/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from '@gosi-ui/core';
import { Name } from '@gosi-ui/core/lib/models/name';

/**
 * Model class to hold contributor details.
 *
 * @export
 * @class RejectedContributor
 */

export class RejectedContributor {
  contributorId :number;
  socialInsuranceNo: number;
  contributorName: Name;  
  removalReason : BilingualText;
}

