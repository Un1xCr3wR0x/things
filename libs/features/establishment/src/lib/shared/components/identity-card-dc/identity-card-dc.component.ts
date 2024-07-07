/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnInit } from '@angular/core';
import { GenderEnum } from '@gosi-ui/core';
import { ControlPerson } from '../../models';
@Component({
  selector: 'est-identity-card-dc',
  templateUrl: './identity-card-dc.component.html',
  styleUrls: ['./identity-card-dc.component.scss']
})
export class IdentityCardDcComponent implements OnInit {
  maleGender = GenderEnum.MALE;
  femaleGender = GenderEnum.FEMALE;
  @Input() controlPerson: ControlPerson;
  @Input() options: string[];
  @Input() translateFromModule = 'ESTABLISHMENT.';
  @Input() hasBorder = true;
  @Input() showMoreOptions = false;

  constructor() {}

  ngOnInit(): void {}
}
