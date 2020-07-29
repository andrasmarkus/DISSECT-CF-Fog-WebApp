import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import * as jQuery from 'jquery';
import * as _ from 'lodash';
import * as joint from 'jointjs';
import { FogNodesObject, CloudNodesObject, ComputingNodesObject } from 'src/app/models/computing-nodes-object';
import { StationsObject } from 'src/app/models/station';
import { ConfigurationObject, Neighbour } from 'src/app/models/configuration';
import { omit } from 'lodash';
import { BehaviorSubject, Subscription } from 'rxjs';
import { StepBackServiceService } from 'src/app/services/step-back/step-back-service.service';
import { ConfigurationService } from 'src/app/services/configuration/configuration.service';
import { StepperService } from 'src/app/services/stepper/stepper.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

export class Node {
  id: string;
  nodeId: string;
}

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.css']
})
export class ConnectionComponent implements OnInit, OnDestroy {
  public clouds: CloudNodesObject = {};
  public fogs: FogNodesObject = {};

  public multipleStationNodes: StationsObject;
  public numOfClouds = 1;
  public numOfFogs = 0;
  public numOfStations = 2;
  public nodeWidth: number;
  public nodeHeight: number;
  public latency: number;

  cloudImageSrcURL = '../../../assets/images/cloud_icon.svg.png';
  fogImageSrcURL = 'https://freesvg.org/img/1343932181.png';
  stationImageSrcURL = '../../../assets/images/station_icon.png';

  selectedNodeQueue: Node[] = [];
  public configuration: ConfigurationObject = { nodes: {}, stations: {} };

  public paper: joint.dia.Paper;
  public graph: joint.dia.Graph;

  public paperWidth: any;
  public paperHeight: any;
  public proportionOfTheTotalSize = 0.8;
  public sapceForClouds: number;
  public sapceForFogs: number;
  public sapceForStations: number;
  public numOfLayers: number;
  public cloudsStartYpos: number;
  public fogsStartYpos: number;
  public stationsStartYpos: number;
  public verticalSpaceBetweenLayers: number;

  private readonly circleRangeBackgroundColor = '#00f71b40';
  private generationSubscription: Subscription;

  public connectionForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private stepBackDialogService: StepBackServiceService,
    public configurationService: ConfigurationService,
    public stepperService: StepperService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.generationSubscription = this.configurationService.generateGraph$.subscribe(value => {
      if (value) {
        this.createGraph();
      }
    });
  }

  ngOnDestroy(): void {
    this.generationSubscription.unsubscribe();
  }

  stepBack() {
    const dialogRef = this.stepBackDialogService.openDialog();
    dialogRef.afterClosed().subscribe((result: { okAction: boolean }) => {
      if (result.okAction) {
        this.stepperService.stepBack();
      }
    });
  }

  private createGraph() {
    this.setNodesQuantities();
    this.setSizes();
    this.countsSpaces();
    this.numOfLayers = this.countLayers();

    this.verticalSpaceBetweenLayers = (this.paperHeight / this.numOfLayers - this.nodeHeight) / 2;
    this.countsStartPositions();
    this.createInitCongifuration();
    this.graph = new joint.dia.Graph();
    this.setConnectionPaper();

    this.setListenerForPointerClickOnElement();
    this.setListenerForPointerClickOnBlank();
    this.setListenerForPointerMoveOnElement();
    this.setListenerForGraphRemove();
    this.createCellsForTheGraph();
  }

  private initForm() {
    this.connectionForm = this.formBuilder.group({
      latency: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[1-9]+[0-9]*$/) //prevent 0 value
      ])
    });
  }

  private createCellsForTheGraph(): void {
    const graphElements: (joint.dia.Link | joint.shapes.standard.Image | joint.dia.Cell)[] = [];
    graphElements.push(
      ...this.createNodesInQueue(this.clouds, this.sapceForClouds, this.cloudsStartYpos, this.cloudImageSrcURL)
    );
    graphElements.push(
      ...this.createNodesInQueue(this.fogs, this.sapceForFogs, this.fogsStartYpos, this.fogImageSrcURL)
    );
    graphElements.push(
      ...this.createNodesWithRangeInQueue(
        this.multipleStationNodes,
        this.sapceForStations,
        this.stationsStartYpos,
        this.stationImageSrcURL
      )
    );
    this.graph.addCells(this.inintCells(graphElements));
  }

  private setListenerForGraphRemove(): void {
    this.graph.on('remove', cell => {
      if (cell.isLink()) {
        console.log(cell);
        const sourceCell = this.graph.getCells().find(c => c.id === cell.attributes.source.id);
        const targetCell = this.graph.getCells().find(c => c.id === cell.attributes.target.id);
        const sourceNodeId = sourceCell.attributes.attrs.nodeId;
        const targetNodeId = targetCell.attributes.attrs.nodeId;
        if (this.configuration.nodes[sourceNodeId] && this.configuration.nodes[targetNodeId]) {
          const sourceNeighbours = this.configuration.nodes[sourceNodeId].neighbours;
          const targetNeighbours = this.configuration.nodes[targetNodeId].neighbours;
          this.configuration.nodes[sourceNodeId].neighbours = omit(sourceNeighbours, targetNodeId);
          this.configuration.nodes[targetNodeId].neighbours = omit(targetNeighbours, sourceNodeId);
        }
      }
    });
  }

  private setListenerForPointerMoveOnElement(): void {
    this.paper.on('element:pointermove', (elementView: joint.dia.ElementView) => {
      const currentElement = elementView.model;
      if (!currentElement.isEmbedded()) {
        const xPos = currentElement.attributes.position.x;
        const yPos = currentElement.attributes.position.y;
        const name = currentElement.attributes.attrs.nodeId;
        currentElement.attr('label/text', name + '\n[' + `${xPos}` + ',' + `${yPos}` + ']');
      }
    });
  }

  private setListenerForPointerClickOnBlank(): void {
    this.paper.on('blank:pointerclick', () => {
      const cells = this.graph.getCells();
      cells.forEach(cell => {
        const elView = this.paper.findViewByModel(cell);
        if (this.selectedNodeQueue.some(node => node.id === cell.id)) {
          elView.unhighlight();
        }
      });
    });
  }

  private setListenerForPointerClickOnElement(): void {
    this.paper.on('element:pointerclick', (elementView: joint.dia.ElementView) => {
      const currentElement = elementView.model;
      if (!currentElement.isEmbedded()) {
        if (currentElement.attributes.attrs.selected === 'true') {
          this.deselectNode(elementView);
        } else {
          this.selectNode(elementView);
        }
      }
    });
  }

  private setConnectionPaper(): void {
    this.paper = new joint.dia.Paper({
      el: jQuery('#paper'),
      width: this.paperWidth,
      height: this.paperHeight,
      model: this.graph,
      gridSize: 1,
      interactive: cellView => {
        return !cellView.model.isEmbedded();
      }
    });
  }

  private countsStartPositions(): void {
    if (this.numOfClouds > 0) {
      this.cloudsStartYpos = this.verticalSpaceBetweenLayers;
    }
    if (this.numOfFogs > 0) {
      this.fogsStartYpos =
        this.numOfClouds > 0
          ? this.cloudsStartYpos + this.nodeHeight + this.verticalSpaceBetweenLayers * 2
          : this.cloudsStartYpos;
    }
    if (this.numOfClouds === 0) {
      this.stationsStartYpos = this.fogsStartYpos + this.nodeHeight + this.verticalSpaceBetweenLayers * 2;
    } else if (this.numOfFogs === 0) {
      this.stationsStartYpos = this.cloudsStartYpos + this.nodeHeight + this.verticalSpaceBetweenLayers * 2;
    } else {
      this.stationsStartYpos = this.fogsStartYpos + this.nodeHeight + this.verticalSpaceBetweenLayers * 2;
    }
  }

  private countsSpaces(): void {
    if (this.numOfClouds > 0) {
      this.sapceForClouds = (this.paperWidth - this.numOfClouds * this.nodeWidth) / (this.numOfClouds + 1);
    }
    if (this.numOfFogs > 0) {
      this.sapceForFogs = (this.paperWidth - this.numOfFogs * this.nodeWidth) / (this.numOfFogs + 1);
    }
    if (this.numOfStations > 0) {
      this.sapceForStations = (this.paperWidth - this.numOfStations * this.nodeWidth) / (this.numOfStations + 1);
    }
  }

  private setSizes(): void {
    this.paperWidth = window.innerWidth * this.proportionOfTheTotalSize;
    this.paperHeight = window.innerHeight * this.proportionOfTheTotalSize;
    const computedNodeWidth = this.paperWidth / (this.getTheMaxQuantityOfNodes() * 2);
    const computedNodeHeight = this.paperHeight / (this.getTheMaxQuantityOfNodes() * 2);
    this.nodeWidth = computedNodeWidth > 75 ? 75 : computedNodeWidth;
    this.nodeHeight = computedNodeHeight > 50 ? 50 : computedNodeHeight;
  }

  private setNodesQuantities(): void {
    this.clouds = this.getMultipleNodes(this.configurationService.computingNodes.clouds) as CloudNodesObject;
    this.fogs = this.getMultipleNodes(this.configurationService.computingNodes.fogs) as FogNodesObject;
    this.multipleStationNodes = this.getMultipleNodes(this.configurationService.stationNodes) as StationsObject;
    this.numOfClouds = Object.keys(this.clouds).length;
    this.numOfFogs = Object.keys(this.fogs).length;
    this.numOfStations = Object.keys(this.multipleStationNodes).length;
  }

  public createLinkBetweenSelectedNodes(): void {
    if (this.isQueueFull && this.connectionForm.controls.latency.valid) {
      const link = new joint.dia.Link({
        source: { id: this.selectedNodeQueue[0].id },
        target: { id: this.selectedNodeQueue[1].id }
      });
      link.labels([
        {
          attrs: {
            text: {
              text: '' + this.connectionForm.controls.latency.value
            }
          }
        }
      ]);
      this.createNeighbours();
      this.graph.addCell(link);
    }
    console.log(this.graph.toJSON());
  }

  private createImageNode(
    nodeId: string,
    x: number,
    y: number,
    imageSrc: string,
    width = this.nodeWidth,
    height = this.nodeHeight
  ): joint.shapes.standard.Image {
    const node = new joint.shapes.standard.Image({
      position: { x, y },
      size: { width, height }
    });
    node.attr('image/xlinkHref', imageSrc);
    node.attr('label/text', nodeId + '\n[' + `${Math.round(x)}` + ',' + `${Math.round(y)}` + ']');
    node.attr('label/fontSize', '11');
    node.attributes.attrs.label.refY = '100%';
    node.attributes.attrs.label.refY2 = '1';
    node.attr('nodeId', nodeId);
    return node;
  }

  private isQueueFull(): boolean {
    return this.selectedNodeQueue.length === 2;
  }

  private selectNode(elementView: joint.dia.ElementView): void {
    if (this.isQueueFull()) {
      const shiftedNode = this.selectedNodeQueue.shift();
      const cells = this.graph.getCells();
      cells.forEach(cell => {
        const elView = this.paper.findViewByModel(cell);
        if (cell.id === shiftedNode.id) {
          elView.unhighlight();
        }
      });
    }
    this.selectedNodeQueue.push({
      id: elementView.model.id as string,
      nodeId: elementView.model.attributes.attrs.nodeId as string
    });
    elementView.highlight();
    elementView.model.attr('selected', 'true');
  }

  private deselectNode(elementView: joint.dia.ElementView): void {
    elementView.unhighlight();
    elementView.model.attr('selected', 'false');
    if (this.selectedNodeQueue.some(node => node.id === elementView.model.id)) {
      this.selectedNodeQueue = this.selectedNodeQueue.filter(node => node.id !== elementView.model.id);
    }
  }

  private inintCells(
    cells: (joint.shapes.standard.Image | joint.dia.Link | joint.dia.Cell)[]
  ): (joint.shapes.standard.Image | joint.dia.Link | joint.dia.Cell)[] {
    cells.forEach(cell => cell.attr('selected', 'false'));
    return cells;
  }

  private countLayers(): number {
    let numOfLayers = 0;
    if (this.numOfClouds && this.numOfClouds > 0) {
      numOfLayers++;
    }
    if (this.numOfFogs && this.numOfFogs > 0) {
      numOfLayers++;
    }
    if (this.numOfStations && this.numOfStations > 0) {
      numOfLayers++;
    }
    return numOfLayers;
  }

  private getTheMaxQuantityOfNodes(): number {
    const nums = [];
    if (this.numOfClouds) {
      nums.push(this.numOfClouds);
    }
    if (this.numOfFogs) {
      nums.push(this.numOfFogs);
    }
    if (this.numOfStations) {
      nums.push(this.numOfStations);
    }
    return Math.max(...nums);
  }

  private getMultipleNodes(
    nodes: StationsObject | FogNodesObject | CloudNodesObject
  ): StationsObject | FogNodesObject | CloudNodesObject {
    const resultObject = {};
    for (const [id, node] of Object.entries(nodes)) {
      if (node.quantity > 1) {
        for (let i = 1; i <= node.quantity; i++) {
          const subNodeKey = id + '.' + i;
          resultObject[subNodeKey] = { ...node };
          resultObject[subNodeKey].quantity = 1;
        }
      } else {
        resultObject[id] = node;
      }
    }
    return resultObject;
  }

  private getCircleRangeForNode(
    node: joint.shapes.standard.Image,
    nodeStartX: number,
    nodeStartY: number,
    radius: number
  ): joint.shapes.standard.Circle {
    const nodeXCenter = nodeStartX + this.nodeWidth / 2;
    const nodeYCenter = nodeStartY + this.nodeHeight / 2;
    const circleXCenter = nodeXCenter - radius;
    const circleYCenter = nodeYCenter - radius;
    const circle = new joint.shapes.standard.Circle();
    circle.resize(radius * 2, radius * 2);
    circle.position(circleXCenter, circleYCenter);
    circle.attr('root/title', 'joint.shapes.standard.Circle');
    circle.attr('body/fill', this.circleRangeBackgroundColor);
    circle.attr('body/strokeWidth', '0');
    node.embed(circle);
    return circle;
  }

  private createNodesWithRangeInQueue(
    items: StationsObject,
    space: number,
    startYpos: number,
    imageUrl: string
  ): (joint.shapes.standard.Image | joint.shapes.standard.Circle)[] {
    const nodes: (joint.shapes.standard.Image | joint.shapes.standard.Circle)[] = [];
    const itemsLength = Object.keys(items).length;
    let counter = 0;
    for (const [stationId, station] of Object.entries(items)) {
      const xPos = space + (counter * this.nodeWidth + space * counter);
      const node = this.createImageNode(stationId, xPos, startYpos, imageUrl);
      if (station.radius > 0) {
        const nodeRange = this.getCircleRangeForNode(node, xPos, startYpos, station.radius);
        nodes.push(...[nodeRange, node]);
      } else {
        nodes.push(node);
      }
      counter++;
    }
    return nodes;
  }

  private createNodesInQueue(
    items: CloudNodesObject | FogNodesObject,
    space: number,
    startYpos: number,
    imageUrl: string
  ): joint.shapes.standard.Image[] {
    const nodes: joint.shapes.standard.Image[] = [];
    const itemsLength = Object.keys(items).length;
    let counter = 0;
    if (itemsLength > 0) {
      for (const [nodeId, node] of Object.entries(items)) {
        const xPos = space + (counter * this.nodeWidth + space * counter);
        nodes.push(this.createImageNode(nodeId, xPos, startYpos, imageUrl));
        counter++;
      }
    }

    return nodes;
  }

  private createInitCongifuration(): void {
    this.configuration.nodes = {};
    for (const [id, node] of Object.entries(this.clouds)) {
      this.configuration.nodes[id] = { ...node, neighbours: {} };
    }
    for (const [id, node] of Object.entries(this.fogs)) {
      this.configuration.nodes[id] = { ...node, neighbours: {} };
    }
    this.configuration.stations = this.multipleStationNodes;
    //console.log(this.configuration);
  }

  private createNeighbours(): void {
    const firstSelectedNodeId = this.selectedNodeQueue[0].nodeId;
    const secondSelectedNodeId = this.selectedNodeQueue[1].nodeId;
    if (this.configuration.nodes[firstSelectedNodeId] && this.configuration.nodes[secondSelectedNodeId]) {
      const firstToSecond = {
        name: secondSelectedNodeId,
        latency: this.latency
      } as Neighbour;

      const secondToFirst = {
        name: firstSelectedNodeId,
        latency: this.latency
      } as Neighbour;
      this.configuration.nodes[firstSelectedNodeId].neighbours[secondSelectedNodeId] = firstToSecond;
      this.configuration.nodes[secondSelectedNodeId].neighbours[firstSelectedNodeId] = secondToFirst;
    }
  }

  public save(): void {
    this.graph.getCells().forEach(cell => {
      if (!cell.isLink() && cell.attributes.attrs.nodeId) {
        const nodeId = cell.attributes.attrs.nodeId;
        const x = cell.attributes.position.x;
        const y = cell.attributes.position.y;
        if (this.configuration.nodes[nodeId]) {
          this.configuration.nodes[nodeId].x = x;
          this.configuration.nodes[nodeId].y = y;
        } else if (this.configuration.stations[nodeId]) {
          this.configuration.stations[nodeId].yCoord = x;
          this.configuration.stations[nodeId].xCoord = y;
        }
      }
    });
    console.log(this.configuration);
  }
}
