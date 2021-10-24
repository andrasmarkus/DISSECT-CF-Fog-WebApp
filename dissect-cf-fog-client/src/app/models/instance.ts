export class Instance {
    id: string;
    name: string;
    ram: number;
    cpuCores: number;
    cpuProcessingPower: number;
    startupProcess: number;
    networkLoad: number;
    reqDisk: number;
    pricePerTick: number;
    quantity: number;
    valid = false;
  }
  
  export class InstanceObject {
    [id: string]: Instance;
  }
  