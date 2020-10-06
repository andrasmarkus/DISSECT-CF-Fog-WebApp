import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { first, take } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfigurationRequestCreatorService } from 'src/app/services/configuration-request-creator.service';
import { StepperService } from 'src/app/services/stepper/stepper.service';
import { Subscription } from 'rxjs';

export interface ConfigurationResult {
  html: string;
  data: string;
}

@Component({
  selector: 'app-configuration-result',
  templateUrl: './configuration-result.component.html',
  styleUrls: ['./configuration-result.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigurationResultComponent implements OnInit {
  @Input() public showSpinner = false;
  public configResult: ConfigurationResult;
  private resultSub: Subscription;

  constructor(
    public configService: ConfigurationRequestCreatorService,
    public stepperService: StepperService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.resultSub = this.configService.configurationResult$?.subscribe(res => {
      this.configResult = res;
      this.showSpinner = false;
      this.changeDetectorRef.detectChanges();
    });
  }

  public back(): void {
    this.resultSub?.unsubscribe();
    this.stepperService.stepBack();
  }
}
