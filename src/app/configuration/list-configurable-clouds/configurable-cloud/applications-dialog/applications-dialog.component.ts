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

@Component({
  selector: 'app-applications-dialog',
  templateUrl: './applications-dialog.component.html',
  styleUrls: ['./applications-dialog.component.css']
})
export class ApplicationsDialogComponent implements AfterViewInit {
  @ViewChildren(ApplicationCardComponent) applicationCards: QueryList<ApplicationCardComponent>;

  constructor(
    public dialogRef: MatDialogRef<ApplicationsDialogComponent>,
    private cdRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: { numOfApps: number; counter: number; applications: ApplicationsObject }
  ) {}

  ngAfterViewInit() {
    this.cdRef.detectChanges();
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
      this.applicationCards.forEach(appCard => {
        const app = appCard.getValidApplication();
        if (app !== null) {
          this.data.applications[app.id] = app;
        } else {
          // here the form would be invalid, which now is not reacheble
        }
      });
      this.closeWithData();
    }
  }

  public checkDialogIsValid(): boolean {
    let validAll = true;
    if (this.applicationCards) {
      this.applicationCards.forEach(appCard => {
        if (!appCard.checkValidation()) {
          validAll = false;
        }
      });
    }
    return validAll;
  }

  closeWithData() {
    const dialogResult = {
      applications: this.data.applications,
      valid: this.checkDialogIsValid()
    };

    this.dialogRef.close(dialogResult);
  }
  getAppByIndex(id: number) {
    const index = id + 1;
    return this.data.applications['app' + index];
  }
}
