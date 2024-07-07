/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { getIdentityByType } from '@gosi-ui/core';
import { ContributorWageDetails } from '../../../shared/models';

@Component({
  selector: 'cnt-contributor-table-dc',
  templateUrl: './contributor-table-dc.component.html',
  styleUrls: ['./contributor-table-dc.component.scss']
})
export class ContributorTableDcComponent {
  /**Input variables */
  @Input() contributorList: ContributorWageDetails[];
  @Input() isAllContributor = false;
  @Input() currentPage: number; //Pagination current page
  @Input() totalSize: number; // Pagination total page
  @Input() id: string; // Pagination for Identificatino during multiple instance. !Important id for pagniation component and paginate Pipe should be same.

  /**Output Variables */
  @Output() navigateToContProfile = new EventEmitter<number>(null);

  /**Method to fetch identity types */
  getIdentity(contributor): number {
    return getIdentityByType(contributor.person.identity, contributor.person.nationality?.english).id;
  }
}
