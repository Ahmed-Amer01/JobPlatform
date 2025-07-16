import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ApplicationService } from '../services/application/application.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-application',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})
export class ApplicationComponent {
  applicationForm: FormGroup;
  jobId: string = '';
  resumeFile!: File;
  coverLetterFile?: File;
  userId: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private applicationService: ApplicationService
  ) {

    this.route.params.subscribe(params => {
      this.jobId = params['id'] || '';
    });

    // Extract user ID from local storage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userId = user?._id;

    this.applicationForm = this.fb.group({
      resume: ['', Validators.required],
      coverLetter: ['']
    });
  }

  onFileChange(event: Event, field: 'resume' | 'coverLetter') {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      field === 'resume' ? (this.resumeFile = file) : (this.coverLetterFile = file);
    }
  }

  submitApplication() {
    if (this.applicationForm.invalid || !this.resumeFile || !this.userId) {
      alert('Please complete all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('jobId', this.jobId);
    formData.append('candidateId', this.userId);
    formData.append('resume', this.resumeFile);
    if (this.coverLetterFile) {
      formData.append('coverLetter', this.coverLetterFile);
    }

    this.applicationService.submitApplication(formData).subscribe({
      next: () => {
        alert('Application submitted successfully!');
        this.router.navigate(['/jobs']);
      },
      error: (err: any) => {
        console.error('Submission error:', err);
        alert(err.error?.message || 'Failed to submit application');
      }
    });
  }
}
