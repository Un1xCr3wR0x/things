/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BehaviorSubject } from 'rxjs';
import {
  Component,
  OnInit,
  Inject,
  Input,
  SimpleChanges,
  TemplateRef,
  Output,
  EventEmitter,
  HostListener,
  OnChanges
} from '@angular/core';
import {
  CoreAdjustmentService,
  LanguageToken,
  LovList,
  GosiCalendar,
  convertToYYYYMMDD,
  RouterDataToken,
  RouterData,
  formatDate,
  BilingualText,
  checkIqamaOrBorderOrPassport
} from '@gosi-ui/core';
import { Location } from '@angular/common';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import * as moment from 'moment';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import {
  AverageMonthlyWagePeriod,
  BenefitDetails,
  ContributionPlan,
  AnnuityResponseDto,
  ValidateRequest,
  HeirHistory,
  DependentTransaction,
  EachHeirDetail,
  SystemParameter,
  HeirBenefitDetails,
  Benefits,
  HeirDetailsRequest,
  PersonalInformation
} from '../../models';
import { MonthYearLabel, BenefitValues, BenefitStatus } from '../../enum';
import { isHeirBenefit, isHeirLumpsum, isHeirPension, isLumpsumBenefit, isOccBenefit } from '../../utils/benefitUtil';
import { BenefitConstants } from '../../../shared/constants/benefit-constants';
import { Router } from '@angular/router';
import {isEligibleForPensionReform} from "../../utils";

@Component({
  selector: 'bnt-gosi-ui-annuity-benefits-dc',
  templateUrl: './annuity-benefits-dc.component.html',
  styleUrls: ['./annuity-benefits-dc.component.scss']
})
export class AnnuityBenefitsDcComponent implements OnInit, OnChanges {
  /*
   * Local variables
   */
  benefitValues = BenefitValues;
  isLumpsum = false;
  isHeir = false;
  isHeirLumpsum = false;
  isHeirPension = false;
  isOcc = false;
  // isHeirLumpsum = isHeirLumpsum;
  isHeirBenefit = isHeirBenefit;
  amount = [];
  averageMonthlyTotal = 0;
  averageMonthlyWagePeriods: AverageMonthlyWagePeriod[];
  index = 0;
  lang = 'en';
  modalRef: BsModalRef;
  totalBenefit = 0;
  totalNewLawMonths = 0;
  totalOldLawMonths = 0;

  startDate: GosiCalendar;
  endDate: GosiCalendar;
  month: number;
  benefitAmount: number;
  paymentAmount: number;
  plans: ContributionPlan[] = [];
  percentage: number;
  isSmallScreen: boolean;
  // isLumpsum: boolean;

  requestId: number;
  personId: number;
  registrationNo: number;
  socialInsuranceNo: number;
  transactionNumber: number;
  referenceNo: number;
  nin: number;
  eligibleHeirList: HeirBenefitDetails[];

  showDependentHistoryLabel: boolean;
  showHelperHistoryLabel: boolean;
  showDeathGrantColumn = false;
  showAdjustmentsColumn = false;

  readonly benefitConstants = BenefitConstants;
  payload;
  dependentPercentageForm = new FormControl();
  DependentPercentageLov = new LovList([
    { value: { english: '25', arabic: '25' }, sequence: 1 },
    { value: { english: '100', arabic: '100' }, sequence: 2 }
  ]);
  heirTableHeading = [
    'BENEFITS.HEIR_NAME_VALIDATOR',
    'BENEFITS.RELATIONSHIP-WITH-CONTRIBUTOR',
    'BENEFITS.STATUS',
    'BENEFITS.BENEFIT-AMOUNT',
    'BENEFITS.DEATH-GRANT',
    'BENEFITS.ADJUSTMENTS',
    'BENEFITS.BENEFIT-AMOUNT-AFTER-DEDUCTIONS'
  ];
  benefitStatusEnum = BenefitStatus;

  /*
   * Input variables
   */
  @Input() isNonOcc = false;
  @Input() benefitCalculationDetails: BenefitDetails;
  @Input() benefitDetails: BenefitDetails;
  @Input() annuityResponse: AnnuityResponseDto;
  @Input() systemParameter: SystemParameter;
  @Input() requestpensionForm: FormGroup;
  @Input() parentForm: FormGroup;
  @Input() isAppPrivate: boolean;
  @Input() isModifyBackdated = false;
  @Input() deductionPlanList: LovList;
  @Input() benefitType: string;
  @Input() dependentHistory: DependentTransaction[];
  @Input() previousDependentHistory: DependentTransaction[];
  @Input() heirHistory: HeirHistory;
  @Input() showRequestDateDc = true;
  @Input() isValidator = false;
  @Input() heirEligibilityDetails: ValidateRequest[];
  @Input() benefitPeriodHistory: HeirHistory;
  @Input() showConfirmButton = false;
  @Input() eligibleForBenefit = false;
  @Input() systemRunDate: GosiCalendar;
  @Input() annuityBenefit: Benefits;
  @Input() benefitStatus: BilingualText;
  @Input() newRequestDate: GosiCalendar;
  @Input() lateRequest: boolean;
  @Input() maxDate: Date;
  @Input() isIndividualApp: boolean;
  @Input() heirDetailsData: HeirDetailsRequest;
  @Input() contributorDetails: PersonalInformation;
  @Input() isFuneral = false;
  @Input() isPension = false;
  @Input() annuitybenefits:Benefits[] = [];
  @Input() eligibleForPensionReform: boolean;
  @Input() isPpaOhDeath: boolean;
  @Input() heirBenefit:boolean;  

  /**
   * Output
   */
  @Output() setDeductionPlan = new EventEmitter();
  @Output() getBenefitDetailsByDate: EventEmitter<GosiCalendar> = new EventEmitter();
  @Output() showIneligibilityDetails: EventEmitter<ValidateRequest> = new EventEmitter();
  @Output() showBenefitsWagePopup: EventEmitter<EachHeirDetail> = new EventEmitter();
  @Output() navigateToAdjustmentDetails: EventEmitter<HeirBenefitDetails> = new EventEmitter();
  @Output() navigateToPrevAdjustment: EventEmitter<HeirBenefitDetails> = new EventEmitter();
  @Output() onPreviousAdjustmentsClicked = new EventEmitter();
  /**
   *
   * @param location
   * @param language
   */
  constructor(
    readonly adjustmentService: CoreAdjustmentService,
    readonly router: Router,
    readonly fb: FormBuilder,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly location: Location,
    readonly modalService: BsModalService
  ) {}

  /*
   * This methid is for initialization tasks
   */
  ngOnInit(): void {
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    this.amount[this.index] = 0;
    if (this.benefitDetails) {
      this.plans = this.benefitDetails?.additionalContribution?.contributionPlans;
      this.selectdeductionPlanMethod(BenefitValues.plan10);
    }
    this.checkBenefit();
  }
  /*
   * This methid is for detecting changes in input property
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.benefitDetails && changes.benefitDetails.currentValue) {
      this.benefitDetails = changes.benefitDetails.currentValue;
      if (this.benefitDetails) {
        this.averageMonthlyWagePeriods = this.benefitDetails.averageMonthlyWagePeriods;
        this.getTotalAmount();
        this.plans = this.benefitDetails?.additionalContribution?.contributionPlans;
        this.selectdeductionPlanMethod(BenefitValues.plan25);
        // Defect 472771: Ineligible heir details should not be showcase in the second table of eligibility details
        this.eligibleHeirList = this.benefitDetails?.heirBenefitDetails?.filter(
          eachHeir => eachHeir.benefitAmount && eachHeir?.benefitAmount !== 0
        );
        this.eligibleHeirList = this.eligibleHeirList.map(heir => {
          heir.heirIdentifier = heir?.identity.length ? checkIqamaOrBorderOrPassport(heir.identity) : null;
          return heir;
        });
        //TODO: Change logic, Refactor
        this.showDeathGrantColumn = this.eligibleHeirList.findIndex(heir => heir.deathGrant) >= 0;
        this.showAdjustmentsColumn =
          this.eligibleHeirList.findIndex(heir => heir.adjustmentCalculationDetails.previousAdjustmentAmount) >= 0;
        if (!this.showDeathGrantColumn)
          this.heirTableHeading = this.heirTableHeading.filter(heading => heading != 'BENEFITS.DEATH-GRANT');
        if (!this.showAdjustmentsColumn)
          this.heirTableHeading = this.heirTableHeading.filter(heading => heading != 'BENEFITS.ADJUSTMENTS');
        if (
          this.eligibleHeirList.findIndex(
            val => val.benefitAmountAfterDeduction || val.benefitAmountAfterDeduction === 0
          ) < 0
        )
          this.heirTableHeading = this.heirTableHeading.filter(
            heading => heading != 'BENEFITS.BENEFIT-AMOUNT-AFTER-DEDUCTIONS'
          );
      }
    }
    if (changes && changes.annuityResponse && changes.annuityResponse.currentValue) {
      this.annuityResponse = changes.annuityResponse.currentValue;
      if (this.annuityResponse?.additionalContribution) {
        this.selectdeductionPlanForValidatorEdit(this.annuityResponse);
      }
    }
    if (changes && changes.dependentHistory && changes.dependentHistory.currentValue) {
      this.dependentHistory = changes.dependentHistory.currentValue;
      this.showHistoryLabels();
    }
    // if (changes && changes.benefitType && changes.benefitType.currentValue) {
    //   this.benefitType = changes.benefitType.currentValue;
    this.checkBenefit();
    // }
  }
  /*
   * This methid is to show Modal
   */
  showModal(templateRef: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-xl' }));
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
  /*
   * This method is to set deduction plan
   */
  selectdeductionPlanMethod(type: string) {
    this.plans?.forEach(plan => {
      if (type === BenefitValues.plan10) {
        this.percentage = 10;
        this.requestpensionForm?.get('deductionPlan.english').setValue(BenefitValues.plan10);
      } else if (type === BenefitValues.plan25) {
        this.percentage = 25;
        this.requestpensionForm?.get('deductionPlan.english').setValue(BenefitValues.plan25);
      }
      if (plan.deductionPercentage === this.percentage) {
        this.startDate = plan.startDate;
        this.endDate = plan.endDate;
        this.benefitAmount = plan.deductionAmount;
        this.month = plan.recoveryPeriodMonths;
        this.paymentAmount = plan.paymentAmount;
      }
    });
    this.setDeductionPlan.emit(this.percentage);
  }

  showIneligibilityReasons(details: ValidateRequest) {
    this.showIneligibilityDetails.emit(details);
  }

  showBenefitWageDetails(benefitWageDetail: EachHeirDetail) {
    this.showBenefitsWagePopup.emit(benefitWageDetail);
  }

  // checkIsHeir() {
  //   return isHeirBenefit(this.benefitType);
  // }
  checkBenefit() {
    if (isLumpsumBenefit(this.benefitType)) {
      this.isLumpsum = true;
    }
    if (isOccBenefit(this.benefitType)) {
      this.isOcc = true;
    }

    if (isHeirBenefit(this.benefitType)) {
      this.isHeir = true;
      if (isHeirPension(this.benefitType)) {
        this.isHeirPension = true;
      } else if (isHeirLumpsum(this.benefitType)) {
        this.isHeirLumpsum = true;
      }
    }
    // if (isLumpsumBenefit(this.benefitType)) {
    //   this.isLumpsum = true;
    // }
    // if (isHeirLumpsum(this.benefitType)) {
    //   this.isHeirLumpsum = true;
    // }
    // if (isHeirPension(this.benefitType)) {
    //   this.isHeirPension = true;
    // }
    // if (isHeirBenefit(this.benefitType)) {
    //   this.isHeir = true;
    // }
  }
  /*
   * This method is to set deduction plan for Validator edit flow
   */
  selectdeductionPlanForValidatorEdit(annuityResponseDto: AnnuityResponseDto) {
    if (annuityResponseDto.additionalContribution) {
      this.percentage = annuityResponseDto.additionalContribution.deductionPercent;
      if (this.percentage === 10) {
        this.requestpensionForm?.get('deductionPlan.english').setValue(BenefitValues.plan10);
      } else if (this.percentage === 25) {
        this.requestpensionForm?.get('deductionPlan.english').setValue(BenefitValues.plan25);
      }
      this.startDate = annuityResponseDto.additionalContribution.startDate;
      this.endDate = annuityResponseDto.additionalContribution.endDate;
      this.benefitAmount = annuityResponseDto.additionalContribution.deductionAmount;
      this.month = annuityResponseDto.additionalContribution.recoveryPeriodMonths;
      this.paymentAmount = annuityResponseDto.additionalContribution.paymentAmount;
    }
    this.setDeductionPlan.emit(this.percentage);
  }
  /** This method is to hide the modal reference. */
  hideModal() {
    this.modalRef.hide();
  }
  // method to get month labels for display
  geMonthForTrans(date: GosiCalendar) {
    let monthLabel = '';
    if (date?.gregorian) {
      monthLabel = Object.values(MonthYearLabel)[moment(date.gregorian).toDate().getMonth()];
    }
    return monthLabel;
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    const scrWidth = window.innerWidth;
    this.isSmallScreen = scrWidth <= 992 ? true : false;
  }
  requestDateChanged(date: GosiCalendar) {
    this.getBenefitDetailsByDate.emit(date);
  }
  checkHijiri(date) {
    if (convertToYYYYMMDD(date.toString()) < convertToYYYYMMDD(this.systemParameter.OLD_LAW_DATE.toString())) {
      return true;
    } else {
      return false;
    }
  }

  selectDependentPercetage(value) {}

  showHistoryLabels() {
    if (this.dependentHistory && this.dependentHistory.length > 0) {
      this.dependentHistory.forEach(history => {
        if (!this.showDependentHistoryLabel)
          this.showDependentHistoryLabel = history.dependentsDetails && history.dependentsDetails.length > 0;

        if (!this.showHelperHistoryLabel)
          this.showHelperHistoryLabel =
            history?.helperAllowanceDetails?.allowanceAmount || history?.helperAllowanceDetails?.allowanceEndDate
              ? true
              : false;
      });
    }
  }

  navigateToAdjustmentDetailsHeir(event: HeirBenefitDetails) {
    this.navigateToAdjustmentDetails.emit(event);
  }
  navigateToPrevAdjustmentHeir(event: HeirBenefitDetails) {
    this.navigateToPrevAdjustment.emit(event);
  }
  onViewPreviousDetails() {
    this.onPreviousAdjustmentsClicked.emit();
  }
  // TO BE CHANGED
  initialiseView(routerData) {
    if (routerData.payload) {
      this.payload = JSON.parse(routerData.payload);
      this.personId = this.payload.socialInsuranceNo;
      this.registrationNo = this.payload.registrationNo;
      this.requestId = this.payload.id;
      this.socialInsuranceNo = +this.routerData.idParams.get('socialInsuranceNo');
      this.transactionNumber = this.payload.referenceNo;
      this.referenceNo = this.payload.referenceNo;
      this.nin = this.payload.nin;
    }
  }

  viewPrevAdjustment(benefitParam) {
    this.adjustmentService.identifier = this.requestId;
    this.router.navigate([BenefitConstants.ROUTE_ADJUSTMENT], {
      queryParams: { from: benefitParam }
    });
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }

  isPensionReform(){
    return isEligibleForPensionReform(this.benefitType, this.isLumpsum, this.eligibleForPensionReform)
  }
}
