import { AlgorithmUploadConfigurationService } from './../../services/algorithm-upload-configuration/algorithm-upload-configuration.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { algorithmUploadData } from 'src/app/models/algorithm-upload-data';
import { AdminConfigurationService } from 'src/app/services/admin-configuration/admin-configuration.service';

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

  @ViewChild('deviceCodemirror') deviceCodemirror: any;
  @ViewChild('applicationCodeMirror') applicationCodeMirror: any;
  @ViewChild('id') id: any;
  @ViewChild('nickname') nickname: any;

  sendData() {
    console.log(this.deviceCodemirror.codeMirror.getValue());
    console.log(this.id.nativeElement.value);
    console.log(this.nickname.nativeElement.value)
    if (this.id.nativeElement.value != '') {
      this.algorithmUploadConfigurationService
        .getAdminConfigurationFilesById(this.id.nativeElement.value)
        .subscribe(data => {
          const configFileIds: algorithmUploadData = {
            ApplicationId: data.configFiles.APPLIANCES_FILE,
            DevicesId: data.configFiles.DEVICES_FILE,
            InstancesId: data.configFiles.INSTANCES_FILE,
            deviceCode: this.deviceCodemirror.codeMirror.getValue(),
            applicationCode: this.applicationCodeMirror.codeMirror.getValue(),
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
