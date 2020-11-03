import { Component, ViewChild, AfterViewChecked, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { PanelService } from '../services/panel/panel.service';
import { Station } from '../models/station';
import { BehaviorSubject } from 'rxjs';
import { StepperService } from '../services/configuration/stepper/stepper.service';
import { ConfigurationStateService } from '../services/configuration/configuration-state/configuration-state.service';
import { UserConfigurationService } from '../services/configuration/user-configuration/user-configuration.service';

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
  public stations: Station[] = [];

  @ViewChild('stepper') public stepper: MatStepper;
  @ViewChild('drawer') public drawer: MatDrawer;

  public stepperAnimationDoneSubject = new BehaviorSubject<boolean>(false);
  public stepperAnimationDone$ = this.stepperAnimationDoneSubject.asObservable();

  constructor(
    private changeDetect: ChangeDetectorRef,
    public dialog: MatDialog,
    public stepperService: StepperService,
    public configurationStateService: ConfigurationStateService,
    public configService: UserConfigurationService,
    public panelService: PanelService
  ) {
    this.configurationStateService.passStation$.subscribe(
      () => (this.stations = this.configurationStateService.getStationArray())
    );
  }

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

  public stepperDone(): void {
    if (this.stepper.selectedIndex === 4) {
      this.stepperAnimationDoneSubject.next(true);
    }
  }
}
