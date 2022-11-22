import { environment } from '../../../environments/environment';
export interface StrategysResponse {
  strategy: string[];
}

export interface InstancesResponse {
  instance: any[];
}

export interface Instance {
  name: string;
  ram: number;
  cpuCores: number;
  pricePerTick: number;
  coreProcessingPower: number;
  startupProcess: number;
  networkLoad: number;
  reqDisk: number;
}

export interface Repository {
  id: string;
  capacity: string;
  inBW: string;
  outBW: string;
  diskBW: string;
}

export interface Machine {
  id: string;
  cores: string;
  processing: string;
  memory: string;
}

export interface Resource {
  name: string;
  machines: Machine[];
  repositories: Repository[];
}

export interface UserConfigurationDetails {
  directory: string;
  time: string;
  clouds: number;
  fogs: number;
  devices: number;
}

export interface ConfigurationResult {
  configuration_id: any;
  directory: string;
  html: string[];
  data: string;
  err: string;
  job: any;
  jobs: any;
}

export interface SimulationResult {
  _id: any;
  user: any;
  time: any;
  jobs: any;
}

export type ConfigurationFile = 'timeline' | 'devicesenergy' | 'nodesenergy' | 'appliances' | 'devices' | 'instances';

export interface SignInResponse {
  id: string;
  email: string;
  accessToken: string;
}

export interface SignUpResponse {
  message: string;
}

export const SERVER_URL = environment.SERVER_URL;
