/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
// Imports

import { RecordGovernmentReceiptsScComponent } from './record-government-receipts-sc/record-government-receipts-sc.component';
import { GovernmentReceiptsFileUploadDcComponent } from './government-receipts-file-upload-dc/government-receipts-file-upload-dc.component';
import { GovernmentReceiptsReceivePaymentDcComponent } from './government-receipts-receive-payment-dc/government-receipts-receive-payment-dc.component';
import { GovernmentReceiptsListViewDcComponent } from './government-receipts-list-view-dc/government-receipts-list-view-dc.component';

export const RECORD_GOVERNMENT_RECEIPTS_COMPONENTS = [
  RecordGovernmentReceiptsScComponent,
  GovernmentReceiptsFileUploadDcComponent,
  GovernmentReceiptsReceivePaymentDcComponent,
  GovernmentReceiptsListViewDcComponent
];

// exporting components
export * from './record-government-receipts-sc/record-government-receipts-sc.component';
export * from './government-receipts-file-upload-dc/government-receipts-file-upload-dc.component';
export * from './government-receipts-receive-payment-dc/government-receipts-receive-payment-dc.component';
export * from './government-receipts-list-view-dc/government-receipts-list-view-dc.component';
