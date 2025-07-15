import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get formControls() {
    return this.loginForm.controls;
  }

  login() {
    this.submitted = true;
    this.errorMessage = '';

    if (this.loginForm.invalid) 
      return;

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        // Save token and user in localStorage
        this.authService.saveUserData(res.data.token, res.data.user);

        this.router.navigate(['/']); // Redirect to home
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Login failed. Please try again.';
      }
    });
  }
}
