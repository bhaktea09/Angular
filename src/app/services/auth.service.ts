import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject: BehaviorSubject<string | null>;
  public userToken: Observable<string | null>;
  private readonly TOKEN_KEY = 'token'; // Avoid hardcoding token key
  baseUrl = 'http://localhost:8080/api/auth';

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService
  ) {
    const storedToken = localStorage.getItem(this.TOKEN_KEY);
    this.userSubject = new BehaviorSubject<string | null>(storedToken);
    this.userToken = this.userSubject.asObservable();
  }

  login(data: { usernameOrEmail: string; password: string }): Observable<any> {
    const url = `${this.baseUrl}/login`;
    return this.httpClient.post<any>(url, data).pipe(
      map((response) => {
        this.setToken(response.accessToken);
        return response;
      })
    );
  }

  private setToken(token: string | null): void {
    if (token) {
      localStorage.setItem(this.TOKEN_KEY, token);
      this.userSubject.next(token);
    } else {
      this.clearToken();
    }
  }

  private clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.userSubject.next(null);
  }

  getUserRoles(): string[] {
    const token = this.userSubject.getValue();
    return this.decodeRoles(token);
  }

  isAuthenticated(): boolean {
    const token = this.userSubject.getValue();
    return this.isValidToken(token);
  }

  private decodeRoles(token: string | null): string[] {
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      try {
        const decodedToken = this.jwtHelper.decodeToken(token);
        return decodedToken.roles || [];
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
    return [];
  }

  private isValidToken(token: string | null): boolean {
    if (token) {
      try {
        return !this.jwtHelper.isTokenExpired(token);
      } catch (error) {
        console.error('Error checking token expiration:', error);
        return false;
      }
    }
    return false; // No token means not authenticated
  }

  logout(): void {
    this.clearToken();
    this.router.navigate(['/login']);
  }
}
