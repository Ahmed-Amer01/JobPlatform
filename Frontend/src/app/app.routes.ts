import { Routes } from '@angular/router';
import { Application } from './application/application';

export const routes: Routes = [
    {
        path: "application/:jobId/:userId",
        component:Application,
        title: 'Job Application'
    }

];
