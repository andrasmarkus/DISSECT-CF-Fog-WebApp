import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { isEmpty } from 'lodash';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TokenStorageService } from '../services/token-storage/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private tokenStorageService: TokenStorageService, private router: Router) {}

  public canActivate(): Observable<boolean> | Promise<boolean> {
    return this.tokenStorageService.userToken$.pipe(
      switchMap(token => {
        if (!isEmpty(token)) {
          return of(true);
        } else {
          this.router.navigate(['/login']);
          return of(false);
        }
      })
    );
  }
}
