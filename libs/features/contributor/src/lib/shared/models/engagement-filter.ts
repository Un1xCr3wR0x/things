import { BilingualText, Lov } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class EngagementFilter {
  occupation: Lov[] = [];
  endDate: string = undefined;
  startDate: string = undefined;
  estName: string = undefined;
  employer: BilingualText[] = [];
  engagementType: BilingualText[] = [];
  engagementStatus: BilingualText[] = [];

  // fromJsonToObject(json) {
  //   Object.keys(new EngagementFilter()).forEach(key => {
  //     this[key] = json[key];
  //   });
  //   return this;
  // }
}
