import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ListStateService } from '../list-state.service';
import { FILTERS, ItemFilter } from '../social-service-list/item-filters';
import { MAX_YEAR } from '../social-service-editor/social-service-utils';

@Component({
  selector: 'app-social-service-list-item',
  templateUrl: './social-service-list-item.component.html',
  styleUrls: ['./social-service-list-item.component.less']
})
export class SocialServiceListItemComponent implements OnChanges {

  @Input() item: any = {};
  @Input() def: any = {};
  @Input() search: string;
  @Input() level = 0;
  @Input() itemFilter: string;

  @Output() found = new EventEmitter<void>();

  stats: any = {};
  _open = false;
  items: any[] = [];
  itemFilterObj: ItemFilter | null = null;

  constructor(private listState: ListStateService) { }

  _stats(item, force=false) {
    if (!force && !!item._stats) {
      return item._stats;
    }
    let ret: any = null;
    if (item.item) {
      const manualBudget = (item.item.manualBudget || []).filter(x => x.approved || x.executed);
      const beneficiaries = (item.item.beneficiaries || []).filter(x => x.num_beneficiaries);
      const updated = (
        manualBudget.length > 0 && manualBudget[0].year >= MAX_YEAR &&
        beneficiaries.length > 0 && beneficiaries[0].year >= MAX_YEAR
      );
        //  && (item.item.tenders || []).every((tender) => !tender.survey || tender.survey.submitted);
      item.item['updated'] = updated;
      const complete = !!item.item.complete && !item.item.deleted;
      const keepPrivate = !!item.item.keepPrivate;
      const incomplete = !item.item.complete && !item.item.deleted;
      const inactive = !!item.item.deleted;
      ret = {
        total: 1,
        completeUpdated: (complete && updated) ? 1 : 0,
        updateNeeded: (complete && !updated) ? 1 : 0,
        publishedWIP: (incomplete && !keepPrivate) ? 1 : 0,
        unpublishedWIP: (incomplete && keepPrivate) ? 1 : 0,
        inactive: inactive ? 1 : 0,
      }
    } else if (item.items) {
      ret = {};
      for (const i of this.itemFilterObj?.filter(item.items) || item.items) {
        const itemStats = this._stats(i, force);
        for (const key of Object.keys(itemStats)) {
          if (!ret[key]) {
            ret[key] = 0;
          }
          ret[key] += itemStats[key];
        }
      }
    }
    item._stats = ret;
    return ret || {};
  }

  ngOnChanges(): void {
    if (this.item.items) {
      if (this.itemFilter) {
        this.itemFilterObj = FILTERS[this.itemFilter] || new ItemFilter();
      }
      this.items = this.itemFilterObj.filter(this.item.items);
    } else {
      this.items = [];
    }
    if (!this.item.id && !this.item.header) { // root
      this._stats(this.item, true);
    }
    this.stats = this.item._stats;
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
          (this.item.item.description && this.item.item.description.indexOf(this.search) >= 0) ||
          (this.item.item.catalog_number && ('' + this.item.item.catalog_number) === this.search)
        ) {
          this.onfound();
        }
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
      Math.min(...(this.item.item.manualBudget || []).filter(x => x.approved || x.executed).map(x => x.year)),
      Math.min(...(this.item.item.beneficiaries || []).filter(x => x.num_beneficiaries).map(x => x.year)),      
    );
    const maxYear = Math.min(
      Math.max(...(this.item.item.manualBudget || []).filter(x => x.approved || x.executed).map(x => x.year)),
      Math.max(...(this.item.item.beneficiaries || []).filter(x => x.num_beneficiaries).map(x => x.year)),      
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
