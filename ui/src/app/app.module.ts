import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { EtlServerModule } from 'etl-server';

import { SocialServiceEditorComponent} from './social-service-editor/social-service-editor.component';
import { EditableTableComponent} from './editable-table/editable-table.component';
import { EditableFieldComponent } from './editable-field/editable-field.component';
import { BudgetSearcherComponent } from './budget-searcher/budget-searcher.component';
import { TenderSearcherComponent } from './tender-searcher/tender-searcher.component';
import { SupplierSearcherComponent } from './supplier-searcher/supplier-searcher.component';
import { FormsModule } from '@angular/forms';
import { SocialServiceListComponent } from './social-service-list/social-service-list.component';
import { Router, RouterModule } from '@angular/router';
import { SimpleListEditorComponent } from './simple-list-editor/simple-list-editor.component';
import { SocialServiceUserComponent } from './social-service-user/social-service-user.component';
import { HierarchyEditorComponent } from './hierarchy-editor/hierarchy-editor.component';
import { EditableFieldMultipleSelectionComponent } from './editable-field-multiple-selection/editable-field-multiple-selection.component';

import * as Sentry from "@sentry/angular-ivy";
import { AlertTextComponent } from './alert-text/alert-text.component';
import { TenderSuppliersEditorComponent } from './social-service-editor/tender-suppliers-editor/tender-suppliers-editor.component';
import { TenderSurveyControlComponent } from './social-service-editor/tender-survey-control/tender-survey-control.component';
import { SocialServiceListUpdaterComponent } from './social-service-list-updater/social-service-list-updater.component';
import { SurveyComponent } from './survey/survey.component';
import { ServicesTabComponent } from './social-service-list/services-tab/services-tab.component';
import { ItemProgressComponent } from './social-service-list/services-tab/social-service-list-item/item-progress/item-progress.component';
import { ItemProgressLegendComponent } from './social-service-list/services-tab/item-progress-legend/item-progress-legend.component';
import { SocialServiceListItemComponent } from './social-service-list/services-tab/social-service-list-item/social-service-list-item.component';
import { MeasurementTabComponent } from './social-service-list/measurement-tab/measurement-tab.component';
import { MeasurementProgressLegendComponent } from './social-service-list/measurement-tab/measurement-progress-legend/measurement-progress-legend.component';
import { SocialServiceListMeasurementItemComponent } from './social-service-list/measurement-tab/social-service-list-measurement-item/social-service-list-measurement-item.component';
import { MeasurementItemProgressComponent } from './social-service-list/measurement-tab/social-service-list-measurement-item/measurement-item-progress/measurement-item-progress.component';

@NgModule({
    declarations: [
        AppComponent,
        SocialServiceEditorComponent,
        EditableTableComponent,
        EditableFieldComponent,
        BudgetSearcherComponent,
        TenderSearcherComponent,
        SupplierSearcherComponent,
        SocialServiceListComponent,
        SocialServiceListItemComponent,
        SimpleListEditorComponent,
        SocialServiceUserComponent,
        HierarchyEditorComponent,
        EditableFieldMultipleSelectionComponent,
        ItemProgressComponent,
        AlertTextComponent,
        ItemProgressLegendComponent,
        TenderSuppliersEditorComponent,
        TenderSurveyControlComponent,
        SocialServiceListUpdaterComponent,
        SurveyComponent,
        ServicesTabComponent,
        MeasurementTabComponent,
        MeasurementProgressLegendComponent,
        SocialServiceListMeasurementItemComponent,
        MeasurementItemProgressComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule.forRoot([
            { path: '**', loadChildren: () => EtlServerModule },
        ], {}),
        EtlServerModule,
    ],
    providers: [
        {
            provide: ErrorHandler,
            useValue: Sentry.createErrorHandler({
                showDialog: false,
            }),
        },
        {
            provide: Sentry.TraceService,
            deps: [Router],
        },
        {
            provide: APP_INITIALIZER,
            useFactory: () => () => { },
            deps: [Sentry.TraceService],
            multi: true,
        }],
    bootstrap: [AppComponent]
})
export class AppModule { }
