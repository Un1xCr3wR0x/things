/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HasThisRolePipe } from './has-this-role.pipe';
import { PaymentTypePipe } from './payment-type.pipe';

export const BENEFITPIPES = [HasThisRolePipe, PaymentTypePipe];

export * from './has-this-role.pipe';
export * from './payment-type.pipe';
