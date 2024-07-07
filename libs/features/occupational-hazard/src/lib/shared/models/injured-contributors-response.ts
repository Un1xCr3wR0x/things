/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { InjuredContributorsDTO } from './injured-contributors-DTO';

export class InjuredContributorsResponse {
  totalCount: number = undefined;
  injuredContributors: InjuredContributorsDTO[] = [];
 }
