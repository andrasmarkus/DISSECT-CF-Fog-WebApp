import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { StationsObject, Station } from 'src/app/models/station';
import { StepBackServiceService } from 'src/app/services/step-back/step-back-service.service';
import { Subscription } from 'rxjs';
import { RestartConfigurationService } from 'src/app/services/restart-configuration.service';

@Component({
  selector: 'app-list-stations',
  templateUrl: './list-stations.component.html',
  styleUrls: ['./list-stations.component.css']
})
export class ListStationsComponent implements OnDestroy {
  @Input() public stationNodes: StationsObject = {};
  @Output() public stationsEmitter = new EventEmitter<StationsObject>();

  public stations: Station[] = [];
  public stationIndex = 1;
  public readyToSave = false;

  private restartSubscription: Subscription;

  constructor(private restartConfService: RestartConfigurationService) {
    this.initStations();

    this.restartSubscription = this.restartConfService.restartConfiguration$.subscribe(restart => {
      if (restart) {
        this.stationIndex = 1;
        this.readyToSave = false;
        this.stationNodes = {};
        this.stations = [];
        this.initStations();
      }
    });
  }

  private initStations() {
    const firstStationId = 'station' + this.stationIndex;
    const firstStation = new Station();
    firstStation.id = firstStationId;
    this.stations.push(firstStation);
    this.stationNodes[firstStation.id] = firstStation;
  }

  public ngOnDestroy(): void {
    this.restartSubscription.unsubscribe();
  }

  public addStation(): void {
    this.stationIndex += 1;
    const stationId = 'station' + this.stationIndex;
    const station = new Station();
    station.id = stationId;
    this.stations.push(station);
    this.stationNodes[station.id] = station;
    this.readyToSave = !Object.values(this.stationNodes).some(node => node.valid === false);
  }

  public getStationFromEmitter(station: Station): void {
    this.stationNodes[station.id] = station;
    this.readyToSave = !Object.values(this.stationNodes).some(node => node.valid === false);
  }

  public sendStationNodes(): void {
    if (this.readyToSave) {
      this.stationsEmitter.emit(this.stationNodes);
    }
  }

  public removeStation(index: number): void {
    delete this.stationNodes[index];
    const arrayIndex = index - 1;
    this.stations.splice(arrayIndex, 1);
    this.readyToSave =
      Object.values(this.stationNodes).length > 0
        ? !Object.values(this.stationNodes).some(node => node.valid === false)
        : false;
  }
}
