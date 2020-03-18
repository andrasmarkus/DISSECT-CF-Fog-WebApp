import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroupDirective, ControlContainer, Validators, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationsDialogComponent } from './applications-dialog/applications-dialog.component';

@Component({
  selector: 'app-configurable-cloud',
  templateUrl: './configurable-cloud.component.html',
  styleUrls: ['./configurable-cloud.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class ConfigurableCloudComponent implements OnInit {
  @Input() icon: string;
  public readonly lpdsTypes: string[] = ['LPDS_Fog_T1', 'LPDS_Fog_T2', 'LPDS_original'];
  cloudCardForm: FormGroup;
  selectedLPDStype = this.lpdsTypes[0];
  numOfApps = 1;

  animal: string;
  name: string;

  constructor(private formBuilder: FormBuilder, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.cloudCardForm = this.formBuilder.group({
      numOfApplications: ['', Validators.required]
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ApplicationsDialogComponent, {
      width: '80%',
      height: '80%',
      data: { apps: this.numOfApps }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }
}
