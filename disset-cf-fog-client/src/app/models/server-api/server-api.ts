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
