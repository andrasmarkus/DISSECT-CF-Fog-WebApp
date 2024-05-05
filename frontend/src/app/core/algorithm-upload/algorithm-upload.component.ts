import { AlgorithmUploadConfigurationService } from './../../services/algorithm-upload-configuration/algorithm-upload-configuration.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { algorithmUploadData } from 'src/app/models/algorithm-upload-data';
import { AdminConfigurationService } from 'src/app/services/admin-configuration/admin-configuration.service';

interface Application {
  value: string;
  viewValue: string;
}

interface ApplicationGroup {
  disabled?: boolean;
  name: string;
  strategy: Application[];
}

interface Device {
  value: string;
  viewValue: string;
}

interface DeviceGroup {
  disabled?: boolean;
  name: string;
  strategy: Device[];
}


@Component({
  selector: 'app-algorithm-upload',
  templateUrl: './algorithm-upload.component.html',
  styleUrls: ['./algorithm-upload.component.css']
})
export class AlgorithmUploadComponent implements OnInit {
  deviceCode: string = '// Write your Device strategy java code here\n';
  applicationCode: string = '// Write your Application strategy java code here\n';
  options: any = [];
  filteredOptions: string[];
  applicationCodeValue: string;
  deviceCodeValue:  string;
  isApplicationCustom: string = "false";
  isDeviceCustom: string = "false";

  constructor(
    private adminConfigurationService: AdminConfigurationService,
    private algorithmUploadConfigurationService: AlgorithmUploadConfigurationService
  ) {
    this.filteredOptions = this.options.slice();
  }

  ngOnInit(): void {
    this.adminConfigurationService.getAdminConfigurations().subscribe(
      data => {
        this.options = data.map(obj => obj._id);
        this.filterOptions('');
      },
      error => {
        console.log(error);
      }
    );
  }


  applicationControl = new FormControl('');
  applicationGroups: ApplicationGroup[] = [
    {
      name: 'Custom alg',
      strategy: [
        {value: 'custom', viewValue: 'Custom Strategy'},
      ],
    },
    {
      name: 'Pre built appliaction strategies',
      strategy: [
        {value: 'HoldDownApplicationStrategy', viewValue: 'Hold Down Strategy'},
        {value: 'PliantApplicationStrategy', viewValue: 'Pliant Application Strategy'},
        {value: 'PushUpApplicationStrategy', viewValue: 'Push Up Application Strategy'},
        {value: 'RuntimeAwareApplicationStrategy', viewValue: 'Runtime Aware Application Strategy'},
      ],
    },
  ];

  deviceControl = new FormControl('');
  deviceGroups: DeviceGroup[] = [
    {
      name: 'Custom alg',
      strategy: [
        {value: 'custom', viewValue: 'Custom Strategy'},
      ],
    },
    {
      name: 'Pre built device strategies',
      strategy: [
        {value: 'CostAwareDeviceStrategy', viewValue: 'Cost Aware Device Strategy'},
        {value: 'DistanceBasedDeviceStrategy', viewValue: 'Distance Based Device Strategy'},
        {value: 'LoadBalancedDeviceStrategy', viewValue: 'Load Balanced Device Strategy'},
        {value: 'PliantDeviceStrategy', viewValue: 'Pliant Device Strategy'},
      ],
    },
  ];

  @ViewChild('deviceCodemirror') deviceCodemirror: any;
  @ViewChild('applicationCodeMirror') applicationCodeMirror: any;
  @ViewChild('id') id: any;
  @ViewChild('nickname') nickname: any;

  sendData() {
    
    if(this.applicationControl.value == "custom"){
      this.isApplicationCustom = "true";
      this.applicationCodeValue = this.applicationCodeMirror.codeMirror.getValue()
   }else{
    this.applicationCodeValue = this.applicationControl.value
   }

   if(this.deviceControl.value == "custom"){
    this.isDeviceCustom = "true";
    this.deviceCodeValue = this.deviceCodemirror.codeMirror.getValue()
 }else{
  this.deviceCodeValue = this.deviceControl.value
 }
    if (this.id.nativeElement.value != '') {
      this.algorithmUploadConfigurationService
        .getAdminConfigurationFilesById(this.id.nativeElement.value)
        .subscribe(data => {
          const configFileIds: algorithmUploadData = {
            ApplicationId: data.configFiles.APPLIANCES_FILE,
            DevicesId: data.configFiles.DEVICES_FILE,
            InstancesId: data.configFiles.INSTANCES_FILE,
            deviceCode: this.deviceCodeValue,
            isDeviceCodeCustom: this.isDeviceCustom,
            applicationCode: this.applicationCodeValue,
            isApplicationCodeCustom: this.isApplicationCustom,
            adminConfigId: this.id.nativeElement.value,
            nickname: this.nickname.nativeElement.value
          };
          this.algorithmUploadConfigurationService.sendJobWithOwnAlgorithm(configFileIds).subscribe(
            response => {
              console.log(response);
            },
            error => console.log(error)
          );
        });
    }
  }

  filterOptions(value: string) {
    this.filteredOptions = this.options.filter(option => option.toLowerCase().includes(value.toLowerCase()));
  }
}
