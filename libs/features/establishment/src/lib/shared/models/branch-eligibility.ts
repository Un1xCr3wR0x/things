import { ValidationMessage } from './validation-messages';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class BranchEligibility {
  key: string;
  messages: ValidationMessage = new ValidationMessage();
  eligible: boolean;
}
