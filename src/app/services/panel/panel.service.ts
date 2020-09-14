import { Injectable } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import {
  InfoPanelData,
  getResourceFilesInfoData,
  getApplicationInfoData,
  getStationInfoData,
  getConectionInfoData
} from 'src/app/models/info-panel-data';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PanelService {
  public infoData$ = new BehaviorSubject<InfoPanelData>(undefined);

  constructor() {}

  private mainDrawer: MatDrawer;
  private dialogDrawer: MatDrawer;
  private selectedDrawer: MatDrawer;

  public setMainDrawer(drawer: MatDrawer) {
    this.mainDrawer = drawer;
    this.selectedDrawer = drawer;
  }

  public setDialogDrawer(drawer: MatDrawer) {
    this.dialogDrawer = drawer;
    this.selectedDrawer = drawer;
  }

  public setSelectedDrawerBacktoMainDrawer() {
    if (this.mainDrawer) {
      this.selectedDrawer = this.mainDrawer;
    }
  }

  public getDrawer(): MatDrawer {
    return this.selectedDrawer;
  }

  public open() {
    this.selectedDrawer.open();
  }

  public toogle() {
    this.selectedDrawer.toggle();
  }

  public close() {
    this.selectedDrawer.close();
  }

  public getResourceData(): void {
    this.infoData$.next(getResourceFilesInfoData());
  }

  public getStationeData(): void {
    this.infoData$.next(getStationInfoData());
  }

  public getApplicationData(): void {
    this.infoData$.next(getApplicationInfoData());
  }
  public getConnectionData(): void {
    this.infoData$.next(getConectionInfoData());
  }
}
