import { Injectable } from '@angular/core';
import { ApiService } from 'etl-server';
import { from, Observable, ReplaySubject } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import * as Sentry from "@sentry/angular-ivy";
import { AuthService } from 'dgp-oauth2-ng';

@Injectable({
  providedIn: 'root'
})
export class CachedApiService {

  private datarecordCache: any = {};
  email = '';

  constructor(private api: ApiService, private auth: AuthService) {
    this.auth.getUser().subscribe((user) => {
      if (user && user.profile) {
        this.email = user.profile.email;
      }
    });
  }

  queryDatarecords(kind: string): Observable<any> {
    if (!this.datarecordCache[kind]) {
      this.datarecordCache[kind] = new ReplaySubject<any[]>(1);
      this.api.queryDatarecords(kind).pipe(
        catchError((err) => {
          Sentry.captureMessage('CachedApiService::queryDatarecords(' + kind + '): ' + this.email + ' GOT ERROR=' + JSON.stringify(err));
          return from([]);
        })
      ).subscribe((ret) => {
        this.datarecordCache[kind].next(ret);
      });
    }
    return this.datarecordCache[kind].pipe(first());
  }
  

}
