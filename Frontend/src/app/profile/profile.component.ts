import { Component } from '@angular/core';
import { UserService } from '../services/user/user.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [DatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user: any = null;
  error: string | null = null;

  constructor(private userService: UserService) {}

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
    // Navigate to edit form page or open modal
    console.log('Edit button clicked');
  }

  deleteProfile() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Call API to delete user
      console.log('Delete confirmed');
    }
  }

}
