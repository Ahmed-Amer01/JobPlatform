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

  updateProfile(data: any, photo?: File, resume?: File): Observable<any> {
    const formData = new FormData();
    Object.keys(data).forEach(field => {
      if (data[field]) formData.append(field, data[field]);
    });
    if (photo) formData.append('photo', photo);
    if (resume) formData.append('resume', resume);

    return this.http.patch(`${this.apiUrl}/profile`, formData, { headers: this.headers });
  }

  deleteProfile(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/profile`, { headers: this.headers });
  }
}
