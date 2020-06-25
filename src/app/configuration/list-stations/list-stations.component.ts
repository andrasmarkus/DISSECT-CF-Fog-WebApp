import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { StationsObject, Station } from 'src/app/models/station';
import { StepBackServiceService } from 'src/app/services/step-back-service.service';

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
  @Output() isStepBack = new EventEmitter<boolean>();

  constructor(private stepBackDialogService: StepBackServiceService) {}

  ngOnInit(): void {
    const firstStationId = 'station' + this.stationIndex;
    const firstStation = new Station();
    firstStation.id = firstStationId;
    this.stations.push(firstStation);
    this.stationNodes[firstStation.id] = firstStation;
  }

  public addStation() {
    this.stationIndex += 1;
    const stationId = 'station' + this.stationIndex;
    const station = new Station();
    station.id = stationId;
    this.stations.push(station);
    this.stationNodes[station.id] = station;
    this.readyToSave = !Object.values(this.stationNodes).some(node => node.valid === false);
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

  public stepBack() {
    const dialogRef = this.stepBackDialogService.openDialog();
    dialogRef.afterClosed().subscribe((result: { discard: boolean }) => {
      if (result.discard) {
        this.isStepBack.emit(true);
      }
    });
  }

  public removeStation(index: number) {
    this.stationIndex--;
    delete this.stationNodes['station' + index];
    const arrayIndex = index - 1;
    this.stations.splice(arrayIndex, 1);
    this.readyToSave =
      Object.values(this.stationNodes).length > 0
        ? !Object.values(this.stationNodes).some(node => node.valid === false)
        : false;
  }
}
