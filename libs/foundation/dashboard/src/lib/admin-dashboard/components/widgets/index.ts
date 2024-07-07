/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { WorklistWidgetDcComponent } from './worklist-widget-dc/worklist-widget-dc.component';
import { BillDetailsWidgetDcComponent } from './bill-details-widget-dc/bill-details-widget-dc.component';
import { EngagementWidgetDcComponent } from './engagement-widget-dc/engagement-widget-dc.component';
import { OccupationalHazardWidgetDcComponent } from './occupational-hazard-widget-dc/occupational-hazard-widget-dc.component';
import { QuickLinksWidgetDcComponent } from './quick-links-widget-dc/quick-links-widget-dc.component';
import { RecentActivitiesWidgetDcComponent } from './recent-activities-widget-dc/recent-activities-widget-dc.component';
import { SkeletonCardDcComponent } from './skeleton-card-dc/skeleton-card-dc.component';

export const DASHBOARD_WIDGET_COMPONENTS = [
  WorklistWidgetDcComponent,
  BillDetailsWidgetDcComponent,
  EngagementWidgetDcComponent,
  OccupationalHazardWidgetDcComponent,
  QuickLinksWidgetDcComponent,
  RecentActivitiesWidgetDcComponent,
  SkeletonCardDcComponent
];

export * from './bill-details-widget-dc/bill-details-widget-dc.component';
export * from './engagement-widget-dc/engagement-widget-dc.component';
export * from './occupational-hazard-widget-dc/occupational-hazard-widget-dc.component';
export * from './quick-links-widget-dc/quick-links-widget-dc.component';
export * from './recent-activities-widget-dc/recent-activities-widget-dc.component';
export * from './worklist-widget-dc/worklist-widget-dc.component';
export * from './skeleton-card-dc/skeleton-card-dc.component';
