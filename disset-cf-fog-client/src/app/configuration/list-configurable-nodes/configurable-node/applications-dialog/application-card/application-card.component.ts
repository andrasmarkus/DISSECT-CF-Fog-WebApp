import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Application } from 'src/app/models/application';
import { ComputingNodeService } from 'src/app/services/configuration/computing-node/computing-node.service';
import { PanelService } from 'src/app/services/panel/panel.service';

@Component({
  selector: 'app-application-card',
  templateUrl: './application-card.component.html',
  styleUrls: ['./application-card.component.css']
})
export class ApplicationCardComponent implements OnChanges {
  @Input() application: Application;
  @Output() removeEmitter = new EventEmitter<string>();

  public appFormGroup: FormGroup;
  public canJoin: boolean;
  public instance: string;
  public strategy: string;

  public strategys: string[];
  public instances: string[];

  constructor(
    private formBuilder: FormBuilder,
    public nodeService: ComputingNodeService,
    public panelService: PanelService
  ) {
    this.instances = nodeService.getAppInstances();
    this.strategys = nodeService.getAppStrategys();
  }

  public ngOnChanges(): void {
    this.createForm();
    this.initForm();
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
    this.instance = this.application.instance ? this.application.instance : '';
    this.strategy = this.application.strategy ? this.application.strategy : '';
  }

  public getValidApplication() {
    const isConfigured = this.application.isConfigured;
    this.application = this.appFormGroup.value;
    this.application.isConfigured = isConfigured;
    this.application.canJoin = this.canJoin;
    this.application.strategy = this.strategy;
    this.application.instance = this.instance;
    return this.application;
  }

  public checkValidation(): boolean {
    return this.appFormGroup.valid && this.instance !== '' && this.strategy !== '';
  }

  public openInfoPanelForApplications(): void {
    this.panelService.getApplicationData();
    this.panelService.toogle();
  }
}
