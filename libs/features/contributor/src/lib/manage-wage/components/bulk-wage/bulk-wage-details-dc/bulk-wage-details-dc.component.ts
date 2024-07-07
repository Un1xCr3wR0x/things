/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input } from '@angular/core';
import { ContributorWageDetailsResponse } from '../../../../shared';

@Component({
  selector: 'cnt-bulk-wage-details-dc',
  templateUrl: './bulk-wage-details-dc.component.html',
  styleUrls: ['./bulk-wage-details-dc.component.scss']
})
export class BulkWageDetailsDcComponent {
  /** Input variables. */
  @Input() contributorWageDetailsResponse: ContributorWageDetailsResponse;
  @Input() currentPage: number; //Pagination current page
  @Input() pageSize: number; // Pagination item per page
  @Input() totalSize: number; // Pagination total page
  @Input() id: string; // Pagination for Identificatino during multiple instance. !Important id for pagniation component and paginate Pipe should be same.
}
