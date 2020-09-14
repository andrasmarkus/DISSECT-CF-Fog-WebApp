import { Application, ApplicationsObject } from './application';

export class ComputingNode {
  id: string;
  x: number;
  y: number;
  resource: string; //should be an interface from server
  applications: ApplicationsObject;
  isCloud: boolean;
  isConfigured: boolean;
  quantity?: number;
}
