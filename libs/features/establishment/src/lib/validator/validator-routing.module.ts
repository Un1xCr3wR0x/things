/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  EstablishmentScComponent,
  RasedRequestDocumentScComponent,
  ValidateAddSuperAdminScComponent,
  ValidateAddressDetailsScComponent,
  ValidateBankDetailsScComponent,
  ValidateBasicDetailsScComponent,
  ValidateContactDetailsScComponent,
  ValidateDelinkScComponent,
  ValidateFlagEstablishmentScComponent,
  ValidateIdentifierDetailsScComponent,
  ValidateLateFeeScComponent,
  ValidateLegalEntityScComponent,
  ValidateMainEstablishmentScComponent,
  ValidateMofPaymentDetailsScComponent,
  ValidateOwnerScComponent,
  ValidateReOpenEstablishmentScComponent,
  ValidateSafetyInspectionScComponent,
  ValidateSuperAdminScComponent,
  ValidateTerminateEstablishmentScComponent
} from './components';
import { ValidatorDcComponent } from './validator-dc.component';

const routes: Routes = [
  {
    path: '',
    component: ValidatorDcComponent,
    children: [
      {
        path: 'basic-details',
        component: ValidateBasicDetailsScComponent,
        data: {
          breadcrumb: 'ESTABLISHMENT.CHANGE-ESTABLISHMENT-DETAILS'
        }
      },
      {
        path: 'identifier-details',
        component: ValidateIdentifierDetailsScComponent,
        data: {
          breadcrumb: 'ESTABLISHMENT.CHANGE-ESTABLISHMENT-DETAILS'
        }
      },
      {
        path: 'bank-details',
        component: ValidateBankDetailsScComponent,
        data: {
          breadcrumb: 'ESTABLISHMENT.CHANGE-ESTABLISHMENT-DETAILS'
        }
      },
      {
        path: 'owner-details',
        component: ValidateOwnerScComponent,
        data: {
          breadcrumb: 'ESTABLISHMENT.CHANGE-ESTABLISHMENT-DETAILS'
        }
      },
      {
        path: 'contact-details',
        component: ValidateContactDetailsScComponent,
        data: {
          breadcrumb: 'ESTABLISHMENT.CHANGE-ESTABLISHMENT-DETAILS'
        }
      },
      { path: 'register-establishment', component: EstablishmentScComponent },
      {
        path: 'address-details',
        component: ValidateAddressDetailsScComponent,
        data: {
          breadcrumb: 'ESTABLISHMENT.CHANGE-ESTABLISHMENT-DETAILS'
        }
      },
      {
        path: 'legal-entity',
        component: ValidateLegalEntityScComponent,
        data: {
          breadcrumb: 'ESTABLISHMENT.CHANGE-ESTABLISHMENT-DETAILS'
        }
      },
      {
        path: 'change-main',
        component: ValidateMainEstablishmentScComponent
      },
      {
        path: 'delink',
        component: ValidateDelinkScComponent
      },
      {
        path: 'link',
        component: ValidateDelinkScComponent
      },
      {
        path: 'manage-admin',
        component: ValidateSuperAdminScComponent
      },
      {
        path: 'register-admin',
        component: ValidateAddSuperAdminScComponent
      },
      {
        path: 'terminate',
        component: ValidateTerminateEstablishmentScComponent
      },
      {
        path: 'flag',
        component: ValidateFlagEstablishmentScComponent
      },
      {
        path: 'safety-inspection',
        component: ValidateSafetyInspectionScComponent
      },
      {
        path: 'reopen',
        component: ValidateReOpenEstablishmentScComponent
      },
      { path: 'late-fee', component: ValidateLateFeeScComponent },
      { path: 'request-documents', component: RasedRequestDocumentScComponent },
      { path: 'change-mof-payment', component: ValidateMofPaymentDetailsScComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValidatorRoutingModule {}
