/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { GenericValidationKey } from './generic-validation-key';
import { ValidationMessage } from './validation-messages';

export class ValidityCheck extends GenericValidationKey {
  messages: ValidationMessage = new ValidationMessage();
}
