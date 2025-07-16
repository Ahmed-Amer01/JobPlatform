import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobsService, Job } from '../jobs.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.css']
})
export class JobDetailsComponent implements OnInit {

  jobId: string = '';
  job?: Job;

  constructor(private route: ActivatedRoute, private jobsService: JobsService) {}

  ngOnInit(): void {
  this.route.params.subscribe(params => {
    this.jobId = params['id'] || '';
    console.log('Route ID:', this.jobId); // ✅ Log the ID
    if (this.jobId) {
      this.jobsService.getJobById(this.jobId).subscribe({
        next: (data) => {
          console.log('Fetched job:', data); // ✅ Log the data
          this.job = data;
        },
        error: (err) => console.error('Failed to load job:', err)
      });
    }
  });
}

}
