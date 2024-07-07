/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, AuthTokenService } from '@gosi-ui/core';
import { BranchList, EstablishmentService } from '@gosi-ui/features/establishment';
import { EstablishmentScBaseComponent } from '@gosi-ui/features/establishment/lib/shared/base/establishment-sc.base-component';

@Component({
  selector: 'est-medical-insurance-sc',
  templateUrl: './medical-insurance-sc.component.html',
  styleUrls: ['./medical-insurance-sc.component.scss']
})
export class MedicalInsuranceScComponent extends EstablishmentScBaseComponent implements OnInit {
  goToFaq = true;
  establishments: BranchList[];
  disableEnrollmentButton = true;
  isAllEnrolled = true;
  isNoneEnrolled = true;
  isDoneLoading = false;

  constructor(
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly establishmentService: EstablishmentService,
    readonly authService: AuthTokenService,
    readonly alertService: AlertService
  ) {
    super(null, null);
  }

  ngOnInit(): void {
    this.alertService.clearAlerts();
    const token = this.authService.decodeToken(this.authService.getAuthToken());
    this.establishmentService.getMedicalInsuranceEstablishmentGroupsUnderAdmin(Number(token.uid)).subscribe(
      estGroups => {
        this.isDoneLoading = true;
        this.establishments = estGroups.branchList;
        this.disableEnrollmentButton = false;
        this.establishments.forEach(est => {
          if (est.medicalInsurancePolicy) {
            if (est.medicalInsurancePolicy.policyStatus) {
              est.medicalInsurancePolicy.policyStatus =
                'ESTABLISHMENT.MEDICAL-INSURANCE-POLICY-STATUS.' + est.medicalInsurancePolicy.policyStatus;
            }
            if (est.medicalInsurancePolicy.policyNumber) {
              this.goToFaq = false;
              est.medicalInsurancePolicy.addPolicy = false;
              this.isNoneEnrolled = false;
            } else {
              est.medicalInsurancePolicy.addPolicy = true;
              this.isAllEnrolled = false;
            }
          }
        });
      },
      () => {
        this.alertService.showErrorByKey('ESTABLISHMENT.ERROR.NO-ELIGIBLE-ESTABLISHMENTS');
        this.disableEnrollmentButton = false;
        this.isDoneLoading = true;
      }
    );
  }

  switchToFaq(goToFaq) {
    this.goToFaq = goToFaq;
  }

  switchToEstList(goToEstList) {
    this.goToFaq = !goToEstList;
  }
}
