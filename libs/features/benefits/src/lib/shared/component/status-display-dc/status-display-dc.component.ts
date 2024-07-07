/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'bnt-status-display-dc',
  templateUrl: './status-display-dc.component.html',
  styleUrls: ['./status-display-dc.component.scss']
})
export class StatusDisplayDcComponent implements OnInit {
  @Input() recordStatus: string;
  constructor() {}

  ngOnInit(): void {}
}
