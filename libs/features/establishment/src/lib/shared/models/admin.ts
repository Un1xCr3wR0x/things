/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, Person } from '@gosi-ui/core';

/**
 * Class used in front end for admin data
 */
export class Admin {
  person: Person = new Person();
  roles?: Array<BilingualText> = []; //From api it will come as numbers and should be converted to Bilingual Text For Viewing using mapAdminIdToRoles helper
}
