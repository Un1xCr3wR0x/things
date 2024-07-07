import { Component, Input, OnInit } from '@angular/core';
import { EstablishmentDetails } from '../../../../shared/models';

@Component({
  selector: 'blg-receive-payment-est-details-dc',
  templateUrl: './receive-payment-est-details-dc.component.html',
  styleUrls: ['./receive-payment-est-details-dc.component.scss']
})
export class ReceivePaymentEstDetailsDcComponent implements OnInit {
  @Input() estDetails: EstablishmentDetails;
  @Input() isMOF: boolean;
  @Input() gccFlag: boolean;
  isMain = false;
  constructor() {}

  ngOnInit(): void {}
}
