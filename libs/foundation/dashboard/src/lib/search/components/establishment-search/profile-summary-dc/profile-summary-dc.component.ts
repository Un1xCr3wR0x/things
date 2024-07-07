/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { Establishment } from '@gosi-ui/core';
import { RouterConstants } from '../../../constants';
import { BillHistoryWrapper } from '../../../../shared';
@Component({
  selector: 'dsb-profile-summary-dc',
  templateUrl: './profile-summary-dc.component.html',
  styleUrls: ['./profile-summary-dc.component.scss']
})
export class ProfileSummaryDcComponent implements OnInit, OnChanges {
  /**
   * local variables
   */
  establishmentProfileUrl: string;
  establishmentGroupProfileUrl: string;
  totalEngagements: number = null;
  activeEngagements: number = null;
  isBillingAmount: number;
  isPaid = false;
  tempHide = true;
  /**
   * input variables
   */
  @Input() establishmentDetails: Establishment = new Establishment();
  @Input() billingDetails: BillHistoryWrapper = new BillHistoryWrapper();
  @Input() eligibilityStatus: boolean;
  @Input() isLoaded = false;
  //Output variables
  @Output() navigate: EventEmitter<string> = new EventEmitter();
  constructor() {}
  /**
   * method to initialise tasks
   */
  ngOnInit(): void {}
  /*
   * This method is to detect changes in input property
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.establishmentDetails && changes.establishmentDetails.currentValue) {
      this.establishmentDetails = changes.establishmentDetails.currentValue;
      this.establishmentProfileUrl = RouterConstants.ROUTE_ESTABLISHMENT_PROFILE(
        this.establishmentDetails.registrationNo
      );
      this.establishmentGroupProfileUrl = RouterConstants.ROUTE_ESTABLISHMENT_GROUP_PROFILE(
        this.establishmentDetails.registrationNo
      );
      this.getTotalEngagements();
    }
    if (changes && changes.eligibilityStatus) this.eligibilityStatus = changes.eligibilityStatus.currentValue;
    if (changes && changes.billingDetails) {
      this.billingDetails = changes.billingDetails.currentValue;
      if (this.billingDetails) {
        this.getTotalEngagements();
        if (this.billingDetails.totalDebitBalance > 0) this.isBillingAmount = this.billingDetails.totalDebitBalance;
        else this.isBillingAmount = this.billingDetails.totalCreditBalance;
      }
    }
  }
  /*
   * This method is to get total engagements
   */
  getTotalEngagements() {
    if (this.establishmentDetails && this.establishmentDetails.engagementInfo) {
      this.totalEngagements = this.establishmentDetails.engagementInfo.totalContributorCount;
      this.activeEngagements = this.establishmentDetails.engagementInfo.activeContributorCount;
    }
  }
  navigateTo(url: string) {
    this.navigate.emit(url);
  }
}
