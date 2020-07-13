import { Component, OnInit, Inject, QueryList, ViewChildren, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Application, ApplicationsObject } from 'src/app/models/application';
import { ApplicationCardComponent } from './application-card/application-card.component';
import { QuantityCounterService } from 'src/app/services/quantity-counter/quantity-counter.service';

@Component({
  selector: 'app-applications-dialog',
  templateUrl: './applications-dialog.component.html',
  styleUrls: ['./applications-dialog.component.css']
})
export class ApplicationsDialogComponent implements OnInit, AfterViewChecked {
  public appIndex = 0;

  @ViewChildren(ApplicationCardComponent) applicationCards: QueryList<ApplicationCardComponent>;

  constructor(
    public dialogRef: MatDialogRef<ApplicationsDialogComponent>,
    private cdRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: { numOfApps: number; applications: ApplicationsObject },
    public quantityCounterService: QuantityCounterService
  ) {}

  public ngOnInit(): void {
    if (Object.values(this.data.applications).length === 0) {
      this.createApp();
    } else {
      this.appIndex = this.calculateLastAppIndex();
    }
    this.quantityCounterService.setAppsQuantities(
      this.data.numOfApps,
      this.getNumberOfConfigurabledApps(this.data.applications)
    );
  }

  public ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  private calculateLastAppIndex(): number {
    const keys: number[] = [];
    for (const id of Object.keys(this.data.applications)) {
      keys.push(+id.replace('app', ''));
    }
    return Math.max(...keys);
  }

  private getNumberOfConfigurabledApps(apps: ApplicationsObject): number {
    let sum = 0;
    for (const [id, app] of Object.entries(apps)) {
      sum += app.quantity;
    }
    return sum;
  }

  public onNoClick(): void {
    this.dialogRef.close();
  }

  private filterOutUnConfiguredApps(): ApplicationsObject {
    const configuredApps: ApplicationsObject = {};
    for (const [id, app] of Object.entries(this.data.applications)) {
      if (app.isConfigured) {
        configuredApps[id] = app;
      }
    }
    return configuredApps;
  }

  public submitApplicationCards(): void {
    this.saveApplicationsState();
    this.closeWithData();
  }

  public checkDialogIsValid(): boolean {
    let isValidAll = true;
    if (this.quantityCounterService.getUndividedApps() > 0) {
      isValidAll = false;
    } else {
      if (this.applicationCards) {
        this.applicationCards.forEach(appCard => {
          if (!appCard.checkValidation()) {
            isValidAll = false;
          } else {
            appCard.application.isConfigured = true;
          }
        });
      }
    }
    return isValidAll;
  }

  private closeWithData(): void {
    const dialogResult = {
      applications: this.filterOutUnConfiguredApps(),
      valid: this.checkDialogIsValid()
    };

    this.dialogRef.close(dialogResult);
  }

  public addApp(): void {
    if (this.quantityCounterService.increaseApps()) {
      this.saveApplicationsState();
      this.createApp();
    }
  }

  private createApp(): void {
    this.appIndex += 1;
    const appId = 'app' + this.appIndex;
    const app = new Application();
    app.id = appId;
    app.quantity = 1;
    app.isConfigured = false;
    this.data.applications[app.id] = app;
  }

  private saveApplicationsState(): void {
    if (this.applicationCards) {
      this.data.applications = {};
      this.applicationCards.forEach(appCard => {
        const application = appCard.getValidApplication();
        this.data.applications[application.id] = application;
      });
    }
  }

  public removeTypeOfApp(id: string): void {
    this.saveApplicationsState();
    delete this.data.applications[id];
    this.quantityCounterService.setAppsQuantities(
      this.data.numOfApps,
      this.getNumberOfConfigurabledApps(this.data.applications)
    );
  }
}
