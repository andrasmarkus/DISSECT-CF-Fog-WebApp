import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Output,
  EventEmitter,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Application } from 'src/app/models/application';

@Component({
  selector: 'app-application-card',
  templateUrl: './application-card.component.html',
  styleUrls: ['./application-card.component.css']
})
export class ApplicationCardComponent implements OnInit {
  @Input() index: number;
  @Input() application: Application;
  private app: Application;
  public appFormGroup: FormGroup;
  public canJoin: boolean;

  constructor(private formBuilder: FormBuilder, private cdr: ChangeDetectorRef) {
    this.createForm();
  }

  ngOnInit(): void {
    this.initForm();
  }

  createForm() {
    this.appFormGroup = this.formBuilder.group({
      taksize: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      freq: new FormControl('', [Validators.required]),
      instance: new FormControl('', [Validators.required]), // shuld be select
      numOfInstruction: new FormControl('', [Validators.required]),
      threshold: new FormControl('', [Validators.required]),
      strategy: new FormControl('', [Validators.required]) // shuld be select
    });
  }

  initForm() {
    if (this.application) {
      this.appFormGroup.patchValue(this.application);
    }
    this.canJoin = this.application ? this.application.canJoin : false;
  }

  public getValidApplication() {
    if (this.appFormGroup.valid) {
      this.app = new Application();
      this.app = this.appFormGroup.value;
      this.app.canJoin = this.canJoin;
      this.app.id = 'app' + this.index;
      return this.app;
    }
    return null;
  }

  public checkValidation(): boolean {
    return this.appFormGroup.valid;
  }
}
