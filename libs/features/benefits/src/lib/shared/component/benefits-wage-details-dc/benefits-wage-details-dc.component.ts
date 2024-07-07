import { Component, EventEmitter, HostListener, Inject, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageToken, RouterData, RouterDataToken, formatDate } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { BenefitConstants } from '../../constants';
import { ActiveBenefits, EachHeirDetail, ParamId } from '../../models';
import { isHeirBenefit } from '../../utils';

@Component({
  selector: 'bnt-benefits-wage-details-dc',
  templateUrl: './benefits-wage-details-dc.component.html',
  styleUrls: ['./benefits-wage-details-dc.component.scss']
})
export class BenefitsWageDetailsDcComponent implements OnInit {
  wageBenefitHeading: string;
  isSmallScreen: boolean;
  showBenefits: boolean;
  benefitsWageType = 'wage';
  queryParams: string;

  @Input() lang: string;
  @Input() benefitWageDetail: EachHeirDetail;
  @Input() acitveBenefit: ActiveBenefits;
  // @Input() activeBenefitsList: ActiveBenefits[];
  @Input() paramId: ParamId;

  @Output() close: EventEmitter<null> = new EventEmitter();
  @Output() navigateToProfile: EventEmitter<number> = new EventEmitter();

  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly router: Router,
    @Inject(RouterDataToken) readonly routerData: RouterData
  ) {}

  ngOnInit(): void {
    this.setHeading();
  }

  closeModal() {
    this.close.emit();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    const scrWidth = window.innerWidth;
    this.isSmallScreen = scrWidth <= 992 ? true : false;
  }
  setHeading() {
    if (
      this.benefitWageDetail?.heirDetails?.otherBenefitAndWage?.wageDetailsList?.length &&
      this.benefitWageDetail?.heirDetails?.otherBenefitAndWage?.benefitDetailsList?.length
    ) {
      this.wageBenefitHeading = 'BENEFITS.WAGE-DETAILS-AND-OTHER-BENEFITS';
    } else if (
      this.benefitWageDetail?.heirDetails?.otherBenefitAndWage?.wageDetailsList?.length &&
      !this.benefitWageDetail?.heirDetails?.otherBenefitAndWage?.benefitDetailsList?.length
    ) {
      this.wageBenefitHeading = 'BENEFITS.WAGE-DETAILS';
    } else if (
      !this.benefitWageDetail?.heirDetails?.otherBenefitAndWage?.wageDetailsList?.length &&
      this.benefitWageDetail?.heirDetails?.otherBenefitAndWage?.benefitDetailsList?.length
    ) {
      this.wageBenefitHeading = 'BENEFITS.OTHER-BENEFITS-DETAILS';
    }
  }

  benefitsWageChange(benefitsWageType) {
    if (benefitsWageType === 'wage') {
      this.benefitsWageType = 'wage';
      this.showBenefits = false;
    } else if (benefitsWageType === 'benefit') {
      this.benefitsWageType = 'benefit';
      this.showBenefits = true;
    }
  }

  showViewDetails(position: number) {
    const selectedBenefitDetail =
      this.benefitWageDetail?.heirDetails?.otherBenefitAndWage?.benefitDetailsList[position];

    const navigationConstant = isHeirBenefit(selectedBenefitDetail?.benefitType.english)
      ? BenefitConstants.ROUTE_ACTIVE_HEIR_BENEFIT
      : BenefitConstants.ROUTE_MODIFY_RETIREMENT;
    const url =
      '#' +
      this.router.serializeUrl(
        this.router.createUrlTree([navigationConstant], {
          queryParams: {
            sin: selectedBenefitDetail?.sin,
            benReqId: selectedBenefitDetail?.benefitRequestId,
            referenceNumber: this.paramId?.transactionTraceId,
            benefitType: selectedBenefitDetail?.benefitType?.english,
            newTab: true
          }
        })
      );
    const newTab = window.open(url, '_blank');
    if (newTab) {
      newTab.opener = null;
    }
  }

  showPersonalDetails(sin: number) {
    this.navigateToProfile.emit(sin);
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
}
