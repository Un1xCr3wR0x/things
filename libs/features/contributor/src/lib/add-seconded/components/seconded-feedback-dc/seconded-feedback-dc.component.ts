/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BilingualText } from '@gosi-ui/core';

@Component({
  selector: 'cnt-seconded-feedback-dc',
  templateUrl: './seconded-feedback-dc.component.html',
  styleUrls: ['./seconded-feedback-dc.component.scss']
})
export class SecondedFeedbackDcComponent {
  /** Input variables. */
  @Input() message: BilingualText;

  /** Output variables. */
  @Output() addAnother: EventEmitter<null> = new EventEmitter();

  /** Method to add another contributor. */
  addAnotherContributor() {
    this.addAnother.emit();
  }
}
