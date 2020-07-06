import {
  Component,
  OnInit,
  Inject,
  QueryList,
  ViewChildren,
  OnChanges,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Application, ApplicationsObject } from 'src/app/models/application';
import { ApplicationCardComponent } from './application-card/application-card.component';
import { QuantityCounterService } from 'src/app/services/quantity-counter/quantity-counter.service';
import { Station } from 'src/app/models/station';

@Component({
  selector: 'app-applications-dialog',
  templateUrl: './applications-dialog.component.html',
  styleUrls: ['./applications-dialog.component.css']
})
export class ApplicationsDialogComponent implements OnInit, AfterViewInit {
  public dividedApps = 1;
  public appIndex = 1;

  @ViewChildren(ApplicationCardComponent) applicationCards: QueryList<ApplicationCardComponent>;

  constructor(
    public dialogRef: MatDialogRef<ApplicationsDialogComponent>,
    private cdRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: { numOfApps: number; applications: ApplicationsObject },
    public quantityCounterService: QuantityCounterService
  ) {}
  ngOnInit(): void {
    if (Object.values(this.data.applications).length === 0) {
      const firstAppId = 'app' + 1;
      const firsApp = new Application();
      firsApp.id = firstAppId;
      firsApp.quantity = 1;
      this.data.applications[firsApp.id] = firsApp;
    } else {
      this.appIndex = Object.keys(this.data.applications).length;
    }
    this.quantityCounterService.setAppsQuantities(
      this.data.numOfApps,
      this.getNumberOfConfigurabledApps(this.data.applications)
    );
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  private getNumberOfConfigurabledApps(apps: ApplicationsObject): number {
    let sum = 0;
    for (const [id, app] of Object.entries(apps)) {
      sum += app.quantity;
    }
    return sum;
  }

  onNoClick(): void {
    const dialogResult = {
      applications: this.data.applications,
      valid: false
    };

    this.dialogRef.close(dialogResult); // if the user click the back button, there are won't be configured applications
  }

  submitApplicationCards(): void {
    if (this.applicationCards) {
      this.data.applications = {};
      this.applicationCards.forEach(appCard => {
        const app = appCard.getValidApplication();
        if (app !== null) {
          this.data.applications[app.id] = app;
        }
      });
      this.closeWithData();
    }
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
          }
        });
      }
    }
    return isValidAll;
  }

  closeWithData() {
    const dialogResult = {
      applications: this.data.applications,
      valid: this.checkDialogIsValid()
    };

    this.dialogRef.close(dialogResult);
  }

  public addApp(): void {
    if (this.quantityCounterService.increaseApps()) {
      this.appIndex += 1;
      const appId = 'app' + this.appIndex;
      const app = new Application();
      app.id = appId;
      app.quantity = 1;
      this.data.applications[app.id] = app;
    }
  }

  public removeTypeOfApp(id: string): void {
    delete this.data.applications[id];
    this.quantityCounterService.setAppsQuantities(
      this.data.numOfApps,
      this.getNumberOfConfigurabledApps(this.data.applications)
    );
  }
}
