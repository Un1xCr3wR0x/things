/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Person } from '@gosi-ui/core';

/**
 * Model class to hold establishment owner details.
 *
 * @export
 * @class EstablishmentOwnerDetails
 */
export class EstablishmentOwnerDetails {
  isAdmin?: boolean;
  persons: Person[] = [];
}
