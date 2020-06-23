import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Station } from 'src/app/models/station';

@Component({
  selector: 'app-configurable-station',
  templateUrl: './configurable-station.component.html',
  styleUrls: ['./configurable-station.component.css']
})
export class ConfigurableStationComponent implements OnInit {
  @Input() public station: Station;
  @Input() index: number;
  @Input() public strategys: string[] = ['random', 'distance'];
  @Output() stationEmitter = new EventEmitter<Station>();
  public strategy = this.strategys[0];
  public stationFormGroup: FormGroup;
  public quantity = 1;

  constructor(private formBuilder: FormBuilder) {
    this.createForm();
    this.station = new Station();

    this.stationFormGroup.valueChanges.subscribe(station => {
      if (this.stationFormGroup.valid && this.quantity >= 1) {
        this.stationEmitter.emit(this.getValidStation());
      } else {
        this.station.valid = false;
        this.stationEmitter.emit(this.station);
      }
    });
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

      strategy: new FormControl(this.strategy, [Validators.required]),
      number: new FormControl('', [Validators.required]),
      radius: new FormControl('', [Validators.required])
    });
  }

  public decrease() {
    if (this.quantity > 1) {
      this.quantity--;
      this.station.quantity = this.quantity;
    }
  }

  public increase() {
    this.quantity++;
    this.station.quantity = this.quantity;
  }

  public getValidStation() {
    this.station = new Station();
    this.station = this.stationFormGroup.value;
    this.station.id = 'station' + this.index;
    this.station.valid = true;
    this.station.quantity = this.quantity;
    return this.station;
  }

  ngOnInit(): void {}
}
