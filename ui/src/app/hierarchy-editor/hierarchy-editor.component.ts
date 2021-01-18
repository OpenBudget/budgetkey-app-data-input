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

  save(record) {
    if (!record.id) {
      record.id = record.name;
    }
    this.api.saveDatarecord('hierarchy', record).subscribe(() => {
      console.log('SAVED');
    })
  }
}
