import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Instance,
  InstancesResponse,
  StrategysResponse as StrategiesResponse
} from 'src/app/models/server-api/server-api';

@Injectable()
export class ComputingNodeService {
  private readonly PROPERTIES_API = 'http://localhost:3000/properties';

  private readonly resources: string[] = ['LPDS_Fog_T1', 'LPDS_Fog_T2', 'LPDS_original'];

  constructor(private http: HttpClient) {}

  public sendConfiguration(): void {}

  public getResurceFiles(): string[] {
    return this.resources;
  }

  public getAppInstances(): Observable<Instance[]> {
    return this.http.get<InstancesResponse>(this.PROPERTIES_API + '/instances').pipe(
      map(instances => {
        const finalInstances: Instance[] = [];
        for (const instance of instances.instance) {
          const finalInstance = Object.assign(
            {},
            ...Object.keys(instance).map(key => ({ [this.parseInstanceKey(key)]: instance[key] }))
          ) as Instance;
          finalInstances.push(finalInstance);
        }
        return finalInstances;
      })
    );
  }

  private parseInstanceKey(key: string): string {
    if (!key.includes('-')) {
      return key;
    }
    const words = key.split('-');
    for (let i = 1; i < words.length; i++) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
    return words.join('');
  }

  public getStrategies(): Observable<string[]> {
    return this.http
      .get<StrategiesResponse>(this.PROPERTIES_API + '/strategies')
      .pipe(map(strategies => strategies.strategy));
  }
}
