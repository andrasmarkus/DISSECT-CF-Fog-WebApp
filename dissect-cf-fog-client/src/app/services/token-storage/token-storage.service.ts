import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/models/user';

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

  public saveUser(user: User): void {
    localStorage.removeItem(USER_KEY);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): { accessToken: string; email: string; id: number } {
    return JSON.parse(localStorage.getItem(USER_KEY));
  }

  public getToken(): string {
    return localStorage.getItem(TOKEN_KEY);
  }
}
