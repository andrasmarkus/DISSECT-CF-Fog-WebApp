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
  reposize: number;
  strategy: string;
  number: number;
  radius: number;
  xCoord?: number;
  yCoord?: number;
  quantity: number;
  valid = false;
  focusedInputName?: string;
}

export class StationsObject {
  [id: string]: Station;
}
