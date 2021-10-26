import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay, switchMapTo } from 'rxjs/operators';
import {
  Instance,
  InstancesResponse,
  Resource,
  SERVER_URL,
  StrategysResponse as StrategiesResponse
} from 'src/app/models/server-api/server-api';
import { ConfigurationStateService } from '../configuration-state/configuration-state.service';

/**
 * API calls for selections.
 */
@Injectable()
export class ResourceSelectionService {
  private readonly PROPERTIES_API = SERVER_URL + 'properties';

  public instances$: Observable<Instance[]>;
  public strategiesForApplications$: Observable<string[]>;
  public strategiesForDevices$: Observable<string[]>;
  public resources$: Observable<Resource[]>;
  private refreshAPIcalls$ = new BehaviorSubject<void>(undefined);

  constructor(
    private http: HttpClient,
    private configurationStateService: ConfigurationStateService
    ) {
    this.refreshResources();
    this.instances$ = this.refreshAPIcalls$.pipe(switchMapTo(this.getAppInstances()), shareReplay(1));
    this.strategiesForApplications$ = this.refreshAPIcalls$.pipe(
      switchMapTo(this.getStrategiesForApplications()),
      shareReplay(1)
    );
    this.strategiesForDevices$ = this.refreshAPIcalls$.pipe(
      switchMapTo(this.getStrategiesForDevices()),
      shareReplay(1)
    );
    this.resources$ = this.refreshAPIcalls$.pipe(switchMapTo(this.getResurceFiles()), shareReplay(1));
  }

  public refreshResources() {
    this.refreshAPIcalls$.next();
  }

  public getResurceFiles(): Observable<Resource[]> {
    return this.http.get<Resource[]>(this.PROPERTIES_API + '/resources');
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

        Object.values(this.configurationStateService.instanceNodes).forEach( instance => {
          if(instance.valid && instance.name && instance.name.length > 0) {
            finalInstances.push(Object.assign(instance) as Instance)
          }
        })

        return finalInstances;
      })
    );
  }

  /**
   * This method transform the given property key. If the key contains '-' character,
   * it will be removed and after this, the next caracter will be upper case.
   * @param key - a property name
   */
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

  public getStrategiesForApplications(): Observable<string[]> {
    return this.http
      .get<StrategiesResponse>(this.PROPERTIES_API + '/strategies/application')
      .pipe(map(strategies => strategies.strategy));
  }

  public getStrategiesForDevices(): Observable<string[]> {
    return this.http
      .get<StrategiesResponse>(this.PROPERTIES_API + '/strategies/device')
      .pipe(map(strategies => strategies.strategy));
  }
}
