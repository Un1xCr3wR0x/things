/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Benefits } from './benefits';

export class UiBenefitsResponse {
  benefits: Benefits[];
  totalBenefits: number;
}
export interface Comments {
  comments: string;
}
