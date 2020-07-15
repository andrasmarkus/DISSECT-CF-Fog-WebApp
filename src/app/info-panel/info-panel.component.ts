import { Component, Input } from '@angular/core';
import { PanelService } from '../services/panel/panel.service';
import { InfoPanelData } from '../models/info-panel-data';

@Component({
  selector: 'app-info-panel',
  templateUrl: './info-panel.component.html',
  styleUrls: ['./info-panel.component.css']
})
export class InfoPanelComponent {
  @Input() public infoData: InfoPanelData;

  constructor(public panelService: PanelService) {}
}
