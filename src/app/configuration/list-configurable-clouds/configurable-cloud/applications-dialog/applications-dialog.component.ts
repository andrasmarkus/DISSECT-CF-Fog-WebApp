import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Application } from 'src/app/models/application';

@Component({
  selector: 'app-applications-dialog',
  templateUrl: './applications-dialog.component.html',
  styleUrls: ['./applications-dialog.component.css']
})
export class ApplicationsDialogComponent implements OnInit {
  applications: Application[] = [];
  constructor(
    public dialogRef: MatDialogRef<ApplicationsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { apps: number }
  ) {}

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onChangeApplication(app) {
    console.log(app);
    this.applications.push(app);
    console.log(this.applications);
  }
}
