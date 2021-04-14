import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-editable-field-multiple-selection',
  templateUrl: './editable-field-multiple-selection.component.html',
  styleUrls: ['./editable-field-multiple-selection.component.less']
})
export class EditableFieldMultipleSelectionComponent implements OnInit, OnChanges {

  @Input() value: string[];
  @Input() options: any[];
  @Input() invalid: boolean;
  @Output() modified = new EventEmitter<string[]>();

  _value: any = {};

  constructor() { }

  ngOnInit(): void { }

  ngOnChanges(): void {
    if (this.options) {
      this._value = {};
      for (const option of this.options) {
        this._value[option.value] = false;
      }
      for (const key of this.value) {
        this._value[key] = true;
      }  
    }
  }

  changed(key, event: Event) {
    this._value[key] = (event.target as HTMLInputElement).checked;
    const value = [];
    for (const option of this.options) {
      if (this._value[option.value]) {
        value.push(option.value);
      }
    }
    this.modified.emit(value);
  }

}
