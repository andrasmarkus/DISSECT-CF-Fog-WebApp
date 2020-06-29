import { Component, OnInit, Input, OnChanges, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ComputingNode } from 'src/app/models/computing-node';
import { ComputingNodesObject, CloudNodesObject, FogNodesObject } from 'src/app/models/computing-nodes-object';
import * as _ from 'lodash';
import { StepBackServiceService } from 'src/app/services/step-back-service.service';
import { QuantityCounterService } from 'src/app/services/quantity-counter/quantity-counter.service';
import { StationsObject } from 'src/app/models/station';
import { map } from 'lodash';

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
  public dividedClouds = 1;
  public dividedFogs = 1;
  public clouds: ComputingNode[] = [];
  public fogs: ComputingNode[] = [];
  public cloudIndex = 1;
  public fogIndex = 1;

  constructor(public quantityCounterService: QuantityCounterService) {
    const firstCloudId = 'cloud' + this.cloudIndex;
    const firstCloud = new ComputingNode();
    firstCloud.id = firstCloudId;
    firstCloud.isCloud = true;
    firstCloud.quantity = 1;
    this.clouds.push(firstCloud);
    this.computingNodes.clouds[firstCloud.id] = firstCloud;

    const firstFogId = 'fog' + this.fogIndex;
    const firstFog = new ComputingNode();
    firstFog.id = firstFogId;
    firstFog.isCloud = false;
    firstFog.quantity = 1;
    this.fogs.push(firstFog);
    this.computingNodes.fogs[firstFog.id] = firstFog;
    this.quantityCounterService.setQuantities(
      this.numOfClouds,
      this.numOfFogs,
      this.getNumberOfConfigurabledNodes(this.computingNodes.clouds),
      this.getNumberOfConfigurabledNodes(this.computingNodes.fogs)
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateNodesByInputFormChanges(changes);
    this.checkIsReadyToSave();
    this.quantityCounterService.setQuantities(
      this.numOfClouds,
      this.numOfFogs,
      this.getNumberOfConfigurabledNodes(this.computingNodes.clouds),
      this.getNumberOfConfigurabledNodes(this.computingNodes.fogs)
    );
  }

  public addCloud() {
    if (this.quantityCounterService.increaseClouds()) {
      this.cloudIndex += 1;
      const cloudId = 'cloud' + this.cloudIndex;
      const cloud = new ComputingNode();
      cloud.id = cloudId;
      cloud.isCloud = true;
      cloud.quantity = 1;
      this.clouds.push(cloud);
      this.computingNodes.clouds[cloud.id] = cloud;
    }
  }

  public addFog() {
    if (this.quantityCounterService.increaseFogs()) {
      this.fogIndex += 1;
      const fogId = 'fog' + this.fogIndex;
      const fog = new ComputingNode();
      fog.id = fogId;
      fog.isCloud = false;
      fog.quantity = 1;
      this.fogs.push(fog);
      this.computingNodes.fogs[fog.id] = fog;
    }
  }

  private updateNodesByInputFormChanges(changes: SimpleChanges): void {
    if (changes.numOfClouds) {
      if (changes.numOfClouds.previousValue > changes.numOfClouds.currentValue) {
        this.computingNodes.clouds = this.updateNodesObject(
          this.computingNodes.clouds,
          changes.numOfClouds.currentValue
        );
        this.filterOutCloudsFromArray();
      }
    }
    if (changes.numOfFogs) {
      if (
        changes.numOfFogs.previousValue > changes.numOfFogs.currentValue &&
        changes.numOfFogs.currentValue > 0 &&
        changes.numOfFogs.currentValue !== undefined
      ) {
        this.computingNodes.fogs = this.updateNodesObject(this.computingNodes.fogs, changes.numOfFogs.currentValue);
        this.filterOutFogsFromArray();
      } else if (changes.numOfFogs.currentValue === 0 || changes.numOfFogs.currentValue === undefined) {
        this.computingNodes.fogs = {};
        this.filterOutFogsFromArray();
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
      this.getNumberOfConfigurabledNodes(this.computingNodes.clouds) === this.numOfClouds &&
      this.getNumberOfConfigurabledNodes(this.computingNodes.fogs) === this.numOfFogs &&
      this.quantityCounterService.getUndividedClouds() === 0;
  }

  private updateNodesObject(
    nodes: CloudNodesObject | FogNodesObject,
    currentValue: number
  ): CloudNodesObject | FogNodesObject {
    const restOfTheNodes = {};
    let index = 0;
    for (const [id, node] of Object.entries(nodes)) {
      if (index === currentValue) {
        break;
      }
      if (index + node.quantity <= currentValue) {
        restOfTheNodes[id] = node;
        index += node.quantity;
      } else {
        const quantity = currentValue - index;
        index += quantity;
        node.quantity = quantity;
        restOfTheNodes[id] = node;
        break;
      }
    }
    return restOfTheNodes;
  }

  private filterOutCloudsFromArray(): void {
    this.clouds = this.clouds.filter(cloud => this.computingNodes.clouds[cloud.id] !== undefined);
    this.clouds = this.clouds.map(cloud => (cloud = this.computingNodes.clouds[cloud.id]));
  }

  private filterOutFogsFromArray(): void {
    this.fogs = this.fogs.filter(fog => this.computingNodes.clouds[fog.id] !== undefined);
    this.fogs = this.fogs.map(fog => (fog = this.computingNodes.fogs[fog.id]));
  }

  getNumberOfConfigurabledNodes(nodes: CloudNodesObject | FogNodesObject): number {
    let sum = 0;
    for (const [id, node] of Object.entries(nodes)) {
      sum += node.quantity;
    }
    return sum;
  }
}
