export class Application {
  id: string;
  taksize: number;
  name: string;
  freq: number;
  instance: string; //shuld be select
  numOfInstruction: number;
  threshold: number;
  strategy: string; //shuld be select
  canJoin: boolean;
}

export class ApplicationsObject {
  [id: string]: Application;
}
