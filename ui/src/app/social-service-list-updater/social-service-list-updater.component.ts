import { Component, Input, OnInit } from '@angular/core';
import { interval, map, take, timer } from 'rxjs';
import { SocialServiceUtils } from '../social-service-editor/social-service-utils';
import { ApiService } from 'etl-server';
import { CachedApiService } from '../cached-api.service';
import { ObudgetApiService } from '../obudget-api.service';

@Component({
  selector: 'app-social-service-list-updater',
  templateUrl: './social-service-list-updater.component.html',
  styleUrls: ['./social-service-list-updater.component.less']
})
export class SocialServiceListUpdaterComponent implements OnInit {

  @Input() datarecords: any[] = [];
  @Input() def: any;

  updating = false;
  count = 0;

  constructor(public api: ObudgetApiService, private etlApi: ApiService, private cachedApi: CachedApiService,) { }

  ngOnInit(): void {
    console.log('datarecords = ', this.datarecords);
  }

  start() {
    if (this.updating) {
      return;
    }
    this.count = 0;
    this.updating = true;
    interval(5000).pipe(
      take(this.datarecords.length),
      map((i) => this.datarecords[i])
    ).subscribe((datarecord) => {
      const ssu = new SocialServiceUtils(datarecord, this.def, this.cachedApi, this.api, this.etlApi);
      timer(10000).subscribe(() => {
        ssu.save().subscribe(() => {
          this.count += 1;
        });
      });
    });
  }
}
