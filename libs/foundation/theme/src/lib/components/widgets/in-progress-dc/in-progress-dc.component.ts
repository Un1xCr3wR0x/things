/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component } from '@angular/core';
import { BaseComponent } from '@gosi-ui/core';

/**
 * Component used to handle work in progress element.
 *
 * @export
 * @class InProgressDcComponent
 * @extends {BaseComponent}
 */
@Component({
  selector: 'gosi-in-progress-dc',
  templateUrl: './in-progress-dc.component.html',
  styleUrls: ['./in-progress-dc.component.scss']
})
export class InProgressDcComponent extends BaseComponent {
  /**
   * Creates an instance of InprogressDcComponent.
   * @memberof InProgressDcComponent
   */
  constructor() {
    super();
  }
}
