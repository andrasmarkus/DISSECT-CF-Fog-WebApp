import {
  Component,
  OnInit,
  ViewChild,
  AfterViewChecked,
  ChangeDetectorRef,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import { NodeQuantityFormComponent } from './node-quantity-form/node-quantity-form.component';
import { ComputingNodesQuantityData } from '../models/computing-nodes-quantity-data';
import { MatStepper } from '@angular/material/stepper';
import { MatDialog } from '@angular/material/dialog';
import { StepBackDialogComponent } from './step-back-dialog/step-back-dialog.component';
import { StepBackServiceService } from '../services/step-back/step-back-service.service';
import { ComputingNodesObject } from '../models/computing-nodes-object';
import { StationsObject } from '../models/station';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { RestartConfigurationService } from '../services/restart-configuration.service';
import { StepperService } from '../services/stepper/stepper.service';
import { ConfigurationService } from '../services/configuration/configuration.service';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements AfterViewInit, AfterViewChecked, OnDestroy {
  public readonly isLinear = true;
  public back = false;
  public computingNodes: ComputingNodesObject = { clouds: {}, fogs: {} };
  public stationNodes: StationsObject = {};
  public showConnections = false;
  public generateGraph: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private restartSubscription: Subscription;

  @ViewChild('stepper') public stepper: MatStepper;

  constructor(
    private changeDetect: ChangeDetectorRef,
    public dialog: MatDialog,
    private restartConfService: RestartConfigurationService,
    public stepperService: StepperService,
    public configurationService: ConfigurationService
  ) {
    this.restartSubscription = this.restartConfService.restartConfiguration$.subscribe(restart => {
      if (restart) {
        this.computingNodes = { clouds: {}, fogs: {} };
        this.stationNodes = {};
      }
    });
  }

  public ngAfterViewInit(): void {
    if (this.stepper) {
      this.stepperService.setStepper(this.stepper);
    }
  }

  public ngOnDestroy(): void {
    this.restartSubscription.unsubscribe();
  }

  ngAfterViewChecked(): void {
    this.changeDetect.detectChanges();
  }

  public saveComputingNodes(nodes: ComputingNodesObject): void {
    this.computingNodes = { ...nodes };
    this.generateGraph.next(true);
  }

  public stepBack(isBack: boolean): void {
    if (isBack) {
      this.stepperService.stepBack();
    }
  }

  private enableConnectionComponent(): void {
    this.showConnections = true;
  }

  public saveStationNodes(stationNodes: StationsObject): void {
    this.enableConnectionComponent();
    this.stationNodes = stationNodes;
    this.generateGraph.next(true);
  }
}
