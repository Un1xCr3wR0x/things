/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  Inject,
  SimpleChanges,
  TemplateRef,
  OnChanges,
  HostListener
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import moment from 'moment';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import {
  LanguageToken,
  CommonIdentity,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  RouterDataToken,
  RouterData,
  CoreBenefitService,
  LovList,
  GosiCalendar
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BenefitValues, MonthYearLabel, HeirStatus } from '../../enum';
import {
  AverageMonthlyWagePeriod,
  ActiveBenefits,
  AnnuityResponseDto,
  BenefitDetails,
  ContributionPlan,
  DependentTransaction,
  HeirHistory,
  EachHeirDetail,
  HeirBenefitDetails,
  SystemParameter,
  ValidateRequest
} from '../../models';
import { BenefitConstants } from '../../constants';
import { isHeirBenefit } from '../../utils';

@Component({
  selector: 'bnt-gosi-benefits-after-modify-dc',
  templateUrl: './benefit-after-modfiy-dependents-dc.component.html',
  styleUrls: ['./benefit-after-modfiy-dependents-dc.component.scss']
})
export class BenefitAfterModfiyDependentsDcComponent implements OnInit, OnChanges {
  /*
   * Local variables
   */
  amount = [];
  averageMonthlyTotal = 0;
  averageMonthlyWagePeriods: AverageMonthlyWagePeriod[];
  index = 0;
  lang = 'en';
  modalRef: BsModalRef;
  totalBenefit = 0;
  totalNewLawMonths = 0;
  totalOldLawMonths = 0;
  heirStatusEnums = HeirStatus;
  startDate: GosiCalendar;
  endDate: GosiCalendar;
  month: number;
  benefitAmount: number;
  paymentAmount: number;
  plans: ContributionPlan[] = [];
  percentage: number;
  isSmallScreen: boolean;
  heirIdentity: CommonIdentity = new CommonIdentity();
  heirIdentifier = new Array();
  heirDetailBefore: HeirBenefitDetails;
  // heirAfterModify = new Array();
  isAppPrivate: boolean;

  benefitBeforeUpdate: number;
  benefitAfterUpdate: number;
  isMarriageGrant: boolean;
  queryParams: string;
  /*
   * Input variables
   */
  @Input() activeBenefitsList: ActiveBenefits[];
  @Input() benefitCalculation: BenefitDetails;
  @Input() annuityResponse: AnnuityResponseDto;
  @Input() requestpensionForm: FormGroup;
  @Input() deductionPlanList: LovList;
  @Input() benefitType: string;
  @Input() historyBenefitDetails: BenefitDetails;
  @Input() actionType: string;
  @Input() acitveBenefit: ActiveBenefits;
  // @Input() heirDetails: DependentDetails[];
  @Input() isHeir: boolean;
  @Input() parentForm: FormGroup;
  @Input() showRequestDate: boolean;
  @Input() isModifyBackdated: boolean;
  @Input() dependentHistory: DependentTransaction[];
  @Input() heirHistory: HeirHistory;
  @Input() heirOldHistory: HeirHistory;
  @Input() benefitPeriodHistory: HeirHistory;
  @Input() systemParameter: SystemParameter;
  @Input() benefitDetails: BenefitDetails;
  @Input() systemRunDate: GosiCalendar;
  @Input() heirEligibilityDetails: ValidateRequest[];
  @Input() isHeirLumpsum = false;
  @Output() setDeductionPlan = new EventEmitter();
  @Output() showBenefitsWagePopup: EventEmitter<EachHeirDetail> = new EventEmitter();
  @Output() navigateToAdjustmentDetails: EventEmitter<HeirBenefitDetails> = new EventEmitter();
  @Output() navigateToPrevAdjustment: EventEmitter<HeirBenefitDetails> = new EventEmitter();
  @Output() showIneligibilityDetails: EventEmitter<ValidateRequest> = new EventEmitter();

  /**
   *
   * @param location
   * @param language
   */
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly location: Location,
    readonly modalService: BsModalService,
    readonly router: Router,
    private coreBenefitService: CoreBenefitService,
    @Inject(RouterDataToken) readonly routerData: RouterData
  ) {}

  /*
   * This methid is for initialization tasks
   */
  ngOnInit(): void {
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    this.amount[this.index] = 0;
    // this.setHeirAfterModify();
  }
  /*
   * This methid is for detecting changes in input property
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.activeBenefit && changes.activeBenefit.currentValue) {
      this.heirDetailBefore = this.acitveBenefit.heirBenefitDetails[0];
    }

    if (changes && changes.benefitCalculation) {
      if (this.benefitCalculation) {
        // this.setHeirAfterModify();
        this.averageMonthlyWagePeriods = this.benefitCalculation.averageMonthlyWagePeriods;
        this.benefitCalculation = changes.benefitCalculation.currentValue;
        this.getTotalAmount();
        this.plans = this.benefitCalculation?.additionalContribution?.contributionPlans;
        this.selectdeductionPlanMethod(BenefitValues.plan10);
        this.setMarriageGrant();
      }
    }

    if (changes && changes.annuityResponse) {
      if (this.annuityResponse?.additionalContribution) {
        this.selectdeductionPlanForValidatorEdit(this.annuityResponse);
      }
    }
    if (changes && changes.dependentHistory && changes.dependentHistory.currentValue) {
      this.dependentHistory = changes.dependentHistory.currentValue;
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

  showBenefitWageDetails(benefitWageDetail: EachHeirDetail) {
    this.showBenefitsWagePopup.emit(benefitWageDetail);
  }

  setMarriageGrant() {
    this.benefitCalculation?.heirBenefitDetails?.forEach(item => {
      if (item?.marriageGrant > 0) {
        this.isMarriageGrant = true;
      }
    });
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
  viewDetails() {}

  viewBenefitDetails(activeBenefit: ActiveBenefits) {
    const benefitType = activeBenefit?.benefitType?.english;
    const sin = activeBenefit.sin;
    const referenceNumber = activeBenefit.referenceNo;
    const benefitRequestId = activeBenefit.benefitRequestId;
    this.coreBenefitService.setActiveBenefit(activeBenefit);

    // navigate to benefit view screen
    if (isHeirBenefit(benefitType)) {
      const url =
        '#' +
        this.router.serializeUrl(
          this.router.createUrlTree([BenefitConstants.ROUTE_ACTIVE_HEIR_BENEFIT], {
            queryParams: {
              sin: sin,
              benReqId: benefitRequestId,
              referenceNumber: referenceNumber,
              benefitType: benefitType,
              newTab: true
            }
          })
        );
      const newTab = window.open(url, '_blank');
      if (newTab) {
        newTab.opener = null;
      }
    } else {
      window.open('#' + BenefitConstants.ROUTE_MODIFY_RETIREMENT, '_blank');
    }
  }

  benefitPeriodDetails() {}

  navigateToAdjustmentDetailsHeir(event: HeirBenefitDetails) {
    this.navigateToAdjustmentDetails.emit(event);
  }
  navigateToPrevAdjustmentHeir(event: HeirBenefitDetails) {
    this.navigateToPrevAdjustment.emit(event);
  }
  showIneligibilityReasons(details: ValidateRequest) {
    this.showIneligibilityDetails.emit(details);
  }
  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    const scrWidth = window.innerWidth;
    this.isSmallScreen = scrWidth <= 992 ? true : false;
  }
}
