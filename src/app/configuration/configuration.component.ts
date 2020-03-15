import { Component, OnInit, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { CloudNumberFormComponent } from '../cloud-number-form/cloud-number-form.component';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit, AfterViewChecked {

  public numOfClouds:number;
  public numOfFogs:number;

  isLinear= true;

  @ViewChild(CloudNumberFormComponent) numOfCloudsForm: CloudNumberFormComponent;

  constructor(private _formBuilder: FormBuilder,
    private changeDetect: ChangeDetectorRef) { }

  ngOnInit(): void {
     
  }

  ngAfterViewChecked(): void {
    this.changeDetect.detectChanges();
  }

  /* numOfCloudsEventHandler($event:any){
    this.numOfClouds = $event;
  }
  numOfFogsEventHandler($event:any){
    this.numOfFogs = $event;
  }
 */
  get numOfCloudsFromGroup() {
    return this.numOfCloudsForm ? this.numOfCloudsForm.numOfComputingNodes : null;
 }

}
