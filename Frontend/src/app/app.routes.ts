import { Title } from '@angular/platform-browser';
import { Routes } from '@angular/router';
import { SignUpComponent } from './sign-up/sign-up.component';

export const routes: Routes = [
    {
        path:'',
        component:SignUpComponent,
        title:'SignUp'
    },
    
    // {
    //     path:'**',
    //     component: NotFoundComponent,
    //     title:'Not found'
    // }
];
