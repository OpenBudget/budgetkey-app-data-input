import { HttpClient } from '@angular/common/http';
import { AfterContentInit, AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ObudgetApiService } from '../obudget-api.service';

@Component({
  selector: 'app-supplier-searcher',
  templateUrl: './supplier-searcher.component.html',
  styleUrls: ['./supplier-searcher.component.less']
})
export class SupplierSearcherComponent implements OnInit, OnDestroy, AfterViewInit {

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
        return this.api.search('entities', query);
      }),
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
