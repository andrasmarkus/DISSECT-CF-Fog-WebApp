import { Injectable } from '@angular/core';
import {ConfigurationObject, ServerSideConfigurationObject} from '../../../models/configuration';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { TokenStorageService } from '../../token-storage/token-storage.service';
import {
  ConfigurationFile,
  ConfigurationResult,
  SERVER_URL, SimulationResult,
  UserConfigurationDetails
} from 'src/app/models/server-api/server-api';
import { saveAs } from 'file-saver';
import { parseConfigurationObjectToXml } from 'src/app/core/util/configuration-util';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const HTML_FILES = [
  'timeline',
  'devicesenergy',
  'nodesenergy'
];

/**
 * API calls for running configuration or get configurations.
 */
@Injectable()
export class UserConfigurationService {
  public configurationResult$: Observable<ConfigurationResult>;

  constructor(private http: HttpClient, public tokenService: TokenStorageService) {}

  public sendConfiguration(objects: ServerSideConfigurationObject[]): void {
    const xmlBaseConfigs = [];
    for (const object of objects) {
      xmlBaseConfigs.push(parseConfigurationObjectToXml(object, this.tokenService.getUser().email));
    }

    console.log(JSON.stringify(xmlBaseConfigs));
    // const xmlBaseConfig = parseConfigurationObjectToXml(object, this.tokenService.getUser().email);
    this.configurationResult$ = this.http
      .post<ConfigurationResult>(SERVER_URL + 'configuration', JSON.stringify(xmlBaseConfigs), httpOptions)
      .pipe(shareReplay(1));
  }

  public getUserConfigurationsDetails(): Observable<UserConfigurationDetails[]> {
    const data = {
      email: this.tokenService.getUser().email
    };
    return this.http.post<UserConfigurationDetails[]>(SERVER_URL + 'user/configurations', data, httpOptions);
  }

  public getUserConfigurationsDetailsMongo(): Observable<UserConfigurationDetails[]> {
    const data = {
      id: this.tokenService.getUser().id
    };
    console.log("getUserConfigurationDetailsMongo() - user=" + this.tokenService.getUser() + "; ID=" + this.tokenService.getUser().id);
    return this.http.post<UserConfigurationDetails[]>(SERVER_URL + 'user/configurations', data, httpOptions);
  }

  public getselectedConfigurationResult(directory: string): Observable<ConfigurationResult> {
    const data = {
      email: this.tokenService.getUser().email,
      directory
    };
    return this.http.post<ConfigurationResult>(SERVER_URL + 'user/configurations/resultfile', data, httpOptions);
  }

  public getSelectedConfigurationResultMongo(id): Observable<ConfigurationResult> {
    const data = { _id: id };

    console.log("getSelectedConfigurationResultMongo() - id =" + id);
    console.log("getSelectedConfigurationResultMongo() - data = " + JSON.stringify(data));
    return this.http.post<ConfigurationResult>(SERVER_URL + 'user/configurations/resultfile', data, httpOptions);
  }

  // switch simulation and configuration above and below
  public getSelectedSimulationResultMongo(id): Observable<ConfigurationResult> {
    const data = { _id: id };

    console.log("getSelectedSimulationResultMongo() - id = " + id);
    console.log("getSelectedSimulationResultMongo() - data =" + JSON.stringify(data));
    return this.http.post<ConfigurationResult>(SERVER_URL + 'user/configurations/job', data, httpOptions);
  }

  /**
   * This downloads the file with specified extensions.
   * @param directory - this determines which configuration is
   * @param file - diagram | appliances | devices
   */
  public downloadFile(directory: string, file: ConfigurationFile): void {
    const data = {
      email: this.tokenService.getUser().email,
      directory: directory
    };
    this.http
      .post(SERVER_URL + 'user/configurations/download/' + file, data, {
        ...httpOptions.headers,
        responseType: 'blob'
      })
      .toPromise()
      .then(blob => {
        saveAs(blob, HTML_FILES.includes(file) ? `${file}.html` : `${file}.xml`);
      })
      .catch(err => console.error('download error = ', err));
  }

  public downloadFileMongo(id, file): void {
    const data = { _id: id };
    this.http
      .post(SERVER_URL + 'user/configurations/download/' + file, data, {
        ...httpOptions.headers,
        responseType: 'blob'
      })
      .toPromise()
      .then(blob => {
        saveAs(blob, HTML_FILES.includes(file) ? `${file}.html` : `${file}.xml`);
      })
      .catch(err => console.error('download error = ', err));
  }
}
