export class Station {
  id: string;
  starttime: number;
  stoptime: number;
  filesize: number;
  freq: number;
  sensor: number;
  maxinbw: number;
  maxoutbw: number;
  diskbw: number;

  strategy: string; //should be select
  number: number;
  radius: number;
  xCoord?: number;
  yCoord?: number;
  quantity: number;
  valid = false;
}

export class StationsObject {
  [id: string]: Station;
}
