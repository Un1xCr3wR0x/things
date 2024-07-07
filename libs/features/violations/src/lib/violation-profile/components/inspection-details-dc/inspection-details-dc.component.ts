/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnInit } from '@angular/core';
import { ViolationTransaction } from '../../../shared/models';

@Component({
  selector: 'vol-inspections-details-dc',
  templateUrl: './inspection-details-dc.component.html',
  styleUrls: ['./inspection-details-dc.component.scss']
})
export class InspectionDetailsDcComponent implements OnInit {
  @Input() transactionDetails: ViolationTransaction;

  constructor() {}

  ngOnInit(): void {}
}
