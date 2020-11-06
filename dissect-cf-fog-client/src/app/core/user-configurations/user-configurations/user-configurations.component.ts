import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { UserConfigurationDetails } from 'src/app/models/server-api/server-api';
import { UserConfigurationService } from 'src/app/services/configuration/user-configuration/user-configuration.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-user-configurations',
  templateUrl: './user-configurations.component.html',
  styleUrls: ['./user-configurations.component.css']
})
export class UserConfigurationsComponent implements AfterViewInit {
  public displayedColumns: string[] = ['time', 'clouds', 'fogs', 'devices', 'actions'];
  public userConfigurationsDetails$: Observable<MatTableDataSource<UserConfigurationDetails>>;
  /**
   * Tells that one of the configuration is selected to watch the result.
   */
  public isConfigSelected = false;
  public configDirName: string;
  @ViewChild(MatSort) public sort: MatSort;
  @ViewChild(MatPaginator) public paginator: MatPaginator;

  constructor(public userConfigurationService: UserConfigurationService) {}

  public ngAfterViewInit(): void {
    this.userConfigurationsDetails$ = this.userConfigurationService.getUserConfigurationsDetails().pipe(
      map(details => new MatTableDataSource(details)),
      map(details => {
        if (details && this.sort && this.paginator) {
          details.sort = this.sort;
          details.paginator = this.paginator;
        }
        return details;
      })
    );
  }

  public overviewConfiguration(directory: string): void {
    this.isConfigSelected = true;
    this.configDirName = directory;
  }

  public showTable() {
    this.isConfigSelected = false;
  }
}
