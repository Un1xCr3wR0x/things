/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter, Inject, OnInit } from '@angular/core';
import { BilingualText, DocumentItem, GosiCalendar, ApplicationTypeEnum, ApplicationTypeToken } from '@gosi-ui/core';
import { Allowance } from '../../models/allowance-wrapper';
import { Claims } from '../../models/claims-wrapper';

@Component({
  selector: 'oh-accordion-view-details-dc',
  templateUrl: './accordion-view-details-dc.component.html',
  styleUrls: ['./accordion-view-details-dc.component.scss']
})
export class AccordionViewDetailsDcComponent implements OnInit, OnChanges {
  //Local Variables
  allowanceList = [];
  oneAtATime = true;
  isReimSubPending = false;
  isRequested = false;
  isTpacompleted = false;
  accordionPanel = 0;
  disabled = false;
  isAppPrivate: boolean;
  status = 'PAYMENT-COMPLETE';
  type: BilingualText;
  totalExpenses = 0;
  paymentStatus: BilingualText;
  actualPaymentStatus: BilingualText;

  //Input Variables
  @Input() allowances: Allowance;
  @Input() claims: Claims;
  @Input() showNewClaims = true;
  @Input() claimBreakUpList: Claims[];
  @Input() injuryId: number;
  @Input() documents: DocumentItem[] = [];
  @Input() isValidator: boolean;
  @Input() allowanceTab = false;
  @Input() tab: string;
  @Input() workDisabilityDate: GosiCalendar;
  @Output() upload: EventEmitter<number> = new EventEmitter();
  @Output() navigateToCtbtr: EventEmitter<null> = new EventEmitter();
  @Output() navigateToEst: EventEmitter<null> = new EventEmitter();
  constructor(@Inject(ApplicationTypeToken) readonly appToken: string) {}

  ngOnInit(): void {
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
  }
  /**
   * This method is detect changes in input property
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.claimBreakUpList) {
      this.claimBreakUpList = changes.claimBreakUpList.currentValue;
    }
    if (changes && changes.allowances) {
      this.allowances = changes.allowances.currentValue;
      this.paymentStatus = this.allowances.paymentStatus;
      this.actualPaymentStatus = this.allowances.actualPaymentStatus;
      if (this.actualPaymentStatus) {
        this.actualPaymentStatus.english = this.actualPaymentStatus?.english.trim();
      }
      if (this.allowances.isDisabled && this.allowanceTab) {
        this.disabled = true;
      }
    }
    if (changes && changes.claims) {
      this.claims = changes.claims.currentValue;
      this.paymentStatus = this.claims.paymentStatus;

      if (this.claims && this.claims?.claimType === null && this.claims?.reImbId != null) {
        this.isReimSubPending = true;
        if (this.paymentStatus?.english === 'Requested') {
          this.isRequested = true;
        }
        this.reimbValidation(this.paymentStatus, this.actualPaymentStatus);
      } else {
        this.actualPaymentStatus = this.claims?.actualPaymentStatus;
        this.actualPaymentStatus.english = this.actualPaymentStatus?.english.trim();
      }
    }
    if (changes && changes.isValidator) {
      this.isValidator = changes.isValidator.currentValue;
    }
    if (changes && changes.injuryId) {
      this.injuryId = changes.injuryId.currentValue;
    }
    if (changes && changes.allowanceTab) {
      this.allowanceTab = changes.allowanceTab.currentValue;
    }
  }
  checkPaymentStatus(item1Status, item2Status) {
    if (item1Status === item2Status) {
      return true;
    } else if (item1Status === 'Paid' && item2Status === 'Approved') {
      return true;
    } else if (item1Status === 'Approved' && item2Status === 'Paid') {
      return true;
    } else {
      return false;
    }
  }
  getTotalExpense(claims: Claims) {
    if (claims) {
      if (this.claimBreakUpList) {
        this.totalExpenses = 0;
        this.claimBreakUpList.forEach(element => {
          const isSameStatus = this.checkPaymentStatus(
            claims.actualPaymentStatus?.english,
            element.actualPaymentStatus?.english
          );
          if (
            element.invoiceItemId === claims.invoiceItemId &&
            element.invoiceItemId &&
            claims.actualPaymentStatus &&
            isSameStatus
          ) {
            element?.expenses?.forEach(item => {
              this.totalExpenses = this.totalExpenses + item.amount;
            });
          }
        });
      }
    }
    return this.totalExpenses;
  }
  getTotalExpenses(claims: Claims) {
    this.totalExpenses = 0;
    if (
      this.claims &&
      (this.claims.claimType?.english === 'Total Disability Repatriation Expenses' ||
        this.claims.claimType?.english === 'Dead Body Repatriation Expenses' ||
        this.claims.claimType?.english === 'Companion Allowance' ||
        this.claims.claimType?.english === 'Companion Conveyance Allowance')
    ) {
      this.claims.expenses.forEach(element => {
        this.totalExpenses = this.totalExpenses + element.amount;
      });
    } else {
      this.getTotalExpense(claims);
    }
    return this.totalExpenses;
  }
  uploadDocuments(event) {
    this.upload.emit(event);
  }
  reimbValidation(paymentStatus, actualPaymentStatus) {
    if (
      paymentStatus?.english === 'Approved' ||
      paymentStatus?.english === 'Denied' ||
      paymentStatus.english === 'Case rejected' ||
      paymentStatus?.english === 'Partially Approved' ||
      actualPaymentStatus?.english === 'Cancelled'
    ) {
      this.isTpacompleted = true;
    }
  }

  navigateToContributor() {
    this.navigateToCtbtr.emit();
  }

  navigateToEstProfile() {
    this.navigateToEst.emit();
  }
}
