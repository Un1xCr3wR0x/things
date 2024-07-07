/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ValidatorBaseScComponent } from '../../base/validator-sc.base-component';
import {
  UITransactionType,
  BenefitType,
  createDetailForm,
  createModalForm,
  bindQueryParamsToForm,
  reDirectUsersToApplyScreen
} from '../../../shared';
import { Channel } from '@gosi-ui/core/lib/enums/channel';
import { Observable } from 'rxjs/internal/Observable';
import { LovList } from '@gosi-ui/core/lib/models/lov-list';
import { FormGroup } from '@angular/forms';
import { FuneralGrantBeneficiaryResponse } from '../../../shared/models/funeral-grant-beneficiary-response';
import { ApplicationTypeEnum } from '@gosi-ui/core';

@Component({
  selector: 'bnt-request-funeral-grant-details-sc',
  templateUrl: './request-funeral-grant-details-sc.component.html',
  styleUrls: ['./request-funeral-grant-details-sc.component.scss']
})
export class RequestFuneralGrantDetailsScComponent extends ValidatorBaseScComponent implements OnInit, OnDestroy {
  listYesNo$: Observable<LovList>;
  funeralGrantForm: FormGroup;
  funeralGrantModal: FormGroup;
  isFuneral = true;
  isValidatorScreen = true;
  funeralBeneficiaryDetails: FuneralGrantBeneficiaryResponse;
  Channel = Channel;

  ngOnInit(): void {
    this.alertService.clearAlerts();
    this.benefitType = BenefitType.funeralGrant;
    this.showComments = false;
    this.listYesNo$ = this.lookUpService.getYesOrNoList();
    this.funeralGrantForm = createDetailForm(this.fb);
    this.funeralGrantModal = createModalForm(this.fb);
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
    bindQueryParamsToForm(this.routerData, this.funeralGrantForm);
    this.intialiseTheView(this.routerData);
    this.getRejectionReason(this.funeralGrantForm);
    if (this.socialInsuranceNo && this.requestId && this.referenceNo) {
      this.getAnnuityBenefitDetails(this.socialInsuranceNo, this.requestId, this.referenceNo);
    }
    this.getBeneficiaryDetails();
    this.trackTransaction(this.referenceNo);
    this.fetchDocuments();
  }

  fetchDocuments() {
    this.transactionKey = UITransactionType.REQUEST_FUNERAL_GRANT;
    this.transactionType =
      this.channel === Channel.FIELD_OFFICE ? UITransactionType.FO_REQUEST_SANED : UITransactionType.GOL_REQUEST_SANED;
    this.getDocuments(this.transactionKey, this.transactionType, this.requestId, this.referenceNo);
  }

  getBeneficiaryDetails() {
    if (this.socialInsuranceNo && this.requestId && this.referenceNo) {
      this.funeralBenefitService
        .getBeneficiaryRequestDetails(this.socialInsuranceNo, this.requestId, this.referenceNo)
        .subscribe(
          res => {
            this.funeralBeneficiaryDetails = res;
          },
          err => {
            this.showError(err);
          }
        );
    }
  }
  navigateToEdit() {}

  reDirectUsersToApplyScreens() {
    reDirectUsersToApplyScreen(
      this.requestType,
      this.socialInsuranceNo,
      this.requestId,
      this.annuityBenefitDetails,
      this.coreBenefitService,
      this.router,
      this.benefitType,
      this.referenceNo
    );
  }

  ngOnDestroy() {
    this.alertService.clearAllErrorAlerts();
    this.alertService.clearAllWarningAlerts();
  }
  returnFuneralGrant() {
    this.confirmReturn(this.funeralGrantForm);
  }
  /** While rejecting from validator */
  confirmRejectFuneral() {
    this.confirmReject(this.funeralGrantForm);
  }
  /** Approving by the validator. */
  confirmApproveFuneral() {
    this.confirmApprove(this.funeralGrantForm);
  }
}
