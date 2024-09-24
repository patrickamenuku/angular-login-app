import { Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { 
    path: '',
    redirectTo: '/signup',
    pathMatch: 'full'
  },
  { 
    path: 'signup',
    component: SignupComponent,
    title: 'Sign Up'
  },
  { 
    path: 'login',
    component: LoginComponent,
    title: 'Login'
  },
  { 
    path: 'main',
    component: MainComponent,
    canActivate: [AuthGuard],
    title: 'Home'
  },
];