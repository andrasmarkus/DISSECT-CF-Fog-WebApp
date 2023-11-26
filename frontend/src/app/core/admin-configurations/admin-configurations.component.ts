import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { adminConfiguration } from 'src/app/models/admin-configuration';
import { AdminConfigurationService } from 'src/app/services/admin-configuration/admin-configuration.service';

@Component({
  selector: 'app-admin-configurations',
  templateUrl: './admin-configurations.component.html',
  styleUrls: ['./admin-configurations.component.css']
})
export class AdminConfigurationsComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['shortDescription', 'appliancesId', 'devicesId', 'instancesId'];
  adminConfigurations: adminConfiguration[] = []
  dataSource = new MatTableDataSource<adminConfiguration>(this.adminConfigurations);

  constructor(private adminConfigurationService: AdminConfigurationService) {}

  ngOnInit(): void {
    this.adminConfigurationService.getAdminConfigurations().subscribe(
      data => {
        this.adminConfigurations = data
        console.log(this.adminConfigurations);
        this.dataSource.data = this.adminConfigurations ;
      },
      error => {
        console.log(error);
      }
    );
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  ngAfterViewInit(): void {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
    }
  }

  logCellValue(value: any) {
    console.log('Cell value:', value);
  }
}
