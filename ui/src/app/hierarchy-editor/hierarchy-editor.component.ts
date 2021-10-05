import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'etl-server';

@Component({
  selector: 'app-hierarchy-editor',
  templateUrl: './hierarchy-editor.component.html',
  styleUrls: ['./hierarchy-editor.component.less']
})
export class HierarchyEditorComponent implements OnInit {

  @Input() def: any;
  @Input() datarecords: any[] = [];

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.datarecords = this.datarecords.map(x => x.value);
  }

  prune(record) {
    if (record.children) {
      record.children = record.children.map((c) => this.prune(c)).filter((c) => !!c);
    }
    if (!record.children || record.children.length === 0) {
      if (!record.name) {
        return null;
      }
    }
    return record;
  }

  save(record) {
    if (!record.id) {
      record.id = record.name;
    }
    record = this.prune(record);
    this.api.saveDatarecord('hierarchy', record).subscribe(() => {
      console.log('SAVED');
    })
  }
}
