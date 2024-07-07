/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BenefitsGosiShowRolesConstants, RoleIdEnum } from '@gosi-ui/core';

@Component({
  selector: 'pmt-action-area-dc',
  templateUrl: './action-area-dc.component.html',
  styleUrls: ['./action-area-dc.component.scss']
})
export class ActionAreaDcComponent {
  validatorAccess = BenefitsGosiShowRolesConstants.VALIDATOR_ROLES;

  /** Input Variables. */
  @Input() primaryButtonLabel: string;
  @Input() showPreviousSection: boolean;
  @Input() disablePrimary = false;
  @Input() idValue = '';


  /** Output Variables. */
  @Output() submit: EventEmitter<null> = new EventEmitter();
  @Output() previous: EventEmitter<null> = new EventEmitter();
  @Output() onCancelAction: EventEmitter<null> = new EventEmitter();

  /** Method to submit transaction. */
  submitTransaction() {
    this.submit.emit();
  }

  /** Method to navigate to previous section. */
  previousSection() {
    this.previous.emit();
  }

  /** Method to cancel transaction. */
  cancelTransaction() {
    this.onCancelAction.emit();
  }
}
