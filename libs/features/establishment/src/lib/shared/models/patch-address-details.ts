import { AddressDetails } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export interface PatchAddressDetails {
  addresses: AddressDetails[];
  comments: string;
  contentIds: string[];
  currentMailingAddress: string;
  navigationIndicator: number;
  referenceNo: number;
  uuid: string;
  isWaselAddress?: boolean;
}
