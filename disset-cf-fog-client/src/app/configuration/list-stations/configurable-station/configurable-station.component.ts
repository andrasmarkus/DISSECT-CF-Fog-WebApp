import { Component, Input, Output, EventEmitter, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Station } from 'src/app/models/station';
import { ComputingNodeService } from 'src/app/services/configuration/computing-node/computing-node.service';
import { ConfigurationService } from 'src/app/services/configuration/configuration-state/configuration.service';
import { PanelService } from 'src/app/services/panel/panel.service';

@Component({
  selector: 'app-configurable-station',
  templateUrl: './configurable-station.component.html',
  styleUrls: ['./configurable-station.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigurableStationComponent implements OnChanges {
  @Input() public station: Station;
  @Output() stationEmitter = new EventEmitter<Station>();
  @Output() removeEmitter = new EventEmitter<string>();

  public stationFormGroup: FormGroup;
  public quantity = 1;
  public strategy: string;

  constructor(
    private formBuilder: FormBuilder,
    public nodeService: ComputingNodeService,
    public configurationService: ConfigurationService,
    public panelService: PanelService,
    public computingNodeService: ComputingNodeService
  ) {
    this.createForm();
    this.stationFormChangeListener();
  }

  public ngOnChanges(): void {
    this.initForm();
    this.stationFormChangeListener();
  }

  private stationFormChangeListener() {
    this.stationFormGroup.valueChanges.subscribe(() => {
      this.saveStation();
    });
  }

  public onStrategyChange(): void {
    this.saveStation();
  }

  private saveStation() {
    this.setStationValues();
    if (this.stationFormGroup.valid && this.quantity >= 1 && this.strategy !== '') {
      this.station.valid = true;
    } else {
      this.station.valid = false;
    }
    this.stationEmitter.emit(this.station);
  }

  createForm() {
    this.stationFormGroup = this.formBuilder.group({
      starttime: this.createNumberFormControl(),
      stoptime: this.createNumberFormControl(),
      filesize: this.createNumberFormControl(),
      freq: this.createNumberFormControl(),
      sensor: this.createNumberFormControl(),
      maxinbw: this.createNumberFormControl(),
      maxoutbw: this.createNumberFormControl(),
      diskbw: this.createNumberFormControl(),
      reposize: this.createNumberFormControl(),
      number: this.createNumberFormControl(),
      radius: this.createNumberFormControl()
    });
  }

  private createNumberFormControl(): FormControl {
    return new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.min(1)]);
  }

  private initForm(): void {
    if (this.station) {
      this.stationFormGroup.patchValue(this.station, { emitEvent: false });
    }
    this.quantity = this.station.quantity ? this.station.quantity : 1;
    this.strategy = this.station.strategy ? this.station.strategy : '';
  }

  public decrease(): void {
    if (this.quantity > 1) {
      this.quantity--;
      this.station.quantity = this.quantity;
      this.saveStation();
    }
  }

  public increase(): void {
    this.quantity++;
    this.station.quantity = this.quantity;
    this.saveStation();
  }

  public setStationValues() {
    const id = this.station.id;
    this.station = this.stationFormGroup.value;
    this.station.id = id;
    this.station.strategy = this.strategy;
    this.station.quantity = this.quantity;
    return this.station;
  }

  public openInfoPanelForStations(): void {
    this.panelService.getStationeData();
    this.panelService.toogle();
  }
}
