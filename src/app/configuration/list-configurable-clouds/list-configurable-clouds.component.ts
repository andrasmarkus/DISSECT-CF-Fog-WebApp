import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ComputingNode } from 'src/app/models/computing-node';
import { ComputingNodesObject } from 'src/app/models/computing-nodes-object';

@Component({
  selector: 'app-list-configurable-clouds',
  templateUrl: './list-configurable-clouds.component.html',
  styleUrls: ['./list-configurable-clouds.component.css']
})
export class ListConfigurableCloudsComponent implements OnInit, OnChanges {
  @Input() numOfClouds: number;
  @Input() numOfFogs: number;
  computingNodes: ComputingNodesObject = {};

  public instaces: string[] = ['LPDS_Fog_T1', 'LPDS_Fog_T2', 'LPDS_original']; // come from server
  constructor() {}

  ngOnChanges() {}

  ngOnInit(): void {}

  public addComputingNode(node: ComputingNode) {
    this.computingNodes[node.id] = node;
  }
}
