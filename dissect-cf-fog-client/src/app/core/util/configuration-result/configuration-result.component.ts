import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ConfigurationFile, ConfigurationResult } from 'src/app/models/server-api/server-api';
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
  private configResultTemp: ConfigurationResult;
  private configId: any;
  public jobs: any;
  public defaultJob: any;
  @Input() public showSpinner = false;
  @Input() public configResult$: Observable<ConfigurationResult>;
  @Input() public contentHeight: number;
  @Output() showActions = new EventEmitter<void>();

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    public configService: UserConfigurationService,
    private panelService: PanelService
  ) {}

  public async ngOnInit(): Promise<void> {
    if (this.configResult$) {
      // setTimeout(() => {
      //   this.showActions.emit();
      // }, 3000);
      this.resultSub = this.configResult$.subscribe(async res => {
        console.log(res);
        console.log(res.jobs);
        this.jobs = res.jobs;

        console.log("CONFIG ID before=" + this.jobs[0]);
        await this.getConfigurationResult(this.jobs[0]);

        this.defaultJob = this.jobs[0];
        console.log(this.configResultTemp);

        // while (this.configResultTemp.job.simulatorJobStatus !== "PROCESSED") {
        //   await new Promise(resolve => setTimeout(resolve, 5000));
        //   await this.getConfigurationResult(this.jobs[0]);
        // }

        // // const data = res.data.replace(/\r\n/g, '<br>');
        // // this.configResult = {...res, data};
        // console.log('configResult ' + this.configResult);
        // this.configId = res.configuration_id;
        // console.log("CONFIG ID=" + this.configId);
        // // this.showSpinner = false;
        // // this.showActions.emit();
        // // this.changeDetectorRef.detectChanges();
        //
        // console.log('JOB IN RES' + ('job' in res));
        // //console.log('PROCESSED' + (res.job.simulatorJobStatus === 'PROCESSED'));
        // let b1 = 'job' in res;
        // let b2 = false;
        // if (b1 === true) {
        //   b2 = 'simulatorJobStatus' in res.job;
        // }
        // let b3 = false;
        // if (b2 === true) {
        //   b3 = res.job.simulatorJobStatus === 'PROCESSED';
        // }
        //
        // if (!b3) {
        //   console.log("CONFIG ID before=" + this.configId);
        //   await this.getConfigurationResult(this.configId);
        //   console.log(this.configResultTemp);
        //
        //   while (this.configResultTemp.job.simulatorJobStatus !== "PROCESSED") {
        //     await new Promise(resolve => setTimeout(resolve, 5000));
        //     await this.getConfigurationResult(this.configId);
        //   }
        // } else {
        //   const data = res.data.replace(/\r\n/g, '<br>');
        //   this.configResult = {...res, data};
        // }
        //
        // this.showSpinner = false;
        // this.showActions.emit();
        // this.changeDetectorRef.detectChanges();
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

  public downloadTimeline(): void {
    // this.downloadFile('timeline');
    console.log("downloadTimeline() called");
    console.log("DOWNLOADABLE TIMELINE ID: " + this.configResult.job.results.TIMELINE);
    this.downloadFileMongo(this.configResult.job.results.TIMELINE, 'timeline');
  }

  public downloadDevicesEnergy(): void {
    // this.downloadFile('devicesenergy');
    console.log("downloadTDevicesEnergy() called");
    console.log("DOWNLOADABLE DEVICES ENERGY ID: " + this.configResult.job.results.DEVICES_ENERGY);
    this.downloadFileMongo(this.configResult.job.results.DEVICES_ENERGY, 'devicesenergy');
  }

  public downloadNodesEnergy(): void {
    // this.downloadFile('nodesenergy');
    console.log("downloadTNodesEnergy() called");
    console.log("DOWNLOADABLE NODES ENERGY ID: " + this.configResult.job.results.NODES_ENERGY);
    this.downloadFileMongo(this.configResult.job.results.NODES_ENERGY, 'nodesenergy');
  }

  public downloadAppliances(): void {
    //this.downloadFile('appliances');
    console.log("downloadAppliances() called");
    console.log("DOWNLOADABLE APPLIANCES ID: " + this.configResult.job.configFiles.APPLIANCES_FILE);
    this.downloadFileMongo(this.configResult.job.configFiles.APPLIANCES_FILE, 'appliances');
  }

  public downloadDevices(): void {
    // this.downloadFile('devices');
    console.log("downloadDevices() called");
    console.log("DOWNLOADABLE DEVICES ID: " + this.configResult.job.configFiles.DEVICES_FILE);
    this.downloadFileMongo(this.configResult.job.configFiles.DEVICES_FILE, 'devices');
  }

  public downloadInstances(): void {
    // this.downloadFile('instances');
    console.log("downloadInstances() called");
    console.log("DOWNLOADABLE INSTANCES ID: " + this.configResult.job.configFiles.INSTANCES);
    this.downloadFileMongo(this.configResult.job.configFiles.INSTANCES_FILE, 'instances');
  }

  private downloadFile(type: ConfigurationFile) {
    this.configService.downloadFile(this.configResult?.directory, type);
  }

  private downloadFileMongo(id, type: ConfigurationFile) {
    console.log("downloadFileMongo() called");
    this.configService.downloadFileMongo(id, type);
  }

  public async getConfigurationResult(id) {
    this.configResult = null;
    this.showSpinner = true;
    this.changeDetectorRef.detectChanges();

    let res = await this.configService.getSelectedConfigurationResultMongo(id).toPromise();

    console.log(res);

    if (res.job.simulatorJobStatus === "PROCESSED") {
      const data = res.data.replace(/\r\n/g, '<br>');
      this.configResultTemp =  {...res};
      this.configResult = {...res, data};
    } else {
      this.configResultTemp = {...res};
    }

    while (this.configResultTemp.job.simulatorJobStatus !== "PROCESSED") {
      await new Promise(resolve => setTimeout(resolve, 5000));
      // await this.getConfigurationResult(this.jobs[0]);
      // console.log("ASDASD getConfigurationResult() CALLED with ID=" + id);
      res = await this.configService.getSelectedConfigurationResultMongo(id).toPromise();

      console.log(res);

      if (res.job.simulatorJobStatus === "PROCESSED") {
        const data = res.data.replace(/\r\n/g, '<br>');
        this.configResultTemp =  {...res};
        this.configResult = {...res, data};
      } else {
        this.configResultTemp = {...res};
      }
    }

    this.showSpinner = false;
    this.showActions.emit();
    this.changeDetectorRef.detectChanges();
  }
}
