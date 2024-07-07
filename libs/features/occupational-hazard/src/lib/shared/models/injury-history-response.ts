/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { InjuryHistory } from './injury-history';

export class InjuryHistoryResponse {
  totalCount: number = undefined;
  injuryHistory: InjuryHistory[] = [];
  diseasePresent: boolean;
}
