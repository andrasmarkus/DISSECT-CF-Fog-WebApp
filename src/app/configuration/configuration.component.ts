import { Component, OnInit, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { CloudNumberFormComponent } from './cloud-number-form/cloud-number-form.component';
import { ComputingNodesQuantityData } from '../models/computing-nodes-quantity-data';
import { MatStepper } from '@angular/material/stepper';
import { MatDialog } from '@angular/material/dialog';
import { StepBackDialogComponent } from './step-back-dialog/step-back-dialog.component';

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

  @ViewChild(CloudNumberFormComponent) numOfCloudsForm: CloudNumberFormComponent;
  @ViewChild('stepper') stepper: MatStepper;

  constructor(private changeDetect: ChangeDetectorRef, public dialog: MatDialog) {}

  ngOnInit(): void {
    /*  this.stepper.selectionChange.subscribe(selection => {
      console.log(selection.selectedStep);
      console.log(selection.previouslySelectedStep);
    }); */
  }

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

  public changeCompleted(value: boolean): void {
    this.isCompleted = value;
  }

  stepClick(event) {
    console.log('kiirom');

    if (event.selectedIndex === 0 && event.previouslySelectedIndex === 1) {
      console.log('hey');
    }
    console.log(event);
  }
  onQuantityFormClick(stepper: MatStepper) {
    const dialogRef = this.dialog.open(StepBackDialogComponent, {
      disableClose: true,
      width: '30%',
      height: '30%',
      data: { discard: false }
    });

    dialogRef.afterClosed().subscribe((result: { discard: boolean }) => {
      if (result.discard) {
        console.log('mehet a back');
        this.editableQuantityForm = true;
      } else {
      }
    });
  }
}
