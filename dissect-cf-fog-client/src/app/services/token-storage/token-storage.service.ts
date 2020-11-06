import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SignInResponse } from 'src/app/models/server-api/server-api';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  private tokenSubject = new BehaviorSubject<string>(localStorage.getItem(TOKEN_KEY));
  public userToken$ = this.tokenSubject.asObservable();

  public signOut(): void {
    localStorage.clear();
    this.tokenSubject.next(undefined);
  }

  public saveToken(token: string): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);

    this.tokenSubject.next(token);
  }

  public saveUser(user: SignInResponse): void {
    localStorage.removeItem(USER_KEY);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): SignInResponse {
    return JSON.parse(localStorage.getItem(USER_KEY));
  }

  public getToken(): string {
    return localStorage.getItem(TOKEN_KEY);
  }
}
