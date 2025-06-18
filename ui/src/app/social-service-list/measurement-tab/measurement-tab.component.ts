import { Component, Input } from '@angular/core';
import { ApiService, RolesService } from 'etl-server';
import { ReplaySubject, Subject, first, switchMap, map, debounceTime } from 'rxjs';
import { CachedApiService } from '../../cached-api.service';
import { ItemMeasurementBaseFilter, ItemMeasurementFilter, ItemMeasurementFlagFilter } from './item-measurement-filters';
import { ObudgetApiService } from '../../obudget-api.service';

@Component({
  selector: 'app-measurement-tab',
  templateUrl: './measurement-tab.component.html',
  styleUrls: ['./measurement-tab.component.less']
})
export class MeasurementTabComponent {
  @Input() def: any;
  @Input() datarecords: any[] = [];

  aggregated: any = {items: []};
  selectedOffice = new ReplaySubject<string | null>(1);
  searchStream = new Subject<string>();
  query = '';
  offices: any = {};
  designatedOffice = null;
  loading = false;
  
  filterAll = new ItemMeasurementFilter();
  filterFlag = new ItemMeasurementFlagFilter();
  filterBase = new ItemMeasurementBaseFilter();
  selectedFilter = 'all';

  updateDatarecords: any[] = [];

  constructor(public api: ApiService, public roles: RolesService, private cachedApi: CachedApiService, private obudgetApi: ObudgetApiService) {
    this.api.currentUserProfile.pipe(
      first(),
      switchMap((profile) => {
        this.designatedOffice = profile.permissions?.datarecords?.social_service?.designated_office;
        return this.cachedApi.queryDatarecords('hierarchy');
      }),
      map((hierarchies) => {
        for (const h of hierarchies) {
          if (h.value.id === this.designatedOffice) {
            this.selectedOffice.next(h.value.name);
            return h.value.name;
          }
        }
        this.selectedOffice.next(null);
      })
    ).subscribe((s) => {
      console.log('SELECTED OFFICE = ', s);
    });
    cachedApi.queryDatarecords('hierarchy').subscribe((results) => {
      results.map(x => x.value).forEach((el) => {
        this.offices[el.id] = el.name;
      });
    });
    this.searchStream.pipe(
      debounceTime(500)
    ).subscribe((query) => {
      this.query = query;
    })
  }

  aggregate(ptr, header) {
    if (header) {
      let upd = ptr.items.filter(x => x.header === header);
      if (upd.length === 0) {
        ptr.items.push({header: header, items: []});
        ptr = ptr.items[ptr.items.length - 1];
      } else {
        ptr = upd[0];
      }
    }
    return ptr;
  }

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.loading = true;
    this.obudgetApi.getSubmittedTenders().pipe(
      switchMap(() => this.selectedOffice),
      first()
    ).subscribe((selectedOffice) => {
      this.aggregated = {items: []};
      for (let d_ of this.datarecords) {
        d_ = d_.value;
        const tenders = this.obudgetApi.syncTenders(d_, false);
        for (let d of tenders) {
          let ptr = this.aggregated;
          if (selectedOffice === null || selectedOffice === d.office) {
            const id = d.tender_key;
            ptr = this.aggregate(ptr, d_.office);
            ptr = this.aggregate(ptr, d_.unit);
            ptr = this.aggregate(ptr, d_.subunit);
            ptr = this.aggregate(ptr, d_.subsubunit);
            ptr = this.aggregate(ptr, `שירות: ״${d_.name}״`);
            ptr.items.push({item: {tender: d, service: d_}, id});
          }
        }
      }
      this.loading = false;
    });
    this.updateDatarecords = this.datarecords.map((x) => x.value).filter((x) => !x.deleted);
  }

  search(event: KeyboardEvent) {
    this.searchStream.next((event.target as HTMLInputElement).value);
  }

}
