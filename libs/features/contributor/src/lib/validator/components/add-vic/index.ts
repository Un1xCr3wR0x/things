/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { ValidateAddVicScComponent } from './validate-add-vic-sc/validate-add-vic-sc.component';
import { ViewHealthRecordDetailDcComponent } from './view-health-record-detail-dc/view-health-record-detail-dc.component';
import { ViewEngagementDetailsDcComponent } from './view-engagement-details-dc/view-engagement-details-dc.component';

export const ADD_VIC_COMPONENTS = [
  ValidateAddVicScComponent,
  ViewHealthRecordDetailDcComponent,
  ViewEngagementDetailsDcComponent
];

export * from './validate-add-vic-sc/validate-add-vic-sc.component';
export * from './view-health-record-detail-dc/view-health-record-detail-dc.component';
export * from './view-engagement-details-dc/view-engagement-details-dc.component';
