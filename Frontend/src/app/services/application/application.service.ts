import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class ApplicationService {
  private apiUrl = 'http://localhost:3000/api/applications';

  constructor(private http: HttpClient) {}

  getMyApplications(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<{ status: string; data: any[] }>(
      `${this.apiUrl}/my-applications`,
      { headers }
    ).pipe(map(res => res.data));
  }

  getApplicationsByCandidate(candidateId: string): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.get<{ status: string; data: any[] }>(
      `http://localhost:3000/api/applications/candidate/${candidateId}`, 
      { headers }
    ).pipe(map(res => res.data));
  }

  getApplicationsByJob(jobId: string): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.get<{ status: string; data: any[] }>(
      `http://localhost:3000/api/applications/job/${jobId}`,
      { headers }
    ).pipe(map(res => res.data));
  }




  submitApplication(formData: FormData): Observable<any> {
  const token = localStorage.getItem('token');

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.post(this.apiUrl, formData, { headers });}

  deleteApplication(applicationId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.delete(`${this.apiUrl}/${applicationId}`, { headers });
  }

  updateApplicationStatus(appId: string, status: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.patch(`${this.apiUrl}/${appId}/status`, { status }, { headers });
  }


}
