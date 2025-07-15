import { Title } from '@angular/platform-browser';
import { Routes } from '@angular/router';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';

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
    }
    
    // {
    //     path:'**',
    //     component: NotFoundComponent,
    //     title:'Not found'
    // }
];
