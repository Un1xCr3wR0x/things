/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnInit } from '@angular/core';
import { UpdatedWageListResponse } from '../../../../shared/models';
// import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'cnt-wage-details-dc',
  templateUrl: './wage-details-dc.component.html',
  styleUrls: ['./wage-details-dc.component.scss']
})

/**
 * This class is used to display wage details
 */
export class WageDetailsDcComponent implements OnInit {
  /**
   * Input variables
   */
  @Input() updatedWageListResponse: UpdatedWageListResponse;
  @Input() isPPA = false;
  // penalityIndicatorForm: FormGroup;

  /**
   * This method is used to initialise WageDetailsDcComponent
   */
  constructor() {}
  ngOnInit(): void {
    // this.penalityIndicatorForm = this.createPenalityForm();
  }

  // createPenalityForm() {
  //   return this.fb.group({
  //     isPenality: [false]
  //   });
  // }

  // isLatePenalty() {}
}
