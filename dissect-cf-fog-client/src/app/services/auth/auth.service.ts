import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';

const AUTH_API = 'http://localhost:3000/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  public login(credentials: User): Observable<any> {
    //set return value
    return this.http.post(
      AUTH_API + 'signin',
      {
        email: credentials.email,
        password: credentials.password
      },
      httpOptions
    );
  }

  public register(user: User): Observable<any> {
    //set return value
    return this.http.post(
      AUTH_API + 'signup',
      {
        email: user.email,
        password: user.password
      },
      httpOptions
    );
  }
}
