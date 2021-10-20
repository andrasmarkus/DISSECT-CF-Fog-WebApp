export class Station {
  id: string;
  starttime: number;
  stoptime: number;
  filesize: number;
  freq: number;
  sensorCount: number;
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
  reposize: number;
  strategy: string;
  number: number;
  xCoord?: number;
  yCoord?: number;
  quantity: number;
  valid = false;
  focusedInputName?: string;
}

export class StationsObject {
  [id: string]: Station;
}
