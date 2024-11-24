import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { delay, first, fromEvent, switchMap, tap, timer } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.less']
})
export class SurveyComponent implements OnChanges {
  @Input() link: string;

  safeLink: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges() {
    if (this.link) {
      this.safeLink = this.sanitizer.bypassSecurityTrustResourceUrl(this.link);
    } else {
      this.safeLink = null;
    }
  }
}
