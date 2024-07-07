/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BulkWageDetails } from '../../../../shared/models';

@Component({
  selector: 'cnt-bulk-wage-upload-history-dc',
  templateUrl: './bulk-wage-upload-history-dc.component.html',
  styleUrls: ['./bulk-wage-upload-history-dc.component.scss']
})
export class BulkWageUploadHistoryDcComponent implements OnInit {
  /* Input Variables */
  @Input() uploadHistoryList: BulkWageDetails[];
  @Input() id: string;
  @Input() currentPage: number;
  @Input() pageSize: number;
  @Input() totalSize: number;
  @Input() isPPAEst = false;
  
  /**Output variables */
  @Output() fetchReport = new EventEmitter(null);

  constructor() {}

  ngOnInit(): void {}
}
