import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { JobsService } from '../services/jobs/jobs.service';

@Component({
  selector: 'app-update-job',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './update-job.component.html',
  styleUrls: ['./update-job.component.css'],
})
export class UpdateJobComponent implements OnInit {
  updateForm!: FormGroup;
  jobId!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private jobsService: JobsService
  ) {}

  ngOnInit(): void {
    this.jobId = this.route.snapshot.params['id'];
    this.updateForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      company: [''],
      location: [''],
      employmentType: [''],
      requirements: [''],
      skills: [''],
      isActive: [true]
    });

    this.jobsService.getJobById(this.jobId).subscribe(job => {
      this.updateForm.patchValue({
        ...job,
        skills: job.skills?.join(', ')
      });
    });
  }

  onSubmit(): void {
  const formData = {
    ...this.updateForm.value,
    skills: this.updateForm.value.skills
      .split(',')
      .map((skill: string) => skill.trim())
      .filter((s: string) => s)
  };

  this.jobsService.updateJob(this.jobId, formData).subscribe({
    next: () => {
      alert('Job updated successfully');
      this.router.navigate(['/my-jobs']); // Redirect to My Jobs
    },
    error: (err: any) => {
      alert(err.error.message || 'Update failed');
      console.error(err);
    }
  });
}

}
