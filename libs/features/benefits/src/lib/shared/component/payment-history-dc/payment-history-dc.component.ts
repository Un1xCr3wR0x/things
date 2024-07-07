/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Inject, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CommonIdentity, LanguageToken, LovList, formatDate } from '@gosi-ui/core';
import { Location } from '@angular/common';
import { BenefitDetails, PaymentHistoryDetails, PaymentHistoryFilter } from '../../models';
import { BenefitType, BenefitValues } from '../../enum';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DateType } from '@gosi-ui/foundation-theme/lib/components/widgets/input-hijiri-dc/enums/date-type';

@Component({
  selector: 'bnt-payment-history-dc',
  templateUrl: './payment-history-dc.component.html',
  styleUrls: ['./payment-history-dc.component.scss']
})
export class PaymentHistoryDcComponent implements OnInit {
  isEligible = false;
  commonModalRef: BsModalRef;
  BenefitValues = BenefitValues;
  /** Input Variables */
  @Input() isExpandable: boolean;
  @Input() paymentHistory: PaymentHistoryDetails[] = [];
  @Input() paymentEventsList: LovList;
  @Input() paymentStatusList: LovList;
  @Input() benefitType: string;
  @Input() isLumpsum: boolean;
  @Input() isSaned = true;
  @Input() isIndividualApp: boolean;
  @Input() identity: CommonIdentity | null;
  @Input() benefitCalculation: BenefitDetails;
  @Input() benefitDetails: BenefitDetails;

  /** output varaiables */
  @Output() showAdjustmentModal = new EventEmitter();
  @Output() paymentFilterEvent: EventEmitter<PaymentHistoryFilter> = new EventEmitter();
  @Output() navigateToAdjustmentDetails: EventEmitter<null> = new EventEmitter();

  /**
   * Local variables
   */
  lang = 'en';
  BenefitType = BenefitType;
  /**
   * @param location
   * @param ReturnLumpsumService
   * @param language
   */
  constructor(
    private location: Location,
    public route: ActivatedRoute,
    readonly modalService: BsModalService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {}

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }
  filterPaymentHistory(paymentHistoryFilter: PaymentHistoryFilter) {
    this.paymentFilterEvent.emit(paymentHistoryFilter);
  }
  viewAdjustmentDetails() {
    this.navigateToAdjustmentDetails.emit();
  }

  /*
   * This methid is to show Modal
   */
  showModal(templateRef: TemplateRef<HTMLElement>) {
    this.commonModalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-xl' }));
  }
  /*
   * This method is to close Modal
   */
  hideModal() {
    this.commonModalRef.hide();
  }
  /**
   * Route back to previous page
   */
  routeBack() {
    this.location.back();
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
  showAdjustmetDetailsLink(payments, index) {
    return payments.findIndex(val => val?.paymentType?.english === 'Adjustment') === index;
  }
  // getIban(iban: string) {
  //   return iban.replace(/.(?=.{4})/g, 'x');
  // }
}
