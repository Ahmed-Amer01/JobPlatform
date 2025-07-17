import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationService } from '../services/application/application.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-candidate-applications',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './candidate-applications.component.html',
  styleUrls: ['./candidate-applications.component.css']
})
export class CandidateApplicationsComponent implements OnInit {
  candidateId!: string;
  applications: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    this.candidateId = this.route.snapshot.params['candidateId'];
    this.applicationService.getApplicationsByCandidate(this.candidateId).subscribe({
      next: (data:any) => this.applications = data,
      error: (err:any) => console.error('Failed to fetch applications:', err)
    });
  }
}
