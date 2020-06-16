import { Component, OnInit } from '@angular/core';
import * as jQuery from 'jquery';
import * as _ from 'lodash';
import * as $ from 'backbone';
import * as joint from 'jointjs';

export class Node {
  id: string;
}

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.css']
})
export class ConnectionComponent implements OnInit {
  numOfClouds = 3;
  numOfFogs = 4;
  numOfIots = 8;
  nodeWidth: number;
  nodeHeight: number;
  /* cloudImageSrcURL =
    'https://cloud.google.com/images/social-icon-google-cloud-1200-630.png'; */
  cloudImageSrcURL =
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Cloud_computing_icon.svg/1280px-Cloud_computing_icon.svg.png';
  /* fogImageSrcURL =
    'https://cdn0.iconfinder.com/data/icons/good-weather-1/96/weather_icons-42-512.png'; */
  fogImageSrcURL = 'https://freesvg.org/img/1343932181.png';

  //iotImageSrcURL = 'https://image.flaticon.com/icons/svg/63/63930.svg';
  iotImageSrcURL = 'https://cdn.pixabay.com/photo/2016/12/19/03/14/gadget-1917227_960_720.png';

  selectedNodeQueue: Node[] = [];

  public paper: joint.dia.Paper;
  public graph: joint.dia.Graph;

  public paperWidth: any;
  public paperHeight: any;
  public proportionOfTheTotalSize = 0.8;
  public sapceForClouds: number;
  public sapceForFogs: number;
  public sapceForIots: number;
  public numOfLayers: number;
  public cloudsStartYpos: number;
  public fogsStartYpos: number;
  public iotssStartYpos: number;
  public verticalSpaceBetweenLayers: number;

  ngOnInit() {
    this.paperWidth = window.innerWidth * this.proportionOfTheTotalSize;
    this.paperHeight = window.innerHeight * this.proportionOfTheTotalSize;
    this.nodeWidth = this.paperWidth / (this.getTheMaxQuantityOfNodes() * 2);
    this.nodeHeight = this.paperHeight / (this.getTheMaxQuantityOfNodes() * 2);

    this.sapceForClouds = (this.paperWidth - this.numOfClouds * this.nodeWidth) / this.numOfClouds;
    this.sapceForFogs = (this.paperWidth - this.numOfFogs * this.nodeWidth) / this.numOfFogs;
    this.sapceForIots = (this.paperWidth - this.numOfIots * this.nodeWidth) / this.numOfIots;
    this.numOfLayers = this.countLayers();
    this.verticalSpaceBetweenLayers = (this.paperHeight / this.numOfLayers - this.nodeHeight) / 2;
    this.cloudsStartYpos = this.verticalSpaceBetweenLayers;
    this.fogsStartYpos = this.cloudsStartYpos + this.nodeHeight + this.verticalSpaceBetweenLayers * 2;
    this.iotssStartYpos = this.fogsStartYpos + this.nodeHeight + this.verticalSpaceBetweenLayers * 2;
    console.log(this.iotssStartYpos);

    this.graph = new joint.dia.Graph();

    this.paper = new joint.dia.Paper({
      el: jQuery('#paper'),
      width: this.paperWidth,
      height: this.paperHeight,
      model: this.graph,
      gridSize: 1
    });

    this.paper.on('element:pointerclick', (elementView: joint.dia.ElementView) => {
      const currentElement = elementView.model;
      if (currentElement.attributes.attrs.selected === 'true') {
        this.deselectNode(elementView);
      } else {
        this.selectNode(elementView);
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
      const xPos = currentElement.attributes.position.x;
      const yPos = currentElement.attributes.position.y;

      currentElement.attr('label/text', 'Name [' + `${xPos}` + ',' + `${yPos}` + ']');
    });

    const graphElements: (joint.dia.Link | joint.shapes.standard.Image | joint.dia.Cell)[] = [];

    graphElements.push(
      ...this.createNodes(this.numOfClouds, this.sapceForClouds, this.cloudsStartYpos, this.cloudImageSrcURL)
    );
    graphElements.push(...this.createNodes(this.numOfFogs, this.sapceForFogs, this.fogsStartYpos, this.fogImageSrcURL));
    graphElements.push(
      ...this.createNodes(this.numOfIots, this.sapceForIots, this.iotssStartYpos, this.iotImageSrcURL)
    );

    this.graph.addCells(this.inintCells(graphElements));
    //console.log(this.graph.toJSON());
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
      this.graph.addCell(link);
    }
  }

  createImageNode(
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
    node.attr('label/text', 'Name [' + `${Math.round(x)}` + ',' + `${Math.round(y)}` + ']');
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
    this.selectedNodeQueue.push({ id: elementView.model.id as string });
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
    if (this.numOfIots && this.numOfIots > 0) {
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
    if (this.numOfIots) {
      nums.push(this.numOfIots);
    }
    return Math.max(...nums);
  }

  createNodes(numOfNodes: number, space: number, startYpos: number, imageUrl: string): joint.shapes.standard.Image[] {
    if (numOfNodes % 2 === 0) {
      return this.createEvenNumberOfNodes(numOfNodes, space, startYpos, imageUrl);
    } else {
      return this.createOddNumberOfNodes(numOfNodes, space, startYpos, imageUrl);
    }
  }

  createOddNumberOfNodes(
    numOfNodes: number,
    space: number,
    startYpos: number,
    imageUrl: string
  ): joint.shapes.standard.Image[] {
    const nodes: joint.shapes.standard.Image[] = [];
    nodes.push(
      this.createImageNode(this.paperWidth / 2 - this.nodeWidth / 2, this.cloudsStartYpos, this.cloudImageSrcURL)
    );
    const xStartPosToLeft = this.paperWidth / 2 - this.nodeWidth / 2 - this.sapceForClouds - this.nodeWidth;
    const xStartPosToRight = this.paperWidth / 2 + this.nodeWidth / 2 + this.sapceForClouds;
    const exitCondition = numOfNodes / 2 - 1;
    nodes.push(
      ...this.createPositionedNodes(exitCondition, xStartPosToLeft, xStartPosToRight, space, startYpos, imageUrl)
    );
    return nodes;
  }

  createEvenNumberOfNodes(
    numOfNodes: number,
    space: number,
    startYpos: number,
    imageUrl: string
  ): joint.shapes.standard.Image[] {
    const xStartPosToLeft = this.paperWidth / 2 - space / 2 - this.nodeWidth;
    const xStartPosToRight = this.paperWidth / 2 + space / 2;
    const exitCondition = numOfNodes / 2;
    return this.createPositionedNodes(exitCondition, xStartPosToLeft, xStartPosToRight, space, startYpos, imageUrl);
  }

  createPositionedNodes(
    exitCondition: number,
    xStartPosToLeft: number,
    xStartPosToRight: number,
    space: number,
    startYpos: number,
    imageUrl: string
  ): joint.shapes.standard.Image[] {
    const nodes: joint.shapes.standard.Image[] = [];
    for (let i = 0; i < exitCondition; i++) {
      nodes.push(this.createImageNode(xStartPosToRight + (i * this.nodeWidth + space * i), startYpos, imageUrl));
      nodes.push(this.createImageNode(xStartPosToLeft - (i * this.nodeWidth + space * i), startYpos, imageUrl));
    }
    return nodes;
  }
}
