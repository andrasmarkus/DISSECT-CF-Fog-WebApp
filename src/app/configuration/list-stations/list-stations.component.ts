import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { StationsObject, Station } from 'src/app/models/station';

@Component({
  selector: 'app-list-stations',
  templateUrl: './list-stations.component.html',
  styleUrls: ['./list-stations.component.css']
})
export class ListStationsComponent implements OnInit {
  @Output() stationsEmitter = new EventEmitter<StationsObject>();

  public stations: Station[] = [];
  public stationIndex = 1;
  public stationNodes: StationsObject = {};
  public readyToSave = false;

  constructor() {}

  ngOnInit(): void {
    const firstStationId = 'station' + this.stationIndex;
    const firstStation = new Station();
    firstStation.id = firstStationId;
    this.stations.push(firstStation);
  }

  public addStation() {
    this.stationIndex += 1;
    const stationId = 'station' + this.stationIndex;
    const station = new Station();
    station.id = stationId;
    this.stations.push(station);
  }

  public getStationFromEmitter(station: Station) {
    this.stationNodes[station.id] = station;
    this.readyToSave = !Object.values(this.stationNodes).some(node => node.valid === false);
  }

  public sendStationNodes() {
    if (this.readyToSave) {
      this.stationsEmitter.emit(this.stationNodes);
    }
  }
}
