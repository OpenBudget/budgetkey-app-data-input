import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as Sentry from "@sentry/angular";

@Injectable({
  providedIn: 'root'
})
export class ObudgetApiService {

  private errors = new Subject<string>();
  private errorMsgs = [];
  private handingErrors = false;
  public errorMsg: string = null;

  constructor(private http: HttpClient) {
    this.errors.subscribe((msg) => {
      this.errorMsgs.push(msg);
      if (!this.handingErrors) {
        this.handingErrors = true;
        this.handleErrorMsg();
      }
    })
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
    sql = btoa(unescape(encodeURIComponent(sql)));
    return this.http.get('https://next.obudget.org/api/query?query=' + sql + '&num_rows=10000')
      .pipe(
        catchError((err) => {
          this.errors.next('שגיאה בשליפת המידע');
          Sentry.captureMessage('ObudgetApiService::query: SQL=' + sql);
          Sentry.captureMessage('ObudgetApiService::query: GOT ERROR=' + JSON.stringify(err));
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
        Sentry.captureMessage('ObudgetApiService::search: GOT ERROR=' + JSON.stringify(err));
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
}
