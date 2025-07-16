import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobsService } from '../services/jobs/jobs.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-job-applications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-applications.component.html',
  styleUrls: ['./job-applications.component.css']
})
export class JobApplicationsComponent implements OnInit {
  jobId!: string;
  applications: any[] = [];
  jobTitle: string = '';

  constructor(private route: ActivatedRoute, private jobsService: JobsService) {}

  ngOnInit(): void {
    this.jobId = this.route.snapshot.params['id'];
    this.jobsService.getJobApplications(this.jobId).subscribe({
      next: res => {
        this.applications = res.applications;
        this.jobTitle = res.title;
      },
      error: err => {
        console.error('Failed to load applications', err);
      }
    });
  }
}
