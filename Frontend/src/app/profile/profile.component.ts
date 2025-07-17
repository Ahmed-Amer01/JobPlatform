import { Component } from '@angular/core';
import { UserService } from '../services/user/user.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-profile',
  imports: [DatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user: any = null;
  error: string | null = null;

  constructor(private router: Router, private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    this.userService.getProfile().subscribe({
      next: (response) => {
        this.user = response.data.user;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load profile';
      }
    });
  }

  editProfile() {
    this.router.navigate(['/edit-profile']);
  }

  deleteProfile() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      this.userService.deleteProfile().subscribe({
        next: () => {
          alert('Account deleted successfully!');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          this.authService.logout();
          this.router.navigate(['/']);
        },
        error: (err) => {
          alert(err.error?.message || 'Failed to delete account');
        }
      });
    }
  }

}
