/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { GroupInjury } from './group-injury-details';

export class GroupInjuryWrapper {
  groupInjuryResponseDto: GroupInjury = new GroupInjury();
  groupInjuryContributorDetails: GroupInjury[] = [];  
}
