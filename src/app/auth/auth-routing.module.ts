import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
{
    path: 'login',
    component: LoginComponent
},
{
  path: 'sendemail',
  component: ResetPasswordComponent
},
{
  path: 'sendemail/:emailId',
  component: ResetPasswordComponent
},
{
  path: 'resetpassword/:emailId',
  component: ResetPasswordComponent
},
{
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {
}
