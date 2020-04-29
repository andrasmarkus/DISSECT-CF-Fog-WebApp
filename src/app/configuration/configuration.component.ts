import { Component, OnInit, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { CloudNumberFormComponent } from './cloud-number-form/cloud-number-form.component';
import { ComputingNodesQuantityData } from '../models/computing-nodes-quantity-data';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit, AfterViewChecked {
  public numOfClouds: number;
  public numOfFogs: number;
  isLinear = true;

  @ViewChild(CloudNumberFormComponent) numOfCloudsForm: CloudNumberFormComponent;

  constructor(private changeDetect: ChangeDetectorRef) {}

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
}
