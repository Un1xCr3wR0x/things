/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '@gosi-ui/core';

@Component({
  selector: 'cim-education-form-dc',
  templateUrl: './education-form-dc.component.html',
  styleUrls: ['./education-form-dc.component.scss']
})
export class EducationFormDcComponent extends BaseComponent implements OnInit {
  //Input Variables
  @Input() educationList;
  @Input() specializationList;
  @Input() educationForm;

  /**
   * Creates an instance of EducationFormDcComponent
   * @memberof  EducationFormDcComponent
   *
   */
  constructor() {
    super();
  }

  /**
   * This method handles the initialization tasks.
   */
  ngOnInit() {}
}
