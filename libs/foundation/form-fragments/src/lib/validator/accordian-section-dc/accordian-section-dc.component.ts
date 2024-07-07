/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input } from '@angular/core';

@Component({
  selector: 'frm-accordian-section-dc',
  templateUrl: './accordian-section-dc.component.html',
  styleUrls: ['./accordian-section-dc.component.scss']
})
export class AccordianSectionDcComponent {
  /** Input variables. */
  @Input() icon: string;
  @Input() heading: string;
  @Input() isSvg = false;
  @Input() isOpen: boolean;
}
