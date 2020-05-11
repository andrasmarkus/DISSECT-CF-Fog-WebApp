import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder, FormGroupDirective, ControlContainer, Validators, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationsDialogComponent } from './applications-dialog/applications-dialog.component';
import { Application } from 'src/app/models/application';
import { ComputingNode } from 'src/app/models/computing-node';
import { IfStmt } from '@angular/compiler';

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
export class ConfigurableCloudComponent implements OnInit, OnChanges {
  @Input() nodeId: string;
  @Input() isCloud: string;
  @Input() lpdsTypes: string[];
  @Input() readyToSave: boolean;
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
  allAppsConfigured: boolean;

  constructor(private formBuilder: FormBuilder, public dialog: MatDialog) {}

  ngOnChanges(): void {
    if (this.cloudCardForm) {
      console.log('visszaadom');

      this.cloudCardForm.valueChanges.subscribe(value => {
        if (value.allAppsConfigured && !!value.xCoord && !!value.yCoord) {
          const computingNode = {
            id: this.nodeId,
            x: +this.cloudCardForm.get('xCoord').value,
            y: +this.cloudCardForm.get('yCoord').value,
            lpdsType: this.selectedLPDStype,
            applications: this.applications,
            isCloud: this.isCloudBoolean,
            isConfigured: true
          } as ComputingNode;
          this.setComputingNode.emit(computingNode);
          this.statusIcon = CONFIGURED_ICON;
        } else {
          this.setComputingNode.emit({
            id: this.nodeId,
            x: 0,
            y: 0,
            lpdsType: '',
            applications: new Map(),
            isCloud: this.isCloudBoolean,
            isConfigured: false
          } as ComputingNode);
        }
      });
    }
  }

  ngOnInit(): void {
    this.isCloudBoolean = this.isCloud === 'true';
    this.cloudIcon = 'fas fa-smog fa-4x';
    if (this.isCloudBoolean) {
      this.cloudIcon = 'fas fa-cloud fa-4x';
    }
    this.selectedLPDStype = this.lpdsTypes[0]; // needs better solution
    this.cloudCardForm = this.formBuilder.group({
      numOfApplications: [1, Validators.required],
      xCoord: [undefined],
      yCoord: [undefined],
      allAppsConfigured: false
    });

    this.statusIcon = NOT_CONFIGURED_ICON;
    this.appsStatusIcon = UNSET_APPS_ICON;
  }

  onChange(event: any): void {
    this.appsStatusIcon = UNSET_APPS_ICON;
    this.cloudCardForm.controls.allAppsConfigured.setValue(false);
    if (this.numOfApps === this.applications.size) {
      this.appsStatusIcon = SET_APPS_ICON;
      this.cloudCardForm.controls.allAppsConfigured.setValue(true);
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
        this.cloudCardForm.controls.allAppsConfigured.setValue(false);
        this.appsStatusIcon = UNSET_APPS_ICON;
      } else {
        this.cloudCardForm.controls.allAppsConfigured.setValue(true);
        this.appsStatusIcon = SET_APPS_ICON;
      }
    });
  }
}
