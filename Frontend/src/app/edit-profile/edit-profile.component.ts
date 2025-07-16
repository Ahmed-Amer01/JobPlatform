import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../services/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent {
  editForm: FormGroup;
  photoFile?: File;
  resumeFile?: File;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.editForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      dateOfBirth: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Load current user data
    this.userService.getProfile().subscribe({
      next: (res) => {
        const user = res.data.user;
        this.editForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          address: user.address,
          dateOfBirth: user.dateOfBirth.split('T')[0] // ISO date format
        });
      },
      error: (err) => console.error(err)
    });
  }

  onFileChange(event: any, type: string) {
    if (type === 'photo') 
      this.photoFile = event.target.files[0];
    if (type === 'resume') 
      this.resumeFile = event.target.files[0];
  }

  onSubmit() {
    if (this.editForm.valid) {
      this.userService.updateProfile(this.editForm.value, this.photoFile, this.resumeFile).subscribe({
        next: () => {
          alert('Profile updated successfully!');
          this.router.navigate(['/profile']);
        },
        error: (err) => {
          alert(err.error?.message || 'Update failed');
        }
      });
    }
  }
}
