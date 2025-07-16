import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { JobsService } from '../services/jobs/jobs.service';
import { JobCardComponent } from '../job-card/job-card.component';
import { Job } from '../Interfaces/job/job';

@Component({
  selector: 'app-my-jobs',
  standalone: true,
  imports: [CommonModule, JobCardComponent],
  templateUrl: './my-jobs.component.html',
  styleUrls: ['./my-jobs.component.css']
})
export class MyJobsComponent implements OnInit {
  myJobs: Job[] = [];

  constructor(
    private jobsService: JobsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.jobsService.getMyJobs().subscribe(data => {
      this.myJobs = data;
    });
  }

  updateJob(jobId: string) {
    this.router.navigate(['/my-job', jobId, 'edit']);
  }

  navigateToDetails(jobId: string) {
    this.router.navigate(['/jobs', jobId]);
  }

  viewApplications(jobId: string) {
    this.router.navigate([`/jobs/${jobId}/applications`]);
  }



  deleteJob(jobId: string) {
    if (confirm('Are you sure you want to delete this job?')) {
      this.jobsService.deleteJob(jobId).subscribe(() => {
        this.myJobs = this.myJobs.filter(job => job._id !== jobId);
        alert('Job deleted successfully');
        this.router.navigate(['/my-jobs']);
      });
    }
  }
}
