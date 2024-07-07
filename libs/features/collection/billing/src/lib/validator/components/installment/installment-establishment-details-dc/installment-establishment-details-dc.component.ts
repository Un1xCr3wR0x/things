/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnInit } from '@angular/core';
import { EstablishmentDetails, InstallmentRequest } from '../../../../shared/models';

@Component({
  selector: 'blg-installment-establishment-details-dc',
  templateUrl: './installment-establishment-details-dc.component.html',
  styleUrls: ['./installment-establishment-details-dc.component.scss']
})
export class InstallmentEstablishmentDetailsDcComponent implements OnInit {
  /*
   * Input Variables
   */
  @Input() installmentSubmittedDetails: InstallmentRequest;
  @Input() establishmentDetails: EstablishmentDetails;
  constructor() {}

  ngOnInit(): void {}
}
