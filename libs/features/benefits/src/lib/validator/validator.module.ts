/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { VALIDATORCOMPONENTS } from './components';
import { ValidatorRoutingModule } from './validator-routing.module';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { PensionBenefitDcComponent } from './components/pension-benefit-dc/pension-benefit-dc.component';
import { HeirRegisterScComponent } from './components/heir-register-sc/heir-register-sc.component';
import { RegisterHeirDetailsDcComponent } from './components/register-heir-details-dc/register-heir-details-dc.component';
import { ModifyBenefitPaymentDetailsScComponent } from './components/modify-benefit-payment-details-sc/modify-benefit-payment-details-sc.component';
import { ValidatorHoldBenefitScComponent } from './components/validator-hold-benefit-sc/validator-hold-benefit-sc.component';
import { RequestFuneralGrantDetailsScComponent } from './components/request-funeral-grant-details-sc/request-funeral-grant-details-sc.component';
import { ValidatorStopBenefitScComponent } from './components/validator-stop-benefit-sc/validator-stop-benefit-sc.component';
import { ValidatorRestartBenefitScComponent } from './components/validator-restart-benefit-sc/validator-restart-benefit-sc.component';
import { ValidatorsModifyCommitmentScComponent } from './components/validators-modify-commitment-sc/validators-modify-commitment-sc.component';

@NgModule({
  declarations: [
    ...VALIDATORCOMPONENTS,
    PensionBenefitDcComponent,
    HeirRegisterScComponent,
    RegisterHeirDetailsDcComponent,
    ModifyBenefitPaymentDetailsScComponent,
    ValidatorHoldBenefitScComponent,
    RequestFuneralGrantDetailsScComponent,
    ValidatorStopBenefitScComponent,
    ValidatorRestartBenefitScComponent,
    ValidatorsModifyCommitmentScComponent
  ],
  imports: [CommonModule, SharedModule, ThemeModule, ValidatorRoutingModule],
  exports: [...VALIDATORCOMPONENTS]
})
export class ValidatorModule {}
