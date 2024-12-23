import { Routes } from '@angular/router';

import { AppSideLoginComponent } from './side-login/side-login.component';


export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        component: AppSideLoginComponent,
      },

    ],
  },
];
