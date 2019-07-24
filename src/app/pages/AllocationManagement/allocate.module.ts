import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule } from '@angular/forms';
import {ViewAllocationComponent} from './ShowAllocation/view-allocation.component';
import { AllocateItemComponent } from './AllocateItem/allocate-item.component';
import {DataTablesModule} from 'angular-datatables';
import { NbIconModule, NbInputModule, NbRadioModule, NbSelectModule, NbCheckboxModule, NbButtonModule, NbCardModule, NbAlertModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

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
      ViewAllocationComponent,
      AllocateItemComponent
    ],
    providers: [],
  })
  export class AllocationModule { }
  