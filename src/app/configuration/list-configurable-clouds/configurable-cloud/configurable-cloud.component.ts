import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroupDirective, ControlContainer, Validators, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationsDialogComponent } from './applications-dialog/applications-dialog.component';
import { Application } from 'src/app/models/application';

// outsource one other repository
const NOT_CONFIGURED_ICON = 'fas fa-times-circle fa-2x';
const CONFIGURED_ICON = 'fas fa-check-circle fa-2x';

const SET_APPS_ICON = 'check_circle_outline';
const UNSET_APPS_ICON = 'error';

@Component({
  selector: 'app-configurable-cloud',
  templateUrl: './configurable-cloud.component.html',
  styleUrls: ['./configurable-cloud.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class ConfigurableCloudComponent implements OnInit {
  @Input() cloudIcon: string;
  public validApplications: Map<number, Application> = new Map();
  public readonly lpdsTypes: string[] = ['LPDS_Fog_T1', 'LPDS_Fog_T2', 'LPDS_original']; // this will come from server
  public statusIcon: string;
  public appsStatusIcon: string;
  cloudCardForm: FormGroup;
  selectedLPDStype = this.lpdsTypes[0]; // need better solution
  numOfApps = 1;
  keyCounter = 0;

  constructor(private formBuilder: FormBuilder, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.cloudCardForm = this.formBuilder.group({
      numOfApplications: ['', Validators.required],
      xCoord: [''],
      yCoord: ['']
    });
    this.statusIcon = NOT_CONFIGURED_ICON;
    this.appsStatusIcon = UNSET_APPS_ICON;
  }

  onChange(event: any): void {
    this.appsStatusIcon = UNSET_APPS_ICON;
    if (this.numOfApps === this.validApplications.size) {
      this.appsStatusIcon = SET_APPS_ICON;
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ApplicationsDialogComponent, {
      disableClose: true,
      width: '80%',
      height: '80%',
      data: { numOfApps: this.numOfApps, counter: this.keyCounter, applications: this.validApplications }
    });

    dialogRef.afterClosed().subscribe((result: { applications: Map<number, Application>; valid: boolean }) => {
      this.validApplications = result.applications;
      if (!result.valid) {
        this.appsStatusIcon = UNSET_APPS_ICON;
      } else {
        this.appsStatusIcon = SET_APPS_ICON;
      }
    });
  }

  checkStatus(): string {
    let iconName = NOT_CONFIGURED_ICON;
    if (
      this.cloudCardForm.valid &&
      this.appsStatusIcon === SET_APPS_ICON &&
      !!this.cloudCardForm.get('xCoord').value &&
      !!this.cloudCardForm.get('yCoord').value
    ) {
      iconName = CONFIGURED_ICON;
    }
    return iconName;
  }
}
