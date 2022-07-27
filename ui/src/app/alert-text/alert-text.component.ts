import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert-text',
  templateUrl: './alert-text.component.html',
  styleUrls: ['./alert-text.component.less'],
  host: {
    '[class.visible]': 'alertVisible()',
  }
})
export class AlertTextComponent implements OnInit {

  @Input() record: any = {};
  @Input() kind: string = '';
  @Input() display: string = '';
  today: Date;

  constructor() {
    this.today = new Date();
  }

  ngOnInit(): void {
  }

  alertVisible() {
    if (this.kind === 'expiration-alert') {
      const end_date = this.record.end_date;
      const option_duration = this.record.option_duration;
      if (end_date) {
        let end_year = parseInt(end_date.slice(0, 4));
        if (option_duration) {
          end_year += parseInt(option_duration);
        }
        console.log('alertVisible', this.kind, this.display, end_year);
        console.log('alertVisible', this.record.end_date, this.record.option_duration, this.today.getFullYear());
        if (this.today.getFullYear() === end_year) {
          return true;
        }
      }
    }
    return false;
  }
}
