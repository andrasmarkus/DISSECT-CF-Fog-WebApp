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

@NgModule({
  declarations: [
    AppComponent,
    CloudNumberFormComponent,
    ConfigurationComponent,
    ListConfigurableCloudsComponent,
    ConfigurableCloudComponent,
    ApplicationsDialogComponent,
    ApplicationCardComponent
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
