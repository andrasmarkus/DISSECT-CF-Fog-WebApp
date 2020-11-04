import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatSpinner } from '@angular/material/progress-spinner';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private spinnerRef: OverlayRef = this.cdkSpinnerCreate();

  constructor(private overlay: Overlay) {}

  private cdkSpinnerCreate() {
    return this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'dark-backdrop',
      positionStrategy: this.overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically()
    });
  }

  public showSpinner() {
    this.spinnerRef.attach(new ComponentPortal(MatSpinner));
  }

  public stopSpinner() {
    this.spinnerRef.detach();
  }
}
