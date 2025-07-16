import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { JobsService } from '../jobs.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-job',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-job.component.html',
  styleUrls: ['./add-job.component.css']

})
export class AddJobComponent {
  jobForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private jobsService: JobsService,
    private router: Router
  ) {
    this.jobForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      company: ['', [Validators.required, Validators.maxLength(100)]],
      location: ['', Validators.maxLength(100)],
      employmentType: ['full-time', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(10000)]],
      requirements: ['', [Validators.required, Validators.maxLength(10000)]],
      skills: ['', [Validators.required]]
    });

  }

  submitJob() {
    if (this.jobForm.invalid) 
      return;

    const formValue = this.jobForm.value;

    const jobData = {
      ...formValue,
      skills: formValue.skills.split(',').map((s: string) => s.trim()),
      postedBy: JSON.parse(localStorage.getItem('user')!)._id
    };

    this.jobsService.postJob(jobData).subscribe({
      next: () => this.router.navigate(['/jobs']),
      error: err => console.error('Failed to post job', err)
    });
  }
}
