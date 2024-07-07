/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { BilingualText, DocumentItem, GosiCalendar } from '@gosi-ui/core';
import { Allowance } from '../../models/allowance-wrapper';
import { ClaimDetail } from '../../models/claim-details';
import { ClaimsWrapper } from '../../models';

@Component({
  selector: 'oh-accordion-view-dc',
  templateUrl: './accordion-view-dc.component.html',
  styleUrls: ['./accordion-view-dc.component.scss']
})
export class AccordionViewDcComponent implements OnChanges {
  //Local Variables
  allowanceList = [];
  oneAtATime = true;
  accordionPanel = 0;
  disabled = false;
  status = 'PAYMENT-COMPLETE';
  type: BilingualText;
  totalExpense = 0;
  paymentStatus: BilingualText;
  actualPaymentStatus: BilingualText;
  lang = 'en';
  //Input Variables
  @Input() allowances: Allowance;
  @Input() claims: ClaimDetail;
  @Input() documents: DocumentItem[] = [];
  @Input() isValidator: boolean;
  @Input() allowanceTab: boolean;
  @Input() claimDetails: ClaimDetail;
  @Input() tab: string;
  @Input() workDisabilityDate: GosiCalendar;
  @Input() repatriationWrapper: ClaimsWrapper;
  @Input() totalRepatriationExpense: number;
  @Output() navigateToCtbtr: EventEmitter<null> = new EventEmitter();
  @Output() navigateToEst: EventEmitter<null> = new EventEmitter();
  /**
   * This method is detect changes in input property
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.allowances) {
      this.allowances = changes.allowances.currentValue;
      if (this.allowances?.isDisabled && this.allowanceTab) {
        this.disabled = true;
      }
    }
    if (changes && changes.claimDetails) {
      this.claimDetails = changes.claimDetails.currentValue;
    }
    if (changes && changes.claims) {
      this.claims = changes.claims.currentValue;
      this.paymentStatus = this.claims.paymentStatus;
      this.actualPaymentStatus = this.claims.actualPaymentStatus;
      this.getTotalExpense();
    }
    if (changes && changes.isValidator) {
      this.isValidator = changes.isValidator.currentValue;
    }
    if (changes && changes.allowanceTab) {
      this.allowanceTab = changes.allowanceTab.currentValue;
    }
    if (changes && changes.workDisabilityDate) {
      this.workDisabilityDate = changes.workDisabilityDate.currentValue;
    }
    if (changes && changes.repatriationWrapper) {
      if(this.repatriationWrapper !== undefined && this.repatriationWrapper !== null) {
        this.totalExpense = 0;
        this.totalExpense = this.totalRepatriationExpense;
      }
    }
  }
  getTotalExpense() {
    if (
      this.claims &&
      (this.claims.claimType?.english === 'Total Disability Repatriation Expenses' ||
        this.claims.claimType?.english === 'Dead Body Repatriation Expenses')
    ) {
      this.claims.claimItem.forEach(element => {
        this.totalExpense = this.totalExpense + element.totalAmount;
      });
    }
  }
  navigateToEstProfile() {
    this.navigateToEst.emit();
  }
  navigateToContributor() {
    this.navigateToCtbtr.emit();
  }
}
