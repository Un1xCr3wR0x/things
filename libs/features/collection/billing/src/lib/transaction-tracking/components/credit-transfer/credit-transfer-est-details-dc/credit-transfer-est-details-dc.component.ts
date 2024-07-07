import { Component, Input, OnInit } from '@angular/core';
import { EstablishmentDetails } from '../../../../shared/models';

@Component({
  selector: 'blg-credit-transfer-est-details-dc',
  templateUrl: './credit-transfer-est-details-dc.component.html',
  styleUrls: ['./credit-transfer-est-details-dc.component.scss']
})
export class CreditTransferEstDetailsDcComponent implements OnInit {
  @Input() establishmentDet: EstablishmentDetails;
  constructor() {}

  ngOnInit(): void {}
}
