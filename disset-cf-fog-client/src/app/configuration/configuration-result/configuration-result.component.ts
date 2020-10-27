import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ConfigurationRequestCreatorService } from 'src/app/services/configuration/configuration-request-creator/configuration-request-creator.service';
import { Subscription } from 'rxjs';
import { StepperService } from 'src/app/services/configuration/stepper/stepper.service';
import { PanelService } from 'src/app/services/panel/panel.service';

export interface ConfigurationResult {
  html: string;
  data: string;
  err: string;
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
    private changeDetectorRef: ChangeDetectorRef,
    private panelService: PanelService
  ) {}
  ngOnInit(): void {
    this.resultSub = this.configService.configurationResult$?.subscribe(res => {
      const data = res.data.replace(/\r\n/g, '<br>');
      this.configResult = { ...res, data };
      this.showSpinner = false;
      this.changeDetectorRef.detectChanges();
    });
  }

  public back(): void {
    this.resultSub?.unsubscribe();
    this.stepperService.stepBack();
  }

  public openPanelInfoForConfigurationError() {
    this.panelService.getConfigurationErrorData();
    this.panelService.toogle();
  }
}
