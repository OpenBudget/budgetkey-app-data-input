import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { EtlServerModule, EXTRA_MAPPING } from 'etl-server';

import { SocialServiceEditorComponent} from './social-service-editor/social-service-editor.component';
import { EditableTableComponent} from './editable-table/editable-table.component';
import { EditableFieldComponent } from './editable-field/editable-field.component';
import { BudgetSearcherComponent } from './budget-searcher/budget-searcher.component';
import { TenderSearcherComponent } from './tender-searcher/tender-searcher.component';
import { SupplierSearcherComponent } from './supplier-searcher/supplier-searcher.component';
import { environment } from 'src/environments/environment';
import { FormsModule } from '@angular/forms';
import { SocialServiceListComponent } from './social-service-list/social-service-list.component';
import { SocialServiceListItemComponent } from './social-service-list-item/social-service-list-item.component';
import { Router, RouterModule } from '@angular/router';
import { SimpleListEditorComponent } from './simple-list-editor/simple-list-editor.component';
import { SocialServiceUserComponent } from './social-service-user/social-service-user.component';
import { HierarchyEditorComponent } from './hierarchy-editor/hierarchy-editor.component';
import { EditableFieldMultipleSelectionComponent } from './editable-field-multiple-selection/editable-field-multiple-selection.component';

import * as Sentry from "@sentry/angular";
import { ItemProgressComponent } from './social-service-list-item/item-progress/item-progress.component';
import { AlertTextComponent } from './alert-text/alert-text.component';
import { ItemProgressLegendComponent } from './social-service-list/item-progress-legend/item-progress-legend.component';
import { TenderSuppliersEditorComponent } from './social-service-editor/tender-suppliers-editor/tender-suppliers-editor.component';

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
    ],
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule.forRoot([], { relativeLinkResolution: 'legacy' }),
        EtlServerModule.forRoot(environment)
    ],
    providers: [{
            provide: EXTRA_MAPPING,
            useValue: {
                social_services: {
                    detail: SocialServiceEditorComponent,
                    dashboard: SocialServiceListComponent,
                    user: SocialServiceUserComponent,
                    list: false
                },
                simple_list: {
                    list: SimpleListEditorComponent
                },
                hierarchy: {
                    list: HierarchyEditorComponent
                }
            }
        },
        {
            provide: ErrorHandler,
            useValue: Sentry.createErrorHandler({
                showDialog: true,
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
