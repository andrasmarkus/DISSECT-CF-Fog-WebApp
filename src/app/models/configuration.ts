import { ComputingNode } from './computing-node';
import { StationsObject } from './station';
import { ConfiguredComputingNodesObject } from './computing-nodes-object';

export interface ConfigurationObject {
  nodes: ConfiguredComputingNodesObject;
  stations: StationsObject;
}

export interface ConfiguredComputingNode extends ComputingNode {
  neighbours?: NeighboursObject;
}

export interface NeighboursObject {
  [nodeId: string]: Neighbour;
}

export interface Neighbour {
  name: string;
  latency: number;
  parent?: boolean;
}
