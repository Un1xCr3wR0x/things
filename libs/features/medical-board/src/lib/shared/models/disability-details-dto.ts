/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from '@gosi-ui/core';
import { DisabilityAttendenceDetails } from './disability-attendence-details';
import { SpecialtyList } from './disabiliy-dto-list';
import {  DisabledPart, DisabledParts } from './disabled-parts';
import { RequireVisitingDoctor } from './require-visiting-doctor';
import { SpecialtyDetails } from './specialty-details';

export class DisabilityDetailsDto {
  transactionTraceId: string = undefined;
  isParticipantAttendanceRequired: string;
  isVdRequired: boolean = undefined;
  specialtyList: SpecialtyList[];
  bodyPartsList: DisabledPart[] | DisabledParts[];
  vdDetails: RequireVisitingDoctor;
  description?: string = undefined;
  assessmentType: string;
  comments?: string;
  disabilityReason?: string;
  disabilityType?: BilingualText;
  isReturn?: boolean;
  mbAssessmentRequestId?: number;
  mbContractId?: number;
  mbProfessionalId?: number;
  injuryId?: number;
  sessionId?: number;
  isVDRequired?: boolean;
  reassessmentDescription?: string;
  slotSequence?: number;
}
