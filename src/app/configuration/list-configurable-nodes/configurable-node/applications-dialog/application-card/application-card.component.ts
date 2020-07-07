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
import { QuantityCounterService } from 'src/app/services/quantity-counter/quantity-counter.service';

@Component({
  selector: 'app-application-card',
  templateUrl: './application-card.component.html',
  styleUrls: ['./application-card.component.css']
})
export class ApplicationCardComponent implements OnInit {
  @Input() index: number;
  @Input() application: Application;
  @Input() instances = ['a1.large', 'a1.xlarge', 'a2.xlarge'];
  @Input() public strategys: string[] = ['random', 'distance'];
  @Output() removeEmitter = new EventEmitter<string>();
  public appFormGroup: FormGroup;
  public canJoin: boolean;
  public instance: string;
  public strategy: string;

  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    public quantityCounterService: QuantityCounterService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.initForm();
    this.instance = this.instances[0];
    this.strategy = this.strategys[0];
  }

  createForm() {
    this.appFormGroup = this.formBuilder.group({
      taksize: new FormControl('', [Validators.required]),
      freq: new FormControl('', [Validators.required]),
      numOfInstruction: new FormControl('', [Validators.required]),
      threshold: new FormControl('', [Validators.required]),
      quantity: [this.application.quantity, [Validators.min(1)]]
    });
  }

  initForm() {
    if (this.application) {
      this.appFormGroup.patchValue(this.application);
    }
    this.canJoin = this.application ? this.application.canJoin : false;
    this.instance = this.application ? this.application.instance : this.instances[0];
    this.strategy = this.application ? this.application.strategy : this.strategys[0];
  }

  public getValidApplication() {
    this.application = this.appFormGroup.value;
    this.application.canJoin = this.canJoin;
    this.application.strategy = this.strategy;
    this.application.instance = this.instance;
    this.application.id = 'app' + this.index;
    return this.application;
  }

  public checkValidation(): boolean {
    return this.appFormGroup.valid;
  }

  decrease() {
    if (this.quantityCounterService.decreseApps(this.application.quantity)) {
      this.application.quantity--;
      this.appFormGroup.get('quantity').setValue(this.application.quantity);
    }
  }
  increase() {
    if (this.quantityCounterService.increaseApps()) {
      this.application.quantity++;
      this.appFormGroup.get('quantity').setValue(this.application.quantity);
    }
  }
}
