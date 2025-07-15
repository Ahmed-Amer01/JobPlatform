import { Component } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isLoggedIn = false;
  role: string | null = null;

  guestLinks = [
    { label: 'Home', route: '/' },
    { label: 'Sign Up', route: '/sign-up' },
    { label: 'Login', route: '/login' }
  ];

  userLinks = [
    { label: 'Home', route: '/' },
    { label: 'Profile', route: '/profile' }
  ];

  adminLinks = [
    { label: 'profile', route: '/profile' }
  ];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.authStatus$.subscribe(status => this.isLoggedIn = status);
    this.authService.roleStatus$.subscribe(role => this.role = role);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
