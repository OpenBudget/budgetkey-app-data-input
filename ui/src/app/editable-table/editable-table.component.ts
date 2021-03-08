import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-editable-table',
  templateUrl: './editable-table.component.html',
  styleUrls: ['./editable-table.component.less']
})
export class EditableTableComponent implements OnInit {

  @Input() record: any;
  @Input() field: string;
  @Input() config: any;
  @Output() changed = new EventEmitter<{row: any, field: any}>();

  headers = [];
  colspan = 1;
  defaultRowIndex = 5;
  rows: any = {};

  constructor() { }

  ngOnInit() {
    this.record[this.field] = this.record[this.field] || [];
    for (const f of this.config.fields) {
      f.fullRow = f.fullRow || this.defaultRowIndex;
      if (f.fullRow !== this.defaultRowIndex) {
        this.rows[f.fullRow] = [f];
      } else {
        this.headers.push(f);
      }
    }
    this.rows[this.defaultRowIndex] = this.headers;
    this.colspan = this.headers.length;
    this.rows = Object.keys(this.rows).sort().map((k) => this.rows[k]);
    console.log('ROWS', this.colspan, this.rows)
  }

  emit(row, field) {
    this.changed.emit({row, field});
  }

  delete(row) {
    this.record[this.field] = this.record[this.field].filter((x) => x !== row);
  }
}
