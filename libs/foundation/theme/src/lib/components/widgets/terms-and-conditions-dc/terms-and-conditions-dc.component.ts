/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component } from '@angular/core';
import { BaseComponent } from '@gosi-ui/core';

/**
 * This is the terms and conditions reusable widget
 *
 * @export
 * @class TermsAndConditionsDcComponent
 * @extends {BaseComponent}
 */
@Component({
  selector: 'gosi-terms-and-conditions-dc',
  templateUrl: './terms-and-conditions-dc.component.html',
  styleUrls: ['./terms-and-conditions-dc.component.scss']
})
export class TermsAndConditionsDcComponent extends BaseComponent {
  /**
   * Creates an instance of TermsAndConditionsDcComponent
   * @memberof  TermsAndConditionsDcComponent
   *
   */
  constructor() {
    super();
  }
}
