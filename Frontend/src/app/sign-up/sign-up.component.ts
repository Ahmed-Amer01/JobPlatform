import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  signupForm: FormGroup;
  submitted = false;
  selectedPhoto?: File;
  selectedResume?: File;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      dateOfBirth: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['']
    });
  }

  get f() { return this.signupForm.controls; }

  onFileChange(event: any, type: string) {
    if (type === 'photo') this.selectedPhoto = event.target.files[0];
    if (type === 'resume') this.selectedResume = event.target.files[0];
  }

  onSubmit() {
    this.submitted = true;
    if (this.signupForm.invalid) return;

    this.authService.register(this.signupForm.value, this.selectedPhoto, this.selectedResume)
      .subscribe({
        next: (res) => {
          console.log('Registered successfully:', res);
          alert('Registration successful!');
        },
        error: (err) => {
          console.error(err);
          alert(err.error.message || 'Registration failed');
        }
      });
  }
}