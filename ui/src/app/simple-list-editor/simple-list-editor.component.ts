import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'etl-server';

@Component({
  selector: 'app-simple-list-editor',
  templateUrl: './simple-list-editor.component.html',
  styleUrls: ['./simple-list-editor.component.less']
})
export class SimpleListEditorComponent implements OnInit {

  @Input() def: any;
  @Input() datarecords: any[] = [];

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.query();
  }

  query() {
    this.api.queryDatarecords(this.def.name).subscribe((results) => {
      const f = this.def.field.name;
      // this.datarecords = results.sort((a, b) => a.value[f] > b.value[f] ? 1 : a.value[f] < b.value[f] ? -1 : 0);
      this.datarecords = results;
    })
  }


  save(row) {
    const value = row[this.def.field.name];
    if (value && value.length) {
      this.api.saveDatarecord(this.def.name, row).subscribe((result) => {
        console.log('SAVED');
      });  
    } else {
      this.api.deleteDatarecord(this.def.name, row.id).subscribe((result) => {
        console.log('DELETED');
        this.query();
      });  
    }
  }

  add(target) {
    const row: any = {};
    row[this.def.field.name] = target.value;
    row.id = target.value;
    this.api.saveDatarecord(this.def.name, row).subscribe((result) => {
      target.value = '';
      this.query();
    });
  }
}
