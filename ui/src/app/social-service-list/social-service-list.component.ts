import { Component, Input } from '@angular/core';
import { VERSION } from '../version';
import { RolesService } from 'etl-server';

@Component({
  selector: 'app-social-service-list',
  templateUrl: './social-service-list.component.html',
  styleUrls: ['./social-service-list.component.less']
})
export class SocialServiceListComponent {

  @Input() def: any;
  @Input() datarecords: any[] = [];

  // tab = 'services';
  tab = 'measurement'; // TODO: change to 'services' when ready
  VERSION = VERSION;

  constructor(public roles: RolesService) {}
}
