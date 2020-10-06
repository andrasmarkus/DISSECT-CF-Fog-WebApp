import { Injectable } from '@angular/core';
import { ConfigurationObject } from '../models/configuration';
import { parseConfigurationObjectToXml } from '../util/configuration-util';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ConfigurationRequestCreatorService {
  constructor(private http: HttpClient) {}

  public configurationResult$: Observable<any>;

  public sendConfiguration(object: ConfigurationObject): void {
    const xmlBaseConfig = parseConfigurationObjectToXml(object);
    this.configurationResult$ = this.http
      .post('http://localhost:3000/configuration', xmlBaseConfig, httpOptions)
      .pipe(shareReplay());
  }
}
