/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  Component,
  OnInit,
  Input,
  TemplateRef,
  SimpleChanges,
  OnChanges,
  HostListener,
  Output,
  EventEmitter
} from '@angular/core';
import { BenefitDetails, AverageMonthlyWagePeriod, AnnuityResponseDto, ContributionPlan } from '../../../shared/models';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { GosiCalendar, formatDate, BenefitsGosiShowRolesConstants } from '@gosi-ui/core';
import { BenefitType, MonthYearLabel, PensionReformEligibility } from '../../../shared/enum';
import * as moment from 'moment';
import {
  getLatestEventForReCalculation,
  isEligibleForPensionReform,
  isLumpsumBenefit,
  isOccBenefit
} from '../../../shared/utils';

@Component({
  selector: 'bnt-woman-contributor-details-dc',
  templateUrl: './woman-contributor-details-dc.component.html',
  styleUrls: ['./woman-contributor-details-dc.component.scss']
})
export class WomanContributorDetailsDcComponent implements OnInit, OnChanges {
  /*
   * Local variables
   */
  amount = [];
  averageMonthlyWagePeriods: AverageMonthlyWagePeriod[];
  index = 0;
  modalRef: BsModalRef;
  isHeirPension: boolean;
  isHeirLumpsum: boolean;
  isLumpsum: boolean;
  isOccCalc = false;
  benefitTypes = BenefitType;
  isSmallScreen: boolean;
  plans: ContributionPlan[] = [];
  totalBenefit = 0;
  totalNewLawMonths = 0;
  totalOldLawMonths = 0;
  averageMonthlyTotal = 0;
  // latestRaisedBenefitAmount: number;
  viewOnly = BenefitsGosiShowRolesConstants.BENEFIT_READ;
  pensionReformEligibilityEnum = PensionReformEligibility;
  /*
   * Input
   */
  @Input() benefitCalculationDetails: BenefitDetails;
  @Input() oldBenefitDetails: BenefitDetails;
  @Input() annuityBenefitDetails: AnnuityResponseDto;
  @Input() lang;
  @Input() benefitType: string;
  @Input() requestType: string;
  @Input() isAddModifyBenefit: boolean;
  @Input() isHeirBenefit = false;
  @Input() isValidator = false;
  @Input() eligibleForPensionReform = false;


  /**
   * Output
   */
  @Output() navigateToInjury = new EventEmitter();
  @Output() navigateToBenefitsHistory = new EventEmitter();
  @Output() getAsyncHeirHistory = new EventEmitter();

  constructor(readonly modalService: BsModalService) {}

  ngOnInit(): void {
    this.amount[this.index] = 0;
    if (this.benefitCalculationDetails) {
      this.plans = this.benefitCalculationDetails?.additionalContribution?.contributionPlans;
      // if (this.benefitCalculationDetails?.reCalculationDetails) {
      //   const latestEventInReCalculationDetails = getLatestEventForReCalculation(
      //     this.benefitCalculationDetails?.reCalculationDetails?.filter(period => period.startDate?.gregorian)
      //   );
      //   this.latestRaisedBenefitAmount = latestEventInReCalculationDetails?.raisedBasicBenefitAmount;
      // }
    }
    if (isOccBenefit(this.benefitType)) {
      this.isOccCalc = true;
    }
  }

  /*
   * This methid is for detecting changes in input property
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.benefitType) {
      // this.benefitType = changes.benefitType.currentValue;
      if (
        this.benefitType === BenefitType.heirMissingPension ||
        this.benefitType === BenefitType.heirDeathPension2 ||
        this.benefitType === BenefitType.heirDeathPension
      ) {
        this.isHeirPension = true;
      }
      if (
        this.benefitType === BenefitType.heirLumpsum ||
        this.benefitType === BenefitType.heirMissingLumpsum ||
        this.benefitType === BenefitType.heirLumpsumDeadContributor
      ) {
        this.isHeirLumpsum = true;
      }
      if (isLumpsumBenefit(this.benefitType)) {
        this.isLumpsum = true;
      }
    }
    if(changes.annuityBenefitDetails){
      this.getAsyncHeirHistory.emit()
    }
    if (changes.requestType && changes.requestType.currentValue) {
      this.requestType = changes.requestType.currentValue;
    }
    if (changes.oldBenefitDetails && changes.oldBenefitDetails.currentValue) {
      this.oldBenefitDetails = changes.oldBenefitDetails.currentValue[0];
    }
    if (changes && changes.benefitCalculationDetails && changes.benefitCalculationDetails.currentValue) {
      this.benefitCalculationDetails = changes.benefitCalculationDetails.currentValue;
      if (this.benefitCalculationDetails) {
        this.averageMonthlyWagePeriods = this.benefitCalculationDetails.averageMonthlyWagePeriods;
        this.getTotalAmount();
        this.plans = this.benefitCalculationDetails?.additionalContribution?.contributionPlans;
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    const scrWidth = window.innerWidth;
    this.isSmallScreen = scrWidth <= 992 ? true : false;
  }

  /*
   * This methid is to show Modal
   */
  showModal(templateRef: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-xl' }));
  }
  /** This method is to hide the modal reference. */
  hideModal() {
    this.modalRef.hide();
  }
  geMonthForTrans(date: GosiCalendar) {
    let monthLabel = '';
    if (date?.gregorian) {
      monthLabel = Object.values(MonthYearLabel)[moment(date.gregorian).toDate().getMonth()];
    }
    return monthLabel;
  }
  /*
   * This methid is to get total amount
   */
  getTotalAmount() {
    if (this.averageMonthlyWagePeriods) {
      this.averageMonthlyWagePeriods.forEach(monthlyWage => {
        this.totalOldLawMonths = this.totalOldLawMonths + monthlyWage.noOfOldLawMonths;
        this.totalNewLawMonths = this.totalNewLawMonths + monthlyWage.noOfNewLawMonths;
        this.totalBenefit = this.totalBenefit + monthlyWage.benefitAmount;
        this.averageMonthlyTotal = this.averageMonthlyTotal + monthlyWage.averageMonthlyWage;
      });
    }
  }
  viewInjuryDetails(injuryId: number) {
    this.navigateToInjury.emit(injuryId);
  }
  viewHistory() {
    this.navigateToBenefitsHistory.emit();
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
  isNonOccBenefit() {
    return (
      this.benefitType === 'Non-Occupational Disability Lumpsum Benefit' ||
      this.benefitType === 'Non-Occupational Disability Pension Benefit'
    );
  }

  isPensionReform(){
    return isEligibleForPensionReform(this.benefitType, this.isLumpsum, this.eligibleForPensionReform)
  }

}
