import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ObudgetApiService } from 'src/app/obudget-api.service';

@Component({
  selector: 'app-tender-survey-control',
  templateUrl: './tender-survey-control.component.html',
  styleUrls: ['./tender-survey-control.component.less']
})
export class TenderSurveyControlComponent {
  
  @Input() survey: any;
  @Input() record: any;
  @Input() context: any;

  @Output() modal = new EventEmitter<string>();
  @Output() changed = new EventEmitter();

  constructor(private api: ObudgetApiService) { }

  set flag(value: boolean) {
    if (value !== this.survey.flag) {
      this.survey.flag = value;
      this.changed.emit();
      this.api.syncTenders(this.context);
    }
  }

  get flag() {
    return this.survey.flag || null;
  }

  openSurvey(flag: string, recId: string) {
    this.modal.emit(`survey:${flag}:${recId}`);
  }
}
