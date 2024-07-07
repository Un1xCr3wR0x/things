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
import {
  HealthInsuranceListComponent
} from "@gosi-ui/features/establishment/lib/health-insurance-list/components/health-insurance-list/health-insurance-list.component";
import {
  TermsAndConditionsComponent
} from "@gosi-ui/features/establishment/lib/health-insurance-list/components/terms-and-conditions/terms-and-conditions.component";
import {
  RedierctToSelectedInsuranceCompanyComponent
} from "@gosi-ui/features/establishment/lib/health-insurance-list/components/redierct-to-selected-insurance-company/redierct-to-selected-insurance-company.component";

export const routes: Routes = [
  {
    path: ':registrationNo',
    component: HealthInsuranceListComponent,
    data: {
      breadcrumb: 'ESTABLISHMENT.HEALTH-INSURANCE'
    }
  },
  {
    path: ':registrationNo/terms-and-conditions',
    component: TermsAndConditionsComponent,
    data: {
      breadcrumb: 'ESTABLISHMENT.HEALTH-INSURANCE'
    }
  },
  {
    path: ':registrationNo/terms-and-conditions/redierct-to-selected-insurance-company',
    component: RedierctToSelectedInsuranceCompanyComponent,
    data: {
      breadcrumb: 'ESTABLISHMENT.HEALTH-INSURANCE'
    }
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HealthInsuranceListRoutingModule {}
