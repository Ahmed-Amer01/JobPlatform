import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobsService } from '../services/jobs/jobs.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ApplicationService } from '../services/application/application.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-job-applications',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './job-applications.component.html',
  styleUrls: ['./job-applications.component.css']
})
export class JobApplicationsComponent implements OnInit {
  jobId!: string;
  applications: any[] = [];
  jobTitle: string = '';
  statuses: string[] = ['applied', 'under_review', 'interviewed', 'hired', 'rejected'];

  constructor(private route: ActivatedRoute, private jobsService: JobsService, private applicationService: ApplicationService) {}

  ngOnInit(): void {
    this.jobId = this.route.snapshot.params['id'];
    this.jobsService.getJobApplications(this.jobId).subscribe({
      next: res => {
        this.applications = res.applications;
        this.jobTitle = res.title;
        this.applications.forEach(app => (app.newStatus = ''));
      },
      error: err => {
        console.error('Failed to load applications', err);
      }
    });
  }

  updateStatus(app: any): void {
    if (!app.newStatus) {
      alert('Please select a status');
      return;
    }

    this.applicationService.updateApplicationStatus(app._id, app.newStatus).subscribe({
      next: () => {
        alert('Status updated successfully!');
        app.status = app.newStatus; // update UI instantly
        app.newStatus = '';
      },
      error: err => {
        console.error('Failed to update status', err);
        alert(err.error?.message || 'Failed to update status');
      }
    });
  }
}
