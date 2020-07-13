import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComputingNodeService {
  private readonly resources: string[] = ['LPDS_Fog_T1', 'LPDS_Fog_T2', 'LPDS_original'];

  constructor() {}

  public getResurceFiles(): string[] {
    return this.resources;
  }
}
