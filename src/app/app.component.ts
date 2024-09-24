import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  providers: [AuthService],
  template: `
    <div class="min-h-screen from-indigo-400 via-pink-500 to-purple-500 bg-gradient-to-r">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AppComponent {}