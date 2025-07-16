// job-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobsService, Job } from '../jobs.service';
import { JobCardComponent } from '../job-card/job-card.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, RouterModule, JobCardComponent, FormsModule],
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css']
})
export class JobListComponent implements OnInit {
  jobs: Job[] = [];

  constructor(private jobsService: JobsService) {}

  ngOnInit() {
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

}
