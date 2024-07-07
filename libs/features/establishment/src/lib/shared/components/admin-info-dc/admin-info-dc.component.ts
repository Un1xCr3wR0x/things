/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'est-admin-info-dc',
  templateUrl: './admin-info-dc.component.html',
  styleUrls: ['./admin-info-dc.component.scss']
})
export class AdminInfoDcComponent implements OnInit {
  @Input() adminRole: string;
  constructor() {}

  ngOnInit(): void {}
}
