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
