import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-step-back-dialog',
  templateUrl: './step-back-dialog.component.html',
  styleUrls: ['./step-back-dialog.component.css']
})
export class StepBackDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<StepBackDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { okAction: boolean }
  ) {}

  ngOnInit(): void {}
  closeDialog() {
    this.data.okAction = false;
    this.dialogRef.close(this.data);
  }
  dicardChanges() {
    this.data.okAction = true;
    this.dialogRef.close(this.data);
  }
}
