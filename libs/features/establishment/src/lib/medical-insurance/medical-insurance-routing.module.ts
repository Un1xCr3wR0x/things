/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddContributorScComponent } from '@gosi-ui/features/establishment/lib/medical-insurance/components/medical-insurance-add-contributor/add-contrbutor-sc/add-contributor-sc.component';
import { MedicalInsuranceEnrollScComponent } from '@gosi-ui/features/establishment/lib/medical-insurance/components/medical-insurance-enroll-sc/medical-insurance-enroll-sc.component';
import { MedicalInsuranceScComponent } from '@gosi-ui/features/establishment/lib/medical-insurance/components/medical-insurance-sc/medical-insurance-sc.component';
import { MedicalInsuranceTermsConditionsDcComponent } from '@gosi-ui/features/establishment/lib/medical-insurance/components/medical-insurance-terms-conditions-dc/medical-insurance-terms-conditions-dc.component';

export const routes: Routes = [
  {
    path: 'medical-insurance-extension',
    component: MedicalInsuranceScComponent,
    data: {
      breadcrumb: 'ESTABLISHMENT.MEDICAL-INSURANCE-EXTENSION'
    }
  },
  {
    path: 'medical-insurance-extension/enroll',
    component: MedicalInsuranceEnrollScComponent,
    data: {
      breadcrumb: 'ESTABLISHMENT.MEDICAL-INSURANCE-EXTENSION'
    }
  },
  {
    path: 'medical-insurance-extension/:registrationNo/add-contributor',
    component: AddContributorScComponent,
    data: {
      breadcrumb: 'ESTABLISHMENT.MEDICAL-INSURANCE-EXTENSION'
    }
  },
  {
    path: 'medical-insurance-extension/terms',
    component: MedicalInsuranceTermsConditionsDcComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicalInsuranceRoutingModule {}
