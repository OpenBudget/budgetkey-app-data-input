import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, ConfirmerService, RolesService } from 'etl-server';
import { filter, switchMap } from 'rxjs/operators';
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

  showSearch = false;
  tab = 'suppliers';
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

  constructor(private api: ObudgetApiService, private etlApi: ApiService, public roles: RolesService,
              private confirmer: ConfirmerService, private router: Router) {
    this.thiz = this;
    this.etlApi.queryDatarecords('hierarchy').subscribe((results) => {
      this.offices = results.map(x => x.value);
      this.updateHierarchy();
    });
  }

  ngOnInit() {
    this.showSearch = !this.datarecord.budgetItems || this.datarecord.budgetItems.length === 0;
    this.datarecord.tenders = this.datarecord.tenders || [];
    this.datarecord.suppliers = this.datarecord.suppliers || [];
    this.datarecord.non_tenders = this.datarecord.non_tenders || [];
    this.datarecord.non_suppliers = this.datarecord.non_suppliers || [];
    this.refresh();
  }

  updateHierarchy() {
    console.log('updateHierarchy');
    this.level1_name = null;
    this.level2_name = null;
    this.level3_name = null;
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
    console.log('LVL1', this.level1_name, this.level1_options);
    console.log('LVL2', this.level2_name, this.level2_options);
    console.log('LVL3', this.level3_name, this.level3_options);
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
      percent: 100
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
            percent: 100
          });  
        }
      }  
    }
    this.fillInBudgets();
    this.showSearch = false;
  }

  fillInBudgets() {
    const conditions = [];
    const percents = {};
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
      percents[line.code + ':' + line.title] = line.percent;
      percents[line.code + ':' + line.title + ':' + line.year] = line.percent;
    }
    const sql = `
      SELECT code, title, year from raw_budget
      where (${conditions.join('')}) and net_revised != 0
      order by year, code
    `;
    this.api.query(sql)
      .subscribe((records: any) => {
        for (const row of records) {
          row.percent = percents[row.code + ':' + row.title + ':' + row.year] || 
            percents[row.code + ':' + row.title];
        }
        this.datarecord.budgetItems = records;
        this.refresh();
      });
  }

  refresh() {
    this.fetchBudgetAmounts();
    this.fetchSpendingSuppliers();
    this.fetchSpendingTenders();
    this.fetchLookupTable();
  }

  fetchBudgetAmounts() {
    if (!this.datarecord.budgetItems || this.datarecord.budgetItems.length === 0) {
      return;
    }
    const conditions = [];
    const percents = {};
    const budgets = [];
    for (const line of this.datarecord.budgetItems) {
      const condition = `(code='${line.code}' and year=${line.year})`
      if (conditions.length > 0) {
        conditions.push(' OR ');
      }
      conditions.push(condition);
      percents[line.code + ':' + line.title + ':' + line.year] = line.percent;
    }
    const sql = `
      SELECT code, title, year, net_revised from raw_budget
      where (${conditions.join('')}) and net_revised != 0
      order by year, code
    `;
    this.api.query(sql)
      .subscribe((records: any) => {
        let budget = null;
        for (const row of records) {
          const percent = parseInt(percents[row.code + ':' + row.title + ':' + row.year], 10);
          if (!budget || budget.year !== row.year) {
            budget = {year: row.year, net_revised: 0};
            budgets.push(budget);
          }
          budget.net_revised += row.net_revised * percent / 100;
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
      (SELECT (((tender_key->>0)::JSON)->>0)::integer AS publication_id,
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
          tender_type_he,
          publisher,
          decision,
          description,
          start_date || '&nbsp;-<br/>' || end_date as date_range,
          regulation,
          page_url
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
             sum(volume) as volume, sum(executed) as executed,
             array_agg(distinct purchase_method->>0) as purchase_methods
      FROM contract_spending
      WHERE budget_code in ('${this.getBudgetCodes().join("','")}')
          AND ${this.OFFICE_CONDITION('publisher_name')}
      GROUP BY 1, 2
      ORDER BY 3 desc nulls last
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

  connectTender({row, field}) {
    row.related = row.related || 'yes';
    const tender_key = row.tender_key;
    if (row.related === 'yes') {
      if (this.datarecord.tenders.filter(x => x.tender_key === tender_key).length === 0) {
        this.datarecord.tenders.push(row);
      }
      this.datarecord.non_tenders = this.datarecord.non_tenders.filter((x) => x.tender_key !== tender_key);
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
    } else if (row.related === 'no') {
      this.datarecord.non_tenders.push(row);
      this.datarecord.tenders = this.datarecord.tenders.filter((x) => x.tender_key !== tender_key);
    } else if (row.related === 'suggestion') {
      this.datarecord.tenders.push(row);
      this.datarecord.non_tenders = this.datarecord.non_tenders.filter((x) => x.tender_key !== tender_key);
    }
  }

  connectSupplier({row, field}) {
    row.related = row.related || 'yes';
    const entity_id = row.entity_id;
    if (row.related === 'yes') {
      if (this.datarecord.suppliers.filter(x => x.entity_id === entity_id).length === 0) {
        this.datarecord.suppliers.push(row);
      }
      this.datarecord.non_suppliers = this.datarecord.non_suppliers.filter((x) => x.entity_id !== entity_id);
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
    } else if (row.related === 'no') {
      this.datarecord.non_suppliers.push(row);
      this.datarecord.suppliers = this.datarecord.suppliers.filter((x) => x.entity_id !== entity_id);
    } else if (row.related === 'suggestion') {
      this.datarecord.suppliers.push(row);
      this.datarecord.non_suppliers = this.datarecord.non_suppliers.filter((x) => x.entity_id !== entity_id);
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

  _save(complete) {
    this.datarecord.id = this.datarecord.id || this.datarecord[this.def.id];
    this.datarecord.complete = complete;
    return this.etlApi.saveDatarecord(this.def.name, this.datarecord);
  }

  save(complete) {
    this._save(complete)
        .subscribe((result) => {
          if (result.id) {
            this.router.navigate(['/datarecords/', this.def.name]);
          } else {
            console.log('Failed to SAVE Datarecord!', this.def.name);
          }
        });
  }

  delete(e) {
    this.confirmer.confirm(this.confirmer.ACTION_DELETE_DATARECORD, this.datarecord.name)
      .pipe(
        filter((x) => x),
        switchMap(() => this.etlApi.deleteDatarecord(this.def.name, this.datarecord.id))
      ).subscribe((result) => {
        console.log('DELETED DATARECORD', result);
        this.router.navigate(['/datarecords/', this.def.name]);
      });
    e.preventDefault();
    return false;
  }

}
