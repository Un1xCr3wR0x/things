import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AdjustmentConstants, SadadOptionDetails } from '@gosi-ui/features/payment/lib/shared';
import moment from 'moment';

@Component({
  selector: 'pmt-sadad-option-dc',
  templateUrl: './sadad-option-dc.component.html',
  styleUrls: ['./sadad-option-dc.component.scss']
})
export class SadadOptionDcComponent implements OnInit {
  @Input() isDisplaySadadDetails: Boolean = false;
  @Input() referenceNo: number;
  @Input() parentForm: FormGroup;
  @Output() isDateValid: EventEmitter<boolean> = new EventEmitter();
  @Output() sadadProceedTopay = new EventEmitter();

  maxDate: Date;
  notValid: boolean;
  BillerConst = AdjustmentConstants.BILLER_CODE;
  constructor() {}

  ngOnInit(): void {
    this.maxDate = moment(new Date()).toDate();
  }
  proceedToPay() {
    const sadadPaymentDetails: SadadOptionDetails = {
      paymentMethod: {
        english: 'SADAD',
        arabic: 'سداد'
      },
      referenceNo: this.referenceNo
    };
    this.sadadProceedTopay.emit(sadadPaymentDetails);
  }
}
