import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestartConfigurationService {
  public restartConfigurationSubject: Subject<any> = new Subject();
  public restartConfiguration$ = this.restartConfigurationSubject.asObservable();

  constructor() {}
}
