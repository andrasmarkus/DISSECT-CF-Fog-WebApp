import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
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
  selector: 'app-configurable-node',
  templateUrl: './configurable-node.component.html',
  styleUrls: ['./configurable-node.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class ConfigurableNodeComponent implements OnInit {
  @Input() public resources: string[];
  @Input() public node: ComputingNode;
  @Output() public readonly setComputingNode = new EventEmitter<ComputingNode>();
  @Output() public readonly removeEmitter = new EventEmitter<string>();

  public statusIcon: string;
  public appsStatusIcon: string;
  public cloudCardForm: FormGroup;
  public selectedResource: string;
  public numOfApps = 0;
  public cloudIcon: string;
  public errorTooltip: string;
  public showErrorTooltip = true;

  private applications: ApplicationsObject = {};
  private isCloudBoolean: boolean;
  private readonly maxApplicationsQuantity = 10;

  public readonly MAX_TOOLTIP = 'The maximum value is ' + this.maxApplicationsQuantity + '!';

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public quantityCounterService: QuantityCounterService
  ) {}

  ngOnInit(): void {
    this.selectedResource = this.resources[0];
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

  onChange(): void {
    if (
      (this.numOfApps === this.getNumberOfConfigurabledApps(this.applications) ||
        this.numOfApps < this.getNumberOfConfigurabledApps(this.applications)) &&
      this.cloudCardForm.valid
    ) {
      this.appsStatusIcon = SET_APPS_ICON;
      this.node.isConfigured = true;
      this.cloudCardForm.controls.allAppsConfigured.setValue(true);
      this.showErrorTooltip = false;
    } else {
      this.appsStatusIcon = UNSET_APPS_ICON;
      this.node.isConfigured = false;
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
  private getNumberOfConfigurabledApps(apps: ApplicationsObject): number {
    let sum = 0;
    for (const [id, app] of Object.entries(apps)) {
      sum += app.quantity;
    }
    return sum;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ApplicationsDialogComponent, {
      panelClass: 'applications-dialog-panel',
      disableClose: true,
      width: '80%',
      height: '80%',
      data: { numOfApps: this.numOfApps, applications: this.applications }
    });

    dialogRef.afterClosed().subscribe((result: { applications: ApplicationsObject; valid: boolean }) => {
      this.applications = result.applications;
      console.log(this.applications);

      if (
        !result.valid ||
        !this.cloudCardForm.valid ||
        this.getNumberOfConfigurabledApps(this.applications) !== this.numOfApps
      ) {
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
    //if the entered number less than it was, then it is correct
    this.cloudCardForm.controls['numOfApplications'].valueChanges.subscribe((newValue: number) => {
      const oldValue = this.cloudCardForm.value['numOfApplications'];
      if (oldValue > newValue && newValue !== 0) {
        this.applications = this.updateAppsObject(this.applications, newValue);
      }
    });

    //send node to the parent at form value changes
    this.cloudCardForm.valueChanges.subscribe(value => {
      if (value.allAppsConfigured) {
        this.node.isConfigured = true;
        this.setNodeProperties();
        this.setComputingNode.emit(this.node);
        this.statusIcon = CONFIGURED_ICON;
      } else {
        this.node.isConfigured = false;
        this.setNodeProperties();
        this.setComputingNode.emit(this.node);
        this.statusIcon = NOT_CONFIGURED_ICON;
      }
    });
  }

  private setNodeProperties(): void {
    this.node.resource = this.selectedResource;
    this.node.applications = this.applications;
  }

  private updateAppsObject(apps: ApplicationsObject, currentValue: number): ApplicationsObject {
    const restOfTheNodes = {};
    let index = 0;
    for (const [id, app] of Object.entries(apps)) {
      if (index === currentValue) {
        break;
      }
      if (index + app.quantity <= currentValue) {
        restOfTheNodes[id] = app;
        index += app.quantity;
      } else {
        const quantity = currentValue - index;
        index += quantity;
        app.quantity = quantity;
        restOfTheNodes[id] = app;
        break;
      }
    }
    return restOfTheNodes;
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
