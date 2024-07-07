/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'cnt-preview-heading-dc',
  templateUrl: './preview-heading-dc.component.html',
  styleUrls: ['./preview-heading-dc.component.scss']
})
export class PreviewHeadingDcComponent implements OnInit {
  @Input() section;
  @Input() isEnglish;

  constructor() {}

  ngOnInit(): void {}
}
