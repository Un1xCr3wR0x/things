/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EstablishmentStatusEnum } from '@gosi-ui/core';
import { BranchList } from '../../../shared';

@Component({
  selector: 'est-administrating-branch-item-dc',
  templateUrl: './administrating-branch-item-dc.component.html',
  styleUrls: ['./administrating-branch-item-dc.component.scss']
})
export class AdministratingBranchItemDcComponent implements OnInit {
  @Input() branch: BranchList;
  @Input() canEdit: boolean;

  startDate = new Date('10/05/2020');

  @Output() editRole: EventEmitter<BranchList> = new EventEmitter();

  registerStatus = EstablishmentStatusEnum.REGISTERED;

  constructor() {}

  ngOnInit(): void {}
}
