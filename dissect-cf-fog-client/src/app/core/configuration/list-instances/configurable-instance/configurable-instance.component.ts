import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { INPUT_VALIDATION_CPU_CORE, INPUT_VALIDATION_NAME, INPUT_VALIDATION_NETWORK_LOAD, INPUT_VALIDATION_POSITIVE_NUMBER, INPUT_VALIDATION_PRICE_PER_TICK } from 'src/app/core/configuration/utils/constants';
import { Instance } from 'src/app/models/instance';

@Component({
  selector: 'app-configurable-instance',
  templateUrl: './configurable-instance.component.html',
  styleUrls: ['./configurable-instance.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigurableInstanceComponent implements OnChanges, OnDestroy {
  @Input() public instance: Instance;
  @Output() public instanceEmitter = new EventEmitter<Instance>();
  @Output() public removeEmitter = new EventEmitter<string>();

  public instanceFormGroup: FormGroup;
  public quantity = 1;

  private formChangeSub: Subscription;

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.createForm();
    this.formChangeSub = this.instanceFormGroup.valueChanges.subscribe(() => {
      this.saveInstance();
    });
  }

  public ngOnDestroy(): void {
    this.formChangeSub?.unsubscribe();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.instance) {
      this.updateForm();
    }
  }

  public onStrategyChange(): void {
    this.saveInstance();
  }

  private createForm(): void {
    this.instanceFormGroup = this.formBuilder.group({
      name: this.createFormControl(INPUT_VALIDATION_NAME),
      ram: this.createFormControl(INPUT_VALIDATION_POSITIVE_NUMBER),
      cpuCores: this.createFormControl(INPUT_VALIDATION_POSITIVE_NUMBER),
      cpuProcessingPower: this.createFormControl(INPUT_VALIDATION_CPU_CORE),
      startupProcess: this.createFormControl(INPUT_VALIDATION_POSITIVE_NUMBER),
      networkLoad: this.createFormControl(INPUT_VALIDATION_NETWORK_LOAD),
      reqDisk: this.createFormControl(INPUT_VALIDATION_POSITIVE_NUMBER),
      pricePerTick: this.createFormControl(INPUT_VALIDATION_PRICE_PER_TICK)
    });
  }

  public decrease(): void {
    if (this.quantity > 1) {
      this.quantity--;
      this.instance.quantity = this.quantity;
      this.saveInstance();
    }
  }

  public increase(): void {
    this.quantity++;
    this.instance.quantity = this.quantity;
    this.saveInstance();
  }

  private saveInstance() {
    this.setInstanceValues();
    this.instance.valid = this.instanceFormGroup.valid && this.quantity >= 1;

    this.instanceEmitter.emit(this.instance);
  }

  public setInstanceValues() {
    const id = this.instance.id;
    this.instance = this.instanceFormGroup.value;
    this.instance.id = id;

    return this.instance;
  }

  private createFormControl(validation: ValidatorFn[]): FormControl {
    return new FormControl('', validation);
  }

  private updateForm(): void {
    if (this.instance) {
      this.instanceFormGroup?.patchValue(this.instance, { emitEvent: false });
    }
    this.quantity = this.instance.quantity ? this.instance.quantity : 1;
  }

  public openInfoPanelForInstances(): void {

  }

}
