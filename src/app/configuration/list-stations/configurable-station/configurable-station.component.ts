import { Component, Input, Output, EventEmitter, OnChanges, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Station } from 'src/app/models/station';
import { ComputingNodeService } from 'src/app/services/computing-node/computing-node.service';
import { ConfigurationService } from 'src/app/services/configuration/configuration.service';
import { PanelService } from 'src/app/services/panel/panel.service';

@Component({
  selector: 'app-configurable-station',
  templateUrl: './configurable-station.component.html',
  styleUrls: ['./configurable-station.component.css']
})
export class ConfigurableStationComponent implements OnChanges, AfterViewInit {
  @Input() public station: Station;
  @Output() stationEmitter = new EventEmitter<Station>();
  @Output() removeEmitter = new EventEmitter<string>();
  public stationFormGroup: FormGroup;
  public quantity = 1;
  public strategys: string[];
  public strategy: string;

  public focusedFromControlName: string;

  @ViewChild('starttimeInput') starttimeInput: ElementRef;
  @ViewChild('stoptimeInput') stoptimeInput: ElementRef;
  @ViewChild('freqInput') freqInput: ElementRef;
  @ViewChild('filesizeInput') filesizeInput: ElementRef;
  @ViewChild('sensorInput') sensorInput: ElementRef;
  @ViewChild('maxinbwInput') maxinbwInput: ElementRef;
  @ViewChild('maxoutbwInput') maxoutbwInput: ElementRef;
  @ViewChild('diskbwInput') diskbwInput: ElementRef;
  @ViewChild('radiusInput') radiusInput: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    public nodeService: ComputingNodeService,
    public configurationService: ConfigurationService,
    public panelService: PanelService
  ) {
    this.strategys = nodeService.getAppStrategys();
    this.createForm();
    this.stationFormChangeListener();
  }

  public onFocus(event) {
    this.focusedFromControlName = event.target.attributes.getNamedItem('ng-reflect-name').value;
  }

  public onFocusOut() {
    this.focusedFromControlName = undefined;
  }

  public ngOnChanges(): void {
    this.initForm();
    this.stationFormChangeListener();
  }

  ngAfterViewInit() {
    if (this.station.focusedInputName) {
      switch (this.station.focusedInputName) {
        case 'starttime':
          this.starttimeInput.nativeElement.focus();
          break;
        case 'stoptime':
          this.stoptimeInput.nativeElement.focus();
          break;
        case 'filesize':
          this.filesizeInput.nativeElement.focus();
          break;
        case 'freq':
          this.freqInput.nativeElement.focus();
          break;
        case 'sensor':
          this.sensorInput.nativeElement.focus();
          break;
        case 'maxinbw':
          this.maxinbwInput.nativeElement.focus();
          break;
        case 'maxoutbw':
          this.maxoutbwInput.nativeElement.focus();
          break;
        case 'diskbw':
          this.diskbwInput.nativeElement.focus();
          break;
        case 'radius':
          this.radiusInput.nativeElement.focus();
          break;
      }
    }
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
    this.station.focusedInputName = this.focusedFromControlName;
    this.stationEmitter.emit(this.station);
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
