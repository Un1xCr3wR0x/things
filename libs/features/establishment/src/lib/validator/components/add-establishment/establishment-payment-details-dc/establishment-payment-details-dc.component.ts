/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent, Establishment } from '@gosi-ui/core';

/**
 * This is the component to validate the establishment payment details
 *
 * @export
 * @class EstablishmentPaymentDetailsDcComponent
 * @extends {BaseComponent}
 */
@Component({
  selector: 'est-establishment-payment-details-dc',
  templateUrl: './establishment-payment-details-dc.component.html',
  styleUrls: ['./establishment-payment-details-dc.component.scss']
})
export class EstablishmentPaymentDetailsDcComponent extends BaseComponent {
  //Input Variables
  @Input() establishment: Establishment = null;
  @Input() canEdit = true;
  @Input() showMofPayment: boolean;
  @Input() highlightIban = false;
  @Input() highlightMof = false;
  @Input() highlightPaymentStartDate = false;
  @Input() highlightLateFee = false;
  @Input() showLateFee = false;
  @Input() isGCC :boolean;
  //Output variable
  @Output() onEdit: EventEmitter<null> = new EventEmitter();

  /**
   * Creates an instance of ValidateEstablishmentPaymentDetailsDcComponent
   * @memberof  ValidateEstablishmentPaymentDetailsDcComponent
   *
   */
  constructor() {
    super();
  }
  // method to emit edit values
  onEditEstPaymentDetails() {
    this.onEdit.emit();
  }
}
