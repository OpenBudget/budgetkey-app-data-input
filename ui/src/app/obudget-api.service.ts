import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ObudgetApiService {

  constructor(private http: HttpClient) { }

  query(sql) {
    sql = encodeURIComponent(sql);
    return this.http.get('https://next.obudget.org/api/query?query=' + sql + '&num_rows=10000')
      .pipe(map((response: any) => response.rows || []));
  }
  
}
