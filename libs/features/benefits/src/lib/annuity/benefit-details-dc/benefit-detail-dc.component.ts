/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  HostListener,
  TemplateRef,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import {
  ActiveBenefits,
  AnnuityResponseDto,
  AverageMonthlyWagePeriod,
  BenefitDetails,
  InjuryDetails
} from '../../shared/models';
import { BenefitType, HeirStatusType, isOccBenefit } from '../../shared';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BilingualText } from '@gosi-ui/core';

@Component({
  selector: 'bnt-benefit-detail-dc',
  templateUrl: './benefit-detail-dc.component.html',
  styleUrls: ['./benefit-detail-dc.component.scss']
})
export class BenefitDetailDcComponent implements OnInit, OnChanges {
  //local Variables
  BenefitType = BenefitType;
  isDisabilityPension: boolean;
  isOccPension: boolean;
  isOccLumpsum = false;
  isOccCalc = false;
  isHoldStopEligible: boolean;
  statusEnums = HeirStatusType;
  commonModalRef: BsModalRef;
  isSmallScreen: boolean;
  lang = 'en';
  totalBenefit = 0;
  totalNewLawMonths = 0;
  totalOldLawMonths = 0;
  averageMonthlyTotal = 0;

  //Input Variables
  @Input() acitveBenefit: ActiveBenefits;
  @Input() activeBenefitDetails: AnnuityResponseDto;
  @Input() benefitType: string;
  @Input() benefitCalculation: BenefitDetails;
  @Input() eligibleForPensionReform: boolean;
  @Input() isHeir: boolean;
  @Input() isLumpsum: boolean;
  @Input() isSaned: boolean;
  @Input() benefeciaryStatus: string;
  @Input() benefitDetails: BenefitDetails;
  @Input() disabilityDetails: InjuryDetails[];
  averageMonthlyWagePeriods: AverageMonthlyWagePeriod[];

  /**
   * Output
   */
  @Output() showModalEvent: EventEmitter<TemplateRef<HTMLElement>> = new EventEmitter();
  @Output() close = new EventEmitter();

  constructor(readonly modalService: BsModalService) {}
  ngOnInit(): void {
    if (this.benefitType === BenefitType.occPension || this.benefitType === BenefitType.nonOccPensionBenefitType) {
      this.isDisabilityPension = true;
    }
    if (this.benefitType === BenefitType.occPension) {
      this.isOccPension = true;
    } else {
      this.isOccPension = false;
    }
    if (this.benefitType === BenefitType.occLumpsum) this.isOccLumpsum = true;
    if (isOccBenefit(this.benefitType)) {
      this.isOccCalc = true;
    }
    if (this.activeBenefitDetails?.status?.english === this.statusEnums.ONHOLD || this.statusEnums.STOPPED) {
      this.isHoldStopEligible = true;
    } else {
      this.isHoldStopEligible = false;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.benefitDetails && changes.benefitDetails.currentValue) {
      this.benefitDetails = changes.benefitDetails.currentValue;
      if (this.benefitDetails) {
        this.averageMonthlyWagePeriods = this.benefitDetails.averageMonthlyWagePeriods;
        this.getTotalAmount();
      }
    }
  }

  /*
   * This methid is to show Modal
   */
  showModal(templateRef: TemplateRef<HTMLElement>) {
    this.commonModalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-xl' }));
  }

  /*
   * This method is to close Modal
   */
  hideModal() {
    this.commonModalRef.hide();
  }
  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    const scrWidth = window.innerWidth;
    this.isSmallScreen = scrWidth <= 992 ? true : false;
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
  getIneligibilityReasons(reasons: BilingualText[]): BilingualText {
    return {
      english: reasons.map((reason: BilingualText) => reason.english).join(','),
      arabic: reasons.map((reason: BilingualText) => reason.arabic).join(',')
    };
  }
}
