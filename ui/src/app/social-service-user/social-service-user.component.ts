import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiService } from 'etl-server';

@Component({
  selector: 'app-social-service-user',
  templateUrl: './social-service-user.component.html',
  styleUrls: ['./social-service-user.component.less']
})
export class SocialServiceUserComponent implements OnInit {

  @Input() datarecord: any = {};
  @Output() updated = new EventEmitter<void>();

  offices: any[] = [];

  constructor(private api: ApiService) {
    api.queryDatarecords('hierarchy').subscribe((results) => {
      this.offices = results.map(x => x.value).map(x => { return {value: x.id, show: x.name}; });
    });
  }

  ngOnInit(): void {
  }

  changed() {
    console.log('CHANGED', this.datarecord);
    this.updated.emit()
  }

}
