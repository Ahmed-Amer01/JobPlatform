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

  links = [
    { label: 'Home', route: '/', roles: ['guest', 'user', 'admin'] },
    { label: 'Sign Up', route: '/sign-up', roles: ['guest'] },
    { label: 'Login', route: '/login', roles: ['guest'] },
    { label: 'Profile', route: '/profile', roles: ['user', 'admin'] },
    { label: 'All Jobs', route: '/jobs', roles: ['user', 'admin'] },
    { label: 'Admin Dashboard', route: '/admin', roles: ['admin'] }
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
