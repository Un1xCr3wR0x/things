/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { CreditAllocation, AllocationSummaryDetails } from '../../../shared/models';

@Component({
  selector: 'blg-allocation-contribution-summary-dc',
  templateUrl: './allocation-contribution-summary-dc.component.html',
  styleUrls: ['./allocation-contribution-summary-dc.component.scss']
})
export class AllocationContributionSummaryDcComponent implements OnInit, OnChanges {
  @Input() creditSummaryValue: CreditAllocation[];
  @Input() mofAllocationSummaryDetails: AllocationSummaryDetails[];
  @Input() exchangeRate = 1;
  @Input() currentCurrency = 'SAR';
  @Input() mofEstablishment: boolean;
  @Input() fromPage: string;
  @Input() isGcc = false;
  @Input() responsiblePayee: string;
  @Input() isPPA: boolean;
  @Input() establishmentType: string

  // local varaiables
  annuityContributionTotal: number;
  isThirdParty = false;
  uiContributionTotal: number;
  ohContributionTotal: number;
  annuityLatefeeTotal: number;
  annuityPPALatefeeTotal: number;
  annuityPRLatefeeTotal: number;
  annuityPPATotal: number;
  annuityPRTotal: number;
  uiLatefeeTotal: number;
  ohLatefeeTotal: number;
  contributionTotal: number;
  latefeeTotal: number;
  currentCurrencyLable: string;

  constructor() {}

  /** Method to fetch details on inialising data */
  ngOnInit() {}

  /** Method to fetch details on input changes */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.creditSummaryValue && changes.creditSummaryValue.currentValue) {
      this.creditSummaryValue = changes.creditSummaryValue.currentValue;
      this.getAllocationContributionDetails(this.creditSummaryValue);
    }
    if (changes?.mofAllocationSummaryDetails?.currentValue) {
      this.mofAllocationSummaryDetails = changes?.mofAllocationSummaryDetails?.currentValue;
      this.getMofAllocationSummary();
    }
    if (changes?.currentCurrency?.currentValue) {
      this.currentCurrencyLable = 'BILLING.' + changes.currentCurrency.currentValue;
    }
    if (changes?.responsiblePayee?.currentValue) {
      this.responsiblePayee = changes.responsiblePayee.currentValue;
      if (this.responsiblePayee === 'THIRD_PARTY') this.isThirdParty = true;
    }
  }
  getMofAllocationSummary() {
    if (this.fromPage === 'mofAllocation') {
      this.mofAllocationSummaryDetails?.forEach(value => {
        if (value.type.english === 'Annuity') {
          this.annuityContributionTotal = value.amount;
        }
        if (value.type.english === 'UI') {
          this.uiContributionTotal = value.amount;
        }
        if (value.type.english === 'OH') {
          this.ohContributionTotal = value.amount;
        }
        if(value.type.english === 'PPA Annuity') {
          this.annuityPPATotal = value.amount;
        }
        if(value.type.english === 'Pension Reform Annuity') {
          this.annuityPRTotal = value.amount;
        }
      });
      this.contributionTotal = this.annuityContributionTotal + this.uiContributionTotal + this.ohContributionTotal + this.annuityPPATotal + this.annuityPRTotal;
    }
  }
  /** Method to fetch allocation contribution details */
  getAllocationContributionDetails(creditSummaryValue: CreditAllocation[]) {
    this.annuityContributionTotal = 0;
    this.uiContributionTotal = 0;
    this.ohContributionTotal = 0;
    this.annuityLatefeeTotal = 0;
    this.annuityPPALatefeeTotal = 0;
    this.annuityPPATotal = 0;
    this.annuityPRLatefeeTotal = 0;
    this.annuityPRTotal = 0;
    this.uiLatefeeTotal = 0;
    this.ohLatefeeTotal = 0;
    this.contributionTotal = 0;
    this.latefeeTotal = 0;
    for (let j = 0; j < creditSummaryValue.length; j++) {
      if (creditSummaryValue[j].type.english === 'Annuity') {
        this.annuityContributionTotal =
          creditSummaryValue[j].adjustmentForCurrent.balance +
          creditSummaryValue[j].amountFromPreviousBill.balance +
          creditSummaryValue[j].currentMonthDues.balance;
      } else if (creditSummaryValue[j].type.english === 'UI') {
        this.uiContributionTotal =
          creditSummaryValue[j].adjustmentForCurrent.balance +
          creditSummaryValue[j].amountFromPreviousBill.balance +
          creditSummaryValue[j].currentMonthDues.balance;
      } else if (creditSummaryValue[j].type.english === 'OH') {
        this.ohContributionTotal =
          creditSummaryValue[j].adjustmentForCurrent.balance +
          creditSummaryValue[j].amountFromPreviousBill.balance +
          creditSummaryValue[j].currentMonthDues.balance;
      } else if (creditSummaryValue[j].type.english === 'PPA Annuity'){
        this. annuityPPATotal =
          creditSummaryValue[j].adjustmentForCurrent.balance +
          creditSummaryValue[j].amountFromPreviousBill.balance +
          creditSummaryValue[j].currentMonthDues.balance;
      }  else if (creditSummaryValue[j].type.english === 'Pension Reform Annuity'){
        this. annuityPRTotal =
          creditSummaryValue[j].adjustmentForCurrent.balance +
          creditSummaryValue[j].amountFromPreviousBill.balance +
          creditSummaryValue[j].currentMonthDues.balance;
      } 
      if (creditSummaryValue[j].type.english === 'Annuity Late Fees') {
        this.annuityLatefeeTotal =
          creditSummaryValue[j].adjustmentForCurrent.balance +
          creditSummaryValue[j].amountFromPreviousBill.balance +
          creditSummaryValue[j].currentMonthDues.balance;
      } else if (creditSummaryValue[j].type.english === 'UI Late Fees') {
        this.uiLatefeeTotal =
          creditSummaryValue[j].adjustmentForCurrent.balance +
          creditSummaryValue[j].amountFromPreviousBill.balance +
          creditSummaryValue[j].currentMonthDues.balance;
      } else if (creditSummaryValue[j].type.english === 'OH Late Fees') {
        this.ohLatefeeTotal =
          creditSummaryValue[j].adjustmentForCurrent.balance +
          creditSummaryValue[j].amountFromPreviousBill.balance +
          creditSummaryValue[j].currentMonthDues.balance;
      }
      else if (creditSummaryValue[j].type.english === 'PPA Annuity Late Fees'){
        this. annuityPPALatefeeTotal =
          creditSummaryValue[j].adjustmentForCurrent.balance +
          creditSummaryValue[j].amountFromPreviousBill.balance +
          creditSummaryValue[j].currentMonthDues.balance;
      }
      else if (creditSummaryValue[j].type.english === 'Pension Reform Annuity Late Fees'){
        this. annuityPRLatefeeTotal =
          creditSummaryValue[j].adjustmentForCurrent.balance +
          creditSummaryValue[j].amountFromPreviousBill.balance +
          creditSummaryValue[j].currentMonthDues.balance;
      }
    }
    //if (this.mofEstablishment && this.responsiblePayee === 'ESTABLISHMENT') {
      // this.contributionTotal = this.annuityContributionTotal + this.uiContributionTotal;
      // this.latefeeTotal = this.annuityLatefeeTotal + this.uiLatefeeTotal;
      this.contributionTotal = this.annuityContributionTotal + this.uiContributionTotal + this.ohContributionTotal + this.annuityPPATotal + this.annuityPRTotal;
      this.latefeeTotal = this.annuityLatefeeTotal + this.uiLatefeeTotal + this.ohLatefeeTotal + this.annuityPPALatefeeTotal + this.annuityPRLatefeeTotal;

  }
}
