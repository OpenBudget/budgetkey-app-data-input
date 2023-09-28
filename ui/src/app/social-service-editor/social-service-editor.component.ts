import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, ConfirmerService, RolesService } from 'etl-server';
import { filter, switchMap, tap } from 'rxjs/operators';
import { CachedApiService } from '../cached-api.service';
import { FieldVerifyerService } from '../field-verifyer.service';
import { ObudgetApiService } from '../obudget-api.service';
import * as configs from './datatypes';

import { SocialServiceUtils } from './social-service-utils';

@Component({
  selector: 'app-social-service-editor',
  templateUrl: './social-service-editor.component.html',
  styleUrls: ['./social-service-editor.component.less']
})
export class SocialServiceEditorComponent implements OnInit {

  @Input() datarecord: any;
  @Input() def: any;

  C = configs;

  spending = [];

  thiz = null;

  modalActive = false;
  showSearch: string = '';
  surveyFlag: string = '';
  surveyRecId: string = '';
  valid = true;
  errorMsg: string = '';
  errorMsgMajor = false;
  saveConfirm: string = '';

  ssu: SocialServiceUtils;

  constructor(public api: ObudgetApiService, private etlApi: ApiService, public roles: RolesService, private cachedApi: CachedApiService,
              private confirmer: ConfirmerService, private router: Router, private verifyer: FieldVerifyerService) {
    this.thiz = this;
  }

  ngOnInit() {
    this.ssu = new SocialServiceUtils(this.datarecord, this.def, this.cachedApi, this.api, this.etlApi);
    this.ssu.clearModal.subscribe(() => {
      this.modal(null);
    });
  }

  get tab(): string {
    return this.datarecord.__tab || 'org';
  }

  set tab(value) {
    this.datarecord.__tab = value;
  }

  checkBudgetAmounts() {
    for (const mb of (this.datarecord.manualBudget || [])) {
      const mbYear = mb.year;
      mb.warning = null;
      for (const ba of (this.ssu.budgetAmounts || [])) {
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

  stat(kind) {
    if (kind === 'suppliers') {
      return {
        possible: this.ssu.possibleSuppliers,
        connected: this.datarecord.suppliers,
        non_connected: this.datarecord.non_suppliers
      };
    } else if (kind === 'tenders') {
      return {
        possible: this.ssu.possibleTenders,
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

  saveSimple() {
    this.ssu.save().subscribe();
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
      this.ssu.save()
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
          return this.ssu.save();
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
      if (kind.indexOf('survey:') === 0) {
        this.modalActive = true;
        const [_, surveyFlag, surveyRecId] = kind.split(':');
        this.surveyRecId = surveyRecId;
        this.surveyFlag = surveyFlag;
      } else {
        this.modalActive = true;
        this.showSearch = kind;  
      }
    } else {
      this.modalActive = false;
      this.showSearch = '';
      this.surveyRecId = '';
      this.surveyFlag = '';
    }
  }

}
