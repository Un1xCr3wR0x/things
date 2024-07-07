/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from '@gosi-ui/core';

export class SafetyCheckListResponse {
  comments: string;
  currentOHRate: string;
  referenceNumber: number;
  safetyChecklists: SCGuidelineResponseList[] = [];
  isCompliant: boolean;
  bpmTaskId: string;
}

export class SCGuidelineResponseList {
  additionalInfoDtoList: SCAddInfoResponseList[] = [];
  violationGuideLineCode: number;
  violationGuideline?: BilingualText;
  categoryId?: number;
  isCompliance?: boolean;
}

export class SCAddInfoResponseList {
  addInfo?: BilingualText;
  addInfoId: number;
  addInfoValue: string;
}
