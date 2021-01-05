import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-editable-field',
  templateUrl: './editable-field.component.html',
  styleUrls: ['./editable-field.component.less']
})
export class EditableFieldComponent implements OnInit {

  @Input() record: any;
  @Input() field: string;
  @Input() placeholder: string;
  @Input() label: string;
  @Input() kind;
  @Input() options: any = {};
  @Input() readonly = false;

  @Output() changed = new EventEmitter<any>();
  @ViewChild('editor', {static: false}) editor: ElementRef;
  _editing = false;

  constructor() { }

  ngOnInit() {
    this.editing = !this.record[this.field] && this.record[this.field] !== 0;
    this.kind = this.kind || 'text';
    this.options = this.options || {};
    this.placeholder = this.placeholder || this.label;
  }

  get editing(): boolean {
    return this._editing;
  }

  set editing(value: boolean) {
    if (this.readonly) {
      this._editing = false;
      return;
    }
    this._editing = value;
  }

  get direction() {
    return (this.options.number || this.options.date) ? 'ltr' : 'inherit';
  }

  toText(x: any) {
    if (this.options.number) {
      return (x as number).toLocaleString(this.options.format || {});
    }
    if (this.options.link) {
      return `<a href='${x}' target='_blank'>קישור</a>`;
    }
    if (this.options.budgetCode) {
      const niceCode = x.slice(2,4) + '.' + x.slice(4,6) + '.' + x.slice(6,8) + '.' + x.slice(8,10);
      return niceCode;
    }

    return x;
  }

  focus() {
    setTimeout(() => {
      if (this.editor && this.editor.nativeElement) {
        (this.editor.nativeElement as HTMLElement).focus();  
      }
    }, 0);
  }

  blur() {
    if (this.record[this.field]) {
      this.editing = false;
    }
    this.record[this.field] = this.processValue(this.record[this.field]);
    this.changed.emit(this.record[this.field]);
  }

  onChanged() {
    this.changed.emit();
  }

  processValue(x) {
    if (this.options.number || this.options.integer) {
      return parseInt(x, 10);
    }
    return x;
  }
}
