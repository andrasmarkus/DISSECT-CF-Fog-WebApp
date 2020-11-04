import { Injectable } from '@angular/core';
import { ConfigurationObject } from '../../../models/configuration';
import { parseConfigurationObjectToXml } from '../../../util/configuration-util';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { TokenStorageService } from '../../token-storage/token-storage.service';
import { ConfigurationFile, ConfigurationResult, UserConfigurationDetails } from 'src/app/models/server-api/server-api';
import { saveAs } from 'file-saver';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class UserConfigurationService {
  public configurationResult$: Observable<ConfigurationResult>;
  public selectedConfigurationResult$: Observable<ConfigurationResult>;
  public userConfigurationsDetails$: Observable<UserConfigurationDetails[]>;

  constructor(private http: HttpClient, public tokenService: TokenStorageService) {
    this.userConfigurationsDetails$ = this.getUserConfigurationsDetails();
  }

  public sendConfiguration(object: ConfigurationObject): void {
    const xmlBaseConfig = parseConfigurationObjectToXml(object, this.tokenService.getUser().email);
    this.configurationResult$ = this.http
      .post<ConfigurationResult>('http://localhost:3000/configuration', JSON.stringify(xmlBaseConfig), httpOptions)
      .pipe(shareReplay(1));
  }

  private getUserConfigurationsDetails(): Observable<UserConfigurationDetails[]> {
    const data = {
      email: this.tokenService.getUser().email
    };
    return this.http.post<UserConfigurationDetails[]>('http://localhost:3000/user/configurations', data, httpOptions);
  }

  public getselectedConfigurationResult(directory: string): Observable<ConfigurationResult> {
    const data = {
      email: this.tokenService.getUser().email,
      directory
    };
    return this.http.post<ConfigurationResult>(
      'http://localhost:3000/user/configurations/resultfile',
      data,
      httpOptions
    );
  }

  public downloadFile(directory: string, file: ConfigurationFile) {
    const data = {
      email: this.tokenService.getUser().email,
      directory
    };
    this.http
      .post('http://localhost:3000/user/configurations/download/' + file, data, {
        ...httpOptions.headers,
        responseType: 'blob'
      })
      .toPromise()
      .then(blob => {
        saveAs(blob, file === 'diagram' ? `${file}.html` : `${file}.xml`);
      })
      .catch(err => console.error('download error = ', err));
  }
}
