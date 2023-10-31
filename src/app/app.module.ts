import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MapComponent } from './map/map.component';
import { ServiceWorkerModule, SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { filter } from 'rxjs/operators';

function promptUser(event: VersionReadyEvent): boolean {
  return true;
}

@NgModule({
  declarations: [
    AppComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 1 second (whichever comes first).
      registrationStrategy: 'registerWhenStable:1000'
    }),
    BrowserAnimationsModule,
    NavbarComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(swUpdate: SwUpdate) {
    swUpdate.versionUpdates
      .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
      .subscribe(evt => {
        if (promptUser(evt)) {
          document.location.reload();
        }
      });
  }
}
