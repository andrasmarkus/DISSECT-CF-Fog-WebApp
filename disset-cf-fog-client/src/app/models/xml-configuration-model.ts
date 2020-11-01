export interface XmlBaseConfiguration {
  configuration: {
    email: string;
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

export interface ApplianceXml {
  name: string;
  xcoord: number;
  ycoord: number;
  file: string;
  applications: { application: ApplicationXml[] };
  neighbours: { neighbour?: NeighbourXml[] };
}

export interface ApplicationXml {
  $tasksize: number;
  name: string;
  freq: number;
  instance: string;
  numOfInstruction: number;
  threshold: number;
  strategy: string;
  canJoin: boolean;
}

export interface NeighbourXml {
  name: string;
  latency: number;
  parent?: boolean;
}

export interface DeviceXml {
  $starttime: number;
  $stoptime: number;
  $number: number;
  $filesize: number;
  name: string;
  freq: number;
  sensor: number;
  maxinbw: number;
  maxoutbw: number;
  diskbw: number;
  reposize: number;
  strategy: string;
  xCoord: number;
  yCoord: number;
}
