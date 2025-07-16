import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
@Component({
  selector: 'app-job-card',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './job-card.component.html',
  styleUrls: ['./job-card.component.css']
})
export class JobCardComponent {
  @Input() job: any;
  @Input() showActions = false;

  @Output() update = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() viewApplications = new EventEmitter<void>();

  constructor(private router: Router) {}

  navigateToJob(jobId: string) {
    this.router.navigate(['/jobs', jobId]);
  }

  

  onUpdate() {
    this.update.emit();
  }

  onDelete() {
    this.delete.emit();
  }

  onViewApplications() {
    this.viewApplications.emit();
  }
}
