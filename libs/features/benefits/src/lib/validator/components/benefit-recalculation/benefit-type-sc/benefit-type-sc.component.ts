import { Component, OnInit } from '@angular/core';
import { DocumentItem, GosiCalendar, monthDiff, Role, BilingualText, formatDate } from '@gosi-ui/core';
import {
  AnnuityResponseDto,
  DependentDetails,
  DependentHistory,
  BenefitRecalculation,
  createDetailForm,
  PaymentDetail
} from '../../../../shared';
import { BenefitRecalculationBaseScComponent } from '../../../base/benefit-recalculation-sc.base.component';

@Component({
  selector: 'bnt-benefit-type-sc',
  templateUrl: './benefit-type-sc.component.html',
  styleUrls: ['./benefit-type-sc.component.scss']
})
export class BenefitTypeScComponent extends BenefitRecalculationBaseScComponent implements OnInit {
  benefitDetails: AnnuityResponseDto;
  benefitPaymentDetails: PaymentDetail;
  benefitType: string;
  comments;
  dependentDetails: DependentDetails[] = [];
  dependentHistory: DependentHistory;
  documents: DocumentItem[];
  readonly Math = Math;
  notificationDate: GosiCalendar;
  requestType: string;
  benefitRecalculationData: BenefitRecalculation;
  rolesEnum = Role;

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.retirementForm = createDetailForm(this.fb);
    this.initialiseView(this.routerData);
    this.setButtonConditions(this.payload?.assignedRole,this.payload?.resourceType);
    this.getContributorBenefits();
    this.getBenefitRecalculation();
    this.getDependentDetails(this.personId, this.requestId, this.referenceNo);
    this.getPaymentDetails();
  }
  getContributorBenefits() {
    this.manageBenefitService.getBenefitDetails(this.personId, this.requestId).subscribe(res => {
      this.benefitDetails = res;
    });
  }
  /** Method to get benefit recalculation details */
  getBenefitRecalculation() {
    this.manageBenefitService.getBenefitRecalculation(this.personId, this.requestId).subscribe(res => {
      this.benefitRecalculationData = res;
    });
  }
  /** Finding the Number of Months */
  getMonths(startDate, endDate) {
    return monthDiff(new Date(startDate), new Date(endDate));
  }
  /** Method to fetch payment details **/
  getPaymentDetails() {
    this.manageBenefitService.getPaymentDetails(this.personId, this.requestId).subscribe(res => {
      this.benefitPaymentDetails = res;
    });
  }
  /** Method to get Adjustment reasons */
  getAdjustmentReasons(reasons: BilingualText[]) {
    if (reasons && reasons.length) {
      return this.lang === 'en'
        ? reasons.map(reason => reason.english).join(', ')
        : reasons.map(reason => reason.arabic).join(', ');
    }
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
}
