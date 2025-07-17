// job-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobCardComponent } from '../job-card/job-card.component';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JobsService } from '../services/jobs/jobs.service';
import { Job } from '../Interfaces/job/job';
import { retry } from 'rxjs';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, RouterModule, JobCardComponent, FormsModule],
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css']
})
export class JobListComponent {
  jobs: Job[] = [];
  currentUserId: string = '';

  constructor(private jobsService: JobsService, private router: Router) {}

  

  ngOnInit() {
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUserId = JSON.parse(user)._id; // assuming backend returns _id
    }

    this.jobsService.getAllJobs().subscribe((data) => {
      this.jobs = data;
      console.log(data)
    });
  }

  searchParams = {
  title: '',
  company: '',
  location: ''
};

searchJobs(): void {
  this.jobsService.searchJobs(this.searchParams).subscribe(data => {
    this.jobs = data;
  });
}

compareIds(postedBy: any): boolean {
  return postedBy && postedBy._id === this.currentUserId;
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
        this.jobs = this.jobs.filter(job => job._id !== jobId);
        alert('Job deleted successfully');
        this.router.navigate(['/my-jobs']);
      });
    }
  }

}
