import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestartConfigurationService {
  public restartConfiguration$ = new BehaviorSubject(false);
  constructor() {}
}
