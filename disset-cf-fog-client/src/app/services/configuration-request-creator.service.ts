import { Injectable } from '@angular/core';
import { ConfigurationObject } from '../models/configuration';
import { parseConfigurationObjectToXml } from '../util/configuration-util';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ConfigurationRequestCreatorService {
  constructor(private http: HttpClient) {}

  public sendConfiguration(object: ConfigurationObject) {
    const xmlBaseConfig = parseConfigurationObjectToXml(object);
    return this.http.post('http://localhost:3000/configuration', xmlBaseConfig, httpOptions).subscribe(
      result => {
        console.log(result);
      },
      error => console.log('There was an error: ')
    );
  }
}
