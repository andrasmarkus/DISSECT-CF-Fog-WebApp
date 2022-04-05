import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Application } from 'src/app/models/application';
import { Instance } from 'src/app/models/server-api/server-api';
import { ConfigurationStateService } from 'src/app/services/configuration/configuration-state/configuration-state.service';
import { ResourceSelectionService } from 'src/app/services/configuration/resource-selection/resource-selection.service';
import { PanelService } from 'src/app/services/panel/panel.service';

@Component({
  selector: 'app-application-card',
  templateUrl: './application-card.component.html',
  styleUrls: ['./application-card.component.css']
})
export class ApplicationCardComponent implements OnInit {
  @Input() public application: Application;
  @Output() public removeEmitter = new EventEmitter<string>();

  public appFormGroup: FormGroup;
  public canJoin: boolean;
  public instance: Instance;
  public strategy: string;
  public userInstanceInputs: Instance[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public panelService: PanelService,
    public resourceSelectionService: ResourceSelectionService,
    public configurationStateService: ConfigurationStateService
  ) {}

  public ngOnInit(): void {
    this.createForm();
    this.initForm();
    this.getUserInstances();
  }

  private createForm(): void {
    this.appFormGroup = this.formBuilder.group({
      id: [this.application.id],
      tasksize: this.createNumberFormControl(),
      freq: this.createNumberFormControl(),
      numOfInstruction: this.createNumberFormControl(),
      threshold: this.createNumberFormControl()
    });
  }

  private createNumberFormControl(): FormControl {
    return new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.min(1)]);
  }

  private initForm(): void {
    if (this.application) {
      this.appFormGroup.patchValue(this.application);
    }
    this.canJoin = this.application.canJoin ? this.application.canJoin : false;
    this.instance = this.application.instance ? this.application.instance : undefined;
    this.strategy = this.application.strategy ? this.application.strategy : '';
  }

  public getValidApplication(): Application {
    const isConfigured = this.application.isConfigured;
    this.application = this.appFormGroup.value;
    this.application.isConfigured = isConfigured;
    this.application.canJoin = this.canJoin;
    this.application.strategy = this.strategy;
    this.application.instance = this.instance;
    return this.application;
  }


  public checkValidation(): boolean {
    return this.appFormGroup.valid && this.instance && this.strategy !== '';
  }

  public openInfoPanelForApplications(): void {
    this.panelService.getApplicationData();
    this.panelService.toogle();
  }

  private getUserInstances(): void {
    Object.values(this.configurationStateService.instanceNodes).forEach( instance => {
      if(instance.valid && instance.name && instance.name.length > 0) {
        this.userInstanceInputs.push(Object.assign(instance) as Instance)
      }
    })
  }

  defaultConfiguration(): void {
    this.appFormGroup.get('tasksize').setValue(5000);
    this.appFormGroup.get('freq').setValue(6000);
    this.appFormGroup.get('numOfInstruction').setValue(1000);
    this.appFormGroup.get('threshold').setValue(1);
    console.log(this.userInstanceInputs);
    this.canJoin = true;
    this.instance = {name: 'a1.large', ram: 1000000, cpuCores: 1, coreProcessingPower: 0.001, startupProcess: 100, networkLoad: 0, pricePerTick: 1e-7, reqDisk: 1000000};
    this.strategy = 'random';
  }

}
