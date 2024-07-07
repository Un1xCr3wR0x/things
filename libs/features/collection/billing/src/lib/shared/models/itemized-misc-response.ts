import { GosiCalendar } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class ItemizedMiscResponse {
  adjustments: ItemizedMiscResponseDetails[];
}

export class ItemizedMiscResponseDetails {
  relatedToContributor: false;
  contributorId: number;
  adjustmentDate: GosiCalendar;
  description: string;
  periodStartDate: GosiCalendar;
  periodEndDate: GosiCalendar;
  annContribution: number;
  annPenality: number;
  rejectedOHCaseNo: number;
  rejectedOHAmount: number;
  violationNo: number;
  violationAmount: number;
  totalAmount: number;
  uicontribution: number;
  ohcontribution: number;
  uipenality: number;
  ohpenality: number;
  ppaAnnContribution: number;
  ppaAnnPenality:  number;
  prAnnContribution:  number;
  prAnnPenality:  number;
  fromJsonToObject(json) {
    if (json) {
      Object.keys(json).forEach(key => {
        this[key] = json[key];
      });
    }
    return this;
  }
}
