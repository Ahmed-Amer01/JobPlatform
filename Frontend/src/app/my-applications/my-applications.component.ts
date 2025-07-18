import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationService } from '../services/application/application.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-my-applications',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-applications.component.html',
  styleUrls: ['./my-applications.component.css']
})
export class MyApplicationsComponent implements OnInit {
  applications: any[] = [];

  constructor(
    private applicationService: ApplicationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.applicationService.getMyApplications().subscribe({
      next: (data) => {
        this.applications = data;
      },
      error: (err) => {
        console.error('Failed to load applications:', err);
      }
    });
  }


  editApplication(applicationId: string) {
    this.router.navigate(['/my-applications', applicationId, 'edit']);
  }

  deleteApplication(applicationId: string) {
    if (confirm('Are you sure you want to delete this application?')) {
      this.applicationService.deleteApplication(applicationId).subscribe({
        next: () => {
          this.applications = this.applications.filter(app => app._id !== applicationId);
          alert('Application deleted successfully');
        },
        error: (err) => {
          console.error('Failed to delete application:', err);
          alert('Error deleting application');
        }
      });
    }
  }
  

}
