import { Component, ViewChild, AfterViewChecked, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { MatDialog } from '@angular/material/dialog';
import { StepperService } from '../services/stepper/stepper.service';
import { ConfigurationService } from '../services/configuration/configuration.service';
import { MatDrawer } from '@angular/material/sidenav';
import { PanelService } from '../services/panel/panel.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements AfterViewInit, AfterViewChecked {
  public readonly isLinear = true;
  public back = false;
  public showConnections = false;
  public show = false;

  @ViewChild('stepper') public stepper: MatStepper;
  @ViewChild('drawer') public drawer: MatDrawer;

  constructor(
    private changeDetect: ChangeDetectorRef,
    public dialog: MatDialog,
    public stepperService: StepperService,
    public configurationService: ConfigurationService,
    public panelService: PanelService
  ) {}

  public ngAfterViewInit(): void {
    if (this.stepper) {
      this.stepperService.setStepper(this.stepper);
    }
    if (this.drawer) {
      this.panelService.setMainDrawer(this.drawer);
    }
  }

  public ngAfterViewChecked(): void {
    this.changeDetect.detectChanges();
  }

  public openInfoPanelForResources(): void {
    this.panelService.getResourceData();
    this.panelService.open();
  }

  public openInfoPanelForApplications(): void {
    this.panelService.getApplicationData();
    this.panelService.open();
  }
}
