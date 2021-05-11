import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ListStateService } from '../list-state.service';

@Component({
  selector: 'app-social-service-list-item',
  templateUrl: './social-service-list-item.component.html',
  styleUrls: ['./social-service-list-item.component.less']
})
export class SocialServiceListItemComponent implements OnChanges {

  @Input() item: any = {};
  @Input() def: any = {};
  @Input() search: string;

  @Output() found = new EventEmitter<void>();

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
    if (!this.item.id && !this.item.header) { // root
      this._open = true;
      if (this.search) {
        this.listState.clear();
      }
    } else if (this.item.header) { // inner node
        if (this.search) {
          this._open = false;
          if (this.item.header.indexOf(this.search) >= 0) {
            this.onfound();
          }
        } else {
          this._open = this.listState.get(this.item.header);
        }
    } else { // leaf
      if (this.search) {
        this._open = false;
        if (
          (this.item.item.name && this.item.item.name.indexOf(this.search) >= 0) ||
          (this.item.item.description && this.item.item.description.indexOf(this.search) >= 0)
        ) {
          this.onfound();
        }
      } else {
        this._open = true;
      }
    }
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

  onfound() {
    if (!this._open) {
      this._open = true;
      setTimeout(() => {
        this.found.emit();
      }, 0);
    }
  }
}
