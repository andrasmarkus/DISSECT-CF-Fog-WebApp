import { Component, OnInit, Input } from '@angular/core';
import * as jQuery from 'jquery';
import * as _ from 'lodash';
import * as $ from 'backbone';
import * as joint from 'jointjs';
import {
  ComputingNodesObject,
  ConfiguredComputingNodesObject,
  FogNodesObject,
  CloudNodesObject
} from 'src/app/models/computing-nodes-object';
import { StationsObject, Station } from 'src/app/models/station';
import { ConfigurationObject, Neighbour } from 'src/app/models/configuration';
import { omit } from 'lodash';

export class Node {
  id: string;
  nodeId: string;
}

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.css']
})
export class ConnectionComponent implements OnInit {
  @Input() public clouds: CloudNodesObject = {};
  @Input() public fogs: FogNodesObject = {};
  @Input() stationNodes: StationsObject;

  public multipleStationNodes: StationsObject;
  public numOfClouds = 6;
  public numOfFogs = 10;
  public numOfStations = 11;
  public nodeWidth: number;
  public nodeHeight: number;
  public latency: number;
  /* cloudImageSrcURL =
    'https://cloud.google.com/images/social-icon-google-cloud-1200-630.png'; */
  cloudImageSrcURL =
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Cloud_computing_icon.svg/1280px-Cloud_computing_icon.svg.png';
  /* fogImageSrcURL =
    'https://cdn0.iconfinder.com/data/icons/good-weather-1/96/weather_icons-42-512.png'; */
  fogImageSrcURL = 'https://freesvg.org/img/1343932181.png';

  //stationImageSrcURL = 'https://image.flaticon.com/icons/svg/63/63930.svg';
  stationImageSrcURL = 'https://cdn.pixabay.com/photo/2016/12/19/03/14/gadget-1917227_960_720.png';

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

  ngOnInit() {
    this.numOfClouds = Object.keys(this.clouds).length;
    this.numOfFogs = Object.keys(this.fogs).length;
    this.multipleStationNodes = this.getMultipleStations();
    this.numOfStations = Object.keys(this.multipleStationNodes).length;

    this.paperWidth = window.innerWidth * this.proportionOfTheTotalSize;
    this.paperHeight = window.innerHeight * this.proportionOfTheTotalSize;
    const computedNodeWidth = this.paperWidth / (this.getTheMaxQuantityOfNodes() * 2);
    const computedNodeHeight = this.paperHeight / (this.getTheMaxQuantityOfNodes() * 2);
    this.nodeWidth = computedNodeWidth > 75 ? 75 : computedNodeWidth;
    this.nodeHeight = computedNodeHeight > 50 ? 50 : computedNodeHeight;

    if (this.numOfClouds > 0) {
      this.sapceForClouds = (this.paperWidth - this.numOfClouds * this.nodeWidth) / (this.numOfClouds + 1);
    }
    if (this.numOfFogs > 0) {
      this.sapceForFogs = (this.paperWidth - this.numOfFogs * this.nodeWidth) / (this.numOfFogs + 1);
    }
    if (this.numOfStations > 0) {
      this.sapceForStations = (this.paperWidth - this.numOfStations * this.nodeWidth) / (this.numOfStations + 1);
    }
    this.numOfLayers = this.countLayers();
    this.verticalSpaceBetweenLayers = (this.paperHeight / this.numOfLayers - this.nodeHeight) / 2;
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

    this.createInitCongifuration();
    this.graph = new joint.dia.Graph();

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

    this.paper.on('blank:pointerclick', () => {
      const cells = this.graph.getCells();
      cells.forEach(cell => {
        const elView = this.paper.findViewByModel(cell);
        if (this.selectedNodeQueue.some(node => node.id === cell.id)) {
          elView.unhighlight();
        }
      });
    });

    this.paper.on('element:pointermove', (elementView: joint.dia.ElementView) => {
      const currentElement = elementView.model;
      if (!currentElement.isEmbedded()) {
        const xPos = currentElement.attributes.position.x;
        const yPos = currentElement.attributes.position.y;
        const name = currentElement.attributes.attrs.nodeId;
        currentElement.attr('label/text', name + '\n[' + `${xPos}` + ',' + `${yPos}` + ']');
      }
    });

    this.graph.on('remove', (cell, collection, opt) => {
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

  createLink(element1: joint.shapes.standard.Image, element2: joint.shapes.standard.Image): joint.dia.Link {
    return new joint.dia.Link({
      source: { id: element1.id },
      target: { id: element2.id }
    });
  }

  createLinkBetweenSelectedNodes() {
    if (this.isQueueFull) {
      const link = new joint.dia.Link({
        source: { id: this.selectedNodeQueue[0].id },
        target: { id: this.selectedNodeQueue[1].id }
      });
      link.labels([
        {
          attrs: {
            text: {
              text: '' + this.latency
            }
          }
        }
      ]);
      this.createNeighbours();
      this.graph.addCell(link);
    }
    console.log(this.graph.toJSON());
  }

  createImageNode(
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

  isQueueFull() {
    return this.selectedNodeQueue.length === 2;
  }

  selectNode(elementView: joint.dia.ElementView) {
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

  deselectNode(elementView: joint.dia.ElementView) {
    elementView.unhighlight();
    elementView.model.attr('selected', 'false');
    if (this.selectedNodeQueue.some(node => node.id === elementView.model.id)) {
      this.selectedNodeQueue = this.selectedNodeQueue.filter(node => node.id !== elementView.model.id);
    }
  }

  inintCells(cells: (joint.shapes.standard.Image | joint.dia.Link | joint.dia.Cell)[]) {
    cells.forEach(cell => cell.attr('selected', 'false'));
    return cells;
  }

  countLayers(): number {
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

  getTheMaxQuantityOfNodes() {
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

  getMultipleStations(): StationsObject {
    const resultObject = {};
    for (const [stationId, station] of Object.entries(this.stationNodes)) {
      if (station.quantity > 1) {
        for (let i = 1; i <= station.quantity; i++) {
          const subStationKey = stationId + '.' + i;
          resultObject[subStationKey] = station;
        }
      } else {
        resultObject[stationId] = station;
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

  createNodesWithRangeInQueue(
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

  createNodesInQueue(
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

  createInitCongifuration() {
    for (const [id, node] of Object.entries(this.clouds)) {
      this.configuration.nodes[id] = { ...node, neighbours: {} };
    }
    for (const [id, node] of Object.entries(this.fogs)) {
      this.configuration.nodes[id] = { ...node, neighbours: {} };
    }
    this.configuration.stations = this.multipleStationNodes;
    console.log(this.configuration);
  }

  createNeighbours() {
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

  save() {
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
