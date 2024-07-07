/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef
} from '@angular/core';
import { checkNull, CommonIdentity, getIdentityByType, getPersonName, LanguageToken } from '@gosi-ui/core';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ClaimPaymentsummary, ClaimSummaryDetails, Contributor, PreviousClaims } from '../../models';
import { MonthYearLabel } from '../../enums';

@Component({
  selector: 'oh-auditor-claim-details-dc',
  templateUrl: './auditor-claim-details-dc.component.html',
  styleUrls: ['./auditor-claim-details-dc.component.scss']
})
export class AuditorClaimDetailsDcComponent implements OnInit, OnChanges, AfterViewChecked {
  lang: string;
  personNameEnglish: string;
  personNameArabic: string;
  primaryIdentity: CommonIdentity = new CommonIdentity();
  modalRef: BsModalRef;
  url: string;
  totalAmount = 0;
  @Input() claimSummaryDetails: ClaimSummaryDetails;
  @Input() previousClaims: PreviousClaims;
  @Input() contributor: Contributor;
  @Input() referenceNo: number;
  @Output() navigate: EventEmitter<ClaimSummaryDetails> = new EventEmitter();
  @Input() hideAction = false;
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly modalService: BsModalService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.language.subscribe((lan: string) => {
      this.lang = lan;
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.contributor) {
      this.contributor = changes.contributor.currentValue;
    }
    if (changes && changes.claimSummaryDetails) {
      this.claimSummaryDetails = changes.claimSummaryDetails.currentValue;
    }
    if (changes && changes.previousClaims) {
      this.previousClaims = changes.previousClaims.currentValue;
      this.previousClaims?.previousClaims?.forEach((element, index) => {
        this.totalAmount = this.totalAmount + element.amount;
        this.previousClaims.previousClaims[index].routerLink =
          'claim/' + element.tpaName + '/' + element.invoiceId + '/' + element.claimId + '/' + this.referenceNo;
      });
    }
  }
  /**
   *
   * @param startDate Get Date Difference
   * @param endDate
   */
  getDateDifference(startDate, endDate) {
    const started = moment(startDate);
    const ended = moment(endDate);
    return ended.diff(started, 'days') + 1;
  }
  navigateTo(claimSummaryDetails: ClaimSummaryDetails) {
    this.navigate.emit(claimSummaryDetails);
  }
  getPaid(paymentDetails: ClaimPaymentsummary) {
    return (
      paymentDetails.amount -
      paymentDetails.discount -
      paymentDetails.medicalDeduction -
      paymentDetails.policyDeduction +
      paymentDetails.vat
    );
  }
  /**
   * Methid to show modal
   */
  showModal(templateRef: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
  }
  /**
   * Methid to hide modal
   */
  hideModal() {
    this.modalRef.hide();
  }

  getMonth(index: number) {
    const date = new Date(this.previousClaims?.previousClaims[index]?.batchMonth);
    return Object.values(MonthYearLabel)[date.getMonth().toString()];
  }
  getYear(index: number) {
    const date = new Date(this.previousClaims?.previousClaims[index]?.batchMonth);
    return date.getFullYear().toString();
  }
  //Setting personal Information
  ngAfterViewChecked() {
    if (this.contributor?.person && this.contributor?.person?.name) {
      this.personNameEnglish = getPersonName(this.contributor.person.name, 'en');
      this.personNameEnglish = !checkNull(this.personNameEnglish) ? this.personNameEnglish : null;
      this.personNameArabic = getPersonName(this.contributor.person.name, 'ar');
      this.personNameArabic = !checkNull(this.personNameArabic) ? this.personNameArabic : null;

      /**
       * getting the identity type for the contributor eg:iqama number border number
       */
      this.primaryIdentity =
        this.contributor.person.identity != null
          ? getIdentityByType(this.contributor.person.identity, this.contributor.person.nationality.english)
          : null;
    }
    this.cdRef.detectChanges();
  }
}
