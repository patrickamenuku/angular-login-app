import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="flex items-center justify-center min-h-screen p-4">
      <div class="flex w-full max-w-4xl bg-[#fefcfc] rounded-lg shadow-lg overflow-hidden">
        <div class="w-1/2 p-8">
          <h2 class="text-2xl font-bold mb-6">Log In</h2>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="mb-4">
              <label for="email" class="block text-m font-medium text-gray-700">Email</label>
              <input type="email" id="email" formControlName="email" class="mt-4 block w-full rounded-md px-2 py-2 border-2 outline-none border-gray-300 mb-[10px] shadow-sm focus:border-indigo-500">
              @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
                <p class="mt-[-8px] text-sm mb-2 text-red-600">Valid email is required</p>
              }
            </div>
            <div class="mb-6">
              <label for="password" class="block text-m font-medium text-gray-700">Password</label>
              <input type="password" id="password" formControlName="password" class="mt-4 block w-full px-2 py-2 rounded-md border-2 outline-none border-gray-300 shadow-sm focus:border-indigo-500 ">
              @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
                <p class="mt-1 text-sm text-red-600">Password is required</p>
              }
            </div>
            <button class="m-4 p-0.5 rounded-full from-indigo-500 via-pink-500 to-purple-500 bg-gradient-to-r">
              <span class="block px-[100px] py-2 font-semibold rounded-full text-white transition hover:backdrop-brightness-110">Login</span>
            </button>
          </form>
          <p class="mt-4 text-center text-sm text-gray-600">
            Don't have an account? <a routerLink="/signup" class="font-medium text-indigo-600 hover:text-indigo-500">Sign up</a>
          </p>
        </div>
        <div class="w-1/2">
          <img src="/assets/login.png" alt="Login" class="object-cover w-full h-full">
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('User logged in:', response);
          this.authService.setUserData(response.user);
          this.authService.setToken(response.token);
          
          const decodedToken = jwtDecode(response.token);
          const expirationTime = decodedToken.exp as number * 1000;
          const timeUntilExpiration = expirationTime - Date.now();
          const timeInSeconds = decodedToken.exp ? Math.floor((decodedToken.exp * 1000 - Date.now()) / 1000) : 0;
          console.log('expiration time: ', expirationTime, ' time until expiration: ', timeUntilExpiration, ' time in seconds', timeInSeconds)
          
          setTimeout(() => {
            this.authService.logout();
            this.router.navigate(['/signup']);
          }, Math.min(timeUntilExpiration, timeInSeconds));
          
          this.router.navigate(['/main']);
        },
        error: (error) => {
          console.error('Login error:', error);
          // Handle error (e.g., show error message to user)
        }
      });
    }
  }
}