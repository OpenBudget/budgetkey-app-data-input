import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-measurement-item-progress',
  templateUrl: './measurement-item-progress.component.html',
  styleUrls: ['./measurement-item-progress.component.less']
})
export class MeasurementItemProgressComponent {
  @Input() stats: any = {};

  constructor() { }

  ngOnInit(): void {
  }

  width(value) {
    if (this.stats.total) {
      return `${value / this.stats.total * 100}%`;
    } else {
      return 'auto';
    }
  }

}
