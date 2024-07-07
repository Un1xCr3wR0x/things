/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { EngagementBasicDetails } from './engagement-basic-details';

export class EngagementSummary {
  current: EngagementBasicDetails = new EngagementBasicDetails();
  updated: EngagementBasicDetails = new EngagementBasicDetails();
}
