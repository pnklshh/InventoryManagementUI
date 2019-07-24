import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule } from '@angular/forms';
import { NbIconModule, NbInputModule, NbRadioModule, NbSelectModule, NbCheckboxModule, NbButtonModule, NbCardModule, NbAlertModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import {ViewStockComponent} from './ViewStock/view-stock.component';
import { AddStockComponent } from './AddStock/add-stock.component';
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
      ViewStockComponent,
      AddStockComponent,
    ],
  })
  export class StockModule { }
  