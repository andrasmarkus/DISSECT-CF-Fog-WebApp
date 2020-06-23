import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder, FormGroupDirective, ControlContainer, Validators, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationsDialogComponent } from './applications-dialog/applications-dialog.component';
import { Application, ApplicationsObject } from 'src/app/models/application';
import { ComputingNode } from 'src/app/models/computing-node';
import { IfStmt } from '@angular/compiler';

// outsource one other repository
const NOT_CONFIGURED_ICON = 'fas fa-times-circle fa-2x';
const CONFIGURED_ICON = 'fas fa-check-circle fa-2x';

const SET_APPS_ICON = 'check_circle_outline';
const UNSET_APPS_ICON = 'error';

const INVALID_TOOLTIP = 'Invalid quantity!';
const UNSET_APPS_TOOLTIP = 'Applications are not configured!';

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

  public applications: ApplicationsObject = {};
  public statusIcon: string;
  public appsStatusIcon: string;
  cloudCardForm: FormGroup;
  selectedLPDStype: string;
  numOfApps = 0;
  keyCounter = 0;
  cloudIcon: string;
  isCloudBoolean: boolean;
  allAppsConfigured: boolean;
  public maxApplicationsQuantity = 10;
  public errorTooltip: string;
  public showErrorTooltip = true;
  public readonly MAX_TOOLTIP = 'The maximum value is ' + this.maxApplicationsQuantity + '!';

  constructor(private formBuilder: FormBuilder, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.statusIcon = NOT_CONFIGURED_ICON;
    this.appsStatusIcon = UNSET_APPS_ICON;
    this.errorTooltip = INVALID_TOOLTIP;

    this.isCloudBoolean = this.isCloud === 'true';
    this.cloudIcon = 'fas fa-smog fa-4x';
    if (this.isCloudBoolean) {
      this.cloudIcon = 'fas fa-cloud fa-4x';
    }

    this.initForm();
    this.sendConfiguredNodeToParent();
  }

  onChange(event: any): void {
    if (
      (this.numOfApps === Object.keys(this.applications).length ||
        this.numOfApps < Object.keys(this.applications).length) &&
      this.cloudCardForm.valid
    ) {
      this.appsStatusIcon = SET_APPS_ICON;
      this.cloudCardForm.controls.allAppsConfigured.setValue(true);
      this.showErrorTooltip = false;
    } else {
      this.appsStatusIcon = UNSET_APPS_ICON;
      this.cloudCardForm.controls.allAppsConfigured.setValue(false);
      this.showErrorTooltip = true;
      if (this.numOfApps > this.maxApplicationsQuantity) {
        this.errorTooltip = this.MAX_TOOLTIP;
      } else if (this.numOfApps === 0) {
        this.errorTooltip = INVALID_TOOLTIP;
      } else {
        this.errorTooltip = UNSET_APPS_TOOLTIP;
      }
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ApplicationsDialogComponent, {
      panelClass: 'applications-dialog-panel',
      disableClose: true,
      width: '80%',
      height: '80%',
      data: { numOfApps: this.numOfApps, counter: this.keyCounter, applications: this.applications }
    });

    dialogRef.afterClosed().subscribe((result: { applications: ApplicationsObject; valid: boolean }) => {
      this.applications = result.applications;

      if (!result.valid || !this.cloudCardForm.valid) {
        this.cloudCardForm.controls.allAppsConfigured.setValue(false);
        this.appsStatusIcon = UNSET_APPS_ICON;
        this.showErrorTooltip = true;
      } else {
        this.cloudCardForm.controls.allAppsConfigured.setValue(true);
        this.appsStatusIcon = SET_APPS_ICON;
        this.showErrorTooltip = false;
      }
    });
  }

  private initForm(): void {
    this.selectedLPDStype = this.lpdsTypes[0]; // needs better solution
    this.cloudCardForm = this.formBuilder.group({
      numOfApplications: [
        '',
        [Validators.required, Validators.max(this.maxApplicationsQuantity), Validators.pattern(/^[1-9]+[0-9]*$/)]
      ],
      allAppsConfigured: false
    });
  }

  private sendConfiguredNodeToParent(): void {
    if (this.cloudCardForm) {
      this.cloudCardForm.valueChanges.subscribe(value => {
        if (value.allAppsConfigured) {
          const computingNode = this.createComputingNode(true, this.selectedLPDStype, this.applications);
          this.setComputingNode.emit(computingNode);
          this.statusIcon = CONFIGURED_ICON;
        } else {
          const computingNode = this.createComputingNode(false);
          this.setComputingNode.emit(computingNode);
          this.statusIcon = NOT_CONFIGURED_ICON;
        }
      });
    }
  }

  private createComputingNode(
    isConfigured: boolean,
    lpdsType: string = '',
    applications: ApplicationsObject = {}
  ): ComputingNode {
    return {
      id: this.nodeId,
      x: 0,
      y: 0,
      lpdsType,
      applications,
      isCloud: this.isCloudBoolean,
      isConfigured
    } as ComputingNode;
  }
}
