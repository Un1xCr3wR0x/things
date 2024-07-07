import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter, OnChanges, Inject } from '@angular/core';
import { EstablishmentDetails, CreditManagmentRequest, CreditBalanceDetails } from '../../../../shared/models';
import moment from 'moment-timezone';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { VicContributorDetails } from '../../../../shared/models/vic-contributor-details';
import { LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { RouteConstants } from '../../../../shared/constants';

@Component({
  selector: 'blg-credit-balance-summary-dc',
  templateUrl: './credit-balance-summary-dc.component.html',
  styleUrls: ['./credit-balance-summary-dc.component.scss']
})
export class CreditBalanceSummaryDcComponent implements OnInit, OnChanges {
  // Input variables
  @Input() establishmentDetails?: EstablishmentDetails;
  @Input() contributorDetails?: VicContributorDetails;
  @Input() creditDetailsReq: CreditManagmentRequest;
  @Input() fromPage: string;
  @Input() creditBalanceDetails: CreditBalanceDetails;
  @Input() errorFlag: boolean;
  @Input() refundbalance;
  @Input() iban;
  @Input() isBankTransfer: boolean;
  @Input() isBankRequestinProgress: boolean;

  // Output variables
  @Output() confirmDetails: EventEmitter<null> = new EventEmitter();
  @Output() cancelModal: EventEmitter<null> = new EventEmitter();

  // Local variables
  submissionDate: string;
  lang = 'en';
  totalAmount = 0;
  remainingBalance = 0;
  modalRef: BsModalRef;
  arabicName: string;
  constructor(readonly router: Router, @Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.submissionDate = moment(new Date()).format('DD/MM/YYYY');
    this.language.subscribe(language => {
      this.lang = language;
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.establishmentDetails && changes.establishmentDetails.currentValue) {
      this.establishmentDetails = changes.establishmentDetails.currentValue;
    }
    if (changes && changes.iban && changes.iban.currentValue) {
      this.iban = changes.iban.currentValue;
    }

    if (changes && changes.creditDetailsReq && changes.creditDetailsReq.currentValue) {
      this.creditDetailsReq = changes.creditDetailsReq.currentValue;
      this.creditDetailsReq.recipientDetail.forEach(res => {
        this.totalAmount = Number(res.amount) + Number(this.totalAmount);
      });
    }
    if (changes && changes.creditBalanceDetails && changes.creditBalanceDetails.currentValue) {
      this.creditBalanceDetails = changes.creditBalanceDetails.currentValue;
      this.remainingBalance = this.creditBalanceDetails.totalCreditBalance - Number(this.totalAmount);
    }
    if (changes && changes.refundbalance && changes.refundbalance.currentValue) {
      this.refundbalance = changes.refundbalance.currentValue;
      this.remainingBalance = this.creditBalanceDetails.totalCreditBalance - this.refundbalance;
    }
    if (changes?.contributorDetails?.currentValue) {
      this.arabicName =
        changes.contributorDetails?.currentValue?.person?.name.arabic?.firstName +
        ' ' +
        changes.contributorDetails?.currentValue?.person?.name.arabic?.secondName +
        ' ' +
        (changes.contributorDetails?.currentValue?.person?.name.arabic?.thirdName
          ? changes.contributorDetails?.currentValue?.person?.name.arabic?.thirdName
          : '') +
        ' ' +
        changes.contributorDetails?.currentValue?.person?.name.arabic?.familyName;
    }
  }

  backToHome() {
    this.router.navigate([RouteConstants.ROUTER_CONTRIBUTOR_SEARCH]);
  }
  /** Method to navigate to confirm the details. */
  confirm() {
    this.confirmDetails.emit();
  }
  cancel() {
    this.cancelModal.emit();
  }
}
