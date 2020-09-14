import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import * as jQuery from 'jquery';
import * as _ from 'lodash';
import * as joint from 'jointjs';
import { FogNodesObject, CloudNodesObject } from 'src/app/models/computing-nodes-object';
import { StationsObject } from 'src/app/models/station';
import { ConfigurationObject, Neighbour, NODETYPES, Node } from 'src/app/models/configuration';
import { omit } from 'lodash';
import { Subscription } from 'rxjs';
import { StepBackServiceService } from 'src/app/services/step-back/step-back-service.service';
import { ConfigurationService } from 'src/app/services/configuration/configuration.service';
import { StepperService } from 'src/app/services/stepper/stepper.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.css']
})
export class ConnectionComponent implements OnInit, OnDestroy {
  public clouds: CloudNodesObject = {};
  public fogs: FogNodesObject = {};
  public configuration: ConfigurationObject = { nodes: {}, stations: {} };
  public multipleStationNodes: StationsObject;

  public numOfClouds = 1;
  public numOfFogs = 0;
  public numOfStations = 2;
  public numOfLayers: number;
  public verticalSpaceBetweenLayers: number;

  public simpleConnectionForm: FormGroup;
  public parentConnectionForm: FormGroup;

  public paper: joint.dia.Paper;
  public graph: joint.dia.Graph;

  public nodeWidth: number;
  public nodeHeight: number;
  public paperWidth: number;
  public paperHeight: number;
  public sapceForClouds: number;
  public sapceForFogs: number;
  public sapceForStations: number;
  public cloudsStartYpos: number;
  public fogsStartYpos: number;
  public stationsStartYpos: number;

  private generationSubscription: Subscription;
  private selectedNodeQueue: Node[] = [];

  private readonly cloudImageSrcURL = '../../../assets/images/cloud_icon.svg.png';
  private readonly fogImageSrcURL = 'https://freesvg.org/img/1343932181.png'; // find other img for that
  private readonly stationImageSrcURL = '../../../assets/images/station_icon.png';
  private readonly circleRangeBackgroundColor = '#00f71b40';

  constructor(
    private formBuilder: FormBuilder,
    private stepBackDialogService: StepBackServiceService,
    public configurationService: ConfigurationService,
    public stepperService: StepperService,
    private snackBar: MatSnackBar
  ) {
    this.initForm();
  }

  public ngOnInit(): void {
    this.generationSubscription = this.configurationService.generateGraph$.subscribe(() => this.createGraph());
  }

  public ngOnDestroy(): void {
    if (this.generationSubscription) {
      this.generationSubscription.unsubscribe();
    }
  }

  public stepBack(): void {
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
    this.simpleConnectionForm = this.formBuilder.group({
      latency: new FormControl('', [Validators.required, Validators.min(1)])
    });
    this.parentConnectionForm = this.formBuilder.group({
      parentLatency: new FormControl('', [Validators.required, Validators.min(1)])
    });
  }

  private createCellsForTheGraph(): void {
    const graphElements: (joint.dia.Link | joint.shapes.standard.Image | joint.dia.Cell)[] = [];
    graphElements.push(
      ...this.createNodesInQueue(
        this.clouds,
        this.sapceForClouds,
        this.cloudsStartYpos,
        this.cloudImageSrcURL,
        NODETYPES.CLOUD
      )
    );
    graphElements.push(
      ...this.createNodesInQueue(this.fogs, this.sapceForFogs, this.fogsStartYpos, this.fogImageSrcURL, NODETYPES.FOG)
    );
    graphElements.push(
      ...this.createNodesWithRangeInQueue(
        this.multipleStationNodes,
        this.sapceForStations,
        this.stationsStartYpos,
        this.stationImageSrcURL,
        NODETYPES.STATION
      )
    );
    this.graph.addCells(this.inintCells(graphElements));
  }

  private setListenerForGraphRemove(): void {
    this.graph.on('remove', cell => {
      if (cell.isLink()) {
        const sourceCell = this.graph.getCells().find(c => c.id === cell.attributes.source.id);
        const targetCell = this.graph.getCells().find(c => c.id === cell.attributes.target.id);
        const sourceNodeId = sourceCell.attributes.attrs.nodeId;
        const targetNodeId = targetCell.attributes.attrs.nodeId;

        if (cell.attributes.attrs.isParentLink && cell.attributes.attrs.isParentLink === 'true') {
          this.addAttributeToCell(sourceCell.attributes.attrs.nodeId, 'parent', 'none');
        }

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
        this.writeOutNodeDetails(currentElement);
      } else {
        const parent = currentElement.getParentCell();
        this.writeOutNodeDetails(parent);
      }
    });
  }

  private writeOutNodeDetails(currentElement: joint.dia.Element | joint.dia.Cell): void {
    const xPos = currentElement.attributes.position.x;
    const yPos = currentElement.attributes.position.y;
    const [lon, lat] = this.convertXYCoordToLatLon(xPos, yPos);
    const name = currentElement.attributes.attrs.nodeId;
    currentElement.attr(
      'label/text',
      (name as string).replace('station', 'devices') + '\n[' + `${lon}` + ',' + `${lat}` + ']'
    );
  }

  private convertXYCoordToLatLon(x: number, y: number) {
    const yPos = y + this.nodeHeight / 2;
    const xPos = x + this.nodeWidth / 2;
    const lat = (yPos / (this.paperHeight / 180) - 90) * -1;
    const lon = xPos / (this.paperWidth / 360) - 180;
    let roundedLat = Math.round(lat);
    let roundedLon = Math.round(lon);
    if (Math.abs(roundedLat) > 90) {
      roundedLat -= roundedLat - 90;
    }
    if (Math.abs(roundedLon) > 180) {
      roundedLon -= roundedLon - 180;
    }
    return [roundedLon, roundedLat];
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
    let paperMargin = 48; /*the static 24 px on left and add +24 for the right*/
    if (window.innerWidth >= 1000) {
      paperMargin += 150; /*sidenav*/
    }
    this.paperWidth = window.innerWidth - paperMargin;
    this.paperHeight = window.innerHeight;
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
    if (this.isQueueFull() && this.simpleConnectionForm.controls.latency.valid) {
      if (this.isLinkBetweenNonStationNodes() && this.isFreeToAddSimpleConnection()) {
        const link = new joint.shapes.standard.Link({
          source: { id: this.selectedNodeQueue[0].id },
          target: { id: this.selectedNodeQueue[1].id }
        });
        link.labels([
          {
            attrs: {
              text: {
                text: '' + this.simpleConnectionForm.controls.latency.value
              }
            }
          }
        ]);
        link.attributes.attrs.line.targetMarker = {};
        link.attr('isParentLink', 'false');
        this.createNeighbours(this.simpleConnectionForm.controls.latency.value);
        this.graph.addCell(link);
        this.createLinkTools(link);
      } else {
        this.openSnackBar('You can not create simple connection between these nodes!.', 'OK');
      }
    } else {
      this.openSnackBar('You should add latency to the simple connection!', 'OK');
    }
  }

  public createParentLinkBetweenSelectedCloudAndFog(): void {
    if (this.isQueueFull() && this.parentConnectionForm.controls.parentLatency.valid) {
      if (this.isLinkBetweenNonStationNodes() && this.isFreeToAddParentConnection()) {
        const fog: Node = this.selectedNodeQueue.filter(node => node.nodeType === NODETYPES.FOG)[0];
        const cloud: Node = this.selectedNodeQueue.filter(node => node.nodeType === NODETYPES.CLOUD)[0];
        const link = new joint.shapes.standard.Link({
          source: { id: fog.id },
          target: { id: cloud.id }
        });
        link.labels([
          {
            attrs: {
              text: {
                text: '' + this.parentConnectionForm.controls.parentLatency.value
              }
            }
          }
        ]);
        link.attr('line/stroke', 'orange');
        link.attr('isParentLink', 'true');
        this.addAttributeToCell(fog.nodeId, 'parent', cloud.nodeId);

        const fogIndex = this.selectedNodeQueue.findIndex(node => node.nodeType === NODETYPES.FOG);
        this.selectedNodeQueue[fogIndex].parent = cloud.nodeId;
        this.createNeighbours(this.parentConnectionForm.controls.parentLatency.value);
        this.graph.addCell(link);
        this.createLinkTools(link);
      } else {
        this.openSnackBar(
          'You have to select 1 cloud and 1 fog! Such nodes which have not parent connection yet.',
          'OK'
        );
      }
    } else {
      this.openSnackBar('You should add latency to the parent connection!', 'OK');
    }
  }

  private isFreeToAddParentConnection(): boolean {
    const fogArray = this.selectedNodeQueue.filter(node => node.nodeType === NODETYPES.FOG);
    if (fogArray.length !== 1) {
      return false;
    }
    return fogArray[0].parent && fogArray[0].parent === 'none';
  }

  private isFreeToAddSimpleConnection(): boolean {
    if (
      this.graph
        .getCells()
        .filter(cell => cell.isLink())
        .some(cell =>
          this.doesThisLinkCointainTheseNodes(cell, this.selectedNodeQueue[0].id, this.selectedNodeQueue[1].id)
        )
    ) {
      return false;
    }
    const fogArray = this.selectedNodeQueue.filter(node => node.nodeType === NODETYPES.FOG);
    if (fogArray.length === 1) {
      return false;
    }
    return true;
  }

  private doesThisLinkCointainTheseNodes(cell: joint.dia.Cell, first: string, second: string): boolean {
    return (
      (cell.attributes.source.id === first || cell.attributes.source.id === second) &&
      (cell.attributes.target.id === first || cell.attributes.target.id === second)
    );
  }

  private addAttributeToCell(nodeId: string, attrKey: string, attrValue: string): void {
    this.graph.getCells().forEach((cell: joint.shapes.standard.Image | joint.dia.Link | joint.dia.Cell) => {
      if (cell.attributes.attrs.nodeId && nodeId === cell.attributes.attrs.nodeId) {
        cell.attr(attrKey, attrValue);
      }
    });
  }

  private createLinkTools(link: joint.shapes.standard.Link) {
    const removeAction = (evt: joint.dia.Event, view: joint.dia.LinkView) => {
      view.model.remove({ ui: true });
    };
    const removeButton = new joint.linkTools.Remove({
      distance: 20,
      action: removeAction
    });

    const toolsView = new joint.dia.ToolsView({
      tools: [removeButton]
    });
    const linkView = link.findView(this.paper);
    linkView.addTools(toolsView);
    linkView.hideTools();

    this.paper.on('link:mouseenter', view => view.showTools());
    this.paper.on('link:mouseleave', view => view.hideTools());
  }

  private openSnackBar(messageText: string, actionText: string, duration: number = 3000): void {
    this.snackBar.open(messageText, actionText, {
      duration
    });
  }

  private isLinkBetweenNonStationNodes(): boolean {
    return !(
      this.selectedNodeQueue[0].nodeType === NODETYPES.STATION ||
      this.selectedNodeQueue[1].nodeType === NODETYPES.STATION
    );
  }

  private createImageNode(
    nodeId: string,
    x: number,
    y: number,
    imageSrc: string,
    width: number,
    height: number,
    nodeType: string
  ): joint.shapes.standard.Image {
    const node = new joint.shapes.standard.Image({
      position: { x, y },
      size: { width, height }
    });
    node.attr('image/xlinkHref', imageSrc);
    const [lon, lat] = this.convertXYCoordToLatLon(x, y);
    node.attr('label/text', (nodeId as string).replace('station', 'devices') + '\n[' + `${lon}` + ',' + `${lat}` + ']');
    node.attr('label/fontSize', '11');
    node.attributes.attrs.label.refY = '100%';
    node.attributes.attrs.label.refY2 = '1';
    node.attr('nodeId', nodeId);
    node.attr('nodeTpye', nodeType);
    if (nodeType === NODETYPES.CLOUD || nodeType === NODETYPES.FOG) {
      node.attr('parent', 'none');
    }
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
      nodeId: elementView.model.attributes.attrs.nodeId as string,
      nodeType: elementView.model.attributes.attrs.nodeTpye as string,
      parent: elementView.model.attributes.attrs.parent
        ? (elementView.model.attributes.attrs.parent as string)
        : undefined
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
    imageUrl: string,
    nodeType: string
  ): (joint.shapes.standard.Image | joint.shapes.standard.Circle)[] {
    const nodes: (joint.shapes.standard.Image | joint.shapes.standard.Circle)[] = [];
    let counter = 0;
    for (const [stationId, station] of Object.entries(items)) {
      const xPos = space + (counter * this.nodeWidth + space * counter);
      const node = this.createImageNode(
        stationId,
        xPos,
        startYpos,
        imageUrl,
        this.nodeWidth,
        this.nodeHeight,
        nodeType
      );
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
    imageUrl: string,
    nodeType: string
  ): joint.shapes.standard.Image[] {
    const nodes: joint.shapes.standard.Image[] = [];
    const itemsLength = Object.keys(items).length;
    let counter = 0;
    if (itemsLength > 0) {
      for (const [nodeId, node] of Object.entries(items)) {
        const xPos = space + (counter * this.nodeWidth + space * counter);
        nodes.push(this.createImageNode(nodeId, xPos, startYpos, imageUrl, this.nodeWidth, this.nodeHeight, nodeType));
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
  }

  private createNeighbours(latency: number): void {
    const firstSelectedNodeId = this.selectedNodeQueue[0].nodeId;
    const secondSelectedNodeId = this.selectedNodeQueue[1].nodeId;
    if (this.configuration.nodes[firstSelectedNodeId] && this.configuration.nodes[secondSelectedNodeId]) {
      const firstToSecond = {
        name: secondSelectedNodeId,
        latency,
        parent: this.selectedNodeQueue[0].parent === secondSelectedNodeId ? true : false
      } as Neighbour;

      const secondToFirst = {
        name: firstSelectedNodeId,
        latency,
        parent: this.selectedNodeQueue[1].parent === firstSelectedNodeId ? true : false
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
