import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, NgForm } from '@angular/forms';
import { ComputingNodesQuantityData } from 'src/app/models/computing-nodes-quantity-data';
import { ConfigurationStateService } from 'src/app/services/configuration/configuration-state/configuration-state.service';
import { RestartConfigurationService } from 'src/app/services/configuration/restart-configuration/restart-configuration.service';
import { StepperService } from 'src/app/services/configuration/stepper/stepper.service';

@Component({
  selector: 'app-node-quantity-form',
  templateUrl: './node-quantity-form.component.html',
  styleUrls: ['./node-quantity-form.component.css']
})
export class NodeQuantityFormComponent {
  public numOfComputingNodes: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public restartConfService: RestartConfigurationService,
    public configurationService: ConfigurationStateService,
    public stepperService: StepperService
  ) {
    this.initForm();
  }

  initForm() {
    this.numOfComputingNodes = this.formBuilder.group({
      numOfClouds: new FormControl('', [
        Validators.required,
        Validators.max(this.configurationService.maxNumOfNodes),
        Validators.pattern('^[0-9]*$'),
        Validators.min(1)
      ]),
      numOfFogs: new FormControl('', [
        Validators.max(this.configurationService.maxNumOfNodes),
        Validators.pattern('^[0-9]*$'),
        Validators.min(1)
      ])
    });
  }

  public sendNodesQuantity() {
    const nodesQuantity = {
      numberOfClouds: this.numOfComputingNodes.get('numOfClouds').value,
      numberOfFogs: this.numOfComputingNodes.get('numOfFogs').value
        ? this.numOfComputingNodes.get('numOfFogs').value
        : undefined
    } as ComputingNodesQuantityData;
    if (this.numOfComputingNodes.valid) {
      this.configurationService.setNodesQuantity(nodesQuantity);
      this.stepperService.stepForward();
    }
  }

  public resetConfiguration() {
    this.numOfComputingNodes.reset();
    this.configurationService.setNodesQuantity(undefined);
    this.configurationService.computingNodes = { clouds: {}, fogs: {} };
    this.configurationService.stationNodes = {};
    this.restartConfService.restartConfigurationSubject.next();
  }
}
