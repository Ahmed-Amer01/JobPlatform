import { Title } from '@angular/platform-browser';
import { Routes } from '@angular/router';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { JobCardComponent } from './job-card/job-card.component';
import { JobListComponent } from './job-list/job-list.component';
import { AddJobComponent } from './add-job/add-job.component';
import { ApplicationComponent } from './application/application.component';
import { JobDetailsComponent } from './job-details/job-details.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { MyJobsComponent } from './my-jobs/my-jobs.component';
import { UpdateJobComponent } from './update-job/update-job.component';
import { JobApplicationsComponent } from './job-applications/job-applications.component';
import { UsersListComponent } from './users-list/users-list.component';
import { MyApplicationsComponent } from './my-applications/my-applications.component';
import { CandidateApplicationsComponent } from './candidate-applications/candidate-applications.component';
import { ApplicationsByJobComponent } from './applications-by-job/applications-by-job.component';
import { UpdateApplicationComponent } from './update-application/update-application.component';
import { ProfileComponent } from './profile/profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
// import { Application } from './application/application.component';
// import { JobsComponent } from './jobs/jobs.component';
// import { JobCardComponent } from './job-card/job-card.component';

export const routes: Routes = [
    { 
        path: '',
        component: HomeComponent,
        title:'Home'
    },
    {
        path:'sign-up',
        component:SignUpComponent,
        title:'SignUp'
    },
    { 
        path: 'login',
        component: LoginComponent,
        title:'Login'
    },

    {
        path: 'profile',
        component: ProfileComponent,
        title: 'My Profile'
    },
    { 
        path: 'edit-profile',
        component: EditProfileComponent,
        title: 'Edit Profile'
    },


    { 
        path: 'jobs', 
        component: JobListComponent, 
        title: 'All Jobs'
    },
    { 
        path: 'my-jobs', 
        component: MyJobsComponent, 
        title: 'My Jobs'
    },
    { 
        path: 'my-job/:jobId/edit', 
        component: AddJobComponent
    },
    { 
        path: 'jobs/:id', 
        component: JobDetailsComponent  , 
        title: 'About'
    },
    {
        path: 'add-job',
        component: AddJobComponent,
        title: 'Add Job'
    },

    {
        path: 'jobs/:id/apply',
        component: ApplicationComponent,
        title: 'Apply for Job'
    },

    {
        path: 'jobs/:id/applications',
        component: JobApplicationsComponent,
        title: 'Job Applications'
    },
    {
    path: 'admin/users',
    component: UsersListComponent,
    title: 'Users List'
    },

    {
        path: 'my-applications',
        component: MyApplicationsComponent,
        title: 'My Applications'
    },


    {
        path: 'admin/candidate/:candidateId/applications',
        component: CandidateApplicationsComponent,
        title: 'Candidate Applications'
    },


    {
        path: 'jobs/:jobId/applications',
        component: ApplicationsByJobComponent,
        title: 'Job Applications'
    },

     {
        path: 'my-applications/:applicationId/edit',
        component: UpdateApplicationComponent,
        title: 'Update Application'
    },






    {
        path:'**',
        component: NotFoundComponent,
        title:'Not found!'
    }
];
