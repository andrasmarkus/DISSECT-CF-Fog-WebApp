import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder, FormGroupDirective, ControlContainer, Validators, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationsDialogComponent } from './applications-dialog/applications-dialog.component';
import { ApplicationsObject } from 'src/app/models/application';
import { ComputingNode } from 'src/app/models/computing-node';
import { StringUtlis } from '../../utils/string-utlis';
import { PanelService } from 'src/app/services/panel/panel.service';
import { WindowSizeService } from 'src/app/services/window-size/window-size.service';
import { QuantityCounterService } from 'src/app/services/configuration/quantity-counter/quantity-counter.service';
import { Resource } from 'src/app/models/server-api/server-api';

@Component({
  selector: 'app-configurable-node',
  templateUrl: './configurable-node.component.html',
  styleUrls: ['./configurable-node.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class ConfigurableNodeComponent implements OnChanges {
  @Input() public resources: Resource[];
  @Input() public node: ComputingNode;
  @Output() public readonly setComputingNode = new EventEmitter<ComputingNode>();
  @Output() public readonly removeEmitter = new EventEmitter<string>();

  public statusIcon: string;
  public appsStatusIcon: string;
  public nodeCardForm: FormGroup;
  public selectedResource: Resource;
  public numOfApps = 0;
  public nodeIcon: string;
  public errorTooltip: string;
  public showErrorTooltip = true;

  private readonly maxApplicationsQuantity = 10;
  public readonly maxTooltipp: string;

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public quantityCounterService: QuantityCounterService,
    public panelService: PanelService,
    public windowService: WindowSizeService
  ) {
    this.maxTooltipp = StringUtlis.MAX_TOOLTIP.replace('{0}', '' + this.maxApplicationsQuantity);
  }

  //needed because the keyvalue pipe always return new value
  ngOnChanges(): void {
    this.initNode();
  }

  private initNode() {
    this.numOfApps = this.node.applications ? Object.keys(this.node.applications).length : 0;
    if (!this.node.applications) {
      this.node.applications = {};
    }
    this.selectedResource = this.node.resource ? this.node.resource : undefined;
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
      (this.numOfApps === Object.keys(this.node.applications).length ||
        this.numOfApps < Object.keys(this.node.applications).length) &&
      this.nodeCardForm.valid &&
      !Object.values(this.node.applications).find(app => !app.isConfigured)
    );
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ApplicationsDialogComponent, {
      panelClass: 'applications-dialog-panel',
      disableClose: true,
      maxWidth: '100%',
      width: this.windowService.calculateWidthForApplicationDialog(),
      height: '90%',
      data: { nodeId: this.node.id, numOfApps: this.numOfApps, applications: this.node.applications }
    });

    dialogRef.afterClosed().subscribe((result: { applications: ApplicationsObject; valid: boolean }) => {
      this.panelService.setSelectedDrawerBacktoMainDrawer();
      if (result) {
        this.node.applications = result.applications;
        if (
          !result.valid ||
          !this.nodeCardForm.valid ||
          Object.keys(this.node.applications).length !== this.numOfApps
        ) {
          this.nodeCardForm.controls.allAppsConfigured.setValue(false);
          this.appsStatusIcon = StringUtlis.UNSET_APPS_ICON;
          this.showErrorTooltip = true;
        } else {
          this.nodeCardForm.controls.allAppsConfigured.setValue(true);
          this.appsStatusIcon = StringUtlis.SET_APPS_ICON;
          this.showErrorTooltip = false;
        }
      }
    });
  }

  private initForm(): void {
    this.nodeCardForm = this.formBuilder.group({
      numOfApplications: [
        this.node.applications ? Object.keys(this.node.applications).length : 0,
        [
          Validators.required,
          Validators.max(this.maxApplicationsQuantity),
          Validators.pattern('^[0-9]*$'),
          Validators.min(1)
        ]
      ],
      allAppsConfigured: this.checkAllAppsAreConfigured(),
      quantity: [this.node.quantity, [Validators.min(1)]]
    });
  }

  private checkAllAppsAreConfigured(): boolean {
    return (
      this.node.applications && this.numOfApps > 0 && Object.keys(this.node.applications).length === this.numOfApps
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
    if (allAppsConfigured && this.selectedResource) {
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

  public onResourceChange() {
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
      if (index <= currentValue) {
        restOfTheNodes[id] = app;
        index++;
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

  public openInfoPanelForResources(): void {
    this.panelService.getResourceData();
    this.panelService.toogle();
  }
}
