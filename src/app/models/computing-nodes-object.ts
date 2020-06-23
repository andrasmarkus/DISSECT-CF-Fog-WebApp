import { ComputingNode } from './computing-node';
import { ConfiguredComputingNode } from './configuration';

export interface ComputingNodesObject {
  [nodeId: string]: ComputingNode;
}

export interface ConfiguredComputingNodesObject {
  [nodeId: string]: ConfiguredComputingNode;
}
