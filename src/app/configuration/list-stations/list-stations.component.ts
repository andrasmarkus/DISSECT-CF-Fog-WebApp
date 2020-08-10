import { Component, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { Station } from 'src/app/models/station';
import { Subscription } from 'rxjs';
import { RestartConfigurationService } from 'src/app/services/restart-configuration.service';
import { ConfigurationService } from 'src/app/services/configuration/configuration.service';
import { StepperService } from 'src/app/services/stepper/stepper.service';

@Component({
  selector: 'app-list-stations',
  templateUrl: './list-stations.component.html',
  styleUrls: ['./list-stations.component.css']
})
export class ListStationsComponent implements OnDestroy {
  @Input() public stations: Station[] = [];
  public stationIndex = 0;
  public isValidConfiguration = false;
  private restartSubscription: Subscription;

  constructor(
    public configurationService: ConfigurationService,
    private restartConfService: RestartConfigurationService,
    public stepperService: StepperService
  ) {
    this.initStations();

    this.restartSubscription = this.restartConfService.restartConfiguration$.subscribe(() => {
      this.stationIndex = 0;
      this.isValidConfiguration = false;
      this.initStations();
    });
  }

  private initStations() {
    this.createStation();
  }

  public ngOnDestroy(): void {
    this.restartSubscription.unsubscribe();
  }

  public addStation(): void {
    this.createStation();
    this.checkIsValidConfiguration();
  }

  private createStation() {
    this.stationIndex += 1;
    const stationId = 'station' + this.stationIndex;
    const station = new Station();
    station.id = stationId;
    this.configurationService.stationNodes[station.id] = station;
    this.stations.push(station);
  }

  public getStationFromEmitter(station: Station): void {
    this.configurationService.saveStation(station);
    this.checkIsValidConfiguration();
  }

  public checkIsReadyToNext(): void {
    if (this.isValidConfiguration) {
      this.configurationService.generateGraphSubject.next();
      this.stepperService.stepForward();
    }
  }

  public removeStation(index: number): void {
    delete this.configurationService.stationNodes[index];
    const arrayIndex = index - 1;
    this.stations.splice(arrayIndex, 1);
    this.checkIsValidConfiguration();
  }

  private checkIsValidConfiguration() {
    this.isValidConfiguration =
      Object.values(this.configurationService.stationNodes).length > 0
        ? !Object.values(this.configurationService.stationNodes).some(node => node.valid === false)
        : false;
  }
}
