import { BilingualText } from '@gosi-ui/core/lib/models/bilingual-text';
/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class InspectionInfo {
  channel: BilingualText;
  visitId: string;
  inspectorComments: string;
  rasedRecommendation: BilingualText;
  inspectionType: BilingualText;
}
