import { Component, Input, OnInit } from '@angular/core';
import { ApiService, RolesService } from 'etl-server';
import { ReplaySubject } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-social-service-list',
  templateUrl: './social-service-list.component.html',
  styleUrls: ['./social-service-list.component.less']
})
export class SocialServiceListComponent implements OnInit {

  @Input() def: any;
  @Input() datarecords: any[] = [];
  aggregated = {items: []};
  selectedOffice = new ReplaySubject<string>(1);
  designatedOffice = null;
  offices: any = {};

  constructor(public api: ApiService, public roles: RolesService) {
    this.api.currentUserProfile.pipe(
      first(),
      switchMap((profile) => {
        this.designatedOffice = profile.permissions?.datarecords?.social_service?.designated_office;
        return this.api.queryDatarecords('hierarchy');
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
    api.queryDatarecords('hierarchy').subscribe((results) => {
      results.map(x => x.value).forEach((el) => {
        this.offices[el.id] = el.name;
      });
    });
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
  }

}
