import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-tender-suppliers-editor',
  templateUrl: './tender-suppliers-editor.component.html',
  styleUrls: ['./tender-suppliers-editor.component.less'],
  host: {
    '[class.editing]': 'editing',
  }
})
export class TenderSuppliersEditorComponent implements OnInit, OnChanges {

  @Input() record: any;
  @Input() context: any;
  @Input() field: string;

  @Output() changed = new EventEmitter();
  @Output() modal = new EventEmitter<string>();

  _editing = false;
  selection: any = {};

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    for (const supplier of (this.value || [])) {
      this.selection[supplier.entity_id] = true;
    }
  }

  get value() {
    return this.record[this.field];
  }

  get commaSeparatedList() {
    if (this.value?.length > 0) {
      return this.value.map(x => x.entity_name).join(', ');
    }
  }

  get editing() {
    return this._editing;
  }

  set editing(value) {
    if (value !== this._editing) {
      this._editing = value;
      if (!value) {
        console.log('SAVING CHANGES');
        const suppliers = [];
        for (const supplier of (this.context.datarecord.suppliers || [])) {
          if (this.selection[supplier.entity_id]) {
            const sup = {};
            for (const key of ['name', 'id', 'kind', 'kind_he']) {
              sup[`entity_${key}`] = supplier[`entity_${key}`];
            }
            suppliers.push(sup);
          }
        }
        console.log('NEW SUPPLIERS', suppliers);
        this.record.suppliers = suppliers;
        this.changed.emit();
      }
    }
  }

  searchSupplier() {
    this.editing = false;
    this.modal.emit("supplier");
  }
}
