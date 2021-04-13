import { Component, Input, OnInit } from '@angular/core';
import { ApiService, ConfirmerService } from 'etl-server';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-simple-list-editor',
  templateUrl: './simple-list-editor.component.html',
  styleUrls: ['./simple-list-editor.component.less']
})
export class SimpleListEditorComponent implements OnInit {

  @Input() def: any;
  @Input() datarecords: any[] = [];

  constructor(private api: ApiService, private confirmer: ConfirmerService) { }

  ngOnInit(): void {
    this.sort();
    this.query();
  }

  query() {
    this.api.queryDatarecords(this.def.name).subscribe((results) => {
      const f = this.def.field.name;
      this.datarecords = results;
      this.sort();
      this.datarecords.forEach((rec, idx) => {
        rec.value.order = rec.value.order || idx;
      });
      this.sort();
      console.log(this.datarecords);
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

  delete(value) {
    const f = this.def.field.name;
    this.confirmer.confirm(this.confirmer.ACTION_DELETE_DATARECORD, value[f]).pipe(first()).subscribe((result) => {
      if (result) {
        value[f] = null;
        this.save(value)
      }
    });
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

  sort() {
    this.datarecords = this.datarecords.sort((a, b) => (a.value.order || 0) - (b.value.order || 0));
  }

  switch(i) {
    if (i >= 0 && i < this.datarecords.length - 1) {
      const prev = this.datarecords[i].value;
      const next = this.datarecords[i+1].value;
      prev.order += 1;
      next.order -= 1;
      this.sort();
      this.save(prev);
      this.save(next);
    }
  }
}
