import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-supplier-searcher',
  templateUrl: './supplier-searcher.component.html',
  styleUrls: ['./supplier-searcher.component.less']
})
export class SupplierSearcherComponent implements OnInit, OnDestroy {

  results = new Subject<any[]>();
  query = new Subject<string>();
  qsub: Subscription;

  @Output() choose = new EventEmitter<any>();

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.qsub = this.query.pipe(
      switchMap((query) => {
        return this.http.get('https://next.obudget.org/search/entities', {
          params: {
            size: '100',
            q: query,
            from_date: '1900-01-01',
            to_date: '2100-01-01',
          }
        });
      }),
      map((result: any) => {
        return result.search_results.map(x => x.source);
      })
    ).subscribe((results) => {
      this.results.next(results);
    });
  }

  ngOnDestroy() {
    if (this.qsub) {
      this.qsub.unsubscribe();
      this.qsub = null;
    }
  }

  search(text) {
    this.query.next(text);
  }

  select(item) {
    const row = {
      entity_id: item.id,
      entity_name: item.name,
      entity_kind: item.kind,
      entity_kind_he: item.kind_he,
      volume: null,
      executed: null,
      purchase_methods: null
    };
    this.choose.emit(row);
  }
}
