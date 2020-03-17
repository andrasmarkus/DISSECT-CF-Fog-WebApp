import { Component, OnInit, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CloudNumberFormComponent } from './cloud-number-form/cloud-number-form.component';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit, AfterViewChecked {
  isLinear = true;

  @ViewChild(CloudNumberFormComponent) numOfCloudsForm: CloudNumberFormComponent;

  constructor(private changeDetect: ChangeDetectorRef) {}

  ngOnInit(): void {}

  ngAfterViewChecked(): void {
    this.changeDetect.detectChanges();
  }

  get numOfCloudsFromGroup() {
    return this.numOfCloudsForm ? this.numOfCloudsForm.numOfComputingNodes : null;
  }
}
