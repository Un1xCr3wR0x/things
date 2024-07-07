/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input } from '@angular/core';
import { PersonBankDetails } from '../../../shared';

@Component({
  selector: 'cim-person-bank-details-dc',
  templateUrl: './person-bank-details-dc.component.html',
  styleUrls: ['./person-bank-details-dc.component.scss']
})
export class PersonBankDetailsDcComponent implements OnInit {
  //Input Variables
  @Input() bankDetails: PersonBankDetails;

  /**
   * Creates an instance of PersonBankDetailsDcComponent
   * @memberof  PersonBankDetailsDcComponent
   *
   */
  constructor() {}
  /**
   * This method handles the initialization tasks.
   *
   */
  ngOnInit() {}
}
