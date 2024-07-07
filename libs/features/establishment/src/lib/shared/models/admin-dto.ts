/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Person } from '@gosi-ui/core';

/**
 * Class to communicate to and from api for admin related functionalities
 */
export class AdminDto extends Person {
  roles: Array<number>;
}
