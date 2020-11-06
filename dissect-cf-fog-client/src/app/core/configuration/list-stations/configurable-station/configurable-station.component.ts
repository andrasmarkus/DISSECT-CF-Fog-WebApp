import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  ChangeDetectionStrategy,
  SimpleChanges,
  OnInit,
  OnDestroy
} from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Station } from 'src/app/models/station';
import { ConfigurationStateService } from 'src/app/services/configuration/configuration-state/configuration-state.service';
import { ResourceSelectionService } from 'src/app/services/configuration/resource-selection/resource-selection.service';
import { PanelService } from 'src/app/services/panel/panel.service';

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
    this.panelService.getStationeData();
    this.panelService.toogle();
  }
}
