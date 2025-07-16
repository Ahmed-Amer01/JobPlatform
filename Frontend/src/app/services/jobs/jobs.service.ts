import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Job } from '../../Interfaces/job/job';

@Injectable({
  providedIn: 'root'
})
export class JobsService {

  private apiUrl = 'http://localhost:3000/api'; 

  constructor(private http: HttpClient) {}


  postJob(jobData: any): Observable<any> {
  const token = localStorage.getItem('token');

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.post<{ status: string; data: Job }>(
    `${this.apiUrl}/jobs`,
    jobData,
    { headers }
  );
}



  getAllJobs(): Observable<Job[]> {
    return this.http.get<{ status: string; data: Job[] }>(`${this.apiUrl}/jobs`).pipe(map(res => res.data));
  }
  

  getJobById(id: string): Observable<Job> {
    return this.http
      .get<{ status: string; data: Job }>(`${this.apiUrl}/jobs/${id}`)
      .pipe(map(res => res.data));
  }


  getMyJobs(): Observable<Job[]> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

  return this.http.get<{ status: string; data: Job[] }>(`${this.apiUrl}/jobs/my-jobs`, { headers }).pipe(map(res => res.data));

}



  updateJob(id: string, jobData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

  return this.http.patch(`${this.apiUrl}/jobs/${id}`, jobData, { headers });
}


  deleteJob(jobId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.delete<{ status: string; message: string }>(
      `${this.apiUrl}/jobs/${jobId}`,
      { headers }
    );
  }

  getJobApplications(jobId: string): Observable<{ title: string, applications: any[] }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.get<{ status: string; data: { title: string, applications: any[] } }>(
      `${this.apiUrl}/jobs/${jobId}/applications`, { headers }
    ).pipe(map(res => res.data));
  }





  searchJobs(params: { title?: string; company?: string; location?: string }): Observable<Job[]> {
    let httpParams = new HttpParams();
    if (params.title) httpParams = httpParams.set('title', params.title);
    if (params.company) httpParams = httpParams.set('company', params.company);
    if (params.location) httpParams = httpParams.set('location', params.location);

    return this.http.get<{ status: string; data: Job[] }>(`${this.apiUrl}/jobs/search`, { params: httpParams })
      .pipe(map(res => res.data));
  }
}
