/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Establishment } from '@gosi-ui/core';
@Component({
  selector: 'cnt-engagement-basic-details-dc',
  templateUrl: './engagement-basic-details-dc.component.html',
  styleUrls: ['./engagement-basic-details-dc.component.scss']
})
export class EngagementBasicDetailsDcComponent implements OnInit {
  constructor() {}
  @Input() establishment: Establishment;
  @Input() engagementStatus: string;
  //Output variables
  @Output() onEdit: EventEmitter<null> = new EventEmitter();

  ngOnInit(): void {}

  // method to emit edit values
  onEditEngagementDetails() {
    this.onEdit.emit();
  }
}
