import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidationErrors,
  ValidatorFn,
  ReactiveFormsModule,
  AbstractControl
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User } from '../user';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

export const passwordMatchValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ 'passwordMismatch': true });
      return { 'passwordMismatch': true };
    } else {
      return null;
    }
  };
};

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="flex items-center justify-center min-h-screen p-4">
      <div class="flex w-full max-w-4xl bg-[#f1f8f8] rounded-lg shadow-lg overflow-hidden">
        <div class="w-1/2 p-8">
          <h2 class="text-2xl font-bold mb-6">Sign Up</h2>
          <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
            <div class="mb-4">
              <label for="firstName" class="block text-m font-medium text-gray-700">First Name</label>
              <input type="text" id="firstName" formControlName="firstName" class="mt-1 block w-full py-2 rounded-md px-2 border-gray-300 border-2 outline-none shadow-sm focus:border-indigo-500">
              @if (signupForm.get('firstName')?.invalid && signupForm.get('firstName')?.touched || signupForm.get('firstName')?.dirty) {
                @if (signupForm.get('firstName')?.errors?.["required"]) {
                  <p class="mt-1 text-sm text-red-600">First name is required</p>
                }
                @if (signupForm.get('firstName')?.errors?.["minlength"]) {
                  <p class="mt-1 text-sm text-red-600">First name must not be less than 3 characters</p>
                }
              }
            </div>
            <div class="mb-4">
              <label for="lastName" class="block text-m font-medium text-gray-700">Last Name</label>
              <input type="text" id="lastName" formControlName="lastName" class="mt-1 block w-full rounded-md px-2 py-2 border-2 border-gray-300 outline-none shadow-sm focus:border-indigo-500">
              @if (signupForm.get('lastName')?.invalid && signupForm.get('lastName')?.touched || signupForm.get('lastName')?.dirty) {
                @if (signupForm.get('lastName')?.errors?.["required"]) {
                  <p class="mt-1 text-sm text-red-600">Last name is required</p>
                }
                @if (signupForm.get('lastName')?.errors?.["minlength"]) {
                  <p class="mt-1 text-sm text-red-600">Last name must not be less than 3 characters</p>
                }
              }
            </div>
            <div class="mb-4">
              <label for="email" class="block text-m font-medium text-gray-700">Email</label>
              <input type="email" id="email" formControlName="email" class="mt-1 block w-full rounded-md px-2 py-2 border-2 border-gray-300 outline-none shadow-sm focus:border-indigo-500">
              @if (signupForm.get('email')?.invalid && signupForm.get('email')?.touched || signupForm.get('email')?.dirty) {
                @if (signupForm.get('email')?.errors?.["required"]) {
                  <p class="mt-1 text-sm text-red-600">Email is required</p>
                }
                @if (signupForm.get('email')?.errors?.["email"]) {
                  <p class="mt-1 text-sm text-red-600">Invalid email format</p>
                }
              }
            </div>
            <div class="mb-4">
              <label for="password" class="block text-m font-medium text-gray-700">Password</label>
              <input type="password" id="password" formControlName="password" class="mt-1 block w-full rounded-md px-2 py-2 border-2 border-gray-300 outline-none shadow-sm focus:border-indigo-500">
              @if (signupForm.get('password')?.invalid && signupForm.get('password')?.touched || signupForm.get('password')?.dirty) {
                @if (signupForm.get('password')?.errors?.['required']) {
                  <p class="mt-1 text-sm text-red-600">Password is required</p>
                }
                @if (signupForm.get('password')?.errors?.['minlength']) {
                  <p class="mt-1 text-sm text-red-600">Password is less than 8 characters</p>
                }
              }
            </div>
            <div class="mb-6">
              <label for="confirmPassword" class="block text-m font-medium text-gray-700">
                Confirm Password
              </label>
              <input type="password" id="confirmPassword" formControlName="confirmPassword" class="mt-1 block px-2 py-2 border-2 w-full rounded-md outline-none border-gray-300 shadow-sm focus:border-indigo-500">
              @if (signupForm.get('confirmPassword')?.invalid && signupForm.get('confirmPassword')?.touched || signupForm.get('confirmPassword')?.dirty) {
                @if (signupForm.get('confirmPassword')?.errors?.['required']) {
                  <p class="mt-1 text-sm text-red-600">Confirm password is required</p>
                }
                @if (signupForm.errors?.['passwordMismatch']) {
                  <p class="mt-1 text-sm text-red-600">Passwords do not match</p>
                }
              }
            </div>
            <button type="submit" [disabled]="signupForm.invalid" class="m-4 p-0.5 rounded-md from-indigo-400 via-pink-500 to-purple-500 bg-gradient-to-r">
              <span class="block text-black px-[100px] py-2 font-semibold rounded-md bg-white hover:bg-transparent hover:text-white text-nowrap transition">Sign Up</span>
            </button>
          </form>
          <p class="mt-4 text-center text-sm text-gray-600">
            Already have an account? <a routerLink="/login" class="font-medium text-indigo-600 hover:text-indigo-500">Log in</a>
          </p>
        </div>
        <div class="w-1/2">
          <img src="signup1.png" alt="Signup" class="ml-[5px] object-cover max-w-[440px] max-h-[665px] w-full h-full mt-[5px]">
        </div>
      </div>
    </div>
  `,
})
export class SignupComponent {
  signupForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.signupForm = this.fb.group({
      firstName: ['', {validators: [Validators.required, Validators.minLength(3)]}],
      lastName: ['', {validators: [Validators.required, Validators.minLength(3)]}],
      email: ['', {validators: [Validators.required, Validators.email]}],
      password: ['', {validators: [Validators.required, Validators.minLength(8)]}],
      confirmPassword: ['', {validators: [Validators.required]}],
    }, { validators: passwordMatchValidator() });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const user: User = {
        firstName: this.signupForm.value.firstName,
        lastName: this.signupForm.value.lastName,
        email: this.signupForm.value.email,
        password: this.signupForm.value.password,
      };
      this.authService.signup(user).subscribe({
        next: (response) => {
          console.log('User signed up:', response);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Signup error:', error);
          // Handle error (e.g., show error message to user)
        }
      });
    }
  }
}