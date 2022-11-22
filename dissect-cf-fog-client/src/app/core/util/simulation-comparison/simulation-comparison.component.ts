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
import {ConfigurationFile, ConfigurationResult, SERVER_URL} from 'src/app/models/server-api/server-api';
import { UserConfigurationService } from 'src/app/services/configuration/user-configuration/user-configuration.service';
import { PanelService } from 'src/app/services/panel/panel.service';
import {Chart} from "chart.js";


@Component({
  selector: 'app-simulation-comparison',
  templateUrl: './simulation-comparison.component.html',
  styleUrls: ['./simulation-comparison.component.css']
})
export class SimulationComparisonComponent implements OnInit, OnDestroy {
  @Input() public simulations: any;
  private resultSub: Subscription;
  public configResult: ConfigurationResult;
  private configResultTemp: ConfigurationResult;
  private configId: any;
  private jobsdata: [
    {
      "actuatorEvents": {
        "eventCount": 111113,
        "nodeChange": 0,
        "positionChange": 13,
        "connectToNodeEventCount": 57100,
        "disconnectFromNodeEventCount": 54000
      },
      "architecture": {
        "usedVirtualMachines": 17,
        "tasks": 18,
        "totalEnergyConsumptionOfNodesInWatt": 35808208.125,
        "totalEnergyConsumptionOfDevicesInWatt": null,
        "sumOfMillisecondsOnNetwork": 6860,
        "sumOfByteOnNetwork": 2430158,
        "highestAppStopTimeInHour": 0.6444447222222223,
        "highestDeviceStopTimeInHour": 0.3611111111111111
      },
      "cost": {
        "totalCostInEuro": 2.2740001,
        "bluemixCostInEuro": 0.00074005126953125,
        "amazonCostInEuro": 0.0078225,
        "azureCostInEuro": 929.9999999999808,
        "oracleCostInEuro": 420.65
      },
      "dataVolume": {
        "generatedDataInBytes": 800000,
        "processedDataInBytes": 800000,
        "arrivedDataInBytes": 800000
      },
      "timeoutInMinutes": 17.000016666666667
    },
    {
      "actuatorEvents": {
        "eventCount": 41104,
        "nodeChange": 0,
        "positionChange": 4,
        "connectToNodeEventCount": 21100,
        "disconnectFromNodeEventCount": 20000
      },
      "architecture": {
        "usedVirtualMachines": 24,
        "tasks": 29,
        "totalEnergyConsumptionOfNodesInWatt": 719015193.13125,
        "totalEnergyConsumptionOfDevicesInWatt": null,
        "sumOfMillisecondsOnNetwork": 6860,
        "sumOfByteOnNetwork": 2430158,
        "highestAppStopTimeInHour": 0.5944447222222223,
        "highestDeviceStopTimeInHour": 0.3611111111111111
      },
      "cost": {
        "totalCostInEuro": 2.7660001999999997,
        "bluemixCostInEuro": 0.00074005126953125,
        "amazonCostInEuro": 0.0078225,
        "azureCostInEuro": 930.0000000000058,
        "oracleCostInEuro": 843.3
      },
      "dataVolume": {
        "generatedDataInBytes": 800000,
        "processedDataInBytes": 800000,
        "arrivedDataInBytes": 800000
      },
      "timeoutInMinutes": 14.000016666666665
    }
  ];
  public chart: any;
  public jobs: any;
  public defaultJob: any;
  @Input() public showSpinner = false;
  @Input() public configResult$: Observable<ConfigurationResult>;
  @Input() public contentHeight: number;
  @Output() showActions = new EventEmitter<void>();
  @Output() public goBack = new EventEmitter<void>();

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    public configService: UserConfigurationService,
    private panelService: PanelService
  ) {}

  public async ngOnInit(): Promise<void> {
    console.log('Onint');
    console.log(this.simulations);
    this.getAllSimulations(this.simulations);
    this.createChart();
  }

  public createChart(){
    this.chart = new Chart("MyChart", {
      type: 'bar', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: ["totalCostInEuro", "bluemixCostInEuro", "amazonCostInEuro","azureCostInEuro",
          "oracleCostInEuro"],
        datasets: [
          {
            label: "Simulation 1",
            data: ['2.27400001','0.0000000000074005126953125', '0.78225', '10.5', '2.5'],
            backgroundColor: 'blue'
          },
          {
            label: "Simulation 2",
            data: ['2.7660001999999997', '0.74005126953125', '0.78225', '15.5', '1.3'],
            backgroundColor: 'limegreen'
          }
        ]
      },
      options: {
        aspectRatio:2.5
      }

    });

    // this.chart = new Chart("MyChart", {
    //   type: 'bar', //this denotes tha type of chart
    //
    //   data: {// values on X-Axis
    //     labels: ['2022-05-10', '2022-05-11', '2022-05-12','2022-05-13',
    //       '2022-05-14', '2022-05-15', '2022-05-16','2022-05-17', ],
    //     datasets: [
    //       {
    //         label: "Sales",
    //         data: ['467','576', '572', '79', '92',
    //           '574', '573', '576'],
    //         backgroundColor: 'blue'
    //       },
    //       {
    //         label: "Profit",
    //         data: ['542', '542', '536', '327', '17',
    //           '0.00', '538', '541'],
    //         backgroundColor: 'limegreen'
    //       }
    //     ]
    //   },
    //   options: {
    //     aspectRatio:2.5
    //   }
    //
    // });
  }

  public ngOnDestroy(): void {
    this.resultSub?.unsubscribe();
  }

  public openPanelInfoForConfigurationError() {
    this.panelService.getConfigurationErrorData();
    this.panelService.toogle();
  }

  public async getAllSimulations(simulations: any){

  }





}
