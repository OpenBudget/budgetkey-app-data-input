import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-budget-searcher',
  templateUrl: './budget-searcher.component.html',
  styleUrls: ['./budget-searcher.component.less']
})
export class BudgetSearcherComponent implements OnInit, OnDestroy, AfterViewInit {

  results = new Subject<any[]>();
  query = new Subject<string>();
  qsub: Subscription;

  @Output() choose = new EventEmitter<any>();
  @ViewChild('input') input: ElementRef;

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.qsub = this.query.pipe(
      switchMap((query) => {
        return this.http.get('https://next.obudget.org/search/budget', {
          params: {
            q: query,
            from_date: '1900-01-01',
            to_date: '2100-01-01',
            filter: JSON.stringify([{
              func_cls_title_1__not: 'הכנסות',
              depth: 4
            }])
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

  ngAfterViewInit() {
    this.input.nativeElement.focus();
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
    this.choose.emit(item);
  }
}
