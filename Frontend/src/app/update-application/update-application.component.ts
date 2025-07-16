import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-update-application',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-application.component.html',
  styleUrls: ['./update-application.component.css']
})
export class UpdateApplicationComponent implements OnInit {
  applicationId!: string;
  updateForm!: FormGroup;
  resumeFile?: File;
  coverLetterFile?: File;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.applicationId = this.route.snapshot.params['applicationId'];
    this.updateForm = this.fb.group({
      resume: [null],
      coverLetter: [null]
    });
  }

  onFileChange(event: any, field: 'resume' | 'coverLetter') {
    const file = event.target.files[0];
    if (field === 'resume') this.resumeFile = file;
    if (field === 'coverLetter') this.coverLetterFile = file;
  }

  onSubmit(): void {
    const formData = new FormData();
    if (this.resumeFile) formData.append('resume', this.resumeFile);
    if (this.coverLetterFile) formData.append('coverLetter', this.coverLetterFile);

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.patch(`http://localhost:3000/api/applications/${this.applicationId}`, formData, { headers })
      .subscribe({
        next: () => {
          alert('Application updated successfully');
          this.router.navigate(['/my-applications']);
        },
        error: err => {
          alert(err.error.message || 'Update failed');
          console.error(err);
        }
      });
  }
}
