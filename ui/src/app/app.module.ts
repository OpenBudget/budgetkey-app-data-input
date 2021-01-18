import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { EtlServerModule, EXTRA_MAPPING } from 'etl-server';

import { SocialServiceEditorComponent} from './social-service-editor/social-service-editor.component';
import { EditableTableComponent} from './editable-table/editable-table.component';
import { EditableFieldComponent } from './editable-field/editable-field.component';
import { BudgetSearcherComponent } from './budget-searcher/budget-searcher.component';
import { environment } from 'src/environments/environment';
import { FormsModule } from '@angular/forms';
import { SocialServiceListComponent } from './social-service-list/social-service-list.component';
import { SocialServiceListItemComponent } from './social-service-list-item/social-service-list-item.component';
import { RouterModule } from '@angular/router';
import { SimpleListEditorComponent } from './simple-list-editor/simple-list-editor.component';
import { SocialServiceUserComponent } from './social-service-user/social-service-user.component';
import { HierarchyEditorComponent } from './hierarchy-editor/hierarchy-editor.component';


@NgModule({
  declarations: [
    AppComponent,
    SocialServiceEditorComponent,
    EditableTableComponent,
    EditableFieldComponent,
    BudgetSearcherComponent,
    SocialServiceListComponent,
    SocialServiceListItemComponent,
    SimpleListEditorComponent,
    SocialServiceUserComponent,
    HierarchyEditorComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([]),
    EtlServerModule.forRoot(environment)
  ],
  providers: [{
    provide: EXTRA_MAPPING,
    useValue: {
      social_services: {
        detail: SocialServiceEditorComponent,
        list: SocialServiceListComponent,
        user: SocialServiceUserComponent
      },
      simple_list: {
        list: SimpleListEditorComponent
      },
      hierarchy: {
        list: HierarchyEditorComponent
      }
    }
  }],
  entryComponents: [
    SocialServiceEditorComponent,
    SocialServiceListComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
