/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, HostListener } from '@angular/core';
import {
  AnnuityResponseDto,
  BenefitDetails,
  BenefitType,
  BenefitValues,
  isHeirBenefit,
  MainframeBenefit,
  PaymentDetail,
  PaymentHistoryFilter,
  PersonalInformation,
  SimisBenefit,
  SimisSanedPaymentHistory
} from '../../shared';
import { HeirStatusType } from '../../shared/enum';
import {
  BenefitsGosiShowRolesConstants,
  checkIqamaOrBorderOrPassport,
  CommonIdentity,
  LovList,
  RoleIdEnum,
  SamaVerificationStatus
} from '@gosi-ui/core';
import { EventsConstants } from '../../shared/constants/events-constants';
import { Observable } from 'rxjs';

@Component({
  selector: 'bnt-payment-tab-details-dc',
  templateUrl: './payment-tab-details-dc.component.html',
  styleUrls: ['./payment-tab-details-dc.component.scss']
})
export class PaymentTabDetailsDcComponent implements OnInit, OnChanges {
  /** Input Variables */
  @Input() showPaymentEditOptions = true;
  @Input() benefitPaymentDetails: PaymentDetail;
  @Input() benefitType: string;
  @Input() isLumpsum: boolean;
  @Input() isSaned: boolean;
  @Input() paymentEventsList: LovList;
  @Input() paymentStatusList: LovList;
  @Input() isAppPrivate: boolean;
  @Input() isIndividualApp: boolean;
  @Input() benefitCalculation: BenefitDetails;
  @Input() benefitDetails: BenefitDetails;
  @Input() simisPaymentHistory$: Observable<Array<SimisBenefit>>;
  @Input() mainframePaymentHistory$: Observable<Array<MainframeBenefit>>;
  @Input() simisSanedPaymentHistory$: Observable<SimisSanedPaymentHistory>;
  @Input() personDetails: PersonalInformation;
  @Input() activeBenefitDetails: AnnuityResponseDto;
  @Input() lang;

  /** Local Variables */
  BenefitType = BenefitType;
  BenefitValues = BenefitValues;
  isHeirBenefit = isHeirBenefit;
  isAddDisabled: boolean;
  authorizedPersonId: CommonIdentity | null;
  identity: CommonIdentity | null;
  nationality: string;
  simisPayments;
  simisSanedPayments;
  mfPayments;
  statusEnums = HeirStatusType;

  /** output varaiables */
  @Output() paymentFilterEvent: EventEmitter<PaymentHistoryFilter> = new EventEmitter();
  @Output() edit: EventEmitter<null> = new EventEmitter();
  @Output() add: EventEmitter<null> = new EventEmitter();
  @Output() view: EventEmitter<null> = new EventEmitter();
  @Output() remove: EventEmitter<null> = new EventEmitter();
  @Output() showAdjustmentPopUp = new EventEmitter();
  @Output() navigateToAdjustmentDetails: EventEmitter<null> = new EventEmitter();
  accessForActionPrivate = BenefitsGosiShowRolesConstants.CREATE_PRIVATE;
  accessForActionPublic = BenefitsGosiShowRolesConstants.CREATE_INDIVIDUAL;
  isSmallScreen: boolean;
  constructor() {}

  ngOnInit(): void {}
  funeralTypeCheck() {
    if (this.isIndividualApp) {
      if (
        this.benefitType === BenefitType.funeralGrant &&
        (this.activeBenefitDetails?.status?.english === this.statusEnums.ACTIVE ||
          this.activeBenefitDetails?.status?.english === this.statusEnums.PAID_UP)
      ) {
        return true;
      } else {
        return true;
      }
    } else {
      if (this.benefitType !== BenefitType.funeralGrant) {
        return true;
      } else {
        return false;
      }
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.benefitPaymentDetails && this.benefitPaymentDetails?.benefitDetails?.authorizedPersonIdentifier) {
      this.authorizedPersonId = checkIqamaOrBorderOrPassport(
        this.benefitPaymentDetails?.benefitDetails?.authorizedPersonIdentifier
      );
      this.nationality = this.authorizedPersonId.id?.toString()[0];
    }
    if (
      this.benefitPaymentDetails &&
      this.benefitPaymentDetails?.benefitDetails?.payeeType?.english === BenefitValues.contributor &&
      this.benefitPaymentDetails?.benefitDetails?.bankAccount?.verificationStatus === SamaVerificationStatus.VERIFIED &&
      this.benefitPaymentDetails?.benefitDetails?.paymentMethod?.english === BenefitValues.BANK &&
      this.personDetails?.nationality?.english === 'Saudi Arabia'
    ) {
      this.isAddDisabled = false;
    } else this.isAddDisabled = true;
    if (changes.benefitPaymentDetails && this.benefitPaymentDetails?.history) {
      this.benefitPaymentDetails?.history?.forEach(element => {
        if (element?.benefitDetails?.authorizedPersonIdentifier) {
          this.identity = checkIqamaOrBorderOrPassport(element?.benefitDetails?.authorizedPersonIdentifier);
        }
      });
    }
    this.getScreenSize();
  }
  filterPaymentHistory(paymentHistoryFilter: PaymentHistoryFilter) {
    this.paymentFilterEvent.emit(paymentHistoryFilter);
  }
  showModal(eachHistory) {
    this.showAdjustmentPopUp.emit(eachHistory);
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    const scrWidth = window.innerWidth;
    this.isSmallScreen = scrWidth <= 820 ? true : false;
  }
  navigateToModifyCommitment() {
    this.edit.emit();
  }
  navigateToAddCommitment() {
    if (
      !this.isAddDisabled &&
      !this.benefitPaymentDetails?.disableBankCommitment &&
      this.benefitType !== BenefitType.ui &&
      this.activeBenefitDetails?.status?.english !== 'Stopped'
    )
      this.add.emit();
  }
  navigateToViewCommitment() {
    this.view.emit();
  }
  navigateToRemoveCommitment() {
    this.remove.emit();
  }
  getSimisPayments() {
    if (!this.simisPayments) {
      this.simisPaymentHistory$.subscribe(res => (this.simisPayments = res));
    }
  }
  getMainframePayments() {
    if (!this.mfPayments) {
      this.mainframePaymentHistory$.subscribe(res => (this.mfPayments = res));
    }
  }

  getSimisSanedPayments() {
    if (!this.simisSanedPayments) {
      this.simisSanedPaymentHistory$.subscribe(res => (this.simisSanedPayments = res));
    }
  }

  get individualAppAccess() {
    return [RoleIdEnum.SUBSCRIBER, RoleIdEnum.VIC, RoleIdEnum.BENEFICIARY];
  }

  // maskIban(iban: string) {
  //   return iban.replace(/.(?=.{4})/g, 'x');
  // }
}
