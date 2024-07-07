/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input } from '@angular/core';
import { GenderEnum, CommonIdentity } from '@gosi-ui/core';
import { Admin } from '../../../shared';

@Component({
  selector: 'est-admin-card-dc',
  templateUrl: './admin-card-dc.component.html',
  styleUrls: ['./admin-card-dc.component.scss']
})
export class AdminCardDcComponent implements OnInit {
  femaleGender = GenderEnum.FEMALE;
  @Input() admin: Admin;
  @Input() adminIdentifier: CommonIdentity;

  constructor() {}

  ngOnInit(): void {}
}
