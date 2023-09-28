import { Component } from '@angular/core';
import { ConfigService } from 'etl-server';
import { HierarchyEditorComponent } from './hierarchy-editor/hierarchy-editor.component';
import { SimpleListEditorComponent } from './simple-list-editor/simple-list-editor.component';
import { SocialServiceEditorComponent } from './social-service-editor/social-service-editor.component';
import { SocialServiceListComponent } from './social-service-list/social-service-list.component';
import { SocialServiceUserComponent } from './social-service-user/social-service-user.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  constructor(private config: ConfigService) {
    config.EXTRA_MAPPING = {
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
    };
    config.ENVIRONMENT = environment;
  }
}
