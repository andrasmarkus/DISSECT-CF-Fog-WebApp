export class Application {
  id: string;
  taksize: number;
  freq: number;
  instance: string; //shuld be select
  numOfInstruction: number;
  threshold: number;
  strategy: string; //shuld be select
  canJoin: boolean;
  quantity: number;
  isConfigured: boolean;
}

export class ApplicationsObject {
  [id: string]: Application;
}
