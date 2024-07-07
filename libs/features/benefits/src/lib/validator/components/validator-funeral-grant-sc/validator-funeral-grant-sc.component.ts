import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Channel } from '@gosi-ui/core';
import { bindQueryParamsToForm, createDetailForm, createModalForm, UITransactionType } from '../../../shared';
import { TransactionPensionBase } from '../../../shared/component/base/transaction-pension.base';

@Component({
  selector: 'bnt-validator-funeral-grant-sc',
  templateUrl: './validator-funeral-grant-sc.component.html',
  styleUrls: ['./validator-funeral-grant-sc.component.scss']
})
export class ValidatorFuneralGrantScComponent extends TransactionPensionBase implements OnInit {
  funeralGrantForm: FormGroup;
  funeralGrantModal: FormGroup;
  isFuneral = true;
  isValidatorScreen = true;
  Channel = Channel;

  ngOnInit(): void {
    this.alertService.clearAlerts();
    this.showComments = false;
    this.funeralGrantForm = createDetailForm(this.fb);
    this.funeralGrantModal = createModalForm(this.fb);
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    bindQueryParamsToForm(this.routerData, this.funeralGrantForm);
    this.intialiseTheView(this.routerData);
    this.getRejectionReason(this.funeralGrantForm);
    this.trackTransaction(this.referenceNo);
    this.fetchDocuments();
    if (this.socialInsuranceNo && this.requestId && this.referenceNo) {
      this.getAnnuityBenefitDetails(this.socialInsuranceNo, this.requestId, this.referenceNo);
    }
  }

  fetchDocuments() {
    this.transactionKey = UITransactionType.REQUEST_FUNERAL_GRANT;
    this.transactionType =
      this.channel === Channel.FIELD_OFFICE ? UITransactionType.FO_REQUEST_SANED : UITransactionType.GOL_REQUEST_SANED;
    this.getDocuments(this.transactionKey, this.transactionType, this.requestId, this.referenceNo);
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
