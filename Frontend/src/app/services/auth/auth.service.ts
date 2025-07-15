import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth'; // backend base URL

  constructor(private http: HttpClient) {}

  // Register user
  register(userData: any, photo?: File, resume?: File): Observable<any> {
    const formData = new FormData();
    formData.append('firstName', userData.firstName);
    formData.append('lastName', userData.lastName);
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    formData.append('dateOfBirth', userData.dateOfBirth);
    formData.append('phone', userData.phone);
    formData.append('address', userData.address || '');

    if (photo) formData.append('photo', photo);
    if (resume) formData.append('resume', resume);

    return this.http.post(`${this.apiUrl}/register`, formData);
  }

  // Login user
  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }
}