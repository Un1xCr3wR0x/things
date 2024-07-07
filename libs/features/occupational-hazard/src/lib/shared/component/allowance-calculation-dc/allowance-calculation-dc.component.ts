/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  AfterViewChecked,
  Component,
  Inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ChangeDetectorRef
} from '@angular/core';
import { BilingualText, GosiCalendar, LanguageToken, dayDiff } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { CalculationWrapper, CompanionDetails } from '../../models';
import { Allowance } from '../../models/allowance-wrapper';
import { DateFormat } from '../../models/date';
import { ClaimDetail } from '../../models/claim-details';

@Component({
  selector: 'oh-allowance-calculation-dc',
  templateUrl: './allowance-calculation-dc.component.html',
  styleUrls: ['./allowance-calculation-dc.component.scss']
})
export class AllowanceCalculationDcComponent implements OnInit, OnChanges, AfterViewChecked {
  /**
   * Creating Instance
   */
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>, private cdRef: ChangeDetectorRef) {}
  //Local variables
  lang = 'en';
  type: string;
  paymentMethod: string;
  secondLabel: string;
  isExclusionSame = false;
  isExclusionLesser = false;
  isAllowanceZero = false;
  paymentStatus: string;
  amount: number;
  isConveyanceCap = false;
  isSimisAllowanceTrue = false;
  wageChange: BilingualText = new BilingualText();
  //Input Variables
  @Input() allowances: Allowance;
  @Input() companionDetails: CompanionDetails;
  @Input() allowance: Allowance;
  @Input() paymentDetails: ClaimDetail;
  @Input() allowancePayee: BilingualText;
  @Input() claimsIndicator = false;
  @Input() calculationWrapper: CalculationWrapper;
  @Input() treatmentType: string;
  @Input() contributorWage: string;
  @Input() day: DateFormat[];
  @Input() validatorView = false;
  @Input() tabView = false;
  @Input() workDisabilityDate: GosiCalendar;
  @Input() status: string;
  /**
   * This method if for initialization tasks
   */
  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.wageChange.english = 'Wage Change';
    this.wageChange.arabic = 'تغير الأجر';
  }
  /**
   *
   * @param changes Capturing input changes on change
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.companionDetails) {
      this.companionDetails = changes.companionDetails.currentValue;
    }
    if (changes && changes.workDisabilityDate) {
      this.workDisabilityDate = changes.workDisabilityDate.currentValue;
    }
    if (changes && changes.allowances) {
      this.allowances = changes.allowances.currentValue;
      this.setPaymentstatusAndAmount(this.allowances);
      if (changes && changes.paymentDetails) {
        this.setPaymentforValidator();
      }
      this.isSimisAllowanceTrue = this.allowances.simisAllowance;
      this.ngAfterViewChecked();
    }
    if (changes && changes.day) {
      this.day = changes.day.currentValue;
    }
    if (changes && changes.calculationWrapper) {
      this.calculationWrapper = changes.calculationWrapper.currentValue;
    }
    if (changes && changes.contributorWage) {
      this.contributorWage = changes.contributorWage.currentValue;
    }
    if (changes && changes.status) {
      this.status = changes.status.currentValue;
    }
    if (changes && changes.tabView) {
      this.tabView = changes.tabView.currentValue;
      this.setNoofdays(this.allowances);
    }
  }
  setNoofdays(allowances) {
    if (allowances && allowances.treatmentType) {
      this.tabView = false;
    } else {
      this.tabView = true;
    }
  }
  setPaymentstatusAndAmount(allowances) {
    if (allowances && allowances.actualPaymentStatus) {
      this.amount = allowances.amount;
      this.paymentStatus = allowances.actualPaymentStatus.english;
    }
    if (this.validatorView) {
      this.amount = allowances.totalAmount;
      this.paymentStatus = this.status;
    }
    //Allowance Paymenhod
    if (allowances && !this.claimsIndicator) {
      this.setPaymentforAllowance();
    }
    //Claims Payment method
    if (allowances && this.claimsIndicator) {
      this.setPaymentforAllowance();
    }
  }

  setLcChequePayment(allowances) {
    this.paymentMethod =
      allowances.paymentMethod.english === 'LC Cheque'
        ? 'OCCUPATIONAL-HAZARD.ALLOWANCE.CHEQUE'
        : 'OCCUPATIONAL-HAZARD.ALLOWANCE.BANK-TRANSFER';
  }

  //Set Payment method for Claims
  setPaymentforAllowance() {
    if (this.allowances.paymentMethod) {
      if (this.allowances.payeeDetails.payableTo.english === 'Contributor') {
        this.setLcChequePayment(this.allowances);
        this.secondLabel = 'OCCUPATIONAL-HAZARD.ALLOWANCE.SELF';
      } else if (this.allowances.payeeDetails.payableTo.english === 'Establishment') {
        this.setLcChequePayment(this.allowances);
        this.secondLabel = 'OCCUPATIONAL-HAZARD.ALLOWANCE.ESTABLISHMENT';
      } else if (this.allowances.payeeDetails.payableTo.english === 'Authorized Person') {
        this.setLcChequePayment(this.allowances);
        this.secondLabel = 'OCCUPATIONAL-HAZARD.ALLOWANCE.AUTHORIZED';
      } else if (this.allowances.payeeDetails.payableTo.english === 'TPA') {
        this.setLcChequePayment(this.allowances);
      }
    } else {
      this.paymentMethod = 'OCCUPATIONAL-HAZARD.NOT-AVAILABLE';
    }
  }
  //Set Payment method for Validator
  setPaymentforValidator() {
    if (this.paymentDetails.paymentMethod) {
      if (
        this.paymentDetails.payeeDetails.payableTo.english === 'Contributor' ||
        this.paymentDetails.payeeDetails.payableTo.english === 'Establishment' ||
        this.paymentDetails.payeeDetails.payableTo.english === 'TPA'
      ) {
        this.paymentMethod =
          this.paymentDetails.paymentMethod.english === 'LC Cheque'
            ? 'OCCUPATIONAL-HAZARD.ALLOWANCE.CHEQUE'
            : 'OCCUPATIONAL-HAZARD.ALLOWANCE.BANK-TRANSFER';
      } else if (this.paymentDetails.payeeDetails.payableTo.english === 'Authorized Person') {
        this.paymentMethod =
          this.paymentDetails.paymentMethod.english === 'LC Cheque'
            ? 'OCCUPATIONAL-HAZARD.ALLOWANCE.CHEQUE'
            : 'OCCUPATIONAL-HAZARD.ALLOWANCE.BANK-TRANSFER';
        if (this.paymentDetails.paymentMethod.english === 'LC Cheque') {
          this.secondLabel = null;
        } else {
          this.secondLabel = 'OCCUPATIONAL-HAZARD.ALLOWANCE.AUTHORIZED';
        }
      } else {
        this.paymentMethod = 'OCCUPATIONAL-HAZARD.NOT-AVAILABLE';
      }
    }
  }
  /**
   * Get distance
   */
  getDistance() {
    if (this.companionDetails && Number(this.companionDetails.distanceTravelled) >= 0) {
      if (this.lang === 'en') {
        return this.companionDetails.distanceTravelled + ' ' + 'KM';
      } else {
        return this.companionDetails.distanceTravelled + ' ' + 'كم';
      }
    } else return '';
  }
  /**
   * Display exclusion messages
   */
  ngAfterViewChecked() {
    if (
      this.allowances?.calculationWrapper?.allowanceBreakup?.allowanceType?.english === 'OutPatient Allowance' ||
      this.allowances?.calculationWrapper?.allowanceBreakup?.allowanceType?.english === 'Inpatient Allowance' ||
      this.allowances?.calculationWrapper?.allowanceBreakup?.allowanceType?.english === 'InPatient Daily Allowance' ||
      this.allowances?.calculationWrapper?.allowanceBreakup?.allowanceType?.english === 'OutPatient Daily Allowance'
    ) {
      if (this.allowances && this.allowances.startDate && this.allowances.benefitStartDate && this.workDisabilityDate) {
        if (
          this.allowances.startDate.hijiri === this.workDisabilityDate.hijiri &&
          this.amount !== 0 &&
          (this.allowances.startDate.hijiri !== this.allowances.benefitStartDate.hijiri ||
            this.allowances.startDate.hijiri === this.allowances.endDate.hijiri)
        ) {
          this.isExclusionSame = true;
        }

        if (
          this.workDisabilityDate.hijiri > this.allowances.startDate.hijiri &&
          this.workDisabilityDate.hijiri > this.allowances.endDate.hijiri &&
          this.amount === 0 &&
          this.paymentStatus === 'Pending'
        ) {
          this.isAllowanceZero = true;
        }

        if (
          this.allowances.startDate.hijiri < this.workDisabilityDate.hijiri &&
          this.workDisabilityDate.hijiri <= this.allowances.endDate.hijiri &&
          this.amount !== 0
        ) {
          this.isExclusionLesser = true;
        }
      }
    }
    this.conveyanceCapScenarios();
    this.cdRef.detectChanges();
  }
  /**
   * Conveyance Cap Messages
   */
  conveyanceCapScenarios() {
    if (this.allowances?.allowanceType?.english === 'Conveyance Allowance') {
      const noOfVisits = this.calculationWrapper?.allowanceBreakup?.noOfVisits * 30;
      let days = dayDiff(this.allowances?.benefitStartDate?.gregorian, this.allowances?.benefitEndDate?.gregorian);
      days = days + 1;
      if (this.allowances?.conveyanceCapApplied) {
        this.isConveyanceCap = true;
      }
    }
  }
}
