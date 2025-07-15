import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../enviroment';
import {catchError, Observable, throwError } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})


export class ApplicationFormService {

  constructor(private http: HttpClient){}

  handleError(error: HttpErrorResponse){
    console.log(error.message);
    return throwError(() => error);
  }

  // First, get the user's data:
  
  private apiUrl = environment.apiUrl
  getUserData(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`, {
      withCredentials: true
    });
  }





    // Application's data:

  postApplication(formData: FormData): Observable<Application> {
    return this.http.post<Application>(`${this.apiUrl}/application`, formData, {
    withCredentials: true
  }).pipe(catchError(this.handleError));
  }


  
  
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface Application {

  _id: string;
  status: string;

}
