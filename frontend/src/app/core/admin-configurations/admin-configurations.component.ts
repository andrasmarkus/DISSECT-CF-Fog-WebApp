import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';


@Component({
  selector: 'app-admin-configurations',
  templateUrl: './admin-configurations.component.html',
  styleUrls: ['./admin-configurations.component.css']
})
export class AdminConfigurationsComponent implements AfterViewInit {
  displayedColumns: string[] = ['shortDescription','appliancesId', 'devicesId', 'instancesId'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  logCellValue(value: any) {
    console.log('Cell value:', value);
  }

}

export interface PeriodicElement {
  shortDescription: string;
  appliancesId: number;
  devicesId: string;
  instancesId: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { appliancesId: 1, devicesId: 'Hydrogen', instancesId: 1.0079, shortDescription: 'H' },
  { appliancesId: 2, devicesId: 'Helium', instancesId: 4.0026, shortDescription: 'He' },
  { appliancesId: 3, devicesId: 'Lithium', instancesId: 6.941, shortDescription: 'Li' },
  { appliancesId: 4, devicesId: 'Beryllium', instancesId: 9.0122, shortDescription: 'Be' },
  { appliancesId: 5, devicesId: 'Boron', instancesId: 10.811, shortDescription: 'B' },
  { appliancesId: 6, devicesId: 'Carbon', instancesId: 12.0107, shortDescription: 'C' },
  { appliancesId: 7, devicesId: 'Nitrogen', instancesId: 14.0067, shortDescription: 'N' },
  { appliancesId: 8, devicesId: 'Oxygen', instancesId: 15.9994, shortDescription: 'O' },
  { appliancesId: 9, devicesId: 'Fluorine', instancesId: 18.9984, shortDescription: 'F' },
  { appliancesId: 10, devicesId: 'Neon', instancesId: 20.1797, shortDescription: 'Ne' },
  { appliancesId: 11, devicesId: 'Sodium', instancesId: 22.9897, shortDescription: 'Na' },
  { appliancesId: 12, devicesId: 'Magnesium', instancesId: 24.305, shortDescription: 'Mg' },
  { appliancesId: 13, devicesId: 'Aluminum', instancesId: 26.9815, shortDescription: 'Al' },
  { appliancesId: 14, devicesId: 'Silicon', instancesId: 28.0855, shortDescription: 'Si' },
  { appliancesId: 15, devicesId: 'Phosphorus', instancesId: 30.9738, shortDescription: 'P' },
  { appliancesId: 16, devicesId: 'Sulfur', instancesId: 32.065, shortDescription: 'S' },
  { appliancesId: 17, devicesId: 'Chlorine', instancesId: 35.453, shortDescription: 'Cl' },
  { appliancesId: 18, devicesId: 'Argon', instancesId: 39.948, shortDescription: 'Ar' },
  { appliancesId: 19, devicesId: 'Potassium', instancesId: 39.0983, shortDescription: 'K' },
  { appliancesId: 20, devicesId: 'Calcium', instancesId: 40.078, shortDescription: 'Ca' }
];
