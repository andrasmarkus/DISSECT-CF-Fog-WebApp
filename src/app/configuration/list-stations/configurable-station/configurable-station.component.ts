import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Station } from 'src/app/models/station';
import { ComputingNodeService } from 'src/app/services/computing-node/computing-node.service';

@Component({
  selector: 'app-configurable-station',
  templateUrl: './configurable-station.component.html',
  styleUrls: ['./configurable-station.component.css']
})
export class ConfigurableStationComponent implements OnChanges {
  @Input() public station: Station;
  @Output() stationEmitter = new EventEmitter<Station>();
  @Output() removeEmitter = new EventEmitter<string>();
  public stationFormGroup: FormGroup;
  public quantity = 1;
  public strategys: string[];
  public strategy: string;

  constructor(private formBuilder: FormBuilder, public nodeService: ComputingNodeService) {
    this.strategys = nodeService.getAppStrategys();
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
    if (this.stationFormGroup.valid && this.quantity >= 1 && this.strategy !== '') {
      this.stationEmitter.emit(this.getValidStation());
    } else {
      this.station.valid = false;
      this.stationEmitter.emit(this.station);
    }
  }

  createForm() {
    this.stationFormGroup = this.formBuilder.group({
      starttime: new FormControl('', [Validators.required]),
      stoptime: new FormControl('', [Validators.required]),
      filesize: new FormControl('', [Validators.required]),
      freq: new FormControl('', [Validators.required]),
      sensor: new FormControl('', [Validators.required]),
      maxinbw: new FormControl('', [Validators.required]),
      maxoutbw: new FormControl('', [Validators.required]),
      diskbw: new FormControl('', [Validators.required]),
      radius: new FormControl('', [Validators.required])
    });
  }

  private initForm(): void {
    if (this.station) {
      this.stationFormGroup.patchValue(this.station, { emitEvent: false });
    }
    this.strategy = this.station.strategy ? this.station.strategy : '';
  }

  public decrease(): void {
    if (this.quantity > 1) {
      this.quantity--;
      this.station.quantity = this.quantity;
    }
  }

  public increase(): void {
    this.quantity++;
    this.station.quantity = this.quantity;
  }

  public getValidStation() {
    const id = this.station.id;
    this.station = this.stationFormGroup.value;
    this.station.id = id;
    this.station.valid = true;
    this.station.strategy = this.strategy;
    this.station.quantity = this.quantity;
    return this.station;
  }
}
