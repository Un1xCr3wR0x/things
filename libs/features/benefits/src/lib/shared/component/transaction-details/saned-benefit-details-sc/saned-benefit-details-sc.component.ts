import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import moment from 'moment';
import {
  ActiveSanedAppeal,
  AppealDetails,
  BenefitDetails,
  Benefits,
  EligibilityMonths,
  EligibilityMonthsAmount,
  PatchPersonBankDetails,
  UiApply
} from '../../../models';
import { TransactionPensionBase } from '../../base/transaction-pension.base';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeEnum, GosiCalendar, startOfDay, Transaction, TransactionStatus } from '@gosi-ui/core';
import { getEligiblePeriodLov, getRequestDateFromForm, showErrorMessage } from '../../../utils';
import { BenefitType, MonthYearLabel } from '../../../enum';
import { BenefitConstants } from '../../../constants';
import { ModifyRequestDateDcComponent } from '../../modify-request-date-dc/modify-request-date-dc.component';
import { EligibilityCriteriaDcComponent } from '../../eligibility-criteria-dc/eligibility-criteria-dc.component';
import { BsModalRef } from 'ngx-bootstrap/modal';
@Component({
  selector: 'bnt-saned-benefit-details-sc',
  templateUrl: './saned-benefit-details-sc.component.html',
  styleUrls: ['./saned-benefit-details-sc.component.scss']
})
export class SanedBenefitDetailsScComponent extends TransactionPensionBase implements OnInit {
  /** Input Variables */
  @Input() isTransactionScreen = false;
  @Input() transaction: Transaction;
  @Input() socialInsuranceNo: number;
  @Input() requestId: number;
  @Input() referenceNo: number;
  @Input() canEditSaned;
  @Input() validatorAppealCanEdit;
  @Input() isReopenCase;
  @Input() retirementForm: FormGroup;
  @Input() eligibleForPensionReform: boolean;
  @Output() calculateOutput: EventEmitter<BenefitDetails> = new EventEmitter();
  showIneligibilityPoup = false;
  benefitDetailsSaned: BenefitDetails;
  eligibleMonths: EligibilityMonths[];
  monthLabel: string;
  yearLabel: number;
  months: number;
  govtEmp: boolean;
  eligibleMonthAmount: EligibilityMonthsAmount;
  eligibleMonthsAmounts: EligibilityMonthsAmount[] = [];
  isAppealDetails = false;
  uiEligibility: Benefits;
  payForm: FormGroup;
  isTransactionCompleted = false;
  ineligibilityModalRef: BsModalRef;
  selectedRequestDate: GosiCalendar;
  ngOnInit(): void {
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
    this.isTransactionCompleted = this.transaction?.status?.english.toUpperCase() === TransactionStatus.COMPLETED;
    this.getBenefitRequestDetails();
  }

  /** method to get reason for benefit*/
  getUIEligibilityDetails(sin: number, benefitType: string) {
    this.uiBenefitService
      .getEligibleUiBenefitByType(
        sin,
        benefitType,
        moment(this.requestDate.gregorian, 'YYYY-MM-DD').format('YYYY-MM-DD')
      )
      .subscribe(
        data => {
          if (data) {
            this.uiEligibility = data;
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

  /**
   * Method to fetch the contributor and saned details from Json
   */
  getBenefitCalculationDetails(socialInsuranceNo: number, requestDate: GosiCalendar, benefitRequestId: number) {
    this.sanedBenefitService.getBenefitCalculationsForSaned(socialInsuranceNo, requestDate, benefitRequestId).subscribe(
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
        this.retirementForm
          .get('checkBoxFlag')
          .setValue(this.benefitDetailsSaned?.adjustmentCalculationDetails?.eligibleForDirectPayment);
        this.calculateOutput.emit(this.benefitDetailsSaned);
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
    // const referenceNumber = this.isTransactionCompleted ? this.referenceNo : null;

    const referenceNumber = this.referenceNo ? this.referenceNo : null;
    const benefitRequestId = this.isTransactionCompleted ? this.requestId : null;
    if(this.socialInsuranceNo && this.requestId){
      this.sanedBenefitService
      .getBenefitRequestDetails(this.socialInsuranceNo, this.requestId, referenceNumber)
      .subscribe(
        res => {
          if (res) {
            this.benefitRequest = res;
            this.personNameEnglish = this.benefitRequest.contributorName.english;
            this.personNameArabic = this.benefitRequest.contributorName.arabic;
            this.requestDate = this.benefitRequest.requestDate;
            this.getBenefitCalculationDetails(this.socialInsuranceNo, this.requestDate, benefitRequestId);
            // if (this.benefitRequest.personId) {
            //   this.benefitPropertyService.setPersonId(this.benefitRequest.personId);
            //   this.getBankDetails(this.benefitRequest.personId.toString());
            // }
            if (this.benefitRequest?.bankAccount) {
              this.setBankDetails(this.benefitRequest?.bankAccount);
            }
            this.getUIEligibilityDetails(this.socialInsuranceNo, BenefitType.ui);
          }
        },
        err => {
          showErrorMessage(err, this.alertService);
        }
      );
    }
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
  viewContributorDetails() {
    if (!this.isIndividualApp) {
      this.routerData.stopNavigationToValidator = true;
      this.router.navigate([BenefitConstants.ROUTE_BENEFIT_LIST(null, this.socialInsuranceNo)], {
        state: { loadPageWithLabel: 'BENEFITS' }
      });
    } else {
      this.router.navigateByUrl(`home/benefits/individual`);
    }
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
      this.router.navigate([BenefitConstants.ROUTE_APPLY_BENEFIT]);
    }
  }
  /** Method  to  navigate  to  View Maintain Adjustment */
  viewMaintainAdjustment(benefitParam) {
    this.adjustmentPaymentService.identifier = this.benefitRequest?.personId;
    this.adjustmentPaymentService.sin = this.socialInsuranceNo;
    this.router.navigate([BenefitConstants.ROUTE_ADJUSTMENT], { queryParams: { from: benefitParam } });
  }
  showEditDateModal() {
    this.commonModalRef = this.modalService.show(
      ModifyRequestDateDcComponent,
      Object.assign({}, { class: 'modal-md' })
    );
    this.commonModalRef.content.showAlertMsg = false;
    this.commonModalRef.content.benefitRequest = this.benefitRequest;
    this.commonModalRef.content.systemRunDate = this.systemRunDate;
    if (this.commonModalRef)
      this.commonModalRef.content.onSave.subscribe(() => {
        this.checkEligibility(this.commonModalRef.content.requestDateForm.get('requestDate').value);
      });
    this.commonModalRef.content.showEligibilityPopup.subscribe(() => {
      this.ineligibilityModalRef = this.modalService.show(
        EligibilityCriteriaDcComponent,
        Object.assign({}, { class: 'modal-md' })
      );
      this.ineligibilityModalRef.content.benefitInfo = this.uiEligibility;
      this.ineligibilityModalRef.content.close.subscribe(() => {
        this.ineligibilityModalRef.hide();
      });
    });
    this.commonModalRef.content.close.subscribe(() => {
      this.commonModalRef.hide();
    });
  }
  checkEligibility(requestDate: GosiCalendar) {
    this.selectedRequestDate = requestDate;
    this.uiBenefitService
      .getEligibleUiBenefitByType(
        this.socialInsuranceNo,
        BenefitType.ui,
        moment(requestDate?.gregorian, 'YYYY-MM-DD').format('YYYY-MM-DD')
      )
      .subscribe(
        data => {
          if (data) {
            this.uiEligibility = data;
            this.showIneligibilityPoup = !this.uiEligibility?.eligible;
            if (data?.eligible) {
              this.saveModifiedDate();
            } else {
              // this.commonModalRef.content.showIneligibilityPoup = true;
              this.showIneligibilityPoup = true;
              this.commonModalRef.hide();
            }
          }
        },
        err => {
          showErrorMessage(err, this.alertService);
        }
      );
  }
  navigateToBenefitsHistory() {
    this.manageBenefitService.socialInsuranceNo = this.socialInsuranceNo;
    this.contributorService.selectedSIN = this.socialInsuranceNo;
    this.router.navigate([BenefitConstants.ROUTE_SANED_BENEFIT_HISTORY], {
      queryParams: {
        uihistory: true
      }
    });
  }
  saveModifiedDate() {
    const uiPayload: UiApply = new UiApply();
    uiPayload.requestDate = {
      gregorian: startOfDay(this.commonModalRef.content.requestDateForm.get('requestDate.gregorian').value),
      hijiri: this.commonModalRef.content.requestDateForm.get('requestDate.hijiri').value
    };
    uiPayload.referenceNo = this.referenceNo;
    uiPayload.appealReason = this.benefitRequest?.appealReason;
    uiPayload.reasonDescription = this.benefitRequest?.reasonDescription;
    uiPayload.directPayment = this.benefitRequest?.directPayment;
    uiPayload.eligiblePeriod = {
      ...uiPayload.eligiblePeriod,
      startDate: this.benefitDetailsSaned?.benefitStartDate,
      endDate: this.benefitRequest?.terminationDate
    };
    if (this.bankDetails) {
      uiPayload.bankAccount = {
        ...uiPayload.bankAccount,
        ibanBankAccountNo: this.bankDetails?.ibanBankAccountNo,
        bankName: this.bankDetails?.bankName,
        verificationStatus: this.bankDetails?.verificationStatus
      };
    }
    this.sanedBenefitService.updateBenefit(this.socialInsuranceNo, this.requestId, uiPayload).subscribe(
      data => {
        if (data) {
          this.benefitResponse = data;
          this.referenceNo = data.referenceNo;
          this.getBenefitRequestDetails();
          this.commonModalRef.hide();
          if (data?.message) this.showSuccessMessage(data?.message);
        }
      },
      err => {
        if (err.status === 400 || err.status === 422) {
          this.commonModalRef.content.showAlertMsg = true;
          showErrorMessage(err, this.alertService);
        }
        if (err.status === 500 || err.status === 404) {
          this.commonModalRef.content.showAlertMsg = true;
          this.alertService.showWarningByKey('BENEFITS.SUBMIT-FAILED-MSG');
        }
        this.goToTop();
      }
    );
  }

  showReasons() {
    const initialState = {
      benefitInfo: this.uiEligibility
    };

    this.ineligibilityModalRef = this.modalService.show(EligibilityCriteriaDcComponent, {
      backdrop: true,
      ignoreBackdropClick: true,
      class: `modal-xl modal-dialog-centered`,
      initialState
    });
    this.ineligibilityModalRef.content.benefitInfo = this.uiEligibility;
    this.ineligibilityModalRef.content.close.subscribe(() => {
      this.ineligibilityModalRef.hide();
    });
  }
}
