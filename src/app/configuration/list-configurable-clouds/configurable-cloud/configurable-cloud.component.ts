import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder, FormGroupDirective, ControlContainer, Validators, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationsDialogComponent } from './applications-dialog/applications-dialog.component';
import { Application, ApplicationsObject } from 'src/app/models/application';
import { ComputingNode } from 'src/app/models/computing-node';
import { IfStmt } from '@angular/compiler';
import { QuantityCounterService } from 'src/app/services/quantity-counter/quantity-counter.service';

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
  @Input() public lpdsTypes: string[];
  @Input() public node: ComputingNode;
  @Output() public readonly setComputingNode = new EventEmitter<ComputingNode>();
  @Output() public readonly removeEmitter = new EventEmitter<string>();

  public statusIcon: string;
  public appsStatusIcon: string;
  public cloudCardForm: FormGroup;
  public selectedLPDStype: string;
  public numOfApps = 0;
  public cloudIcon: string;
  public errorTooltip: string;
  public showErrorTooltip = true;

  private applications: ApplicationsObject = {};
  private keyCounter = 0;
  private isCloudBoolean: boolean;
  private readonly maxApplicationsQuantity = 10;

  public readonly MAX_TOOLTIP = 'The maximum value is ' + this.maxApplicationsQuantity + '!';

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public quantityCounterService: QuantityCounterService
  ) {}

  ngOnInit(): void {
    this.statusIcon = NOT_CONFIGURED_ICON;
    this.appsStatusIcon = UNSET_APPS_ICON;
    this.errorTooltip = INVALID_TOOLTIP;

    this.isCloudBoolean = this.node.isCloud === true;
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

      if (!result.valid || !this.cloudCardForm.valid || Object.keys(this.applications).length !== this.numOfApps) {
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
      allAppsConfigured: false,
      quantity: [this.node.quantity, [Validators.min(1)]]
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
      id: this.node.id,
      x: 0,
      y: 0,
      lpdsType,
      applications,
      isCloud: this.isCloudBoolean,
      isConfigured,
      quantity: this.node.quantity
    } as ComputingNode;
  }

  decrease() {
    if (this.node.isCloud) {
      if (this.quantityCounterService.decreseClouds(this.node.quantity)) {
        this.node.quantity--;
        this.cloudCardForm.get('quantity').setValue(this.node.quantity);
      }
    } else {
      if (this.quantityCounterService.decreseFogs(this.node.quantity)) {
        this.node.quantity--;
        this.cloudCardForm.get('quantity').setValue(this.node.quantity);
      }
    }
  }
  increase() {
    if (this.node.isCloud) {
      if (this.quantityCounterService.increaseClouds()) {
        this.node.quantity++;
        this.cloudCardForm.get('quantity').setValue(this.node.quantity);
      }
    } else {
      if (this.quantityCounterService.increaseFogs()) {
        this.node.quantity++;
        this.cloudCardForm.get('quantity').setValue(this.node.quantity);
      }
    }
  }
}
