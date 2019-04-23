import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders }    from '@angular/common/http';

import { Observable, of } from 'rxjs';

import { User } from './users.interface'

@Injectable({
  providedIn: 'root'
})
export class GuestService {
  private usersURL = 'users/create/';

  constructor(private http: HttpClient) {}

  createUser(user: User): Observable<any> {
    return this.http.post<any>(this.usersURL, user)
  }
}
