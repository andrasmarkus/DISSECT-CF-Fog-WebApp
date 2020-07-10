import { Component, OnInit, ViewChild, AfterViewChecked, ChangeDetectorRef, OnDestroy } from '@angular/core';
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

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements AfterViewChecked, OnDestroy {
  public readonly isLinear = true;
  public numOfClouds: number;
  public numOfFogs: number;
  public back = false;
  public computingNodes: ComputingNodesObject = { clouds: {}, fogs: {} };
  public stationNodes: StationsObject = {};
  public showConnections = false;
  public generateGraph: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private restartSubscription: Subscription;

  @ViewChild(NodeQuantityFormComponent) public numOfCloudsForm: NodeQuantityFormComponent;
  @ViewChild('stepper') public stepper: MatStepper;

  constructor(
    private changeDetect: ChangeDetectorRef,
    public dialog: MatDialog,
    private restartConfService: RestartConfigurationService
  ) {
    this.restartSubscription = this.restartConfService.restartConfiguration$.subscribe(restart => {
      if (restart) {
        this.numOfClouds = 0;
        this.numOfFogs = 0;
        this.computingNodes = { clouds: {}, fogs: {} };
        this.stationNodes = {};
      }
    });
  }

  public ngOnDestroy(): void {
    this.restartSubscription.unsubscribe();
  }

  ngAfterViewChecked(): void {
    this.changeDetect.detectChanges();
  }

  public get numOfCloudsFromGroup(): FormGroup | null {
    return this.numOfCloudsForm ? this.numOfCloudsForm.numOfComputingNodes : null;
  }

  public setNumOfComputingNodes(nodesQuantity: ComputingNodesQuantityData): void {
    this.numOfClouds = nodesQuantity.numberOfClouds;
    this.numOfFogs = nodesQuantity.numberOfFogs ? nodesQuantity.numberOfFogs : 0;
  }

  public saveComputingNodes(nodes: ComputingNodesObject): void {
    this.computingNodes = { ...nodes };
    this.generateGraph.next(true);
  }

  public stepBack(isBack: boolean): void {
    if (isBack) {
      this.stepper.previous();
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
