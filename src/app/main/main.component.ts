import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-100 p-8">
      <h1 class="text-3xl font-bold mb-4">Welcome to the Main Page</h1>
      <p class="text-xl mb-4">You have successfully logged in!</p>
      <div class="mb-4">
        <p><strong>First Name:</strong> {{ userData?.firstName }}</p>
        <p><strong>Last Name:</strong> {{ userData?.lastName }}</p>
        <p><strong>Email:</strong> {{ userData?.email }}</p>
      </div>
      <div class="mb-4">
        <p><strong>Token Expiration (Original):</strong> {{ tokenExp }}</p>
        <p><strong>Token Expiration (Seconds):</strong> {{ tokenExpSeconds }}</p>
        <p><strong>Token Expiration (Minutes):</strong> {{ tokenExpMinutes }}</p>
      </div>
      <div class="w-1/2">
        <img src="/assets/login.png" alt="Login" class="object-cover w-full h-full">
      </div>
    </div>
  `,
})
export class MainComponent implements OnInit {
  userData: any;
  tokenExp: number | null = null;
  tokenExpSeconds: number | null = null;
  tokenExpMinutes: number | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.userData = this.authService.getUserData();
    if (!this.userData) {
      this.router.navigate(['/login']);
      return;
    }

    const token = this.authService.getToken();
    if (token) {
      const decodedToken = jwtDecode(token);
      this.tokenExp = decodedToken.exp as number;
      this.tokenExpSeconds = this.tokenExp ? Math.floor((this.tokenExp * 1000 - Date.now()) / 1000) : null;
      this. tokenExpMinutes = this.tokenExpSeconds ? Math.floor(this.tokenExpSeconds / 60) : null;
    }
  }
}