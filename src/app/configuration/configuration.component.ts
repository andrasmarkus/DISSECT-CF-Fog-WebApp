import { Component, OnInit, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { CloudNumberFormComponent } from './cloud-number-form/cloud-number-form.component';
import { ComputingNodesQuantityData } from '../models/computing-nodes-quantity-data';
import { MatStepper } from '@angular/material/stepper';
import { MatDialog } from '@angular/material/dialog';
import { StepBackDialogComponent } from './step-back-dialog/step-back-dialog.component';
import { StepBackServiceService } from '../services/step-back-service.service';
import { ComputingNodesObject } from '../models/computing-nodes-object';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit, AfterViewChecked {
  public numOfClouds: number;
  public numOfFogs: number;
  isLinear = true;
  isCompleted = false;
  editableQuantityForm = false;
  selectedIndex = 0;
  back = false;
  computingNodes: ComputingNodesObject = {};

  @ViewChild(CloudNumberFormComponent) numOfCloudsForm: CloudNumberFormComponent;
  @ViewChild('stepper') stepper: MatStepper;

  constructor(
    private changeDetect: ChangeDetectorRef,
    public dialog: MatDialog,
    private stepBackDialogService: StepBackServiceService
  ) {}

  ngOnInit(): void {}

  ngAfterViewChecked(): void {
    this.changeDetect.detectChanges();
  }

  get numOfCloudsFromGroup() {
    return this.numOfCloudsForm ? this.numOfCloudsForm.numOfComputingNodes : null;
  }

  setNumOfComputingNodes(nodesQuantity: ComputingNodesQuantityData) {
    this.numOfClouds = nodesQuantity.numberOfClouds;
    this.numOfFogs = nodesQuantity.numberOfFogs ? nodesQuantity.numberOfFogs : 0;
  }

  public changeCompleted(nodes: ComputingNodesObject): void {
    this.computingNodes = nodes;
    console.log(this.computingNodes);
  }

  stepBack(isBack: boolean) {
    if (isBack) {
      this.stepper.previous();
    }
  }
}
