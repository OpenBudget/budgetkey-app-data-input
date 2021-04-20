import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ListStateService } from '../list-state.service';

@Component({
  selector: 'app-social-service-list-item',
  templateUrl: './social-service-list-item.component.html',
  styleUrls: ['./social-service-list-item.component.less']
})
export class SocialServiceListItemComponent implements OnChanges {

  @Input() item: any = {};
  @Input() def: any = {};
  count = 0;
  incompleteCount = 0;
  _open = false;

  constructor(private listState: ListStateService) { }

  _count(item) {
    if (item.item) {
      return 1;
    } else if (item.items) {
      let ret = 0;
      for (const i of item.items) {
        ret += this._count(i);
      }
      return ret;
    }
    return 0;
  }

  _incompleteCount(item) {
    if (item.item) {
      return item.item.complete ? 0 : 1;
    } else if (item.items) {
      let ret = 0;
      for (const i of item.items) {
        ret += this._incompleteCount(i);
      }
      return ret;
    }
    return 0;
  }

  ngOnChanges(): void {
    this.count = this._count(this.item);
    this.incompleteCount = this._incompleteCount(this.item);
    this._open = !this.item.header || this.listState.get(this.item.header);
  }

  set open(value: boolean) {
    this.listState.set(this.item.header, value);
    this._open = value;
  }

  get open(): boolean {
    return this._open;
  }

  get yearRange() {
    const minYear = Math.max(
      Math.min(...(this.item.item.budgetItems || []).map(x => x.year)),
      Math.min(...(this.item.item.beneficiaries || []).map(x => x.year)),      
    );
    const maxYear = Math.min(
      Math.max(...(this.item.item.budgetItems || []).map(x => x.year)),
      Math.max(...(this.item.item.beneficiaries || []).map(x => x.year)),      
    );
    if (Number.isFinite(minYear) && Number.isFinite(maxYear)) {
      return `${minYear} - ${maxYear}`;
    } else {
      return '-';
    }
  }

  get numSuppliers() {
    return (this.item.item.suppliers || []).filter(x => x.related === 'yes').length.toLocaleString();
  }

  get numTenders() {
    return (this.item.item.tenders || []).filter(x => x.related === 'yes').length.toLocaleString();
  }
}
