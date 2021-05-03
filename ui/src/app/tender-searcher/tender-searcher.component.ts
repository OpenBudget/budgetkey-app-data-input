import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ApiService } from 'etl-server';
import { Subject, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ObudgetApiService } from '../obudget-api.service';

@Component({
  selector: 'app-tender-searcher',
  templateUrl: './tender-searcher.component.html',
  styleUrls: ['./tender-searcher.component.less']
})
export class TenderSearcherComponent implements OnInit, OnDestroy, AfterViewInit {

  results = new Subject<any[]>();
  query = new Subject<string>();
  qsub: Subscription;

  @Output() choose = new EventEmitter<any>();
  @ViewChild('input') input: ElementRef;

  constructor(private api: ObudgetApiService) {
  }

  ngOnInit(): void {
    this.qsub = this.query.pipe(
      switchMap((query) => {
        return this.api.search('tenders', query, [{
          publisher: ['הבריאות', 'החינוך', 'לאזרחים ותיקים', 'הרווחה', 'העבודה הרווחה', 'לקליטת העליה', 'העלייה והקליטה']
        }])
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
    const row = {
      volume: null,
      executed: null,
      tender_key: `${item.publication_id}:${item.tender_type}:${item.tender_id}`,
      tender_type: item.tender_type,
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
