import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://user-auth-server.onrender.com/api/v1/user';
  private userData: any = null;
  private token: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  signup(user: User): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/signup`, user, { headers }).pipe(
      catchError(this.handleError),
      tap((response) => {
        console.log('Signup response:', response);
      })
    );
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/login`, credentials, { headers }).pipe(
      catchError(this.handleError),
      tap((response: any) => {
        if (response && response.token) {
          this.setToken(response.token);
          this.setUserData(response.user);
        }
      })
    );
  }

  setUserData(data: any) {
    this.userData = data;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('userData', JSON.stringify(data));
    }
  }

  getUserData() {
    if (!this.userData) {
      const storedData = localStorage.getItem('userData');
      if (storedData) {
        this.userData = JSON.parse(storedData);
      }
    }
    return this.userData;
  }

  setToken(token: string) {
    this.token = token;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  getToken(): string | null {
    if (!this.token && typeof localStorage !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  logout() {
    this.userData = null;
    this.token = null;
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('userData');
      localStorage.removeItem('token');
    }
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong. Please try again later.'));
  }
}