import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-list-configurable-clouds',
  templateUrl: './list-configurable-clouds.component.html',
  styleUrls: ['./list-configurable-clouds.component.css']
})
export class ListConfigurableCloudsComponent implements OnInit, OnChanges {
  @Input() numOfClouds: number;
  @Input() numOfFogs: number;

  private readonly instaces: string[] = ['LPDS_Fog_T1', 'LPDS_Fog_T2', 'LPDS_original'];
  constructor() {}

  ngOnChanges() {}

  ngOnInit(): void {}
}
