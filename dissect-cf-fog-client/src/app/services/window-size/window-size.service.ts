import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WindowSizeService {
  constructor() {}

  public calculateWidthForApplicationDialog(): string {
    const width = window.innerWidth;
    if (width < 700) {
      return '95%';
    } else if (width > 700 && width < 950) {
      return '80%';
    } else {
      return '55%';
    }
  }

  public calculateWidthForStepBackDialog(): string {
    const width = window.innerWidth;
    if (width < 700) {
      return '80%';
    } else {
      return '40%';
    }
  }

  public calculateHeightForStepBackDialog(): string {
    const width = window.innerWidth;
    if (width < 600 || (width >= 600 && width < 1100)) {
      return '40%';
    } else {
      return '30%';
    }
  }
}
