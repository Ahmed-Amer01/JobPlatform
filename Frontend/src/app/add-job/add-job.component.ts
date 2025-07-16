import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { JobsService } from '../services/jobs/jobs.service';

@Component({
  selector: 'app-add-job',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-job.component.html',
  styleUrls: ['./add-job.component.css']
})
export class AddJobComponent implements OnInit {
  jobForm: FormGroup;
  isUpdate = false;
  jobId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private jobsService: JobsService,
    private router: Router,
    private route: ActivatedRoute
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

  ngOnInit(): void {
    this.jobId = this.route.snapshot.paramMap.get('jobId');

    if (this.jobId) {
      this.isUpdate = true;
      this.jobsService.getJobById(this.jobId).subscribe(job => {
        this.jobForm.patchValue({
          ...job,
          skills: job.skills?.join(', ')
        });
      });
    }
  }

  submitJob() {
    if (this.jobForm.invalid) return;

    const formValue = this.jobForm.value;
    const jobData = {
      ...formValue,
      skills: formValue.skills.split(',').map((s: string) => s.trim()),
      postedBy: JSON.parse(localStorage.getItem('user')!)._id
    };

    if (this.isUpdate && this.jobId) {
      this.jobsService.updateJob(this.jobId, jobData).subscribe({
        next: () => this.router.navigate(['/my-jobs']),
        error: err => console.error('Failed to update job', err)
      });
    } else {
      this.jobsService.postJob(jobData).subscribe({
        next: () => this.router.navigate(['/my-jobs']),
        error: err => console.error('Failed to post job', err)
      });
    }
  }
}
