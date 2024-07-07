/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { TeamLimit } from './team-limit';
import { TeamSearch } from './team-search';

export class TeamRequest {
  member: string;
  page: TeamLimit = new TeamLimit();
  search: TeamSearch = new TeamSearch();
}
