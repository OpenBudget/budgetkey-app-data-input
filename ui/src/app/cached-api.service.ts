import { Injectable } from '@angular/core';
import { ApiService } from 'etl-server';
import { from, Observable, ReplaySubject } from 'rxjs';
import { first, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CachedApiService {

  private datarecordCache: any = {};

  constructor(private api: ApiService) { }

  queryDatarecords(kind: string): Observable<any> {
    if (!this.datarecordCache[kind]) {
      this.datarecordCache[kind] = new ReplaySubject<any[]>(1);
      this.api.queryDatarecords(kind).subscribe((ret) => {
        this.datarecordCache[kind].next(ret);
      });
    }
    return this.datarecordCache[kind].pipe(first());
  }
  

}
