import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';

import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import {DatabaseModule} from './DatabaseManagement/database.module';
import {StockModule} from './StockManagement/stock.module';
import {AllocationModule} from './AllocationManagement/allocate.module';
import {ReportModule} from './ReportManagement/report.module';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import {Constant} from '../constants/Constants';

const PAGES_COMPONENTS = [
  PagesComponent,
];

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    DatabaseModule,
    StockModule,
    AllocationModule,
    ReportModule,
    MiscellaneousModule
  ],
  declarations: [
    ...PAGES_COMPONENTS,
  ],
  providers: [Constant, NgbModal]
})
export class PagesModule {
}
