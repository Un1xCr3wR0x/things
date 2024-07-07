/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Inject, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import {
  DocumentItem,
  LanguageToken,
  BilingualText,
  ApplicationTypeToken,
  ApplicationTypeEnum,
  EstablishmentStatusEnum
} from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { BranchBreakup, CurrencyDetails, EstablishmentDetails, PaymentDetails } from '../../../shared/models';
import { ReceiptApprovalStatus } from '../../../shared/enums';
import { BillingConstants } from '../../../shared/constants';
import moment from 'moment';

@Component({
  selector: 'blg-receipt-breakup-dc',
  templateUrl: './receipt-breakup-dc.component.html',
  styleUrls: ['./receipt-breakup-dc.component.scss']
})
export class ReceiptBreakupDcComponent implements OnInit, OnChanges {
  /**LocaL Variable */
  lang = 'en';
  statusStyle: string;
  isAppPrivate: boolean;
  isApproved = true;
  isRegistered: boolean;
  notRegisteredEstablishments: BranchBreakup[] = [];
  isBranchRegistered: boolean;
  isValidReceipt: boolean;
  cancelBtnDisableTemp = false;
  isCancelled: boolean;
  isCancelledPvWaiting:boolean;
  isApprovalInProgress: boolean;
  isReceiptRejected:boolean;

  /** Input variables. */
  @Input() receipt: PaymentDetails;
  @Input() establishment: EstablishmentDetails;
  @Input() receiptNumber: number;
  @Input() currencyDetails: CurrencyDetails;
  @Input() currency: BilingualText;
  @Input() gccFlag: boolean;
  @Input() documents: DocumentItem[];
  @Input() isMofReceiptFlag = false;
  @Input() accessRoles = [];
  @Input() establishmentType: string;
  /** Output varaibles. */
  @Output() back: EventEmitter<null> = new EventEmitter();
  @Output() cancelReceipt: EventEmitter<number> = new EventEmitter();
  @Output() mofAllocationBreakupDetails: EventEmitter<null> = new EventEmitter();
  
  /**
   * Creates an instance of ReceiptBreakupDcComponent
   * @param language
   */
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
  }

  /** Initializes the component. */
  ngOnInit() {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }

  /** Method to handle chnages in input variables. */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.receipt && changes.receipt.currentValue && !changes.receipt.isFirstChange()) {
      // if (moment(this.receipt.transactionDate?.gregorian).isAfter(moment(new Date('2004/03/16'))))
      //   this.isValidReceipt = true;
      // else this.isValidReceipt = false;
      this.checkReceiptStatus(this.receipt.status.english);
      this.checkSadadPayment(this.receipt.receiptMode?.english);
      this.checkApprovalStatus(this.receipt.approvalStatus?.english);
      this.getCancelReceiptStatus();
    }
    if (changes.establishment && changes.establishment.currentValue) {
      if (
        this.establishment?.status?.english === ReceiptApprovalStatus.REGISTERED ||
        this.establishment?.status?.english === EstablishmentStatusEnum.REOPEN ||
        this.establishment?.status?.english === EstablishmentStatusEnum.REOPEN_CLOSING_IN_PROGRESS
      )
        this.isRegistered = true;
      else this.isRegistered = false;
      this.getCancelReceiptStatus();
    }
  }

  /** Method to check receipt status of each receipt. */
  checkReceiptStatus(status: string) {
    switch (status) {
      case ReceiptApprovalStatus.APPROVAL_IN_PROGRESS:
        {
          this.isApprovalInProgress=true;
        }
        break;
      case ReceiptApprovalStatus.APPROVAL_IN_PROGRESS_:
      case ReceiptApprovalStatus.TO_BE_CANCELLED:{
        this.isCancelledPvWaiting = true;
      }
      case ReceiptApprovalStatus.RECEIPT_ALLOCATION_CANCEL_IN_PROGRESS:
      case ReceiptApprovalStatus.WAITING_ALLOCATION:
        {
          this.statusStyle = 'Orange';
        }
        break;
      case ReceiptApprovalStatus.CANCELLED:
        {
          this.isCancelled=true;
        }
        break;
      case ReceiptApprovalStatus.CANCELLED_PV_WAITING:
        {
          this.statusStyle = 'Red';
          this.isCancelledPvWaiting=true;
        }
        break;
      case ReceiptApprovalStatus.DISCARD:
        {
          this.statusStyle = 'gray';
        }
        break;
      case ReceiptApprovalStatus.REJECTED:
        {
          this.statusStyle = 'dark_red';
          this.isReceiptRejected=true;
        }
        break;
      case ReceiptApprovalStatus.RECEIVED:
      case ReceiptApprovalStatus.PARTIALLY_ALLOCATED:
        {
          this.statusStyle = 'blue';
        }
        break;
      case ReceiptApprovalStatus.FULLY_ALLOCATED:
        {
          this.statusStyle = 'green';
        }
        break;
    }
  }

  checkSadadPayment(receiptMode: string) {
    switch (receiptMode) {
      case BillingConstants.PAYMENT_MODE:
        this.isApproved = false;
        break;
    }
  }

  checkApprovalStatus(approvalStatus: string){
    if(approvalStatus !== ReceiptApprovalStatus.APPROVED){
      this.isApproved = false;
    }
  }

  getCancelReceiptStatus() {
    this.notRegisteredEstablishments = this.receipt?.branchAmount?.filter(
      branch =>
        branch?.status?.english !== EstablishmentStatusEnum.REOPEN_CLOSING_IN_PROGRESS &&
        branch?.status?.english !== ReceiptApprovalStatus.REGISTERED &&
        branch?.status?.english !== EstablishmentStatusEnum.REOPEN
    );
    if (this.notRegisteredEstablishments?.length === 0) this.isBranchRegistered = true;
    else this.isBranchRegistered = false;
  }

  /** Method to navigate back to receipt list view. */
  navigateBack() {
    this.back.emit();
  }

  navigateToCancelReceipt() {
    this.cancelReceipt.emit(this.receiptNumber);
  }
  getMofAllocationBreakupDetails() {
    this.mofAllocationBreakupDetails.emit();
  }
}
