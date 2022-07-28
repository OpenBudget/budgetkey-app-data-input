import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, ConfirmerService, RolesService } from 'etl-server';
import { filter, switchMap, tap } from 'rxjs/operators';
import { CachedApiService } from '../cached-api.service';
import { FieldVerifyerService } from '../field-verifyer.service';
import { ObudgetApiService } from '../obudget-api.service';
import * as configs from './datatypes';

@Component({
  selector: 'app-social-service-editor',
  templateUrl: './social-service-editor.component.html',
  styleUrls: ['./social-service-editor.component.less']
})
export class SocialServiceEditorComponent implements OnInit {

  @Input() datarecord: any;
  @Input() def: any;

  C = configs;

  budgetAmounts = [];
  spending = [];

  thiz = null;
  possibleSuppliers = [];
  possibleTenders = [];
  lookupTable: any[] = [];

  modalActive = false;
  showSearch: string = '';
  valid = true;
  errorMsg: string = '';
  errorMsgMajor = false;
  saveConfirm: string = '';

  offices: any[] = [];
  office_options: any = {options: []};
  level1_name: string = null;
  level1_options: any = {options: []};
  level2_name: string = null;
  level2_options: any = {options: []};
  level3_name: string = null;
  level3_options: any = {options: []};

  OFFICE_CONDITION = (p) => `(
    (${p} like 'משרד הבריאות%%') OR
    (${p} like 'משרד החינוך%%') OR
    (${p} like 'המשרד לאזרחים ותיקים%%') OR
    (${p} like 'משרד הרווחה%%') OR
    (${p} like 'משרד העבודה הרווחה%%') OR
    (${p} like 'המשרד לקליטת העליה%%') OR
    (${p} like 'משרד העלייה והקליטה%%')
  )`;

  constructor(public api: ObudgetApiService, private etlApi: ApiService, public roles: RolesService, private cachedApi: CachedApiService,
              private confirmer: ConfirmerService, private router: Router, private verifyer: FieldVerifyerService) {
    this.thiz = this;
  }

  ngOnInit() {
    this.datarecord.tenders = this.datarecord.tenders || [];
    this.datarecord.suppliers = this.datarecord.suppliers || [];
    this.datarecord.non_tenders = this.datarecord.non_tenders || [];
    this.datarecord.non_suppliers = this.datarecord.non_suppliers || [];
    this.datarecord.beneficiaries = this.datarecord.beneficiaries || [];
    if (!this.datarecord.virtue_of_table || this.datarecord.virtue_of_table.length === 0) {
      this.datarecord.virtue_of_table = [{}];
    }
    this.datarecord.__tab = this.datarecord.__tab || 'org';
    this.cachedApi.queryDatarecords('beneficiary_kind').subscribe((results) => {
      this.datarecord.beneficiary_kind = this.datarecord.beneficiary_kind || results[0].value.id;
    });
    this.cachedApi.queryDatarecords('hierarchy').subscribe((results) => {
      this.offices = results.map(x => x.value);
      this.updateHierarchy();
    });
    this.refresh();
  }

  get tab(): string {
    return this.datarecord.__tab || 'org';
  }

  set tab(value) {
    this.datarecord.__tab = value;
  }

  updateHierarchy(clear?: number) {
    this.level1_name = null;
    this.level2_name = null;
    this.level3_name = null;
    if (clear) {
      if (clear <= 3) {
        this.datarecord.subsubunit = null;
      }
      if (clear <= 2) {
        this.datarecord.subunit = null;
      }
      if (clear <= 1) {
        this.datarecord.unit = null;
      }
    }
    this.office_options.options = [];
    for (const office of this.offices) {
      this.office_options.options.push({value: office.name, show: office.name});
      if (this.datarecord.office === office.name) {
        this.level1_name = office.level1_name;
        this.level1_options.options = [];
        for (const unit of office.children) {
          this.level1_options.options.push({value: unit.name, show: unit.name});
          if (this.datarecord.unit === unit.name) {
            this.level2_name = office.level2_name;
            this.level2_options.options = [];
            for (const subunit of unit.children) {
              this.level2_options.options.push({value: subunit.name, show: subunit.name});
              if (this.datarecord.subunit === subunit.name) {
                this.level3_name = office.level3_name;
                this.level3_options.options = [];    
                for (const subsubunit of subunit.children) {
                  this.level3_options.options.push({value: subsubunit.name, show: subsubunit.name});
                }    
              }
            }    
          }
        }
      }
    }
  }

  deleteAll(str, subst) {
    return str.split(subst).join('');
  }

  addBudgetItem(item) {
    this.datarecord.budgetItems = this.datarecord.budgetItems || [];
    const fixedTitle = this.deleteAll(this.deleteAll(item.title, '<em>'), '</em>')
    this.datarecord.budgetItems.push({
      code: item.code,
      title: fixedTitle,
      year: item.year,
    });
    if (item.history) {
      for (let historyItem of Object.keys(item.history)) {
        const year = parseInt(historyItem);
        for (const codeTitleItem of item.history[historyItem].code_titles) {
          const codeTitle = codeTitleItem.split(':');
          const code = codeTitle[0];
          const title = codeTitle[1];
          this.datarecord.budgetItems.push({
            code, title, year,
          });  
        }
      }  
    }
    this.fillInBudgets();
    this.modal(null);
  }

  fillInBudgets() {
    const conditions = [];
    if (!this.datarecord.budgetItems || this.datarecord.budgetItems.length === 0) {
      return;
    }
    for (const line of this.datarecord.budgetItems) {
      const title: string = line.title.replace(`'`, `\'`);
      const condition = `(code='${line.code}' and title='${title}')`
      if (conditions.indexOf(condition) === -1) {
        if (conditions.length > 0) {
          conditions.push(' OR ');
        }
        conditions.push(condition);
      }
    }
    const sql = `
      SELECT code, title, year from raw_budget
      where (${conditions.join('')}) and net_revised != 0
      order by year desc, code
    `;
    this.api.query(sql)
      .subscribe((records: any) => {
        this.datarecord.budgetItems = records;
        this.refresh();
      });
  }

  refresh() {
    this.fetchBudgetAmounts();
    this.fetchSpendingSuppliers();
    this.fetchSpendingTenders();
    this.fetchLookupTable();
    this.refreshExistingTenders();
    this.refreshExistingSuppliers();
    this.refreshExistingBeneficiaries();
  }

  fetchBudgetAmounts() {
    if (!this.datarecord.budgetItems || this.datarecord.budgetItems.length === 0) {
      return;
    }
    this.datarecord.budgetItems = (this.datarecord.budgetItems as any[]).sort(
      (a, b) => b.year - a.year
    );
    this.datarecord.manualBudget = this.datarecord.manualBudget || [];
    
    const existingManualYears = {};
    this.datarecord.manualBudget.forEach(x => {
      existingManualYears[x.year] = x;
    });
    this.datarecord.budgetItems.forEach((item) => {
      const year = item.year;
      if (year >= 2017 && !existingManualYears[year]) {
        const rec = {year: year, approved: null, executed: null};
        this.datarecord.manualBudget.push(rec);
        existingManualYears[year] = rec;
      }
      if (item.manual && existingManualYears[year]) {
        const amount = (existingManualYears[year].approved || 0) + item.manual;
        existingManualYears[year].approved = amount;
        item.manual = null;
      }
    });

    this.datarecord.manualBudget = (this.datarecord.manualBudget as any[]).sort(
      (a, b) => b.year - a.year
    ).filter((x) => x.approved || x.year >= 2017);

    const conditions = [];
    const budgets = [];
    for (const line of this.datarecord.budgetItems) {
      const condition = `(code='${line.code}' and year=${line.year})`
      if (conditions.length > 0) {
        conditions.push(' OR ');
      }
      conditions.push(condition);
    }
    const sql = `
      SELECT code, title, year, net_revised, net_executed from raw_budget
      where (${conditions.join('')}) and net_revised != 0
      order by year desc, code
    `;
    this.api.query(sql)
      .subscribe((records: any) => {
        let budget = null;
        for (const row of records) {
          if (!budget || budget.year !== row.year) {
            budget = {year: row.year, net_revised: 0, net_executed: 0};
            budgets.push(budget);
          }
          budget.net_revised += row.net_revised;
          budget.net_executed += row.net_executed;
        }
        this.budgetAmounts = budgets;
      });    
  }

  getBudgetCodes() {
    const budgetCodes = [];
    if (this.datarecord.budgetItems && this.datarecord.budgetItems.length > 0) {
      for (const line of this.datarecord.budgetItems) {
        if (budgetCodes.indexOf(line.code) < 0) {
          budgetCodes.push(line.code);
        }
      }
    }
    return budgetCodes;
  }

  fetchSpendingTenders() {
    const budgetCodes = this.getBudgetCodes();
    if (budgetCodes.length === 0) {
      return;
    }
    const budgetCodesStr = budgetCodes.map(x => `'${x}'`).join(', ');
    const sql = `      
    WITH a AS
      (SELECT (((tender_key->>0)::JSON)->>0) AS publication_id,
              ((tender_key->>0)::JSON)->>1 AS tender_type,
              ((tender_key->>0)::JSON)->>2 AS tender_id,
              sum(volume) AS volume,
              sum(executed) AS executed
      FROM contract_spending
      WHERE budget_code IN (${budgetCodesStr})
        AND jsonb_array_length(tender_key) > 0        
      GROUP BY 1, 2, 3
      ORDER BY 4 DESC nulls LAST)
    SELECT a.volume, a.executed,
          a.publication_id || ':' || a.tender_type || ':' || a.tender_id as tender_key,
          tender_id,
          tender_type,
          tender_type_he,
          publisher,
          decision,
          description,
          start_date || '&nbsp;-<br/>' || end_date as date_range,
          regulation,
          page_url,
          coalesce(supplier, entity_name) as supplier,
          entity_id
    FROM a
    JOIN procurement_tenders_processed USING (publication_id,
                                              tender_id,
                                              tender_type)
    WHERE ${this.OFFICE_CONDITION('publisher')}
    `;
    this.api.query(sql)
      .subscribe((records: any) => {
        this.possibleTenders = records;
        const connectedTenderKeys = [
          ...(this.datarecord.tenders || []),
          ...(this.datarecord.non_tenders || [])
        ].map(x => x.tender_key);
        this.possibleTenders = this.possibleTenders.filter((x) => connectedTenderKeys.indexOf(x.tender_key) < 0);
      });
  }

  fetchSpendingSuppliers() {
    const sql = `
      SELECT entity_id, case when entity_name is null then supplier_name->>0 else entity_name end as entity_name,
             kind as entity_kind, kind_he as entity_kind_he,
             sum(volume) as volume, sum(executed) as executed,
             array_agg(distinct purchase_method->>0) as purchase_methods
      FROM contract_spending
      LEFT JOIN entities on (contract_spending.entity_id=entities.id)
      WHERE budget_code in ('${this.getBudgetCodes().join("','")}')
          AND ${this.OFFICE_CONDITION('publisher_name')}
      GROUP BY 1, 2, 3, 4
      ORDER BY 5 desc nulls last
    `;
    this.api.query(sql)
      .subscribe((records: any) => {
        this.possibleSuppliers = this.possibleSuppliers || [];
        const supplierNames = {};
        const key = (row) => `${row.entity_id}:${row.entity_id}`; 
        for (const supplier of this.possibleSuppliers) {
          supplierNames[key(supplier)] = supplier;
        }
        for (const supplier of records) {
          const existing = supplierNames[key(supplier)];
          if (existing) {
            existing.volume = supplier.volume;
            existing.executed = supplier.executed;
            existing.purchase_methods = supplier.purchase_methods;
          } else {
            this.possibleSuppliers.push(supplier);
          }
        }
        const connectedEntityIds = [
          ...(this.datarecord.suppliers || []),
          ...(this.datarecord.non_suppliers || [])
        ].map(x => x.entity_id);
        this.possibleSuppliers = this.possibleSuppliers.filter((x) => connectedEntityIds.indexOf(x.entity_id) < 0);

        this.possibleSuppliers.sort((a, b) => b.volume - a.volume);
      });
  }

  refreshExistingTenders() {
    const connectedTenders = [
      ...(this.datarecord.tenders || []),
      ...(this.datarecord.non_tenders || [])
    ];
    const connectedTenderKeys = connectedTenders.map(x => x.tender_key);
    if (connectedTenderKeys.length === 0) {
      return;
    }
    const connectedTenderKeysStr = connectedTenderKeys.map(x => `'${x}'`).join(', ');
    const sql = `
    SELECT tender_id,
           tender_type,
           tender_type_he,
           publication_id || ':' || tender_type || ':' || tender_id as tender_key,
           publisher,
           decision,
           description,
           start_date || '&nbsp;-<br/>' || end_date as date_range,
           regulation,
           page_url,
           coalesce(supplier, entity_name) as supplier
    FROM
     procurement_tenders_processed 
    WHERE (publication_id || ':' || tender_type || ':' || tender_id) IN (${connectedTenderKeysStr})
    `;
    this.api.query(sql)
      .subscribe((records: any) => {
        const rm = {};
        for (const record of records) {
          rm[record.tender_key] = record;
        }
        for (const ct of connectedTenders) {
          const tender = rm[ct.tender_key] || {};
          Object.assign(ct, tender);
        }
        for (const t of this.datarecord.tenders) {
          this.calculateTenderActive(t);
        }
      });
  }

  refreshExistingSuppliers() {
    this.datarecord.suppliers.forEach((supplier) => {
      supplier.active = supplier.active || 'yes';
    });
  }

  refreshExistingBeneficiaries() {
    const firstYear = 2017;
    const lastYear = (new Date()).getFullYear();
    const existingYears = this.datarecord.beneficiaries.map((x) => x.year);
    const num_beneficiaries = null;
    for (let year = firstYear; year < lastYear; year++) {
      if (existingYears.indexOf(year) < 0) {
        this.datarecord.beneficiaries.push({year, num_beneficiaries});
      }
    }
    this.datarecord.beneficiaries = this.datarecord.beneficiaries.sort((a, b) => b.year - a.year);
  }

  checkBudgetAmounts() {
    for (const mb of (this.datarecord.manualBudget || [])) {
      const mbYear = mb.year;
      mb.warning = null;
      for (const ba of (this.budgetAmounts || [])) {
        const baYear = ba.year;
        if (mbYear === baYear) {
          if (mb.approved && ba.net_revised && mb.approved > ba.net_revised) {
            mb.warning = 'שימו לב, התקציב המאושר שהזנתם - גבוה מהתקציב המאושר בתקנה כפי שפורסם בספר התקציב (ראו מצד שמאל). בדקו שוב אם הסכום מדויק';
          } else if (mb.executed && ba.net_executed && mb.executed > ba.net_executed) {
            mb.warning = 'שימו לב, תקציב הביצוע שהזנתם - גבוה מהתקציב המבוצע בתקנה כפי שפורסם בספר התקציב (ראו מצד שמאל). בדקו שוב אם הסכום מדויק';
          }
          break;
        }
      }
    }
  }

  calculateTenderActive(tender) {
    const end_date = tender.end_date;
    const option_duration = tender.option_duration;
    tender.formally_active = null;
    if (end_date) {
      let end_year = parseInt(end_date.slice(0, 4));
      if (option_duration) {
        end_year += parseInt(option_duration);
      }
      tender.end_date_extended = end_year.toString() + end_date.slice(4);
      const today = (new Date()).toISOString().slice(0, 10);
      tender.formally_active = tender.end_date_extended > today ? 'yes' : 'no';
    }
    if (!tender.active) {
      tender.active = tender.formally_active;
    }
  }

  connectTender({row, field}) {
    const tender_key = row.tender_key;
    this.datarecord.tenders = this.datarecord.tenders.filter((x) => x.tender_key !== tender_key);
    this.datarecord.non_tenders = this.datarecord.non_tenders.filter((x) => x.tender_key !== tender_key);
    if (row.delete) {
      return;
    }

    this.calculateTenderActive(row);

    row.related = row.related || 'yes';
    if (row.related === 'yes') {
      this.datarecord.tenders.push(row);
      this.possibleTenders = this.possibleTenders.filter((x) => x.tender_key !== tender_key);
      for (const item of this.lookupTable) {
        if (item.tender_key === tender_key) {
          const entity_id = item.entity_id;
          for (const entity of this.possibleSuppliers) {
            if (entity.entity_id === entity_id) {
              entity.related = 'suggestion';
              this.datarecord.suppliers.push(entity);
              this.possibleSuppliers = this.possibleSuppliers.filter((x) => x.entity_id !== entity_id);
              break;
            }
          }
        }
      }
      if (row.entity_id && row.entity_kind) {
        // If the row contains an entity that isn't connected yet
        if (this.datarecord.suppliers.map((x) => x.entity_id).filter((x) => x.entity_id === row.entity_id).length === 0) {
          this.api.fetchEntity(row.entity_kind, row.entity_id).subscribe((row) => {
            if (row) {
              this.connectSupplier({row, field: 'related'}, false);
            }
          })
        }
      }
    } else if (row.related === 'no') {
      this.datarecord.non_tenders.push(row);
    } else if (row.related === 'suggestion') {
      this.datarecord.tenders.push(row);
    }
    // this.modal(null);
  }

  get tendersTender(): any[] {
    const ret: any[] = [];
    if (this.datarecord.tenders) {
      for (const t of this.datarecord.tenders) {
        if (t.tender_type !== 'exemptions') {
          ret.push(t);
        }
      }
    }
    return ret;
  }

  get tendersExemption(): any[] {
    const ret: any[] = [];
    if (this.datarecord.tenders) {
      for (const t of this.datarecord.tenders) {
        if (t.tender_type === 'exemptions') {
          ret.push(t);
        }
      }
    }
    return ret;
  }

  connectSupplier({row, field}, clearModal=true) {
    if (field.name) {
      field = field.name;
    }
    if (field === 'related') {
      row.related = row.related || 'yes';
      row.active = row.active || 'yes';
      const entity_id = row.entity_id;
      this.datarecord.suppliers = this.datarecord.suppliers.filter((x) => x.entity_id !== entity_id);
      this.datarecord.non_suppliers = this.datarecord.non_suppliers.filter((x) => x.entity_id !== entity_id);
      if (row.related === 'yes') {
        this.datarecord.suppliers.push(row);
        this.possibleSuppliers = this.possibleSuppliers.filter((x) => x.entity_id !== entity_id);
        for (const item of this.lookupTable) {
          if (item.entity_id === entity_id) {
            const tender_key = item.tender_key;
            for (const tender of this.possibleTenders) {
              if (tender.tender_key === tender_key) {
                tender.related = 'suggestion';
                this.datarecord.tenders.push(tender);
                this.possibleTenders = this.possibleTenders.filter((x) => x.tender_key !== tender_key);
                break;
              }
            }
          }
        }
        const startYear = (new Date()).getFullYear();
        if (startYear > 2021) {
          row.year_activity_start = startYear;  
        }
      } else if (row.related === 'no') {
        this.datarecord.non_suppliers.push(row);
      } else if (row.related === 'suggestion') {
        this.datarecord.suppliers.push(row);
      }  
      if (clearModal) {
        this.modal(null);
      }
    }
    if (field === 'active') {
      row.active = row.active || 'yes';
      if (row.active === 'yes') {
        row.year_activity_end = null;
      } else {
        row.year_activity_end = (new Date()).getFullYear() - 1;
      }
    }
  }

  fetchLookupTable() {
    const sql = `
      SELECT entity_id,
             ((tender_key->>0)::JSON)->>0 || ':' || 
             (((tender_key->>0)::JSON)->>1)::text || ':' || 
             (((tender_key->>0)::JSON)->>2)::text AS tender_key
     FROM contract_spending
      WHERE budget_code in ('${this.getBudgetCodes().join("','")}')
          AND ${this.OFFICE_CONDITION('publisher_name')}
          AND jsonb_array_length(tender_key) > 0
      GROUP BY 1, 2
    `;
    this.api.query(sql)
      .subscribe((records: any) => {
        this.lookupTable = records;
      });
  }  

  stat(kind) {
    if (kind === 'suppliers') {
      return {
        possible: this.possibleSuppliers,
        connected: this.datarecord.suppliers,
        non_connected: this.datarecord.non_suppliers
      };
    } else if (kind === 'tenders') {
      return {
        possible: this.possibleTenders,
        connected: this.datarecord.tenders,
        non_connected: this.datarecord.non_tenders
      };
    }
  }

  statPossible(kind) {
    const {possible, connected, non_connected} = this.stat(kind);
    return possible ? possible.length : 0;
  }

  statConnected(kind) {
    const {possible, connected, non_connected} = this.stat(kind);
    return connected ? connected.filter(x => x.related === 'yes').length : 0;
  }

  statSuggested(kind) {
    const {possible, connected, non_connected} = this.stat(kind);
    return connected ? connected.filter(x => x.related === 'suggestion').length : 0;
  }
  
  statNonConnected(kind) {
    const {possible, connected, non_connected} = this.stat(kind);
    return non_connected ? non_connected.length : 0;
  }

  _save() {
    this.datarecord.id = this.datarecord.id || this.datarecord[this.def.id];
    return this.etlApi.saveDatarecord(this.def.name, this.datarecord);
  }

  save(complete, publish) {
    if (complete) {
      publish = true;
    }

    let proceed = true;
    let errorMsg = '';
    this.errorMsg = '';
    if (publish) {
      this.verifyer.verify();
      this.valid = this.verifyer.valid();

      if (!this.valid) {
        errorMsg = 'יש למלא ערכים בכל השדות המסומנים!';
      } else if (!this.datarecord.budgetItems || this.datarecord.budgetItems.length === 0) {
        errorMsg = 'יש לחבר לשירות לפחות תקנה תקציבית אחת!';
      } else if ((!this.datarecord.tenders || this.datarecord.tenders.length === 0) && !this.datarecord.noTendersNeeded) {
        errorMsg = 'יש לחבר לשירות לפחות מכרז אחד!';
      } else if (!this.datarecord.suppliers || this.datarecord.suppliers.length === 0) {
        errorMsg = 'יש לחבר לשירות לפחות מפעיל אחד!';
      } else if (this.datarecord.office === 'משרד הרווחה' && !this.datarecord.catalog_number) {
        errorMsg = 'יש למלא לשירות מספר קטלוגי!';
      } else if (this.datarecord.manualBudget) {
      }
      this.valid = this.valid && errorMsg.length === 0;
      this.errorMsg = errorMsg;
      this.errorMsgMajor = complete;
    }
    if (complete) {
      proceed = this.valid;
    }
    if (proceed) {
      this.datarecord.complete = complete;
      this.datarecord.keepPrivate = !publish;
      this._save()
      .subscribe((result) => {
        if (result.id) {
          if (complete) {
            this.router.navigate(['/dashboard']);
          } else {
            this.saveConfirm = `${complete}/${publish}`;
            setTimeout(() => {
              this.saveConfirm = '';
            }, 2000);
          }
        } else {
          console.log('Failed to SAVE Datarecord!', this.def.name, result);
        }
      });
    }

  }

  delete(e) {
    this.confirmer.confirm(this.confirmer.ACTION_DELETE_DATARECORD, this.datarecord.name)
      .pipe(
        filter((x) => x),
        switchMap(() => this.etlApi.deleteDatarecord(this.def.name, this.datarecord.id))
      ).subscribe((result) => {
        console.log('DELETED DATARECORD', result);
        this.router.navigate(['/dashboard']);
      });
    e.preventDefault();
    return false;
  }

  fakeDelete(e) {
    this.confirmer.confirm(this.confirmer.ACTION_CUSTOM, this.datarecord.name, 'לסמן כלא פעיל את השירות')
      .pipe(
        filter((x) => x),
        tap(() => {
          this.datarecord.deleted = true;
        }),
        switchMap(() => {
          return this._save();
        })
      ).subscribe((result) => {
        console.log('FAKE DELETED DATARECORD', result);
      });
    e.preventDefault();
    return false;
  }

  restore(e) {
    this.datarecord.deleted = false;
    this.save(this.datarecord.complete, !this.datarecord.keepPrivate);
    e.preventDefault();
    return false;
  }

  modalKeyup(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.modal(null);
    }
    event.stopPropagation();
    return false;
  }  
  
  modalClick(event: MouseEvent) {
    this.modal(null);
    event.stopPropagation();
    return false;
  }

  modal(kind) {
    if (kind) {
      this.modalActive = true;
      this.showSearch = kind;
    } else {
      this.modalActive = false;
      this.showSearch = '';    
    }
  }

}
