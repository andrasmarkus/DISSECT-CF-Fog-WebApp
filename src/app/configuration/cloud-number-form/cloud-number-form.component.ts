import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
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

  constructor(private formBuilder: FormBuilder) {
    this.initForm();
  }

  ngOnInit(): void {
    //this.initValues();
  }

  initForm() {
    this.numOfComputingNodes = this.formBuilder.group({
      numOfClouds: new FormControl('', [Validators.required]),
      numOfFogs: new FormControl('', [])
    });
  }

  /* initValues() {
    this.numOfComputingNodes.get('numOfClouds').valueChanges.subscribe(val => {
      this.numOfClouds = val;
    });
    this.numOfComputingNodes.get('numOfFogs').valueChanges.subscribe(val => {
      this.numOfFogs = val;
    });
  } */

  public sendCloudAmouts() {
    const cloudsAmount = {
      numberOfClouds: this.numOfComputingNodes.get('numOfClouds').value,
      numberOfFogs: this.numOfComputingNodes.get('numOfFogs').value
        ? this.numOfComputingNodes.get('numOfFogs').value
        : undefined
    } as ComputingNodesQuantityData;
    this.quantityOfComputingNodes.emit(cloudsAmount);
  }
  /*  onCloudsChange(){
    this.numOfCloudsEvent.emit(this.numOfComputingNodes.get('numOfClouds').value);
  }
  onFogChange(){
    this.numOfFogsEvent.emit(this.numOfComputingNodes.get('numOfFogs').value);
  } */
}
