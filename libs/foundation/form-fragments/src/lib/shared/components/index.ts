/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DocumentsDcComponent } from './documents-dc/documents-dc.component';
import { DocumentUploadDcComponent } from './document-upload-dc/document-upload-dc.component';
import { AssessmentAppealDcComponent } from './assessment-appeal-dc/assessment-appeal-dc.component';
import { AssessmentViewDcComponent } from './assessment-view-dc/assessment-view-dc.component';

export const SHARED_COMPONENTS = [DocumentUploadDcComponent, AssessmentAppealDcComponent, AssessmentViewDcComponent];

export const MANAGE_PERSON_COMPONENTS = [
  DocumentsDcComponent,
];

export * from './documents-dc/documents-dc.component';
export * from './document-upload-dc/document-upload-dc.component';
export * from './assessment-appeal-dc/assessment-appeal-dc.component';
export * from './assessment-view-dc/assessment-view-dc.component';
