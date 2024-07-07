/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ValidatorBaseScComponent } from '../../base/validator-sc.base-component';
import {
  UITransactionType,
  EligibilityMonths,
  MonthYearLabel,
  EligibilityMonthsAmount,
  BenefitConstants,
  BenefitDetails,
  BenefitType,
  createDetailForm,
  bindQueryParamsToForm,
  Benefits,
  showErrorMessage,
  ActiveSanedAppeal,
  AppealDetails,
  getEligiblePeriodLov
} from '../../../shared';
import moment from 'moment-timezone';
import { Channel, BilingualText } from '@gosi-ui/core';

@Component({
  selector: 'bnt-approve-saned-sc',
  templateUrl: './approve-saned-sc.component.html',
  styleUrls: ['./approve-saned-sc.component.scss']
})
export class ApproveSanedScComponent extends ValidatorBaseScComponent implements OnInit, OnDestroy {
  comments: null;
  benefitDetailsSaned: BenefitDetails;
  eligibleMonths: EligibilityMonths[];
  monthLabel: string;
  yearLabel: number;
  months: number;
  govtEmp: boolean;
  eligibleMonthAmount: EligibilityMonthsAmount;
  eligibleMonthsAmounts: EligibilityMonthsAmount[] = [];
  requestSanedForm: FormGroup;
  isAppealDetails = false;
  uiEligibility: Benefits;
  selectedInspection: BilingualText;
  payForm: FormGroup;
  Channel = Channel;
  /**
   *
   * This method is to initialize the component
   */
  ngOnInit() {
    this.requestSanedForm = createDetailForm(this.fb);
    bindQueryParamsToForm(this.routerData, this.requestSanedForm);
    this.intialiseTheView(this.routerData);
    /* Setting rejection Indicatior */
    super.getRejectionReason(this.requestSanedForm);
    this.transactionType = UITransactionType.FO_REQUEST_SANED;
    if (this.channel === Channel.GOSI_ONLINE) {
      this.transactionType = UITransactionType.GOL_REQUEST_SANED;
    }
    this.getBenefitRequestDetails();
    this.getUIEligibilityDetails(this.socialInsuranceNo, BenefitType.ui);
    this.inspectionList = this.sanedBenefitService.getSanedInspectionType();
    this.inspectionList.subscribe(inspection => {
      this.selectedInspection = inspection.items[0].value;
    });
    this.payForm = this.fb.group({
      checkBoxFlag: [false]
    });
  }

  /**
   * Method to fetch the contributor and saned details from Json
   */
  getBenefitCalculationDetails() {
    this.sanedBenefitService.getBenefitCalculationsForSaned(this.socialInsuranceNo, this.requestDate).subscribe(
      res => {
        this.benefitDetailsSaned = res;
        if (this.benefitDetailsSaned.initialMonths && this.benefitDetailsSaned.remainingMonths) {
          this.months = this.benefitDetailsSaned.initialMonths.noOfMonths;
          this.benefitDetailsSaned.remainingMonths.noOfMonths = this.months + 1;
        }
        if (!this.benefitDetailsSaned.initialMonths && this.benefitDetailsSaned.availedMonths) {
          this.benefitDetailsSaned.remainingMonths.noOfMonths = this.benefitDetailsSaned.availedMonths + 1;
        }
        this.eligibleMonths = res.eligibleMonths;
        if (this.eligibleMonths) {
          this.eligibleMonths.forEach(eligibilityMonths => {
            this.eligibleMonthAmount = new EligibilityMonthsAmount();

            this.eligibleMonthAmount.yearLabel = moment(eligibilityMonths.month.gregorian).toDate().getFullYear();
            this.eligibleMonthAmount.monthLabel =
              Object.values(MonthYearLabel)[moment(eligibilityMonths.month.gregorian).toDate().getMonth()];
            this.eligibleMonthAmount.amount = eligibilityMonths.amount;
            this.eligibleMonthsAmounts.push(this.eligibleMonthAmount);
          });
        }
        this.payForm
          .get('checkBoxFlag')
          .setValue(this.benefitDetailsSaned?.adjustmentCalculationDetails?.eligibleForDirectPayment);
      },
      err => {
        showErrorMessage(err, this.alertService);
      }
    );
  }

  /**
   * Method to fetch the contributor and saned details
   */
  getBenefitRequestDetails() {
    this.sanedBenefitService
      .getBenefitRequestDetails(this.socialInsuranceNo, this.requestId, this.referenceNo)
      .subscribe(
        res => {
          if (res) {
            this.benefitRequest = res;
            this.personNameEnglish = this.benefitRequest.contributorName.english;
            this.personNameArabic = this.benefitRequest.contributorName.arabic;
            this.requestDate = this.benefitRequest.requestDate;
            this.getBenefitCalculationDetails();
            if (this.benefitRequest.personId) {
              this.benefitPropertyService.setPersonId(this.benefitRequest.personId);
              this.getBankDetails(this.benefitRequest.personId.toString());
            }
          }
        },
        err => {
          showErrorMessage(err, this.alertService);
        }
      );
  }
  /**
   * Navigate to document scan page
   */
  navigateToScan() {
    this.routerData.tabIndicator = 2;
    this.routerData.selectWizard = BenefitConstants.UI_DOCUMENTS;
    this.uiBenefitService.setBenefitStatus(BenefitConstants.VAL_EDIT_BENEFIT);
    this.manageBenefitService.setRequestDate(this.benefitRequest.requestDate);
    this.router.navigate([BenefitConstants.ROUTE_APPLY_BENEFIT]);
  }
  /**
   * Method to show approve modal.
   * @param templateRef
   */
  showTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.showModal(templateRef);
  }

  /**
   * While rejecting from validator
   */
  confirmRejectSaned() {
    this.confirmReject(this.requestSanedForm);
  }

  /**
   * Approving by the validator.
   */
  confirmApproveSaned() {
    this.confirmApprove(this.requestSanedForm);
  }

  /**
   * when return to establishment action is performed, comments will be shared
   */
  returnSaned() {
    this.confirmReturn(this.requestSanedForm);
  }
  /** method to get reason for benefit*/
  getUIEligibilityDetails(sin: number, benefitType: string) {
    this.uiBenefitService.getEligibleUiBenefitByType(sin, benefitType).subscribe(
      data => {
        if (data) {
          this.uiEligibility = data;
          let transactionKey = UITransactionType.REQUEST_SANED;
          if (this.uiEligibility?.appeal) {
            transactionKey = UITransactionType.APPEAL_UNEMPLOYMENT_INSURANCE;
          }
          this.getDocuments(transactionKey, this.transactionType, this.requestId);
          if (data.benefitType && data.benefitType.english === this.benefitType) {
            if (data.warningMessages) {
              this.alertService.showWarning(data.warningMessages[0]);
            }
          }
        }
      },
      err => {
        showErrorMessage(err, this.alertService);
      }
    );
  }

  reDirectUsersToApplyScreens() {
    this.uiBenefitService.setBenefitStatus(BenefitConstants.VAL_EDIT_BENEFIT);
    this.routerData.tabIndicator = 1;
    this.routerData.selectWizard = this.uiEligibility?.appeal
      ? BenefitConstants.UI_RAISE_APPEAL
      : BenefitConstants.UI_SANED_DETAILS;
    this.manageBenefitService.setRequestDate(this.benefitRequest.requestDate);
    if (this.uiEligibility?.appeal) {
      const appealDetails: AppealDetails = {
        eligiblePeriod: this.benefitRequest.selectedEligiblePeriod
          ? getEligiblePeriodLov(this.benefitRequest.selectedEligiblePeriod)
          : null,

        reasonForAppeal: this.benefitRequest.appealReason,
        // periodSelected : this.benefitRequest.selectedEligiblePeriod,
        otherReason: this.benefitRequest.reasonDescription
      };
      const appealBenefitInfo: ActiveSanedAppeal = new ActiveSanedAppeal(
        appealDetails,
        this.bankDetails,
        this.benefitRequestId,
        this.requestDate,
        this.referenceNo
      );
      this.uiBenefitService.setActiveSanedAppeal(appealBenefitInfo);
      this.router.navigate([BenefitConstants.ROUTE_APPEAL_DETAILS]);
    } else {
      this.router.navigate([BenefitConstants.ROUTE_APPLY_BENEFIT]);
    }
  }

  /**
   *
   * This method is to perform cleanup activities when an instance of component is destroyed.
   * @memberof BaseComponent
   */
  ngOnDestroy() {
    this.alertService.clearAllErrorAlerts();
    this.alertService.clearAllWarningAlerts();
  }
  getDocuments(transactionKey: string, transactionType: string, benefitRequestId: number) {
    this.benefitDocumentService
      .getUploadedDocuments(benefitRequestId, transactionKey, transactionType)
      .subscribe(res => {
        this.documentList = res;
      });
  }
  /** Method  to  navigate  to  View Maintain Adjustment */
  viewMaintainAdjustment() {
    this.adjustmentPaymentService.identifier = this.benefitRequest?.personId;
    this.adjustmentPaymentService.sin = this.socialInsuranceNo;
    this.router.navigate([BenefitConstants.ROUTE_ADJUSTMENT]);
  }
}
