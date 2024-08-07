/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from '@gosi-ui/core';

export interface BankName {
  code: number;
  items: string[];
  sequence: number;
  value: BilingualText;
}
