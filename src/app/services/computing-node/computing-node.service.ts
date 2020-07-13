import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComputingNodeService {
  private readonly resources: string[] = ['LPDS_Fog_T1', 'LPDS_Fog_T2', 'LPDS_original'];
  private readonly instances: string[] = ['a1.large', 'a1.xlarge', 'a2.xlarge'];
  private readonly strategys: string[] = ['random', 'distance'];

  constructor() {}

  public getResurceFiles(): string[] {
    return this.resources;
  }

  public getAppInstances(): string[] {
    return this.instances;
  }

  public getAppStrategys(): string[] {
    return this.strategys;
  }
}
