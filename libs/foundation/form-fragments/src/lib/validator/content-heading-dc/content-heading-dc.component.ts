/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'frm-content-heading-dc',
  templateUrl: './content-heading-dc.component.html',
  styleUrls: ['./content-heading-dc.component.scss']
})
export class ContentHeadingDcComponent implements OnInit {
  //Input Variables
  @Input() canEdit = true;
  @Input() icon: string;
  @Input() heading: string;
  @Input() isSvg = false;
  @Input() badge: string;

  //Output Vairables
  @Output() onEdit: EventEmitter<boolean> = new EventEmitter();

  /**
   * Creates an instance of ContentHeadingDcComponent
   * @memberof  ContentHeadingDcComponent
   *
   */
  constructor() {}

  /**
   * This method handles the initialization tasks.
   * @memberof  ContentHeadingDcComponent
   */
  ngOnInit() {}
  // Method to emit edit details

  onEditContent() {
    this.onEdit.emit();
  }
}
