/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnInit } from '@angular/core';
import { GenderEnum } from '@gosi-ui/core';
import { ControlPerson } from '../../models';

@Component({
  selector: 'est-person-dc',
  templateUrl: './person-dc.component.html',
  styleUrls: ['./person-dc.component.scss']
})
export class PersonDcComponent implements OnInit {
  maleGender = GenderEnum.MALE;
  femaleGender = GenderEnum.FEMALE;
  @Input() person: ControlPerson;
  @Input() showRole: boolean;
  @Input() showId: boolean;
  @Input() showMoreOptions: boolean;
  constructor() {}

  ngOnInit(): void {}
}
