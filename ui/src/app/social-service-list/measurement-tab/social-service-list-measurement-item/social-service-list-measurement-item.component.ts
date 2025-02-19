import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ListStateService } from '../../../list-state.service';
import { MAX_YEAR } from '../../../social-service-editor/social-service-utils';
import { ItemFilter } from '../../services-tab/item-filters';
import { FILTERS } from '../item-measurement-filters';

@Component({
  selector: 'app-social-service-list-measurement-item',
  templateUrl: './social-service-list-measurement-item.component.html',
  styleUrls: ['./social-service-list-measurement-item.component.less']
})
export class SocialServiceListMeasurementItemComponent {

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
    if (item.item?.tender) {
      ret = {
        total: 1,
        complete: item.item.tender.tqs.submitted ? 1 : 0,
        incomplete: item.item.tender.tqs.submitted ? 0 : 1,
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
      this.items = this.itemFilterObj?.filter(this.item.items) || [];
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
          (this.item.item.service.name && this.item.item.service.name.indexOf(this.search) >= 0) ||
          (this.item.item.tender.description && this.item.item.tender.description.indexOf(this.search) >= 0) ||
          (this.item.item.tender.tender_id && this.item.item.tender.tender_id.indexOf(this.search) >= 0) 
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

  onfound() {
    if (!this._open) {
      this._open = true;
      setTimeout(() => {
        this.found.emit();
      }, 0);
    }
  }

}
