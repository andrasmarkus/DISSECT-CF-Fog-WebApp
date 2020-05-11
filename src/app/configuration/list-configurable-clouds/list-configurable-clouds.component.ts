import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ComputingNode } from 'src/app/models/computing-node';
import { ComputingNodesObject } from 'src/app/models/computing-nodes-object';
import * as _ from 'lodash';
import { StepBackServiceService } from 'src/app/services/step-back-service.service';

@Component({
  selector: 'app-list-configurable-clouds',
  templateUrl: './list-configurable-clouds.component.html',
  styleUrls: ['./list-configurable-clouds.component.css']
})
export class ListConfigurableCloudsComponent implements OnInit {
  @Input() numOfClouds: number;
  @Input() numOfFogs: number;
  @Output() readyToSaveEmitter = new EventEmitter<ComputingNodesObject>();
  @Output() isStepBack = new EventEmitter<boolean>();
  computingNodes: ComputingNodesObject = {};
  readyToSave = false;

  public instaces: string[] = ['LPDS_Fog_T1', 'LPDS_Fog_T2', 'LPDS_original']; // come from server
  constructor(private stepBackDialogService: StepBackServiceService) {}

  ngOnInit(): void {}

  public addComputingNode(computingNode: ComputingNode) {
    this.computingNodes[computingNode.id] = computingNode;

    this.readyToSave =
      !Object.values(this.computingNodes).some(node => node.isConfigured === false) &&
      Object.keys(this.computingNodes).length === this.numOfClouds + this.numOfFogs;
  }

  public saveNodes(): void {
    this.readyToSaveEmitter.emit(this.computingNodes);
  }

  stepBack() {
    const dialogRef = this.stepBackDialogService.openDialog();
    dialogRef.afterClosed().subscribe((result: { discard: boolean }) => {
      if (result.discard) {
        this.computingNodes = {};
        this.isStepBack.emit(true);
      }
    });
  }
}
