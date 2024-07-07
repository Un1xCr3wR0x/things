import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WriteToUsScComponent, WriteUsDetailsScComponent, WriteUsScComponent } from './components';

const routes: Routes = [
  {
    path: '',
    component: WriteUsScComponent
  },
  {
    path: 'write-to-us',
    component: WriteUsDetailsScComponent,
    data: {
      breadcrumb: 'CUSTOMER-INFORMATION.MOD_PERSONAL_DTLS'
    }
  },
  // {
  //   redirectTo: 'write-to-us',
  //   pathMatch: 'full'
  // },
  {
    path: 'contact-us',
    component: WriteToUsScComponent,
    data: {
      breadcrumb: 'CUSTOMER-INFORMATION.MOD_PERSONAL_DTLS'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactUsRoutingModule {}
