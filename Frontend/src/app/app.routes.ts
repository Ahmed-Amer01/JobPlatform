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
import { ProfileComponent } from './profile/profile.component';
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
        path: 'jobs', 
        component: JobListComponent, 
        title: 'All Jobs'
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
    path:'**',
    component: NotFoundComponent,
    title:'Not found!'
}
];
