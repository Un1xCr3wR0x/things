/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeEnum, Channel, checkIqamaOrBorderOrPassport, CommonIdentity, DocumentItem } from '@gosi-ui/core';
import { AdjustmentConstants } from '@gosi-ui/features/payment/lib/shared';
import {
  bindQueryParamToForm,
  createDetailsForm,
  ValidatorRepayBaseScComponent
} from '../../base/validator-repay-sc.base-component';
import { BenefitConstants } from '@gosi-ui/features/benefits/lib/shared';

@Component({
  selector: 'pmt-validator-adjustment-repayment-sc',
  templateUrl: './validator-adjustment-repayment-sc.component.html',
  styleUrls: ['./validator-adjustment-repayment-sc.component.scss']
})
export class ValidatorAdjustmentRepaymentScComponent extends ValidatorRepayBaseScComponent implements OnInit {
  checkRepayForm: FormGroup;
  form: FormGroup;
  isSadad = false;
  adjustmentId: string;
  adjustmentType: string;
  documents: DocumentItem[];
  isDocuments = false;
  isValidatorCanEditPayment = false;
  authorizedPersonId: CommonIdentity | null;
  isIndividualApp: boolean;

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
    this.alertService.clearAllSuccessAlerts();
    this.initialiseView(this.routerData);
    this.checkRepayForm = this.createCheckForm();
    this.form = createDetailsForm(this.fb);
    bindQueryParamToForm(this.routerData, this.form);
    this.adjustmentId = 'MNT_ADJUSTMENT_REPAYMENT';
    this.adjustmentType = this.channel === Channel.FIELD_OFFICE ? 'REQUEST_BENEFIT_FO' : 'REQUEST_BENEFIT_GOL';
    this.getRequiredDocuments();
    if (this.routerData.payload) {
      this.adjustmentService
        .getAdjustmentRepaymentValidator(this.adjustmentRepayId, this.personId, this.referenceNo, this.sin)
        .subscribe(res => {
          this.adjustmentRepayDetails = res;
          this.adjustmentService.setAdjustmentRepaymentValidatorDetails(res);
          this.isSadad = this.adjustmentRepayDetails?.repaymentDetails?.paymentMethod?.english === 'SADAD';
          this.authorizedPersonId = checkIqamaOrBorderOrPassport(this.adjustmentRepayDetails?.contributor?.identity);
          this.canValidatorCanEditPayment();
        });
    }
    this.getContributor();
  }

  canValidatorCanEditPayment() {
    if (
      this.adjustmentRepayDetails?.repaymentDetails?.receiptMode.english === 'Account Transfer' ||
      this.adjustmentRepayDetails?.repaymentDetails?.receiptMode.english === 'Cash Deposit'
    ) {
      this.isValidatorCanEditPayment = true;
    }
  }
  /**
   * this function will redirect validator to repay adjustment amount screen
   */
  navigateToEdit() {
    this.routerData.tabIndicator = 2;
    this.routerData.selectWizard = AdjustmentConstants.PAYMENT_DETAILS;
    this.coreAdjustmentService.identifier = this.personId;
    this.coreAdjustmentService.sin = this.sin;
    this.router.navigate(['home/adjustment/pay-adjustment'], {
      queryParams: {
        edit: true
      }
    });
  }
  getRequiredDocuments() {
    this.documentService.getRequiredDocuments(this.adjustmentId, this.adjustmentType).subscribe(res => {
      this.documents = res;
      this.documents.forEach(doc => {
        this.refreshDocument(doc);
      });
    });
  }
  refreshDocument(doc: DocumentItem) {
    if (doc && doc.name) {
      this.documentService
        .refreshDocument(doc, this.adjustmentRepayId, this.adjustmentId, this.adjustmentType, this.referenceNo)
        .subscribe(res => {
          if (res?.name?.english === 'Benefit Application Form' && res?.documentContent !== null) {
            this.rejectWarningMessage = 'PAYMENT.INFO-VALIDATOR-REJECTION';
          }
          if (res.contentId) {
            this.isDocuments = true;
          }
          doc = res;
        });
    }
  }
  viewContributorInfo() {
    if (!this.isIndividualApp) {
      this.contributorService.selectedSIN = this.socialInsuranceNo;
      this.router.navigate([BenefitConstants.ROUTE_BENEFIT_LIST(null, this.socialInsuranceNo)], {
        state: { loadPageWithLabel: 'BENEFITS' }
      });
    } else {
      this.router.navigateByUrl(`home/benefits/individual`);
    }
  }
  navigateToAdjustment(adjustmentId: number) {
    this.coreAdjustmentService.identifier = this.personId;
    this.router.navigate(['/home/adjustment/benefit-adjustment'], {
      queryParams: { adjustmentId: adjustmentId }
    });
  }
  getContributor() {
    this.adjustmentService.getPersonById(this.personId).subscribe(data => {
      this.socialInsuranceNo = data?.socialInsuranceNo;
    });
  }
  /**
   * Approving by the validator.
   */
  ConfirmApproveAdjustmentRepayment() {
    this.confirmApprovePayment(this.form, this.checkRepayForm);
  }
  /**
   * While rejecting from validator
   */
  ConfirmRejectAdjustmentRepayment() {
    this.confirmRejectPayment(this.form);
  }
  /**
   * when return to establishment action is performed, comments will be shared
   */
  ConfirmReturnAdjustmentRepayment() {
    this.returnPayment(this.form);
  }
}
