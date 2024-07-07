/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input } from '@angular/core';
import { BilingualText } from '@gosi-ui/core';

@Component({
  selector: 'gosi-no-result-dc',
  templateUrl: './no-result-dc.component.html',
  styleUrls: ['./no-result-dc.component.scss']
})
export class NoResultDcComponent implements OnInit {
  @Input() message: BilingualText;
  constructor() {}

  ngOnInit(): void {}
}
