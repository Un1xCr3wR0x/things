import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GosiAddressDcComponent } from './components/gosi-address-dc/gosi-address-dc.component';
import { GosiContactDcComponent } from './components/gosi-contact-dc/gosi-contact-dc.component';
import { ValidatorDcComponent } from './components/validator-dc/validator-dc.component';
import { FormsDcComponent } from './forms-dc.component';
import { WizardDcComponent } from './components/wizard-dc/wizard-dc.component';

const routes: Routes = [
  {
    path: '',
    component: FormsDcComponent,
    children: [
      {
        path: 'contact',
        component: GosiContactDcComponent,
        data: {
          breadcrumb: 'ESTABLISHMENT.CONTACT-DETAILS'
        }
      },
      {
        path: 'address',
        component: GosiAddressDcComponent,
        data: {
          breadcrumb: 'ESTABLISHMENT.ADDRESS-DETAILS'
        }
      },
      {
        path: 'validator',
        component: ValidatorDcComponent,
        data: {
          breadcrumb: 'Validator'
        }
      },
      {
        path: 'progress-wizard',
        component: WizardDcComponent,
        data: {
          breadcrumb: 'Progress-Wizard'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormsRoutingModule {}
