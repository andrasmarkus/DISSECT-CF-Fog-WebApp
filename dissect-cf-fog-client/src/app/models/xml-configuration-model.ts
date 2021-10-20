export interface XmlBaseConfiguration {
  configuration: {
    email: string;
    tzOffsetInSec?: number;
    appliances: AppliancesContainerXml;
    devices: StationContainerXml;
  };
}

export interface AppliancesContainerXml {
  appliances: {
    appliance: ApplianceXml[];
  };
}

export interface StationContainerXml {
  devices: {
    device: DeviceXml[];
  };
}

export interface InstanceContainerXml {
  instances: {
    instance : InstanceXml[];
  };
}

export interface ApplianceXml {
  $name: string;
  latitude: number;
  longitude: number;
  range: number;
  file: string;
  applications: { application: ApplicationXml[] };
  neighbours: { neighbour?: NeighbourXml[] };
}

export interface ApplicationXml {
  $name: string;
  freq: number;
  tasksize: number;
  instance: string;
  countOfInstruction: number;
  thresload: number;
  strategy: string;
  canJoin: boolean;
}

export interface NeighbourXml {
  $name: string;
  latency: number;
  parent?: boolean;
}

export interface DeviceXml {
  $name: string;
  starttime: number;
  stoptime: number;
  filesize: number;
  sensorCount: number;
  strategy: string;
  freq: number;
  latitude: number;
  longitude: number;
  speed: number;
  radius: number;
  latency: number;
  capacity: number;
  maxinbw: number;
  maxoutbw: number;
  diskbw: number;
  cores: number;
  perCorePocessing: number;
  ram: number;
  ond: number;
  offd: number;
  minpower: number;
  idlepower: number;
  maxpower: number;
}

export interface InstanceXml {
  $name: string;
  ram: number;
  cpucores: number;
  coreprocessingpower: number;
  startupprocess: number;
  networkload: number;
  reqdisk: number;
  pricepertick: number;
}
