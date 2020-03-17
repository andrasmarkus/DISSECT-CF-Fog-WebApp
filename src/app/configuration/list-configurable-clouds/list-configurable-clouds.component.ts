import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-configurable-clouds',
  templateUrl: './list-configurable-clouds.component.html',
  styleUrls: ['./list-configurable-clouds.component.css']
})
export class ListConfigurableCloudsComponent implements OnInit {
  private readonly instaces: string[] = ['LPDS_Fog_T1', 'LPDS_Fog_T2', 'LPDS_original'];

  constructor() {}

  ngOnInit(): void {}
}
