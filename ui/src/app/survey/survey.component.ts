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

  menuItems = {
    flag: [
      {
        label: 'פרטי מכרז והנחיות',
        prefix: 'https://airtable.com/appkFwqZCU6MFquJh/pagUHIK5LdLYZaxzV?WOvEo=',
        icon: 'main'
      },
      {
        label: 'מקבל השירות במרכז',
        prefix: 'https://airtable.com/appkFwqZCU6MFquJh/pagadNKNUxAB7WZAQ?sBn4G=',
        icon: 'recipients-center'
      },
      {
        label: 'ניהול מוכוון תוצאות',
        prefix: 'https://airtable.com/appkFwqZCU6MFquJh/pagkQshT4oAj2pb67?sBn4G=',
        icon: 'result-oriented'
      },
      {
        label: 'חדשנות וגמישות',
        prefix: 'https://airtable.com/appkFwqZCU6MFquJh/pagkm3WwxQi2Ae2Js?sBn4G=',
        icon: 'innovation'
      },
      {
        label: 'פיתוח ושימור ידע',
        prefix: 'https://airtable.com/appkFwqZCU6MFquJh/pagA1eJ6bOdw4z2Qj?sBn4G=',
        icon: 'knowledge-management'
      },
      {
        label: 'המפעיל כשותף',
        prefix: 'https://airtable.com/appkFwqZCU6MFquJh/pagZLhTJhyQeIL4a9?sBn4G=',
        icon: 'supplier-partner'
      },
      {
        label: 'תכנון כלכלי ותחרות בשירות האיכות',
        prefix: 'https://airtable.com/appkFwqZCU6MFquJh/pag56vXM0oKk40Hzz?sBn4G=',
        icon: 'planning-competition'
      },
      {
        label: 'שמירה  / הגשה',
        prefix: 'https://airtable.com/appkFwqZCU6MFquJh/pagNa6ModRWalaUim?BIJb1=',
        icon: 'main'
      }
    ],
    base: [
      {
        label: 'פרטי מכרז והנחיות',
        prefix: 'https://airtable.com/appkFwqZCU6MFquJh/pagAXNXilnivMrB4B?2cbJH=',
        icon: 'main'
      },
      {
        label: 'מקבל השירות במרכז',
        prefix: 'https://airtable.com/appkFwqZCU6MFquJh/pagqkz78I6HnwCW58?pMX9n=',
        icon: 'recipients-center'
      },
      {
        label: 'ניהול מוכוון תוצאות',
        prefix: 'https://airtable.com/appkFwqZCU6MFquJh/pag6vTl7MFcru6HAG?fomRb=',
        icon: 'result-oriented'
      },
      {
        label: 'חדשנות וגמישות',
        prefix: 'https://airtable.com/appkFwqZCU6MFquJh/pagyb9bMw1IcU7tX3?uuwpX=',
        icon: 'innovation'
      },
      {
        label: 'פיתוח ושימור ידע',
        prefix: 'https://airtable.com/appkFwqZCU6MFquJh/paggMfXwG7Dy41nST?lJaw8=',
        icon: 'knowledge-management'
      },
      {
        label: 'המפעיל כשותף',
        prefix: 'https://airtable.com/appkFwqZCU6MFquJh/pagBS7cIfVu2dJ5Cd?p9pAl=',
        icon: 'supplier-partner'
      },
      {
        label: 'תכנון כלכלי ותחרות בשירות האיכות',
        prefix: 'https://airtable.com/appkFwqZCU6MFquJh/pagtqZ2Dvstaojem3?07af4=',
        icon: 'planning-competition'
      },
      {
        label: 'שמירה  / הגשה',
        prefix: 'https://airtable.com/appkFwqZCU6MFquJh/pagc0IlHv6ebam44c?cEx4P=',
        icon: 'main'
      }
    ]
  };
  @Input() flag: string;
  @Input() recId: string;

  constructor() {}

  ngOnChanges(): void {
    this.menuItems[this.flag].forEach((item) => {
      item.active = false;
    });
  }

  select(item) {
    const surveyUrl = item.prefix + this.recId;
    window.open(surveyUrl, 'soprocsurvey', 'width=800,height=600,popup=1,scrollbars=1,resizable=0,toolbar=0,status=0,menubar=0,location=0,directories=0');
    item.active = true;
  }
}
