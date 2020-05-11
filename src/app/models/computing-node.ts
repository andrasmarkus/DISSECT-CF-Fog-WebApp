import { Application, ApplicationsObject } from './application';

export interface ComputingNode {
  id: string;
  x: number;
  y: number;
  lpdsType: string; //should be an interface from server
  applications: ApplicationsObject;
  isCloud: boolean;
  isConfigured: boolean;
}
