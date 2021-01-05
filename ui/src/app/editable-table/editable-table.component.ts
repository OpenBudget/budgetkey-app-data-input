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

  constructor() { }

  ngOnInit() {
    this.record[this.field] = this.record[this.field] || [];
  }

  emit(row, field) {
    this.changed.emit({row, field});
  }

  delete(row) {
    this.record[this.field] = this.record[this.field].filter((x) => x !== row);
  }
}
