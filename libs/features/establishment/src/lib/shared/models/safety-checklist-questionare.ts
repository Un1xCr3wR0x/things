/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, LovList } from '@gosi-ui/core';

export class SafetyCheckListQuestionare {
  establishmentSafetyChecklists: EstablishmentSafetyChecklist[];
}

export class EstablishmentSafetyChecklist {
  mainCategory: BilingualText;
  subCategory: SCListSubCategory[];
  selectedCount: number = 0;
  complianceList?: LovList;
  categoryCode: number;
  disabledComplainceValueValues?: string[] = [];
  highLightError?: boolean;
}
export class SCListSubCategory {
  subCategory: BilingualText;
  guideLines: SCGuideLines[];
  valueType: string;
  subCategoryCode: number;
}

export class SCGuideLines {
  guideline: BilingualText;
  guidelineId: number;
  additionalInfoList: SCAdditionalInfoList[];
  selected: boolean;
  isDisabled?: boolean;
}

export class SCAdditionalInfoList {
  additionalInfo: BilingualText;
  valueType: string;
  addInfoId: number;
  unit: string;
  value?: string;
}
