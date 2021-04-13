import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-tender-searcher',
  templateUrl: './tender-searcher.component.html',
  styleUrls: ['./tender-searcher.component.less']
})
export class TenderSearcherComponent implements OnInit, OnDestroy {

  results = new Subject<any[]>();
  query = new Subject<string>();
  qsub: Subscription;

  @Output() choose = new EventEmitter<any>();

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.qsub = this.query.pipe(
      switchMap((query) => {
        return this.http.get('https://next.obudget.org/search/tenders', {
          params: {
            size: '100',
            q: query,
            from_date: '1900-01-01',
            to_date: '2100-01-01',
            filter: JSON.stringify([{
              publisher: ['הבריאות', 'החינוך', 'לאזרחים ותיקים', 'הרווחה', 'העבודה הרווחה', 'לקליטת העליה', 'העלייה והקליטה']
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
      volume: null,
      executed: null,
      tender_key: `${item.publication_id}:${item.tender_type}:${item.tender_id}`,
      tender_type_he: item.tender_type_he,
      publisher: item.publisher,
      decision: item.decision,
      description: item.description,
      date_range: `${item.start_date || ''}&nbsp;-<br/>${item.end_date || ''}`,
      regulation: item.regulation,
      page_url: item.page_url,
    }
    this.choose.emit(row);
  }
}
