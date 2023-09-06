import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Subject } from 'rxjs';
import { catchError, concatMap, debounceTime, map } from 'rxjs/operators';
import * as Sentry from "@sentry/angular";
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
    this.syncTendersQueue.pipe(concatMap((rec) => this.syncTendersInternal(rec))).subscribe();
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

  syncTendersInternal({body, tenders}) {
    console.log('TTTT', body);
    console.log('TTTT3', tenders);
    return this.http.post(`${environment.api_endpoint}/sync-tenders`, body, this.etlApiService.httpOptions).pipe(
      map((result: any) => {
        console.log('TTTT2', result);
        result.tenders.forEach((t) => {
          const key = t.key;
          const tender = tenders.find((x) => x.tender_key === key);
          if (tender) {
            tender.survey = tender.survey || {};
            tender.survey.link = t.link;
            tender.survey.submitted = !!t.submitted;
          }
        });
      })
    );
  }

  syncTenders(record: any) {
    const office = record.office;
    const unit = record.unit;
    const service_name = record.name;
    const service_id = record.id;
    const tenders = record.tenders.filter((t) => {
      if (t.tender_type !== 'exemptions') {
        t.survey = t.survey || {};
        return !!t.survey.flag;
      } else if (
          t.tender_type === 'exemptions' && (
            t.entity_kind === 'municipality' ||
            (t.regulation || '').indexOf('מיזם משותף') >= 0 ||
            (t.regulation || '').indexOf('ספק יחיד') >= 0
          )
        ) {
        t.survey = t.survey || {};
        t.survey.flag = 'no';
        return true;
      }
      return false;
    }).map((t) => {
      const start_date = (t.date_range || '-').split('-')[0];
      const end_date = (t.date_range || '-').split('-')[1] || t.end_date;
      
      return {
        tender_key: t.tender_key,
        tender_id: t.tender_id === 'none' ? null : t.tender_id,
        publication_number: t.tender_key.split(':')[0],
        publication_name: t.description,
        flag: t.survey.flag === 'yes',
        active: t.active === 'yes',
        start_date: start_date || null,
        end_date: end_date || null,
      }
    });
    const body = {service_id, service_name, office, unit, tenders};
    this.syncTendersQueue.next({body, tenders: record.tenders});
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
