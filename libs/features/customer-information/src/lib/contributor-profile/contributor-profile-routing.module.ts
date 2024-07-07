import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModifyContactDetailsScComponent, MyProfileScComponent, AddBankDetailsScComponent } from './components';
import { InjuryHistoryScComponent } from '@gosi-ui/features/occupational-hazard/lib/injury';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: MyProfileScComponent },
      {
        path: 'modify',
        component: ModifyContactDetailsScComponent,
        data: {
          breadcrumb: 'CUSTOMER-INFORMATION.MOD_PERSONAL_DTLS'
        }
      },
      
      {
        path: 'occupational-hazards',
        loadChildren: () =>
          import('@gosi-ui/features/occupational-hazard').then(mod => mod.OccupationalHazardModule),
        component: InjuryHistoryScComponent
      },
      {
        path: 'add-bank',
        component: AddBankDetailsScComponent,
        data: {
          breadcrumb: 'CUSTOMER-INFORMATION.ADD-BANK-DETAILS'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContributorProfileRoutingModule {}
