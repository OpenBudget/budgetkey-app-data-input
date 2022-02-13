import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ApiService } from 'etl-server';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { ObudgetApiService } from '../obudget-api.service';

@Component({
  selector: 'app-tender-searcher',
  templateUrl: './tender-searcher.component.html',
  styleUrls: ['./tender-searcher.component.less']
})
export class TenderSearcherComponent implements OnInit, OnDestroy, AfterViewInit {

  results = new Subject<any[]>();
  query = new BehaviorSubject<string>(null);
  qsub: Subscription;
  already = 0;

  @Input() office: string;
  @Input() existing: any[];
  @Output() choose = new EventEmitter<any>();
  @ViewChild('input') input: ElementRef;

  constructor(private api: ObudgetApiService) {
  }

  ngOnInit(): void {
    this.qsub = this.query.pipe(
      filter((query) => query !== null),
      switchMap((query) => {
        let publisher = ['הבריאות', 'החינוך', 'לאזרחים ותיקים', 'הרווחה', 'העבודה הרווחה', 'לקליטת העליה', 'העלייה והקליטה'];
        publisher = {
          'משרד הרווחה':
             ['הרווחה', 'העבודה הרווחה', 'לאזרחים ותיקים'],
          'משרד העליה והקליטה':
             ['לקליטת העליה', 'העלייה והקליטה'],
          'משרד החינוך':
             ['החינוך'],
          'משרד הבריאות':
             ['הבריאות'],
        }[this.office] || publisher;
        publisher.push('מטה החשב הכללי');
        return this.api.search('tenders', query, [{publisher}])
      })
    ).pipe(
      map((results) => {
        const tender_keys = this.existing ? this.existing.map((x) => x.tender_key) : [];
        results.forEach((item) => {
          item.tender_key = `${item.publication_id}:${item.tender_type}:${item.tender_id}`;
        });
        const ret = results.filter((x) => tender_keys.indexOf(x.tender_key) < 0);
        this.already = results.length - ret.length;
        return ret;
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
    item = this.api.cleanHighlights(item);
    const row = {
      volume: null,
      executed: null,
      tender_key: item.tender_key,
      tender_id: item.tender_id,
      tender_type: item.tender_type,
      tender_type_he: item.tender_type_he,
      publisher: item.publisher,
      decision: item.decision,
      description: item.description,
      date_range: `${item.start_date || ''}&nbsp;-<br/>${item.end_date || ''}`,
      regulation: item.regulation,
      supplier: item.supplier || item.entity_name,
      entity_id: item.entity_id,
      entity_kind: item.entity_kind,
      page_url: item.page_url,
    }
    this.query.next(this.query.getValue());
    this.choose.emit(row);
  }
}
