import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroupDirective, ControlContainer, Validators, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationsDialogComponent } from './applications-dialog/applications-dialog.component';
import { Application } from 'src/app/models/application';
import { ComputingNode } from 'src/app/models/computing-node';

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
  @Input() nodeId: string;
  @Input() isCloud: string;
  @Input() lpdsTypes: string[];
  @Output() setComputingNode = new EventEmitter<ComputingNode>();

  public applications: Map<number, Application> = new Map();
  public statusIcon: string;
  public appsStatusIcon: string;
  cloudCardForm: FormGroup;
  selectedLPDStype: string;
  numOfApps = 1;
  keyCounter = 0;
  cloudIcon: string;
  isCloudBoolean: boolean;

  constructor(private formBuilder: FormBuilder, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.isCloudBoolean = this.isCloud === 'true';
    this.cloudIcon = 'fas fa-smog fa-4x';
    if (this.isCloudBoolean) {
      this.cloudIcon = 'fas fa-cloud fa-4x';
    }
    this.selectedLPDStype = this.lpdsTypes[0]; // needs better solution
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
    if (this.numOfApps === this.applications.size) {
      this.appsStatusIcon = SET_APPS_ICON;
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ApplicationsDialogComponent, {
      disableClose: true,
      width: '80%',
      height: '80%',
      data: { numOfApps: this.numOfApps, counter: this.keyCounter, applications: this.applications }
    });

    dialogRef.afterClosed().subscribe((result: { applications: Map<number, Application>; valid: boolean }) => {
      this.applications = result.applications;
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
      const computingNode = {
        id: this.nodeId,
        x: +this.cloudCardForm.get('xCoord').value,
        y: +this.cloudCardForm.get('yCoord').value,
        lpdsType: this.selectedLPDStype,
        applications: this.applications,
        isCloud: this.isCloudBoolean
      } as ComputingNode;
      this.setComputingNode.emit(computingNode); //needs to put elsewhere
    }
    return iconName;
  }
}
