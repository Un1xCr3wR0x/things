/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  Component,
  Input,
  OnInit,
  OnChanges,
  TemplateRef,
  Inject,
  HostListener,
  SimpleChanges,
  EventEmitter,
  Output
} from '@angular/core';
import { Router } from '@angular/router';
import {
  Establishment,
  LookupService,
  AlertService,
  DocumentService,
  RouterDataToken,
  RouterData,
  ApplicationTypeToken,
  LanguageToken,
  BenefitsGosiShowRolesConstants
} from '@gosi-ui/core';
import {
  UnemploymentCalculationDto,
  EligibilityMonthsAmount,
  ContributionPlan,
  AverageMonthlyWagePeriod,
  BenefitDetails,
  AnnuityResponseDto
} from '../../../shared/models';
import { ManageBenefitService, UiBenefitsService } from '../../../shared/services';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'bnt-contribution-details-dc',
  templateUrl: './benefit-contribution-details-dc.component.html',
  styleUrls: ['./benefit-contribution-details-dc.component.scss']
})
export class BenefitContributionDetailsDcComponent implements OnInit, OnChanges {
  /**
   * Input variables
   */
  @Input() establishment: Establishment;
  @Input() registrationNo: number;
  @Input() benefitDetails: UnemploymentCalculationDto;
  @Input() eligibleMonthsAmounts: EligibilityMonthsAmount[];
  @Input() benefitCalculationDetails: BenefitDetails;
  @Input() oldBenefitDetails: BenefitDetails;
  @Input() annuityBenefitDetails: AnnuityResponseDto;
  @Input() showViewEligibleMonthsLink = true;
  @Input() isReopenCase;
  @Input() eligibleForPensionReform: boolean;

  @Output() navigateToBenefitsHistory = new EventEmitter();

  modalRef: BsModalRef;
  lang: string;
  isSmallScreen: boolean;
  amount = [];
  averageMonthlyWagePeriods: AverageMonthlyWagePeriod[];
  index = 0;
  plans: ContributionPlan[] = [];
  totalBenefit = 0;
  totalNewLawMonths = 0;
  totalOldLawMonths = 0;
  averageMonthlyTotal = 0;
  viewOnly = BenefitsGosiShowRolesConstants.BENEFIT_READ;
  /**
   *
   * @param language Creating an instance
   * @param router
   */
  constructor(
    readonly router: Router,
    readonly manageBenefitService: ManageBenefitService,
    readonly uiBenefitsService: UiBenefitsService,
    readonly lookService: LookupService,
    readonly alertService: AlertService,
    readonly modalService: BsModalService,
    readonly documentService: DocumentService,
    readonly fb: FormBuilder,
    readonly location: Location,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {}

  /**
   *  This method if for initialization tasks
   */
  ngOnInit() {
    this.language.subscribe((lan: string) => {
      this.lang = lan;
    });

    this.amount[this.index] = 0;
    if (this.benefitCalculationDetails) {
      this.plans = this.benefitCalculationDetails?.additionalContribution?.contributionPlans;
    }
  }
  /*
   * This methid is for detecting changes in input property
   */
  ngOnChanges(changes: SimpleChanges) {
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
  /**
   * This method is to show the modal reference
   * @param modalRef
   */
  showModal(templateRef: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
  }

  /** This method is to hide the modal reference. */
  hideModal() {
    this.modalRef.hide();
  }
  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    const scrWidth = window.innerWidth;
    this.isSmallScreen = scrWidth <= 992 ? true : false;
  }
  /**
   * To append suffix for months eg: 1st, 2nd, 3rd
   * @param number
   */
  getMonthsSuffix(number: number) {
    let suffix = `${number}th`;
    if (this.lang === 'en') {
      switch (number) {
        case 0:
          break;
        case 1:
          suffix = `${number}st`;
          break;
        case 2:
          suffix = `${number}nd`;
          break;
        case 3:
          suffix = `${number}rd`;
          break;
        default:
          break;
      }
    }
    return suffix;
  }
  viewHistory() {
    this.navigateToBenefitsHistory.emit();
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
}
