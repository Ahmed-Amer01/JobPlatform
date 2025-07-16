import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  private token = localStorage.getItem('token');
  private headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}`
  });

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`, {headers: this.headers });
  }
}
