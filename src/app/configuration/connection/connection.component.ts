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
  defaultWidth = 100;
  defauldHeight = 50;
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

  ngOnInit() {
    this.graph = new joint.dia.Graph();

    this.paper = new joint.dia.Paper({
      el: jQuery('#paper'),
      width: 1200,
      height: 600,
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

    const cloud = new joint.shapes.standard.Image({
      position: { x: 600, y: 30 },
      size: { width: 100, height: 50 }
    });
    cloud.attr('image/xlinkHref', this.cloudImageSrcURL);

    const fog = new joint.shapes.standard.Image({
      position: { x: 450, y: 180 },
      size: { width: 100, height: 50 }
    });
    fog.attr('image/xlinkHref', this.fogImageSrcURL);

    const cloud2 = this.createImageNode(500, 100, this.cloudImageSrcURL);
    const cloud3 = this.createImageNode(700, 100, this.cloudImageSrcURL);

    //How to clone an element:
    const cloud4 = cloud.clone() as joint.shapes.standard.Image;

    const fog2 = this.createImageNode(550, 180, this.fogImageSrcURL);
    const fog3 = this.createImageNode(650, 180, this.fogImageSrcURL);
    const fog4 = this.createImageNode(750, 180, this.fogImageSrcURL);

    const iot1 = this.createImageNode(440, 300, this.iotImageSrcURL, 50, 25);
    const iot2 = this.createImageNode(510, 300, this.iotImageSrcURL, 50, 25);
    const iot3 = this.createImageNode(540, 300, this.iotImageSrcURL, 50, 25);
    const iot4 = this.createImageNode(610, 300, this.iotImageSrcURL, 50, 25);
    const iot5 = this.createImageNode(640, 300, this.iotImageSrcURL, 50, 25);
    const iot6 = this.createImageNode(710, 300, this.iotImageSrcURL, 50, 25);
    const iot7 = this.createImageNode(740, 300, this.iotImageSrcURL, 50, 25);
    const iot8 = this.createImageNode(810, 300, this.iotImageSrcURL, 50, 25);

    const link = new joint.dia.Link({
      source: { id: cloud.id },
      target: { id: cloud2.id }
    });

    const link2 = this.createLink(cloud, cloud3);

    const elements = [cloud, cloud2, link, cloud3, link2];
    elements.push(fog, fog2, fog3, fog4);
    elements.push(iot1, iot2, iot3, iot4, iot5, iot6, iot7, iot8);
    this.graph.addCells(this.inintCells(elements));
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
    width = this.defaultWidth,
    height = this.defauldHeight
  ): joint.shapes.standard.Image {
    const node = new joint.shapes.standard.Image({
      position: { x, y },
      size: { width, height }
    });
    node.attr('image/xlinkHref', imageSrc);
    node.attr('label/text', 'Name [' + `${x}` + ',' + `${y}` + ']');
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
}
