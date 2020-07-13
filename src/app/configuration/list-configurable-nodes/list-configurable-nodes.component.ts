import { Component, OnInit, Input, OnChanges, Output, EventEmitter, SimpleChanges, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ComputingNode } from 'src/app/models/computing-node';
import { ComputingNodesObject, CloudNodesObject, FogNodesObject } from 'src/app/models/computing-nodes-object';
import * as _ from 'lodash';
import { StepBackServiceService } from 'src/app/services/step-back/step-back-service.service';
import { QuantityCounterService } from 'src/app/services/quantity-counter/quantity-counter.service';
import { StationsObject } from 'src/app/models/station';
import { map } from 'lodash';
import { RestartConfigurationService } from 'src/app/services/restart-configuration.service';
import { Subscription } from 'rxjs';
import { ConfigurationService } from 'src/app/services/configuration/configuration.service';
import { StepperService } from 'src/app/services/stepper/stepper.service';
import { ComputingNodeService } from 'src/app/services/computing-node/computing-node.service';

@Component({
  selector: 'app-list-configurable-nodes',
  templateUrl: './list-configurable-nodes.component.html',
  styleUrls: ['./list-configurable-nodes.component.css']
})
export class ListConfigurableNodesComponent implements OnChanges, OnDestroy {
  @Input() public readonly numOfClouds: number;
  @Input() public readonly numOfFogs: number;

  public readonly resources: string[];
  public readyToSave = false;
  public cloudIndex = 1;
  public fogIndex = 1;

  private restartSubscription: Subscription;

  constructor(
    public quantityCounterService: QuantityCounterService,
    private restartConfService: RestartConfigurationService,
    public configurationService: ConfigurationService,
    public stepperService: StepperService,
    public nodeService: ComputingNodeService
  ) {
    this.resources = this.nodeService.getResurceFiles();
    this.restartSubscription = this.restartConfService.restartConfiguration$.subscribe(restart => {
      if (restart) {
        this.cloudIndex = 1;
        this.fogIndex = 1;
        this.readyToSave = false;
      }
    });
  }

  public ngOnDestroy(): void {
    this.restartSubscription.unsubscribe();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.initNodesIfneeded(changes);
    this.updateNodesByInputFormChanges(changes);
    this.checkIsReadyToSave();
    this.updateRequiredQuantites();
  }

  private initNodesIfneeded(changes: SimpleChanges) {
    if (this.isQuantityOfCloudWasZero(changes)) {
      this.createFirstCloud();
    }
    if (this.isQuantityOfFogWasZero(changes)) {
      this.createFirstFog();
    }
  }

  private isQuantityOfFogWasZero(changes: SimpleChanges): boolean {
    return (
      changes.numOfFogs &&
      Object.keys(this.configurationService.computingNodes.fogs).length === 0 &&
      changes.numOfFogs.currentValue > 0
    );
  }

  private isQuantityOfCloudWasZero(changes: SimpleChanges): boolean {
    return (
      changes.numOfClouds &&
      Object.keys(this.configurationService.computingNodes.clouds).length === 0 &&
      changes.numOfClouds.currentValue > 0
    );
  }

  private updateRequiredQuantites() {
    this.quantityCounterService.setNodeQuantities(
      this.numOfClouds,
      this.numOfFogs,
      this.getNumberOfConfigurabledNodes(this.configurationService.computingNodes.clouds),
      this.getNumberOfConfigurabledNodes(this.configurationService.computingNodes.fogs)
    );
  }

  private createFirstFog() {
    const firstFogId = 'fog' + this.fogIndex;
    const firstFog = new ComputingNode();
    firstFog.id = firstFogId;
    firstFog.isCloud = false;
    firstFog.quantity = 1;
    this.configurationService.computingNodes.fogs[firstFog.id] = firstFog;
  }

  private createFirstCloud() {
    const firstCloudId = 'cloud' + this.cloudIndex;
    const firstCloud = new ComputingNode();
    firstCloud.id = firstCloudId;
    firstCloud.isCloud = true;
    firstCloud.quantity = 1;
    this.configurationService.computingNodes.clouds[firstCloud.id] = firstCloud;
  }

  public addCloud() {
    if (this.quantityCounterService.increaseClouds()) {
      this.cloudIndex += 1;
      const cloudId = 'cloud' + this.cloudIndex;
      const cloud = new ComputingNode();
      cloud.id = cloudId;
      cloud.isCloud = true;
      cloud.quantity = 1;
      this.configurationService.computingNodes.clouds[cloud.id] = cloud;
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
      this.configurationService.computingNodes.fogs[fog.id] = fog;
    }
  }

  private updateNodesByInputFormChanges(changes: SimpleChanges): void {
    if (changes.numOfClouds && !changes.numOfClouds.firstChange) {
      if (
        changes.numOfClouds.previousValue &&
        changes.numOfClouds.previousValue > changes.numOfClouds.currentValue &&
        changes.numOfClouds.currentValue > 0 &&
        changes.numOfClouds.currentValue !== undefined
      ) {
        this.configurationService.computingNodes.clouds = this.updateNodesObject(
          this.configurationService.computingNodes.clouds,
          changes.numOfClouds.currentValue
        );
      } else if (
        changes.numOfClouds.previousValue === 0 &&
        changes.numOfClouds.currentValue > changes.numOfClouds.previousValue
      ) {
        this.createFirstCloud();
      } else if (changes.numOfClouds.currentValue === 0 || changes.numOfClouds.currentValue === undefined) {
        this.configurationService.computingNodes.clouds = {};
      }
    }
    if (changes.numOfFogs && !changes.numOfFogs.firstChange) {
      if (
        changes.numOfFogs.previousValue &&
        changes.numOfFogs.previousValue > changes.numOfFogs.currentValue &&
        changes.numOfFogs.currentValue > 0 &&
        changes.numOfFogs.currentValue !== undefined
      ) {
        this.configurationService.computingNodes.fogs = this.updateNodesObject(
          this.configurationService.computingNodes.fogs,
          changes.numOfFogs.currentValue
        );
      } else if (
        changes.numOfFogs.previousValue === 0 &&
        changes.numOfFogs.currentValue > changes.numOfFogs.previousValue
      ) {
        this.createFirstFog();
      } else if (changes.numOfFogs.currentValue === 0 || changes.numOfFogs.currentValue === undefined) {
        this.configurationService.computingNodes.fogs = {};
      }
    }
  }

  public saveComputingNode(computingNode: ComputingNode): void {
    if (computingNode.isCloud) {
      this.configurationService.computingNodes.clouds[computingNode.id] = computingNode;
    } else {
      this.configurationService.computingNodes.fogs[computingNode.id] = computingNode;
    }

    this.checkIsReadyToSave();
  }

  private checkIsReadyToSave(): void {
    const areCloudsConfigured = !Object.values(this.configurationService.computingNodes.clouds).some(
      node => node.isConfigured === false || node.isConfigured === undefined
    );

    const areFogsConfigured =
      Object.values(this.configurationService.computingNodes.fogs).length === 0
        ? true
        : !Object.values(this.configurationService.computingNodes.fogs).some(
            node => node.isConfigured === false || node.isConfigured === undefined
          );

    const isCloudsQuantityOk =
      this.getNumberOfConfigurabledNodes(this.configurationService.computingNodes.clouds) === this.numOfClouds;

    const isFogsQuantityOk =
      this.getNumberOfConfigurabledNodes(this.configurationService.computingNodes.fogs) === 0 ||
      this.getNumberOfConfigurabledNodes(this.configurationService.computingNodes.fogs) === this.numOfFogs;

    this.readyToSave =
      areCloudsConfigured &&
      areFogsConfigured &&
      isCloudsQuantityOk &&
      isFogsQuantityOk &&
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

  public checkIsReadyToNext(): void {
    if (this.readyToSave) {
      this.stepperService.stepForward();
    }
  }

  private getNumberOfConfigurabledNodes(nodes: CloudNodesObject | FogNodesObject): number {
    let sum = 0;
    for (const [id, node] of Object.entries(nodes)) {
      sum += node.quantity;
    }
    return sum;
  }

  public removeTypeOfNodes(id: string): void {
    if (id.startsWith('cloud')) {
      delete this.configurationService.computingNodes.clouds[id];
    } else {
      delete this.configurationService.computingNodes.fogs[id];
    }

    this.quantityCounterService.setNodeQuantities(
      this.numOfClouds,
      this.numOfFogs,
      this.getNumberOfConfigurabledNodes(this.configurationService.computingNodes.clouds),
      this.getNumberOfConfigurabledNodes(this.configurationService.computingNodes.fogs)
    );
    this.checkIsReadyToSave();
  }
}
