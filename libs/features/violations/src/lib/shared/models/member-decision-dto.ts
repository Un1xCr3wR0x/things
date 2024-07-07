import { BilingualText } from '@gosi-ui/core';
import { ContributorsDecisionInfoDto } from '.';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class MemberDecisionDto {
  assignedCommitteeUser: string;
  committeeMemberOrHead: string;
  contributorsDecisionInfoDto: ContributorsDecisionInfoDto[];
  establishmentProactiveAction: boolean;
  justification: string;
  penaltyAmount: number;
  comments: string;
  commentScope: string;
  selectedViolationClass: string;
  outcome: string;
  penaltyCalculationEquation: BilingualText;
  systemSuggestedClass?: string;
}
