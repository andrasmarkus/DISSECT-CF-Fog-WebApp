import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Application } from 'src/app/models/application';

@Component({
  selector: 'app-application-card',
  templateUrl: './application-card.component.html',
  styleUrls: ['./application-card.component.css']
})
export class ApplicationCardComponent implements OnInit, OnChanges {
  @Input() index: number;
  private app: Application;
  public appFormGroup: FormGroup;
  public canJoin = false;

  constructor(private formBuilder: FormBuilder) {
    this.initForm();
  }
  ngOnChanges(): void {
    console.log(this.index);
  }

  ngOnInit(): void {}

  initForm() {
    this.appFormGroup = this.formBuilder.group({
      taksize: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      freq: new FormControl('', [Validators.required]),
      instance: new FormControl('', [Validators.required]), //shuld be select
      numOfInstruction: new FormControl('', [Validators.required]),
      threshold: new FormControl('', [Validators.required]),
      strategy: new FormControl('', [Validators.required]) //shuld be select
    });
  }

  checkValidation() {
    if (this.appFormGroup.valid) {
      this.app = new Application();
      this.app.taksize = this.appFormGroup.get('taksize').value;
      this.app.name = this.appFormGroup.get('name').value;
      this.app.freq = this.appFormGroup.get('freq').value;
      this.app.instance = this.appFormGroup.get('instance').value;
      this.app.numOfInstruction = this.appFormGroup.get('numOfInstruction').value;
      this.app.threshold = this.appFormGroup.get('threshold').value;
      this.app.strategy = this.appFormGroup.get('strategy').value;
      this.app.canJoin = this.canJoin;
      console.log(this.app);
    }
  }
}
