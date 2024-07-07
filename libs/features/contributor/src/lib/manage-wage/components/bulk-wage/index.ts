import { BulkWageCustomListScComponent } from './bulk-wage-custom-list-sc/bulk-wage-custom-list-sc.component';
import { BulkWageDetailsDcComponent } from './bulk-wage-details-dc/bulk-wage-details-dc.component';
import { BulkWageUpdateScComponent } from './bulk-wage-update-sc/bulk-wage-update-sc.component';
import { BulkWageUploadDcComponent } from './bulk-wage-upload-dc/bulk-wage-upload-dc.component';
import { BulkWageUploadHistoryDcComponent } from './bulk-wage-upload-history-dc/bulk-wage-upload-history-dc.component';

export const BULK_WAGE_COMPONENTS = [
  BulkWageUpdateScComponent,
  BulkWageUploadDcComponent,
  BulkWageUploadHistoryDcComponent,
  BulkWageCustomListScComponent,
  BulkWageDetailsDcComponent
];

export * from './bulk-wage-custom-list-sc/bulk-wage-custom-list-sc.component';
export * from './bulk-wage-details-dc/bulk-wage-details-dc.component';
export * from './bulk-wage-update-sc/bulk-wage-update-sc.component';
export * from './bulk-wage-upload-dc/bulk-wage-upload-dc.component';
export * from './bulk-wage-upload-history-dc/bulk-wage-upload-history-dc.component';
