import { Component, Input, OnInit } from '@angular/core';
import { RolesService } from 'etl-server';

@Component({
  selector: 'app-social-service-list',
  templateUrl: './social-service-list.component.html',
  styleUrls: ['./social-service-list.component.less']
})
export class SocialServiceListComponent implements OnInit {

  @Input() def: any;
  @Input() datarecords: any[] = [];
  aggregated = {items: []};

  constructor(public roles: RolesService) { }

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
    for (let d of this.datarecords) {
      let ptr = this.aggregated;
      d = d.value;
      const id = d.id;
      ptr = this.aggregate(ptr, d.office);
      ptr = this.aggregate(ptr, d.unit);
      ptr = this.aggregate(ptr, d.subunit);
      ptr = this.aggregate(ptr, d.subsubunit);
      ptr.items.push({item: d, id});
    }
  }

}
