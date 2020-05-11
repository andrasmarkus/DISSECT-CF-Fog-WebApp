import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { StepBackDialogComponent } from '../configuration/step-back-dialog/step-back-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class StepBackServiceService {
  constructor(private dialog: MatDialog) {}

  openDialog(): MatDialogRef<StepBackDialogComponent, any> {
    return this.dialog.open(StepBackDialogComponent, {
      disableClose: true,
      width: '30%',
      height: '20%',
      data: { discard: false }
    });
  }
}
