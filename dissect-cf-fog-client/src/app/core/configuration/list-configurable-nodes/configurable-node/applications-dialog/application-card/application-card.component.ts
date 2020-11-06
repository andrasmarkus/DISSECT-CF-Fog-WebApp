import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Application } from 'src/app/models/application';
import { Instance } from 'src/app/models/server-api/server-api';
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

  constructor(
    private formBuilder: FormBuilder,
    public panelService: PanelService,
    public resourceSelectionService: ResourceSelectionService
  ) {}

  public ngOnInit(): void {
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
}
