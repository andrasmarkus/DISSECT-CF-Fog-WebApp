import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-configurable-cloud',
  templateUrl: './configurable-cloud.component.html',
  styleUrls: ['./configurable-cloud.component.css']
})
export class ConfigurableCloudComponent implements OnInit {
  public readonly lpdsTypes: string[] = ['LPDS_Fog_T1', 'LPDS_Fog_T2', 'LPDS_original'];
  selectedLPDStype = this.lpdsTypes[0];
  constructor() {}

  ngOnInit(): void {}
}
