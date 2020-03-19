import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-cloud-number-form',
  templateUrl: './cloud-number-form.component.html',
  styleUrls: ['./cloud-number-form.component.css']
})
export class CloudNumberFormComponent implements OnInit {
  /*  @Output() numOfCloudsEvent = new EventEmitter<any>();
  @Output() numOfFogsEvent = new EventEmitter<any>(); */

  public numOfClouds: string;
  public numOfFogs: number;
  public numOfComputingNodes: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.initForm();
  }

  ngOnInit(): void {
    this.initValues();
  }

  initForm() {
    this.numOfComputingNodes = this.formBuilder.group({
      numOfClouds: new FormControl('', [Validators.required]),
      numOfFogs: new FormControl('', [])
    });
  }

  initValues() {
    this.numOfComputingNodes.get('numOfClouds').valueChanges.subscribe(val => {
      this.numOfClouds = val;
    });
    this.numOfComputingNodes.get('numOfFogs').valueChanges.subscribe(val => {
      this.numOfFogs = val;
    });
  }
  /*  onCloudsChange(){
    this.numOfCloudsEvent.emit(this.numOfComputingNodes.get('numOfClouds').value);
  }
  onFogChange(){
    this.numOfFogsEvent.emit(this.numOfComputingNodes.get('numOfFogs').value);
  } */
}
