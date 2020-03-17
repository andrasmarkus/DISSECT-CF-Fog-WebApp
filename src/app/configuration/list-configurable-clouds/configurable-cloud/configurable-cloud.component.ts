import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroupDirective, ControlContainer, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-configurable-cloud',
  templateUrl: './configurable-cloud.component.html',
  styleUrls: ['./configurable-cloud.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class ConfigurableCloudComponent implements OnInit {
  public readonly lpdsTypes: string[] = ['LPDS_Fog_T1', 'LPDS_Fog_T2', 'LPDS_original'];
  cardForm: FormGroup;
  selectedLPDStype = this.lpdsTypes[0];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.cardForm = this.formBuilder.group({
      numOfApplications: ['', Validators.required]
    });
  }
}
