import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ComputingNode } from 'src/app/models/computing-node';
import { ComputingNodesObject } from 'src/app/models/computing-nodes-object';
import * as _ from 'lodash';

@Component({
  selector: 'app-list-configurable-clouds',
  templateUrl: './list-configurable-clouds.component.html',
  styleUrls: ['./list-configurable-clouds.component.css']
})
export class ListConfigurableCloudsComponent implements OnInit, OnChanges {
  @Input() numOfClouds: number;
  @Input() numOfFogs: number;
  @Output() readyToSaveEmitter = new EventEmitter<boolean>();
  computingNodes: ComputingNodesObject = {};
  readyToSave = false;

  public instaces: string[] = ['LPDS_Fog_T1', 'LPDS_Fog_T2', 'LPDS_original']; // come from server
  constructor() {}

  ngOnChanges() {
    console.log(this.computingNodes);
    let clouds = this.getCloudNodesFromObject();
    let fogs = this.getFogNodesFromObject();
    clouds = this.restoreTheObject(clouds, true);
    fogs = this.restoreTheObject(fogs, false);
    /*     console.log(this.numOfClouds);
    console.log(clouds);
    console.log(this.numOfFogs);
    console.log(fogs); */
  }

  getCloudNodesFromObject(): ComputingNodesObject {
    return _.omitBy(this.computingNodes, (value: ComputingNode, key: string) => !value.isCloud);
  }
  getFogNodesFromObject(): ComputingNodesObject {
    return _.omitBy(this.computingNodes, (value: ComputingNode, key: string) => value.isCloud);
  }

  restoreTheObject(nodes: ComputingNodesObject, isCloud: boolean): ComputingNodesObject {
    let comparableLength = isCloud ? this.numOfClouds : this.numOfFogs;
    if (Object.keys(nodes).length !== comparableLength) {
      if (Object.keys(nodes).length < comparableLength) {
        for (let i = Object.keys(nodes).length; i < this.numOfClouds; i++) {
          const key = isCloud ? 'cloud' + i : 'fog' + i;
          nodes[key] = {
            id: key,
            x: 0,
            y: 0,
            lpdsType: '',
            applications: new Map(),
            isCloud,
            isConfigured: false
          } as ComputingNode;
        }
      } else {
        nodes = Object.keys(nodes)
          .slice(0, this.numOfClouds)
          .reduce((result, key) => {
            result[key] = this.computingNodes[key];
            return result;
          }, {});
      }
    }
    return nodes;
  }

  ngOnInit(): void {
    /*  console.log(this.computingNodes);
    let clouds = this.getCloudNodesFromObject();
    let fogs = this.getFogNodesFromObject();
    clouds = this.restoreTheObject(clouds, true);
    fogs = this.restoreTheObject(fogs, false);
    console.log(this.numOfClouds);
    console.log(clouds);
    console.log(this.numOfFogs);
    console.log(fogs); */
  }

  public addComputingNode(computingNode: ComputingNode) {
    this.computingNodes[computingNode.id] = computingNode;

    this.readyToSave =
      !Object.values(this.computingNodes).some(node => node.isConfigured === false) &&
      Object.keys(this.computingNodes).length === this.numOfClouds + this.numOfFogs;
    this.readyToSaveEmitter.emit(this.readyToSave);
  }

  public saveNodes(): void {
    this.readyToSave = true;
  }
}
