import { Component, OnInit, Input, OnChanges, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ComputingNode } from 'src/app/models/computing-node';
import { ComputingNodesObject, CloudNodesObject, FogNodesObject } from 'src/app/models/computing-nodes-object';
import * as _ from 'lodash';
import { StepBackServiceService } from 'src/app/services/step-back-service.service';

@Component({
  selector: 'app-list-configurable-clouds',
  templateUrl: './list-configurable-clouds.component.html',
  styleUrls: ['./list-configurable-clouds.component.css']
})
export class ListConfigurableCloudsComponent implements OnChanges {
  @Input() public readonly numOfClouds: number;
  @Input() public readonly numOfFogs: number;
  @Input() public computingNodes: ComputingNodesObject = { clouds: {}, fogs: {} };
  @Output() public readyToSaveEmitter = new EventEmitter<ComputingNodesObject>();

  public readonly instaces: string[] = ['LPDS_Fog_T1', 'LPDS_Fog_T2', 'LPDS_original']; // come from server
  public readyToSave = false;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.updateNodesByInputFormChanges(changes);
    this.checkIsReadyToSave();
  }

  private updateNodesByInputFormChanges(changes: SimpleChanges): void {
    if (changes.numOfClouds) {
      if (changes.numOfClouds.previousValue > changes.numOfClouds.currentValue) {
        this.computingNodes.clouds = this.updateNodesObject(
          this.computingNodes.clouds,
          changes.numOfClouds.currentValue
        );
      }
    }
    if (changes.numOfFogs) {
      if (
        changes.numOfFogs.previousValue > changes.numOfFogs.currentValue &&
        changes.numOfFogs.currentValue > 0 &&
        changes.numOfFogs.currentValue !== undefined
      ) {
        this.computingNodes.fogs = this.updateNodesObject(this.computingNodes.fogs, changes.numOfFogs.currentValue);
      } else if (changes.numOfFogs.currentValue === 0 || changes.numOfFogs.currentValue === undefined) {
        this.computingNodes.fogs = {};
      }
    }
  }

  public addComputingNode(computingNode: ComputingNode): void {
    if (computingNode.isCloud) {
      this.computingNodes.clouds[computingNode.id] = computingNode;
    } else {
      this.computingNodes.fogs[computingNode.id] = computingNode;
    }

    this.checkIsReadyToSave();
  }

  public saveNodes(): void {
    if (this.readyToSave) {
      this.readyToSaveEmitter.emit(this.computingNodes);
    }
  }

  private checkIsReadyToSave(): void {
    this.readyToSave =
      !Object.values(this.computingNodes.clouds).some(node => node.isConfigured === false) &&
      !Object.values(this.computingNodes.fogs).some(node => node.isConfigured === false) &&
      Object.keys(this.computingNodes.clouds).length === this.numOfClouds &&
      Object.keys(this.computingNodes.fogs).length === this.numOfFogs;
  }

  private updateNodesObject(
    nodes: CloudNodesObject | FogNodesObject,
    currentValue: number
  ): CloudNodesObject | FogNodesObject {
    const restOfTheNodes = {};
    let index = 0;
    for (const [id, node] of Object.entries(nodes)) {
      restOfTheNodes[id] = node;
      index++;
      if (index === currentValue) {
        break;
      }
    }
    return restOfTheNodes;
  }
}
