import { Injectable } from '@angular/core';
import { ComputingNodesQuantityData } from 'src/app/models/computing-nodes-quantity-data';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  public maxNumOfNodes = 10;

  public nodesQuantity$ = new BehaviorSubject<ComputingNodesQuantityData>(undefined);

  constructor() {}

  public setNodesQuantity(quantity: ComputingNodesQuantityData) {
    this.nodesQuantity$.next(quantity);
  }
}
