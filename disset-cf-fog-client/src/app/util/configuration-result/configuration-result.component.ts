import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ConfigurationResult } from 'src/app/models/server-api/server-api';
import { UserConfigurationService } from 'src/app/services/configuration/user-configuration/user-configuration.service';
import { PanelService } from 'src/app/services/panel/panel.service';

@Component({
  selector: 'app-configuration-result',
  templateUrl: './configuration-result.component.html',
  styleUrls: ['./configuration-result.component.css']
})
export class ConfigurationResultComponent implements OnDestroy, OnInit {
  private resultSub: Subscription;
  public configResult: ConfigurationResult;
  public showSpinner = true;
  @Input() public configResult$: Observable<ConfigurationResult>;
  @Input() public contentHeight: number;
  @Output() showActions = new EventEmitter<void>();

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    public configService: UserConfigurationService,
    private panelService: PanelService
  ) {}
  ngOnInit(): void {
    if (this.configResult$) {
      this.showSpinner = true;
      setTimeout(() => {
        this.showActions.emit();
      }, 3000);
      this.resultSub = this.configResult$.subscribe(res => {
        const data = res.data.replace(/\r\n/g, '<br>');
        this.configResult = { ...res, data };
        this.showSpinner = false;
        this.showActions.emit();
        this.changeDetectorRef.detectChanges();
      });
    }
  }

  public ngOnDestroy(): void {
    this.resultSub?.unsubscribe();
  }

  public openPanelInfoForConfigurationError() {
    this.panelService.getConfigurationErrorData();
    this.panelService.toogle();
  }
}
