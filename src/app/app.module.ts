import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material/angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfigurationComponent } from './configuration/configuration.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CloudNumberFormComponent } from './configuration/cloud-number-form/cloud-number-form.component';
import { ListConfigurableCloudsComponent } from './configuration/list-configurable-clouds/list-configurable-clouds.component';
import { ConfigurableCloudComponent } from './configuration/list-configurable-clouds/configurable-cloud/configurable-cloud.component';
import { ApplicationsDialogComponent } from './configuration/list-configurable-clouds/configurable-cloud/applications-dialog/applications-dialog.component';
import { ApplicationCardComponent } from './configuration/list-configurable-clouds/configurable-cloud/applications-dialog/application-card/application-card.component';
import { StepBackDialogComponent } from './configuration/step-back-dialog/step-back-dialog.component';
import { ConnectionComponent } from './configuration/connection/connection.component';
import { ListStationsComponent } from './configuration/list-stations/list-stations.component';
import { ConfigurableStationComponent } from './configuration/list-stations/configurable-station/configurable-station.component';

@NgModule({
  declarations: [
    AppComponent,
    CloudNumberFormComponent,
    ConfigurationComponent,
    ListConfigurableCloudsComponent,
    ConfigurableCloudComponent,
    ApplicationsDialogComponent,
    ApplicationCardComponent,
    StepBackDialogComponent,
    ConnectionComponent,
    ListStationsComponent,
    ConfigurableStationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
