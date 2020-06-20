import { Component, OnInit } from '@angular/core';
import { StationsObject, Station } from 'src/app/models/station';

@Component({
  selector: 'app-list-stations',
  templateUrl: './list-stations.component.html',
  styleUrls: ['./list-stations.component.css']
})
export class ListStationsComponent implements OnInit {
  public stations: Station[] = [];
  public stationIndex = 1;
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
}
