import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule } from '@angular/forms';
import { NbIconModule, NbActionsModule, NbInputModule, NbRadioModule, NbSelectModule, NbCheckboxModule, NbButtonModule, NbCardModule, NbAlertModule, NbDatepickerModule, NbUserModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import {ViewEngineersComponent} from './ViewEngineers/view-engineers.component';
import {ViewItemsComponent} from './ViewItems/view-items.component';
import {ViewCitiesComponent} from './ViewCities/view-cities.component';
import { AddEngineerComponent } from './AddEngineer/add-engineer.component';
import { AddItemComponent } from './AddItem/add-item.component';
import { AddCityComponent } from './AddCity/add-city.component';
import {DataTablesModule} from 'angular-datatables';

@NgModule({
    imports: [
      ThemeModule,
      DataTablesModule,
      FormsModule,
      NbIconModule,
      NbEvaIconsModule,
      NbActionsModule,
      NbInputModule,
      NbRadioModule,
      NbSelectModule,
      NbCheckboxModule,
      NbButtonModule,
      NbCardModule,
      NbDatepickerModule,
      NbAlertModule,
      NbUserModule
    ],
    declarations: [
      ViewEngineersComponent,
      ViewItemsComponent,
      ViewCitiesComponent,
      AddEngineerComponent,
      AddItemComponent,
      AddCityComponent
    ],
  })
  export class DatabaseModule { }
  