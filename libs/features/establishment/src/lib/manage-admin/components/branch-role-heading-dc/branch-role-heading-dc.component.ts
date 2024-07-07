/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'est-branch-role-heading-dc',
  templateUrl: './branch-role-heading-dc.component.html',
  styleUrls: ['./branch-role-heading-dc.component.scss']
})
export class BranchRoleHeadingDcComponent implements OnInit {
  @Input() canSelect = true;
  @Output() showInfo: EventEmitter<void> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}
}
