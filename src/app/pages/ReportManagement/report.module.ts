import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule } from '@angular/forms';
import { NbIconModule, NbInputModule, NbRadioModule, NbSelectModule, NbCheckboxModule, NbButtonModule, NbCardModule, NbAlertModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { ReportUsageComponent } from './ReportUsage/report-usage.component';
import {ViewUsageComponent} from './ViewUsage/view-usage.component';
import {DataTablesModule} from 'angular-datatables';

@NgModule({
    imports: [
      ThemeModule,
      DataTablesModule,
      FormsModule,
      NbIconModule,
      NbEvaIconsModule,
      NbInputModule,
      NbRadioModule,
      NbSelectModule,
      NbCheckboxModule,
      NbButtonModule,
      NbCardModule,
      NbAlertModule
    ],
    declarations: [
      ViewUsageComponent,
      ReportUsageComponent
    ],
  })
  export class ReportModule { }
  