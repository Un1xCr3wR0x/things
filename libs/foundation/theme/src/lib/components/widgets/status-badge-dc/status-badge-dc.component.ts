/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnInit } from '@angular/core';
import { AlertTypeEnum, BilingualText } from '@gosi-ui/core';

@Component({
  selector: 'gosi-status-badge-dc',
  templateUrl: './status-badge-dc.component.html',
  styleUrls: ['./status-badge-dc.component.scss']
})
export class StatusBadgeDcComponent implements OnInit {
  /**Input variables */
  @Input() label: BilingualText;
  @Input() key = null;
  @Input() type: AlertTypeEnum;
  /**Constructor */
  constructor() {}

  /**Method to init component */
  ngOnInit(): void {}
}
