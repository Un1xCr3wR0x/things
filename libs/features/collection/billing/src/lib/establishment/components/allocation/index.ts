/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { AllocationBillScomponent } from './allocation-bill-sc/allocation-bill-sc.component';
import { ContributorAllocationCreditScComponent } from './contributor-allocation-credit-sc/contributor-allocation-credit-sc.component';
import { ContributorAllocationCreditDetailsDcComponent } from './contributor-allocation-credit-details-dc/contributor-allocation-credit-details-dc.component';
import { AllocationBillMofScomponent } from './allocation-bill-mof-sc/allocation-bill-mof-sc.component';
import { MofAllocationOfCreditTableDcComponent } from './mof-allocation-of-credit-table-dc/mof-allocation-of-credit-table-dc.component';
import { ContributorAllocationCreditFilterDcComponent } from './contributor-allocation-credit-filter-dc/contributor-allocation-credit-filter-dc.component';

export const ALLOCATION_COMPONENTS = [
  AllocationBillScomponent,
  ContributorAllocationCreditScComponent,
  ContributorAllocationCreditDetailsDcComponent,
  AllocationBillMofScomponent,
  MofAllocationOfCreditTableDcComponent,
  ContributorAllocationCreditFilterDcComponent
];

export * from './allocation-bill-sc/allocation-bill-sc.component';
export * from './contributor-allocation-credit-sc/contributor-allocation-credit-sc.component';
export * from './contributor-allocation-credit-details-dc/contributor-allocation-credit-details-dc.component';
export * from './allocation-bill-mof-sc/allocation-bill-mof-sc.component';
export * from './mof-allocation-of-credit-table-dc/mof-allocation-of-credit-table-dc.component';
export * from './contributor-allocation-credit-filter-dc/contributor-allocation-credit-filter-dc.component';
