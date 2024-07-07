/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnInit } from '@angular/core';
@Component({
  selector: 'pmt-third-party-timeline-dc',
  templateUrl: './third-party-timeline-dc.component.html',
  styleUrls: ['./third-party-timeline-dc.component.scss']
})
export class ThirdPartyTimelineDcComponent implements OnInit {
  constructor() {}

  @Input() isFirstItem = false;
  @Input() isLastItem = false;
  ngOnInit(): void {}
}
