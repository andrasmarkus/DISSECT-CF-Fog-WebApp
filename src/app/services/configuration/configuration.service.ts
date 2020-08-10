import { Injectable } from '@angular/core';
import { ComputingNodesQuantityData } from 'src/app/models/computing-nodes-quantity-data';
import { BehaviorSubject, Subject } from 'rxjs';
import { ComputingNodesObject } from 'src/app/models/computing-nodes-object';
import { StationsObject, Station } from 'src/app/models/station';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  public maxNumOfNodes = 10;

  public generateGraphSubject: Subject<any> = new Subject();
  public generateGraph$ = this.generateGraphSubject.asObservable();

  public passStationSubject: Subject<any> = new Subject();
  public passStation$ = this.passStationSubject.asObservable();

  public nodesQuantity$ = new BehaviorSubject<ComputingNodesQuantityData>(undefined);
  public computingNodes: ComputingNodesObject = { clouds: {}, fogs: {} };
  public stationNodes: StationsObject = {};

  constructor() {}

  public setNodesQuantity(quantity: ComputingNodesQuantityData) {
    this.nodesQuantity$.next(quantity);
  }

  public saveStation(station: Station): void {
    this.stationNodes[station.id] = station;
  }

  public getStationArray(): Station[] {
    const stations: Station[] = [];
    for (const stat of Object.values(this.stationNodes)) {
      stations.push(stat);
    }
    return stations;
  }
}
