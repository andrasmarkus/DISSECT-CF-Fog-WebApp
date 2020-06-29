import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuantityCounterService {
  public numOfClouds: number;
  public numOfFogs: number;
  public dividedClouds: number;
  public dividedFogs: number;

  constructor() {}

  public setQuantities(nOfClouds: number, nOfFogs: number, divClouds: number, divFogs: number) {
    this.numOfClouds = nOfClouds;
    this.numOfFogs = nOfFogs;
    this.dividedClouds = divClouds;
    this.dividedFogs = divFogs;
  }

  public getUndividedClouds(): number {
    return this.numOfClouds - this.dividedClouds;
  }

  public getUndividedFogs(): number {
    return this.numOfFogs - this.dividedFogs;
  }

  public increaseClouds(): boolean {
    if (this.dividedClouds + 1 <= this.numOfClouds) {
      this.dividedClouds++;
      return true;
    }
    return false;
  }

  public increaseFogs(): boolean {
    if (this.dividedFogs + 1 <= this.numOfFogs) {
      this.dividedFogs++;
      return true;
    }
    return false;
  }

  public decreseClouds(unitNumber: number): boolean {
    if (this.dividedClouds - 1 > 0 && unitNumber > 1) {
      this.dividedClouds--;
      return true;
    }
    return false;
  }

  public decreseFogs(unitNumber: number): boolean {
    if (this.dividedFogs - 1 > 0 && unitNumber > 1) {
      this.dividedFogs--;
      return true;
    }
    return false;
  }
}
