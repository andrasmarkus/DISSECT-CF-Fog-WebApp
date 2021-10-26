import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
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
      name: this.createStringFormControl(),
      ram: this.createNumberFormControl(),
      cpuCores: this.createNumberFormControl(),
      cpuProcessingPower: this.createNumberFormControl(),
      startupProcess: this.createNumberFormControl(),
      networkLoad: this.createNumberFormControl(),
      reqDisk: this.createNumberFormControl(),
      pricePerTick: this.createNumberFormControl()
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

  private createNumberFormControl(): FormControl {
    return new FormControl('', [Validators.required, Validators.pattern('^[0-9.]*$')]);
  }

  private createStringFormControl(): FormControl {
    return new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z._]*$')]);
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
