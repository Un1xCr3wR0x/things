/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnInit } from '@angular/core';
import { CommonIdentity, getIdentityByType } from '@gosi-ui/core';

@Component({
  selector: 'cnt-agreement-arabic-dc',
  templateUrl: './agreement-arabic-dc.component.html',
  styleUrls: ['./agreement-arabic-dc.component.scss']
})
export class AgreementArabicDcComponent implements OnInit {
  @Input() establishment;
  @Input() contractAtDraft;
  @Input() personDetails;

  constructor() {}

  ngOnInit(): void {}
  /**Method to fetch person identity*/
  getPersonIdentity(personDetails): CommonIdentity {
    return getIdentityByType(personDetails?.person?.identity, personDetails?.person?.nationality?.english);
  }
}
