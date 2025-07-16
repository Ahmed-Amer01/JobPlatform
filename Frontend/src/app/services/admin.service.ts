import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<any[]> {
    return this.http
      .get<{ status: string; data: { users: any[] } }>(`${this.apiUrl}/admin/users`)
      .pipe(map(res => res.data.users));
  }
}
