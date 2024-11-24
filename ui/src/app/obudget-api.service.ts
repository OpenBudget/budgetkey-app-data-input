import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, from, Subject } from 'rxjs';
import { catchError, concatMap, debounceTime, map, take, tap } from 'rxjs/operators';
import * as Sentry from "@sentry/angular-ivy";
import { AuthService } from 'dgp-oauth2-ng';
import { ApiService } from 'etl-server';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ObudgetApiService {

  private errors = new Subject<string>();
  private errorMsgs = [];
  private handingErrors = false;
  private email: any;
  public errorMsg: string = null;
  private syncTendersQueue = new Subject<any>();
  private syncedTendersQueue = new Subject<any[]>();
  private initialTenderSync = false;
  public submittedTenders: any = {};

  constructor(private http: HttpClient, private auth: AuthService, private etlApiService: ApiService) {
    this.errors.subscribe((msg) => {
      this.errorMsgs.push(msg);
      if (!this.handingErrors) {
        this.handingErrors = true;
        this.handleErrorMsg();
      }
    })
    this.auth.getUser().subscribe((user) => {
      if (user && user.profile) {
        this.email = user.profile.email;
      }
    });
    this.syncTendersQueue.pipe(
      tap((tenders) => {
        this.updateTenderSubmittedStatus(tenders);
      }),
      concatMap((tenders) => 
        this.getSubmittedTenders().pipe(
          map(() => tenders)
        )
      ),
      tap((tenders) => {
        this.initialTenderSync = true;
        this.updateTenderSubmittedStatus(tenders);
      })
    ).subscribe((tenders) => {
      this.syncedTendersQueue.next(tenders);
    });
  }

  handleErrorMsg() {
    if (this.errorMsgs.length > 0) {
      this.errorMsg = this.errorMsgs.shift();
      window.setTimeout(() => {
        this.handleErrorMsg();
      }, 3000);
    } else {
      this.handingErrors = false;
    }
  }

  query(sql) {
    // sql = encodeURIComponent(sql);
    sql = encodeURIComponent(btoa(unescape(encodeURIComponent(sql))));
    return this.http.get('https://next.obudget.org/api/query?query=' + sql + '&num_rows=10000')
      .pipe(
        catchError((err) => {
          this.errors.next('שגיאה בשליפת המידע');
          Sentry.captureMessage('ObudgetApiService::query: SQL=' + sql);
          Sentry.captureMessage('ObudgetApiService::query: ' + this.email + ' GOT ERROR=' + JSON.stringify(err));
          return from([{}]);
        }),
        map((response: any) => response.rows || []),
      );
  }

  search(what, query, filters?) {
    const params: any = {
      size: '100',
      q: query,
      from_date: '1900-01-01',
      to_date: '2100-01-01',
    };
    if (filters) {
      params.filter = JSON.stringify(filters);
    }
    return this.http.get('https://next.obudget.org/search/' + what, {params}).pipe(
      catchError((err) => {
        this.errors.next('שגיאה בחיפוש המידע');
        Sentry.captureMessage('ObudgetApiService::search: WHAT=' + what + '/' + query);
        Sentry.captureMessage('ObudgetApiService::search: ' + this.email + ' GOT ERROR=' + JSON.stringify(err));
        return from([{}]);
      }),
      map((result: any) => {
        if (result && result.search_results) {
          return result.search_results.map(x => x.source);
        } else {
          return [];
        }
      })
    );
  }

  fetchEntity(entity_kind, entity_id) {
    return this.http.get(`https://next.obudget.org/get/org/${entity_kind}/${entity_id}`).pipe(
      catchError((err) => {
        this.errors.next('שגיאה באיתור המידע');
        Sentry.captureMessage(`ObudgetApiService::fetchSupplier: entity=${entity_kind}/${entity_id}`);
        Sentry.captureMessage('ObudgetApiService::fetchSupplier: ' + this.email + ' GOT ERROR=' + JSON.stringify(err));
        return from([{}]);
      }),
      map((result: any) => {
        if (result && result.value) {
          return {
            entity_id: result.value.id,
            entity_name: result.value.name,
            entity_kind: result.value.kind,
            entity_kind_he: result.value.kind_he,
            volume: null,
            executed: null,
            purchase_methods: null
          };
        } else {
          return null;
        }
      })
    );
  }

  getSubmittedTenders() {
    return this.http.get(`${environment.api_endpoint}/sync-tenders`, this.etlApiService.httpOptions).pipe(
      tap((result: any) => {
        this.submittedTenders = {};
        // Object.assign({}, (result.submitted_flag_ids || {}), (result.submitted_base_ids || {}));
        for (const key of Object.keys(result.submitted_flag_ids || {})) {
          this.submittedTenders[key] = {
            flag: 'yes',
            recId: result.submitted_flag_ids[key]
          };
        }
        for (const key of Object.keys(result.submitted_base_ids || {})) {
          this.submittedTenders[key] = {
            flag: 'no',
            recId: result.submitted_base_ids[key]
          };
        }
      })
    );
  }

  updateTenderSubmittedStatus(tenders) {
    for (const tender of tenders) {
      tender.tqs = tender.tqs || {};
      tender.tqs.required = this.initialTenderSync;
      if (!!this.submittedTenders[tender.tender_key]) {
        tender.tqs.submitted = true;
        tender.tqs.recId = this.submittedTenders[tender.tender_key].recId;
        tender.tqs.flag = this.submittedTenders[tender.tender_key].flag;
      } else {
        tender.tqs.submitted = false;
      }
    }
  }

  syncTenders(record: any) {
    const tenders = record.tenders.filter((t) => {
      t.survey = null;
      t.tqs = t.tqs || {};
      t.tqs.required = false;;
      const start_year = parseInt((t.publication_date || '0-').split('-')[0]);
      if (start_year < 2024) {
        return false;
      }
      if (t.tender_type !== 'exemptions') {
        t.tqs = t.tqs || {};
        return true;
      } else if (
          t.tender_type === 'exemptions' && (
            t.entity_kind === 'municipality' ||
            (t.regulation || '').indexOf('מיזם משותף') >= 0 ||
            (t.regulation || '').indexOf('ספק יחיד') >= 0
          )
        ) {
        t.tqs = t.tqs || {};
        t.tqs.flag = 'no';
        return true;
      }
      return false;
    }).map((t) => {
      t.tqs.required = true;
      return t;
    });
    if (tenders.length === 0) {
      return;
    }
    this.syncedTendersQueue.pipe(
      take(1),
    ).subscribe((tenders) => {
      const office = record.office;
      const unit = record.unit;

      for (const t of tenders) {
        const tender_key = t.tender_key;
        const tender_name = t.description;
        if (t.tqs.flag === 'yes') {
          if (!t.tqs.submitted) {
            t.tqs.link = 'https://form.jotform.com/242954939134062?' + 
              'office_name=' + encodeURIComponent(office) + '&' +
              'devision_name=' + encodeURIComponent(unit) + '&' +
              'unit_name=' + encodeURIComponent(unit) + '&' +
              'tender_ID=' + encodeURIComponent(tender_key) + '&' +
              'tender_name=' + encodeURIComponent(tender_name);
          } else {
            t.tqs.link = 'https://airtable.com/appkFwqZCU6MFquJh/pag7DVwsy7HFIWno5?2cOrN=' + t.tqs.recId;
          }
        } else {
          t.tqs.link = null;
        }
      }
    });
    this.syncTendersQueue.next(tenders);
  }

  cleanHighlights(item) {
    const ret = {};
    for (const k of Object.keys(item)) {
      let v = item[k];
      if (v && v.replace) {
        v = v.split('<em>').join('').split('</em>').join('');
      }
      ret[k] = v;
    }
    return ret;
  }

}
