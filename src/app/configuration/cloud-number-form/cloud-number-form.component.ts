import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, NgForm } from '@angular/forms';
import { ComputingNodesQuantityData } from 'src/app/models/computing-nodes-quantity-data';

@Component({
  selector: 'app-cloud-number-form',
  templateUrl: './cloud-number-form.component.html',
  styleUrls: ['./cloud-number-form.component.css']
})
export class CloudNumberFormComponent implements OnInit {
  @Output() quantityOfComputingNodes = new EventEmitter<ComputingNodesQuantityData>();

  public numOfClouds = 0;
  public numOfFogs = 0;
  public numOfComputingNodes: FormGroup;
  public maxNumOfNodes = 10;

  constructor(private formBuilder: FormBuilder) {
    this.initForm();
  }

  ngOnInit(): void {}

  initForm() {
    this.numOfComputingNodes = this.formBuilder.group({
      numOfClouds: new FormControl('', [
        Validators.required,
        Validators.max(this.maxNumOfNodes),
        Validators.pattern(/^[1-9]+[0-9]*$/)
      ]),
      numOfFogs: new FormControl('', [Validators.max(this.maxNumOfNodes)])
    });
  }

  public sendCloudAmouts() {
    const cloudsAmount = {
      numberOfClouds: this.numOfComputingNodes.get('numOfClouds').value,
      numberOfFogs: this.numOfComputingNodes.get('numOfFogs').value
        ? this.numOfComputingNodes.get('numOfFogs').value
        : undefined
    } as ComputingNodesQuantityData;
    this.quantityOfComputingNodes.emit(cloudsAmount);
  }
}
