/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { VALIDATOR_APPEAL_COMPONENTS } from './general-appeal';
import { EMPLOYEE_VALIDATOR_APPEAL_COMPONENTS } from './establishment-private-appeal';
import { VALIDATOR_SHARED_COMPONENTS } from './shared';

export const VALIDATOR_COMPONENTS = [
  VALIDATOR_APPEAL_COMPONENTS,
  VALIDATOR_SHARED_COMPONENTS,
  EMPLOYEE_VALIDATOR_APPEAL_COMPONENTS
];

//export * from './appeal-on-violation/appeal-violation';
export * from './general-appeal';
