import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';
import { ThemeModule } from '../../@theme/theme.module';
import { NbCardModule } from '@nebular/theme';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  imports: [
    ThemeModule,
    ChartsModule,
    FormsModule,
    NbCardModule
  ],
  declarations: [
    DashboardComponent,
  ],
  
})
export class DashboardModule { }
