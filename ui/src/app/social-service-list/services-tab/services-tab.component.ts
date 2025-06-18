import { Component, Input, OnInit } from '@angular/core';
import { ApiService, RolesService } from 'etl-server';
import { ReplaySubject, Subject, first, switchMap, map, debounceTime } from 'rxjs';
import { CachedApiService } from '../../cached-api.service';

@Component({
  selector: 'app-services-tab',
  templateUrl: './services-tab.component.html',
  styleUrls: ['./services-tab.component.less']
})
export class ServicesTabComponent implements OnInit {

  @Input() def: any;
  @Input() datarecords: any[] = [];

  aggregated: any = {items: []};
  selectedOffice = new ReplaySubject<string | null>(1);
  searchStream = new Subject<string>();
  query = '';
  offices: any = {};
  designatedOffice = null;
  
  selectedFilter = 'active';

  updateDatarecords: any[] = [];

  constructor(public api: ApiService, public roles: RolesService, private cachedApi: CachedApiService) {
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
    this.selectedOffice.pipe(first()).subscribe((selectedOffice) => {
      this.aggregated = {items: []};
      for (let d of this.datarecords) {
        let ptr = this.aggregated;
        d = d.value;
        if (selectedOffice === null || selectedOffice === d.office) {
          const id = d.id;
          ptr = this.aggregate(ptr, d.office);
          ptr = this.aggregate(ptr, d.unit);
          ptr = this.aggregate(ptr, d.subunit);
          ptr = this.aggregate(ptr, d.subsubunit);
          ptr.items.push({item: d, id});
        }
      }
    });
    this.updateDatarecords = this.datarecords.map((x) => x.value).filter((x) => !x.deleted);
  }

  search(event: KeyboardEvent) {
    this.searchStream.next((event.target as HTMLInputElement).value);
  }
}
