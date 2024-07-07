import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, TemplateRef } from '@angular/core';
import {
  BenefitConstants,
  ReturnLumpsumResponse,
  ReturnLumpsumPaymentDetails
} from '@gosi-ui/features/benefits/lib/shared';
import { FormGroup } from '@angular/forms';
import moment from 'moment';
import { BenefitsGosiShowRolesConstants, GosiCalendar, RoleIdEnum } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'bnt-sanad-payment-dc',
  templateUrl: './sanad-payment-dc.component.html',
  styleUrls: ['./sanad-payment-dc.component.scss']
})
export class SanadPaymentDcComponent implements OnInit, OnChanges {
  @Input() nin: number;
  @Input() isDisplaySadadDetails: Boolean = false;
  @Input() parentForm: FormGroup;
  @Input() isAppPrivate: boolean;
  @Output() sadadProceedTopay = new EventEmitter();
  @Output() sadadPaymentDetailsSubmit = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();

  maxDate: Date;
  modalRef: BsModalRef;
  BillerConst = BenefitConstants.BILLER_CODE;
  accessForActionPrivate = BenefitsGosiShowRolesConstants.DIRECT_PAYMENT_ACCESS;
  accessForActionPublic = [RoleIdEnum.SUBSCRIBER, RoleIdEnum.AUTH_PERSON, RoleIdEnum.VIC, RoleIdEnum.BENEFICIARY];
  constructor(private modalService: BsModalService) {}

  ngOnInit(): void {
    this.maxDate = moment(new Date()).toDate();
  }
  ngOnChanges(changes: SimpleChanges) {}
  /**this function is called when user click on the proceed to pay button */
  proceedToPay() {
    const sadadPaymentDetails: ReturnLumpsumPaymentDetails = {
      paymentMethod: {
        english: 'SADAD',
        arabic: ''
      }
    };
    this.sadadProceedTopay.emit(sadadPaymentDetails);
  }
  submit() {
    if (this.parentForm.valid) {
      const TranscationDate: GosiCalendar = this.parentForm.get('transactionDate').value;

      const sadadPaymentDetails: ReturnLumpsumPaymentDetails = {
        paymentMethod: {
          english: 'SADAD',
          arabic: ''
        },
        transactionDate: TranscationDate
      };
      this.sadadPaymentDetailsSubmit.emit(sadadPaymentDetails);
    }
  }
  /** Method to confirm cancellation of the form. */
  confirmCancel() {
    this.modalRef.hide();
    this.cancel.emit();
  }
  /**
   * Method to show a confirmation popup for reseting the form.
   * @param template template
   */
  popUp(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template);
  }
  /** Method to decline the popUp. */
  decline() {
    this.modalRef.hide();
  }
}
