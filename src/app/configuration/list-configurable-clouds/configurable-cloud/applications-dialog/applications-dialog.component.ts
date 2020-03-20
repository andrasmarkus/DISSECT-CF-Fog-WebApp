import { Component, OnInit, Inject, QueryList, ViewChildren, OnChanges } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Application } from 'src/app/models/application';
import { ApplicationCardComponent } from './application-card/application-card.component';

@Component({
  selector: 'app-applications-dialog',
  templateUrl: './applications-dialog.component.html',
  styleUrls: ['./applications-dialog.component.css']
})
export class ApplicationsDialogComponent implements OnInit {
  public applications: Application[] = [];

  @ViewChildren(ApplicationCardComponent) applicationCards: QueryList<ApplicationCardComponent>;

  constructor(
    public dialogRef: MatDialogRef<ApplicationsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { apps: number }
  ) {}

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close([] as Application[]); // if the user click the back button, there are won't be configured applications
  }

  submitApplicationCards(): void {
    if (this.applicationCards) {
      this.applicationCards.forEach(appCard => {
        const app = appCard.getValidApplication();
        if (app !== null) {
          this.applications.push(app);
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
        if (appCard.checkValidation() === false) {
          validAll = false;
        }
      });
    } else {
      validAll = false;
    }
    return validAll;
  }

  closeWithData() {
    this.dialogRef.close(this.applications);
  }

  onChangeApplication(app) {
    console.log(app);
    this.applications.push(app);
    console.log(this.applications);
  }
}
