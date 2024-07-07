/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticateCaptchaScComponent } from './authenticate-captcha-sc/authenticate-captcha-sc.component';
import { AssessmentDecisionDisplayScComponent } from './assessment-decision-display-sc/assessment-decision-display-sc.component';
import { VerifyOtpScComponent } from './verify-otp-sc/verify-otp-sc.component';

const routes: Routes = [
  {
    path: 'login',
    component: AuthenticateCaptchaScComponent,
    data: {
      breadcrumb: 'BENEFITS.ACCEPT-ASSESSMENT-DECISION'
    }
  },
  {
    path: 'assessment-decision',
    component: AssessmentDecisionDisplayScComponent,
    data: {
      breadcrumb: 'BENEFITS.ACCEPT-ASSESSMENT-DECISION'
    }
  },
  {
    path: 'verify-otp',
    component: VerifyOtpScComponent,
    data: {
      breadcrumb: 'BENEFITS.ACCEPT-ASSESSMENT-DECISION'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BypassReassessmentRoutingModule {}
