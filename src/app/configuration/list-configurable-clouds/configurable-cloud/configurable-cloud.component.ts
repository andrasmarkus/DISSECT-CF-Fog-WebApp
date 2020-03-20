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
  public readonly lpdsTypes: string[] = ['LPDS_Fog_T1', 'LPDS_Fog_T2', 'LPDS_original'];
  public statusIcon: string;
  public appsStatusIcon: string;
  cloudCardForm: FormGroup;
  selectedLPDStype = this.lpdsTypes[0];
  numOfApps = 1;

  constructor(private formBuilder: FormBuilder, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.cloudCardForm = this.formBuilder.group({
      numOfApplications: ['', Validators.required]
    });
    this.statusIcon = NOT_CONFIGURED_ICON;
    this.appsStatusIcon = UNSET_APPS_ICON;
  }

  onChange(event: any): void {
    this.appsStatusIcon = UNSET_APPS_ICON;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ApplicationsDialogComponent, {
      disableClose: true,
      width: '80%',
      height: '80%',
      data: { apps: this.numOfApps }
    });

    dialogRef.afterClosed().subscribe((applications: Application[]) => {
      console.log('The dialog was closed');
      console.log(applications);
      if (applications.length === 0) {
        this.appsStatusIcon = UNSET_APPS_ICON;
      } else {
        this.appsStatusIcon = SET_APPS_ICON;
      }
    });
  }
}
