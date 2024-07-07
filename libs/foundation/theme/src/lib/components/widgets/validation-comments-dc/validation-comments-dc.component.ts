/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input } from '@angular/core';
import { AutoValidationComments } from '@gosi-ui/core/lib/models/auto-validation';

@Component({
  selector: 'gosi-validation-comments-dc',
  templateUrl: './validation-comments-dc.component.html',
  styleUrls: ['./validation-comments-dc.component.scss']
})
export class ValidationCommentsDcComponent {
  @Input() autoValidationComments?: AutoValidationComments[];

  /**
   * Creates an instance of ValidationCommentsDcComponent
   * @memberof  ValidationCommentsDcComponent
   *
   */
  constructor() {}
}
