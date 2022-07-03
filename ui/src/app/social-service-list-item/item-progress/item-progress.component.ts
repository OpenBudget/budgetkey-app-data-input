import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-item-progress',
  templateUrl: './item-progress.component.html',
  styleUrls: ['./item-progress.component.less']
})
export class ItemProgressComponent implements OnInit {

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
