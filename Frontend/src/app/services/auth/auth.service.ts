import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth'; // backend base URL
  private authStatus = new BehaviorSubject<boolean>(this.isLoggedIn());
  private roleStatus = new BehaviorSubject<string | null>(this.getRole());

  authStatus$ = this.authStatus.asObservable();
  roleStatus$ = this.roleStatus.asObservable();

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

  // Save token and user info
  saveUserData(token: string, user: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authStatus.next(true);
    this.roleStatus.next(user.role);
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return Boolean(localStorage.getItem('token'));
  }

  // Get current role
  getRole(): string | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).role : null;
  }

  // Logout
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.authStatus.next(false);
    this.roleStatus.next(null);
  }
}