import {Component, OnInit, ViewChild, TemplateRef, SimpleChanges, OnChanges} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BenefitRecalculationBaseScComponent } from '../../../base/benefit-recalculation-sc.base.component';
import {
  createDetailForm,
  bindQueryParamsToForm,
  BenefitCalcDetailsDcComponent,
  AnnuityCalculationDetailsDcComponent
} from '../../../../shared';
import { Role } from '@gosi-ui/core';

@Component({
  selector: 'bnt-validator-saned-cancellation-sc',
  templateUrl: './validator-saned-cancellation-sc.component.html',
  styleUrls: ['./validator-saned-cancellation-sc.component.scss']
})
export class ValidatorSanedCancellationScComponent extends BenefitRecalculationBaseScComponent implements OnInit, OnChanges {
  /**
   * ViewChild components
   */

  @ViewChild('cancelSanedTemplate', { static: true })
  cancelSanedTemplate: TemplateRef<HTMLElement>;
    payForm: FormGroup;
  retirementForm: FormGroup;

  ngOnInit(): void {
    this.retirementForm = createDetailForm(this.fb);
    bindQueryParamsToForm(this.routerData, this.retirementForm);
    this.payForm = this.fb.group({
      checkBoxFlag: [false]
    });
    this.isSaned = true;
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.initialiseView(this.routerData);
    this.getSanedBenefits();
    this.getSanedRecalculationDetails();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      this.getSanedRecalculationDetails();
    }
  }
  /** Method to get contributor details from benefit details */
  getSanedBenefits() {
    this.sanedBenefitService.getBenefitRequestDetails(this.personId, this.requestId, null).subscribe(
      res => {
        this.benefitSanedDetails = res;
        if(this.benefitSanedDetails?.status?.english === 'Nullified' || this.benefitSanedDetails?.status?.english === 'Suspended'){
          this.confirmReject(
            this.fb.group({
              rejectionReason: this.fb.group({
                arabic: ['غير مؤهل للمنفعة'],
                english: ['Ineligible for the benefit']
              }),
              comments: 'Ineligible for the benefit’ (غير مؤهل للمنفعة)'
            })
          );
        }
      },
      err => {
        this.alertService.showError(err.error.message);
      }
    );
  }
    /** Method to get recalculation benefit details */
  getSanedRecalculationDetails() {
    if(this.personId && this.requestId){
      this.sanedBenefitService.getBenefitRecalculateDetails(this.personId, this.requestId, this.referenceNo).subscribe(
        res => {
          this.sanedRecalculationDetails = res;
          if (this.sanedRecalculationDetails) {
            this.benefitRecalculationDetails = {
              ...this.benefitRecalculationDetails,
              averageMonthlyWagePeriods: this.sanedRecalculationDetails?.averageMonthlyWagePeriods,
              oldAverageMonthlyWagePeriods: this.sanedRecalculationDetails?.oldAverageMonthlyWagePeriods,
              totalContributionMonths: this.sanedRecalculationDetails?.totalContributionMonths,
              averageMonthlyContributoryWage: this.sanedRecalculationDetails?.averageMonthlyContributoryWage
            };
            this.benefitCalculationDetails = {
              ...this.benefitCalculationDetails,
              reCalculation:
                this.sanedRecalculationDetails?.recalculationGroupedPeriods[0]?.recalcPeriods[0]?.reCalculation
            };
            this.payForm.get('checkBoxFlag').setValue(this.sanedRecalculationDetails?.directPaymentStatus);
            this.recalculationInfoMessages = res.infoMessages;
            this.recalculationAlertMessages = this.adjustmentPaymentService.mapMessagesToAlert({
              details: this.recalculationInfoMessages,
              message: null
            });
          }
        },
        err => {
          this.alertService.showError(err.error.message);
        }
      );
    }
  }
  /** Method to open Recalculation wage modal */
  howToCalculate(calculationPeriod) {
    this.commonModalRef = this.modalService.show(
      AnnuityCalculationDetailsDcComponent,
      Object.assign({}, { class: 'modal-xl' })
    );
    this.commonModalRef.content.benefitCalculationDetails = this.benefitRecalculationDetails;
    this.commonModalRef.content.benefitRecalculationDetails = this.benefitCalculationDetails;
    this.commonModalRef.content.averageMonthlyWagePeriods = this.benefitRecalculationDetails?.averageMonthlyWagePeriods;
    this.commonModalRef.content.oldAverageMonthlyWagePeriods =
      this.benefitRecalculationDetails?.oldAverageMonthlyWagePeriods;
    this.commonModalRef.content.isSaned = true;
    this.commonModalRef.content.isRecalculation = true;
    this.commonModalRef.content.lang = this.lang;
    if (this.commonModalRef)
      this.commonModalRef.content.close.subscribe(() => {
        this.commonModalRef.hide();
      });
  }
  /** Method to approve saned with payment status */
  approvePaymentSanedInspection(form) {
    if (this.payload.assignedRole === Role.VALIDATOR_1 && this.sanedRecalculationDetails?.netAdjustmentAmount) {
      this.sanedBenefitService
        .editDirectPayment(this.personId, this.requestId, this.payForm.get('checkBoxFlag').value)
        .subscribe(
          () => {
            this.confirmApprove(form);
          },
          err => {
            this.alertService.showError(err.error.message);
          }
        );
    } else {
      this.confirmApprove(form);
    }
  }
}
