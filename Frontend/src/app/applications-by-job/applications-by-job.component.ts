import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationService } from '../services/application/application.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-job-applications',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './applications-by-job.component.html',
  styleUrls: ['./applications-by-job.component.css']
})
export class ApplicationsByJobComponent  implements OnInit {
  jobId!: string;
  applications: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    this.jobId = this.route.snapshot.params['jobId'];
    this.applicationService.getApplicationsByJob(this.jobId).subscribe({
      next: (data) => this.applications = data,
      error: (err) => console.error('Error fetching applications:', err)
    });
  }
}
