import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  ChangeDetectionStrategy,
  SimpleChanges,
  OnDestroy
} from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Station } from 'src/app/models/station';
import { ConfigurationStateService } from 'src/app/services/configuration/configuration-state/configuration-state.service';
import { ResourceSelectionService } from 'src/app/services/configuration/resource-selection/resource-selection.service';
import { PanelService } from 'src/app/services/panel/panel.service';
import { INPUT_VALIDATION_CPU_CORE, INPUT_VALIDATION_POSITIVE_FLOAT, INPUT_VALIDATION_POSITIVE_NUMBER } from '../../utils/constants';

@Component({
  selector: 'app-configurable-station',
  templateUrl: './configurable-station.component.html',
  styleUrls: ['./configurable-station.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigurableStationComponent implements OnChanges, OnDestroy {
  @Input() public station: Station;
  @Output() public stationEmitter = new EventEmitter<Station>();
  @Output() public removeEmitter = new EventEmitter<string>();

  public stationFormGroup: FormGroup;
  public quantity = 1;
  public strategy: string;

  private formChangeSub: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    public configurationService: ConfigurationStateService,
    public panelService: PanelService,
    public resourceSelectionService: ResourceSelectionService
  ) {
    this.createForm();
    this.formChangeSub = this.stationFormGroup.valueChanges.subscribe(() => {
      this.saveStation();
    });
  }

  public ngOnDestroy(): void {
    this.formChangeSub?.unsubscribe();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.station) {
      this.updateForm();
    }
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

  private createForm(): void {
    this.stationFormGroup = this.formBuilder.group({
      starttime: this.createFormControl(INPUT_VALIDATION_POSITIVE_NUMBER),
      stoptime: this.createFormControl(INPUT_VALIDATION_POSITIVE_NUMBER),
      filesize: this.createFormControl(INPUT_VALIDATION_POSITIVE_NUMBER),
      freq: this.createFormControl(INPUT_VALIDATION_POSITIVE_NUMBER),
      sensorCount: this.createFormControl(INPUT_VALIDATION_POSITIVE_NUMBER),
      maxinbw: this.createFormControl(INPUT_VALIDATION_POSITIVE_NUMBER),
      maxoutbw: this.createFormControl(INPUT_VALIDATION_POSITIVE_NUMBER),
      diskbw: this.createFormControl(INPUT_VALIDATION_POSITIVE_NUMBER),
      radius: this.createFormControl(INPUT_VALIDATION_POSITIVE_NUMBER),
      speed: this.createFormControl(INPUT_VALIDATION_POSITIVE_FLOAT),
      cores: this.createFormControl(INPUT_VALIDATION_POSITIVE_NUMBER),
      ram: this.createFormControl(INPUT_VALIDATION_POSITIVE_NUMBER),
      perCoreProcessing: this.createFormControl(INPUT_VALIDATION_CPU_CORE),
      minpower: this.createFormControl(INPUT_VALIDATION_POSITIVE_FLOAT),
      maxpower: this.createFormControl(INPUT_VALIDATION_POSITIVE_FLOAT),
      idlepower: this.createFormControl(INPUT_VALIDATION_POSITIVE_FLOAT),
      capacity: this.createFormControl(INPUT_VALIDATION_POSITIVE_NUMBER),
      latency: this.createFormControl(INPUT_VALIDATION_POSITIVE_NUMBER)
    });
  }

  private createFormControl(validation: ValidatorFn[]): FormControl {
    return new FormControl('', validation);
  }

  private updateForm(): void {
    if (this.station) {
      this.stationFormGroup?.patchValue(this.station, { emitEvent: false });
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
    this.panelService.getStationData();
    this.panelService.toogle();
  }
}
