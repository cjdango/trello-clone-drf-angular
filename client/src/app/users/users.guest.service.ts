import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders }    from '@angular/common/http';

import { Observable, of } from 'rxjs';

import { User } from './users.interface'

@Injectable({
  providedIn: 'root'
})
export class GuestService {
  private usersURL = 'users';

  constructor(private http: HttpClient) {}

  login(creds: {email: string, password: string}): Observable<any>  {
    const url = `${this.usersURL}/login/`
    return this.http.post<any>(url, creds)
  }

  createUser(user: User): Observable<any> {
    const url = `${this.usersURL}/create/`
    return this.http.post<any>(url, user)
  }

  requestPasswordReset(payload: {email: string}): Observable<any> {
    const url = `${this.usersURL}/password_reset/`
    return this.http.post<any>(url, payload)
  }
}
