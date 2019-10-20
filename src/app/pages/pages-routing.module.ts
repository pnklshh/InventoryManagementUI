import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { ViewStockComponent } from './StockManagement/ViewStock/view-stock.component';
import { ViewItemsComponent } from './DatabaseManagement/ViewItems/view-items.component';
import { ViewEngineersComponent } from './DatabaseManagement/ViewEngineers/view-engineers.component';
import { ViewCitiesComponent } from './DatabaseManagement/ViewCities/view-cities.component';
import { AddStockComponent } from './StockManagement/AddStock/add-stock.component';
import { AddItemComponent } from './DatabaseManagement/AddItem/add-item.component';
import { AddEngineerComponent } from './DatabaseManagement/AddEngineer/add-engineer.component';
import { AddCityComponent } from './DatabaseManagement/AddCity/add-city.component';
import {ViewAllocationComponent} from './AllocationManagement/ShowAllocation/view-allocation.component';
import {AllocateItemComponent} from './AllocationManagement/AllocateItem/allocate-item.component';
import {ReportUsageComponent} from './ReportManagement/ReportUsage/report-usage.component';
import {ViewUsageComponent} from './ReportManagement/ViewUsage/view-usage.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [  
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'viewitems',
    component: ViewItemsComponent,
  },
  {
    path: 'additem',
    component: AddItemComponent,
  },
  // {
  //   path: 'edititem',
  //   component: AddItemComponent,
  // },
  {
    path: 'edititem/:item',
    component: AddItemComponent,
  },
  {
    path: 'viewengineers',
    component: ViewEngineersComponent,
  },
  {
    path: 'addengineer',
    component: AddEngineerComponent,
  },
  // {
  //   path: 'editengineer',
  //   component: AddEngineerComponent,
  // },
  {
    path: 'editengineer/:engineer',
    component: AddEngineerComponent,
  },
  {
    path: 'viewcities',
    component: ViewCitiesComponent,
  },
  {
    path: 'addcity',
    component: AddCityComponent,
  },
  // {
  //   path: 'editcity',
  //   component: AddCityComponent,
  // },
  {
    path: 'editcity/:city',
    component: AddCityComponent,
  }, 
  {
    path: 'viewstock',
    component: ViewStockComponent,
  },
  {
    path: 'addstock',
    component: AddStockComponent,
  },
  // {
  //   path: 'editstock',
  //   component: AddStockComponent,
  // },
  {
    path: 'editstock/:stock',
    component: AddStockComponent,
  },
  // {
  //   path: 'reportdefect',
  //   component: AddStockComponent,
  // },
  {
    path: 'reportdefect/:stock',
    component: AddStockComponent,
  },
  {
    path: 'fixdefect/:allocation',
    component: AddStockComponent,
  }, 
  {
    path: 'viewallocation',
    component: ViewAllocationComponent,
  }, 
  {
    path: 'allocateitem',
    component: AllocateItemComponent,
  }, 
  {
    path: 'editallocation/:allocation',
    component: AllocateItemComponent,
  },
  {
    path: 'viewhistory',
    component: ViewUsageComponent,
  },  
  {
    path: 'reportusage',
    component: ReportUsageComponent,
  },
  {
    path: 'editusage/:usage',
    component: ReportUsageComponent,
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  }, 
  {
    path: '**',
    component: NotFoundComponent,
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
