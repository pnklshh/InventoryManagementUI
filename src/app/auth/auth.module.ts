import { NgModule } from '@angular/core';
import { ThemeModule } from '../@theme/theme.module';
import { FormsModule } from '@angular/forms';
import {AuthRoutingModule} from './auth-routing.module';
import {LoginComponent} from './login/login.component';
import { NbLayoutModule, NbIconModule, NbInputModule, NbButtonModule, NbCardModule, NbAlertModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
    imports: [
      ThemeModule,
      NbLayoutModule,
      FormsModule,
      NbIconModule,
      NbEvaIconsModule,
      NbInputModule,
      NbButtonModule,
      NbCardModule,
      NbAlertModule,
      AuthRoutingModule,
    ],
    declarations: [
      LoginComponent,
      ResetPasswordComponent
    ],
    providers: [],
  })
  export class AuthModule { }
  