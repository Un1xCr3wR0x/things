/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { AssessmentDecisionDisplayScComponent } from './assessment-decision-display-sc/assessment-decision-display-sc.component';
import { AuthBypassDcComponent } from './auth-bypass-dc/auth-bypass-dc.component';
import { AuthenticateCaptchaScComponent } from './authenticate-captcha-sc/authenticate-captcha-sc.component';
import { InvalidAuthenticationDcComponent } from './invalid-authentication-dc/invalid-authentication-dc.component';
import { MedicalBoardDetailsDcComponent } from './medical-board-details-dc/medical-board-details-dc.component';
import { ReassessmentBenefitDetailsDcComponent } from './reassessment-benefit-details-dc/reassessment-benefit-details-dc.component';
import { VerifyOtpScComponent } from './verify-otp-sc/verify-otp-sc.component';

export const BYPASS_REASSESSMENT_COMPONENTS = [
  AssessmentDecisionDisplayScComponent,
  AuthBypassDcComponent,
  AuthenticateCaptchaScComponent,
  InvalidAuthenticationDcComponent,
  MedicalBoardDetailsDcComponent,
  ReassessmentBenefitDetailsDcComponent,
  VerifyOtpScComponent
];
export * from './assessment-decision-display-sc/assessment-decision-display-sc.component';
export * from './auth-bypass-dc/auth-bypass-dc.component';
export * from './authenticate-captcha-sc/authenticate-captcha-sc.component';
export * from './invalid-authentication-dc/invalid-authentication-dc.component';
export * from './medical-board-details-dc/medical-board-details-dc.component';
export * from './reassessment-benefit-details-dc/reassessment-benefit-details-dc.component';
export * from './verify-otp-sc/verify-otp-sc.component';
