import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder, FormGroupDirective, ControlContainer, Validators, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationsDialogComponent } from './applications-dialog/applications-dialog.component';
import { ApplicationsObject } from 'src/app/models/application';
import { ComputingNode } from 'src/app/models/computing-node';
import { QuantityCounterService } from 'src/app/services/quantity-counter/quantity-counter.service';
import { StringUtlis } from '../../utils/string-utlis';

@Component({
  selector: 'app-configurable-node',
  templateUrl: './configurable-node.component.html',
  styleUrls: ['./configurable-node.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class ConfigurableNodeComponent implements OnChanges {
  @Input() public resources: string[];
  @Input() public node: ComputingNode;
  @Output() public readonly setComputingNode = new EventEmitter<ComputingNode>();
  @Output() public readonly removeEmitter = new EventEmitter<string>();

  public statusIcon: string;
  public appsStatusIcon: string;
  public nodeCardForm: FormGroup;
  public selectedResource: string;
  public numOfApps = 0;
  public nodeIcon: string;
  public errorTooltip: string;
  public showErrorTooltip = true;

  private readonly maxApplicationsQuantity = 10;
  public readonly maxTooltipp: string;

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public quantityCounterService: QuantityCounterService
  ) {
    this.maxTooltipp = StringUtlis.MAX_TOOLTIP.replace('{0}', '' + this.maxApplicationsQuantity);
  }

  //needed because the keyvalue pipe always return new value
  ngOnChanges(): void {
    this.initNode();
  }

  private initNode() {
    this.numOfApps = this.node.applications ? this.getNumberOfConfigurabledApps(this.node.applications) : 0;
    if (!this.node.applications) {
      this.node.applications = {};
    }
    this.selectedResource = this.node.resource ? this.node.resource : '';
    this.nodeIcon = this.node.isCloud ? StringUtlis.CLOUD_ICON : StringUtlis.FOG_ICON;
    this.initForm();
    this.statusIcon = this.isNodevalid() ? StringUtlis.CONFIGURED_ICON : StringUtlis.NOT_CONFIGURED_ICON;
    this.appsStatusIcon = this.checkAllAppsAreConfigured() ? StringUtlis.SET_APPS_ICON : StringUtlis.UNSET_APPS_ICON;

    this.numOfAppsInputListener();
    this.nodeFormListener();
  }

  onChange(): void {
    if (this.areAppsValidOnInputChange()) {
      this.appsStatusIcon = StringUtlis.SET_APPS_ICON;
      this.node.isConfigured = true;
      this.nodeCardForm.controls.allAppsConfigured.setValue(true);
      this.showErrorTooltip = false;
    } else {
      this.appsStatusIcon = StringUtlis.UNSET_APPS_ICON;
      this.node.isConfigured = false;
      this.nodeCardForm.controls.allAppsConfigured.setValue(false);
      this.showErrorTooltip = true;
      if (this.numOfApps > this.maxApplicationsQuantity) {
        this.errorTooltip = this.maxTooltipp;
      } else if (this.numOfApps === 0) {
        this.errorTooltip = StringUtlis.INVALID_TOOLTIP;
      } else {
        this.errorTooltip = StringUtlis.UNSET_APPS_TOOLTIP;
      }
    }
  }

  private areAppsValidOnInputChange() {
    return (
      (this.numOfApps === this.getNumberOfConfigurabledApps(this.node.applications) ||
        this.numOfApps < this.getNumberOfConfigurabledApps(this.node.applications)) &&
      this.nodeCardForm.valid
    );
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
      data: { numOfApps: this.numOfApps, applications: this.node.applications }
    });

    dialogRef.afterClosed().subscribe((result: { applications: ApplicationsObject; valid: boolean }) => {
      this.node.applications = result.applications;

      if (
        !result.valid ||
        !this.nodeCardForm.valid ||
        this.getNumberOfConfigurabledApps(this.node.applications) !== this.numOfApps //check this!!!
      ) {
        this.nodeCardForm.controls.allAppsConfigured.setValue(false);
        this.appsStatusIcon = StringUtlis.UNSET_APPS_ICON;
        this.showErrorTooltip = true;
      } else {
        this.nodeCardForm.controls.allAppsConfigured.setValue(true);
        this.appsStatusIcon = StringUtlis.SET_APPS_ICON;
        this.showErrorTooltip = false;
      }
    });
  }

  private initForm(): void {
    this.nodeCardForm = this.formBuilder.group({
      numOfApplications: [
        this.node.applications ? this.getNumberOfConfigurabledApps(this.node.applications) : 0,
        [Validators.required, Validators.max(this.maxApplicationsQuantity), Validators.pattern(/^[1-9]+[0-9]*$/)]
      ],
      allAppsConfigured: this.checkAllAppsAreConfigured(),
      quantity: [this.node.quantity, [Validators.min(1)]]
    });
  }

  private checkAllAppsAreConfigured(): boolean {
    return (
      this.node.applications &&
      this.numOfApps > 0 &&
      this.getNumberOfConfigurabledApps(this.node.applications) === this.numOfApps
    );
  }

  private isNodevalid(): boolean {
    return this.checkAllAppsAreConfigured() && this.node.isConfigured && this.nodeCardForm.valid;
  }

  private nodeFormListener(): void {
    this.nodeCardForm.valueChanges.subscribe(value => {
      this.saveNodeInParent(value.allAppsConfigured);
    });
  }

  private saveNodeInParent(allAppsConfigured: boolean) {
    if (allAppsConfigured && this.selectedResource !== '') {
      this.node.isConfigured = true;
      this.setNodeProperties();
      this.setComputingNode.emit(this.node);
      this.statusIcon = StringUtlis.CONFIGURED_ICON;
    } else {
      this.node.isConfigured = false;
      this.setNodeProperties();
      this.setComputingNode.emit(this.node);
      this.statusIcon = StringUtlis.NOT_CONFIGURED_ICON;
    }
  }

  private numOfAppsInputListener() {
    this.nodeCardForm.controls.numOfApplications.valueChanges.subscribe((newValue: number) => {
      const oldValue = this.nodeCardForm.value.numOfApplications;
      if (oldValue > newValue && newValue !== 0) {
        this.node.applications = this.updateAppsObject(this.node.applications, newValue);
      }
    });
  }

  public onResourceChange(event: any) {
    this.saveNodeInParent(this.nodeCardForm.controls.allAppsConfigured.value);
  }

  private setNodeProperties(): void {
    this.node.resource = this.selectedResource;
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
        this.nodeCardForm.get('quantity').setValue(this.node.quantity);
      }
    } else {
      if (this.quantityCounterService.decreseFogs(this.node.quantity)) {
        this.node.quantity--;
        this.nodeCardForm.get('quantity').setValue(this.node.quantity);
      }
    }
  }
  increase() {
    if (this.node.isCloud) {
      if (this.quantityCounterService.increaseClouds()) {
        this.node.quantity++;
        this.nodeCardForm.get('quantity').setValue(this.node.quantity);
      }
    } else {
      if (this.quantityCounterService.increaseFogs()) {
        this.node.quantity++;
        this.nodeCardForm.get('quantity').setValue(this.node.quantity);
      }
    }
  }
}
