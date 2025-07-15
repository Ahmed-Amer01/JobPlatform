import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { ApplicationFormService } from '../application-form-service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-application',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './application.html',
  styleUrls: ['./application.css']
})
export class Application {



  isFormSubmitted:boolean = false;
  resumeFile: File | null = null;
  coverLetterFile: File | null = null;

  
  getStatusClass(status: string | null): string {
    switch (status) {
      case 'applied':
        return 'tag-applied';
      case 'under_review':
        return 'tag-review';
      case 'interviewed':
        return 'tag-interviewed';
      case 'hired':
        return 'tag-hired';
      case 'rejected':
        return 'tag-rejected';
      default:
        return '';
    }
  }

  applicationForm:FormGroup;

  constructor(private fb: FormBuilder, private applicationFormService: ApplicationFormService, private route: ActivatedRoute, private  httpClient:HttpClient) {
    
    this.applicationForm = this.fb.group({
      jobId: ['64e123abc456def789012345', Validators.required],
      candidateId: ['', Validators.required],
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[1-9]\d{1,14}$/)]],
      address: ['', [Validators.required, Validators.maxLength(100)]],
      resume: ['', [Validators.required]],
      coverLetter: [''],
      status: ['Apply Now!', Validators.required]
    });

  }

  ngOnInit(){

    const userId = this.route.snapshot.params['userId'];
    console.log("user id",userId)
    const jobId = this.route.snapshot.params['jobId'];

    this.applicationForm.patchValue({ jobId: jobId });
    
    this.applicationFormService.getUserData(userId).subscribe(user => {

      this.applicationForm.patchValue({
        candidateId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone
      })
    })
  }



//   onSubmit() {


//     if(this.applicationForm.invalid)
//       return;

//     const fd = new FormData();

//     const application = {
//     jobId: this.applicationForm.value.jobId,
//     candidateId: this.applicationForm.value.candidateId,
//     firstName: this.applicationForm.value.firstName,
//     lastName: this.applicationForm.value.lastName,
//     email: this.applicationForm.value.email,
//     phone: this.applicationForm.value.phone,
//     address: this.applicationForm.value.address,
//     resume: this.applicationForm.value.resume, 
//     coverLetter: this.applicationForm.value.coverLetter, 
//     status: this.applicationForm.value.status
//   };



//   this.applicationFormService.postApplication(application).subscribe({
//     next: (res) => {
//       console.log('Application submitted:', res);
//       this.isFormSubmitted = true;
//     },
//     error: (err) => {
//       console.error('Submission failed:', err.message);
//     }
//   });
// }


onSubmit() {
  if (this.applicationForm.invalid) return;

  // Convert form values to FormData
  const formData = new FormData();
formData.append('jobId', this.applicationForm.value.jobId);
formData.append('candidateId', this.applicationForm.value.candidateId);
formData.append('firstName', this.applicationForm.value.firstName);
formData.append('lastName', this.applicationForm.value.lastName);
formData.append('email', this.applicationForm.value.email);
formData.append('phone', this.applicationForm.value.phone);
formData.append('address', this.applicationForm.value.address);
formData.append('status', this.applicationForm.value.status);


if (this.resumeFile) {
  formData.append('resume', this.resumeFile);
}
if (this.coverLetterFile) {
  formData.append('coverLetter', this.coverLetterFile);
}

  // Post to backend
  this.applicationFormService.postApplication(formData).subscribe({
  next: res => {
    console.log('Submitted!', res);
  },
  error: err => {
    console.error('Error:', err);
  }
});
}

onResumeFileSelected(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) this.resumeFile = file;
}


}
