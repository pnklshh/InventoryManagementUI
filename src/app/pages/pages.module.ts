import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';
import {HttpModule} from '@angular/http';

import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import {DatabaseModule} from './DatabaseManagement/database.module';
import {StockModule} from './StockManagement/stock.module';
import {AllocationModule} from './AllocationManagement/allocate.module';
import {ReportModule} from './ReportManagement/report.module';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import {ApiServiceCall} from '../service/api-call.service';
import {DatasharingService} from '../service/datasharing-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
    MiscellaneousModule,
    HttpModule
  ],
  declarations: [
    ...PAGES_COMPONENTS,
  ],
  providers: [ApiServiceCall, DatasharingService, NgbModal]
})
export class PagesModule {
}
