/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnInit } from '@angular/core';
import { checkBilingualTextNull } from '@gosi-ui/core';

@Component({
  selector: 'cnt-establishment-details-dc',
  templateUrl: './establishment-details-dc.component.html',
  styleUrls: ['./establishment-details-dc.component.scss']
})
export class EstablishmentDetailsDcComponent implements OnInit {
  @Input() establishmentDetails;
  @Input() registrationNumber;
  @Input() isContract;
  @Input() isModifyCoverage;
  @Input() isValidator;
  @Input() applicableFrom?;
  @Input() estDetails;
  @Input() violationDetails;
  constructor() {}

  ngOnInit(): void {}
  /**
   * This method is to check if the data is null or not
   * @param control
   */
  checkNull(control) {
    return checkBilingualTextNull(control);
  }
}
