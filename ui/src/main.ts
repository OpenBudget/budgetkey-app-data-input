import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as Sentry from "@sentry/angular-ivy";
import { Integrations } from "@sentry/tracing";

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  Sentry.init({
    dsn: "https://76f33daa392a4284b5d6dd930d6498da@o367221.ingest.sentry.io/5734503",
    integrations: [
      new Integrations.BrowserTracing({
        tracingOrigins: ["https://data-input.obudget.org/"],
        routingInstrumentation: Sentry.routingInstrumentation,
      }),
    ],
  
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
