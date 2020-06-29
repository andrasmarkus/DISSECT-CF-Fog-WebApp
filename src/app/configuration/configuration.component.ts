import { Component, OnInit, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { CloudNumberFormComponent } from './cloud-number-form/cloud-number-form.component';
import { ComputingNodesQuantityData } from '../models/computing-nodes-quantity-data';
import { MatStepper } from '@angular/material/stepper';
import { MatDialog } from '@angular/material/dialog';
import { StepBackDialogComponent } from './step-back-dialog/step-back-dialog.component';
import { StepBackServiceService } from '../services/step-back-service.service';
import { ComputingNodesObject } from '../models/computing-nodes-object';
import { StationsObject } from '../models/station';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements AfterViewChecked {
  public readonly isLinear = true;
  public numOfClouds: number;
  public numOfFogs: number;
  public isCompleted = false;
  public editableQuantityForm = false;
  public selectedIndex = 0;
  public back = false;
  public computingNodes: ComputingNodesObject = {};
  public stationNodes: StationsObject = {};
  public showConnections = false;

  @ViewChild(CloudNumberFormComponent) public numOfCloudsForm: CloudNumberFormComponent;
  @ViewChild('stepper') public stepper: MatStepper;

  constructor(
    private changeDetect: ChangeDetectorRef,
    public dialog: MatDialog,
    private stepBackDialogService: StepBackServiceService
  ) {}

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
    this.computingNodes = nodes;
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
  }
}
