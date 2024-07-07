/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
    BilingualText,
    GosiCalendar  
  } from '@gosi-ui/core';
import { EngagementDetailsDTO } from './engagement-detailsDTO';
  
  
  export class DiseaseDetailsDTO {
    diseaseId?: number = undefined;
    diseaseDiagnosisDate: GosiCalendar = new GosiCalendar();
    workDisabiltyDate: GosiCalendar = new GosiCalendar();
    contributorInformedDate: GosiCalendar = new GosiCalendar();
    employerInformedOn : GosiCalendar = new GosiCalendar();
    diseaseDiagnosis : BilingualText = new BilingualText();
    diseaseCause : BilingualText = new BilingualText();
    diseaseDescription: string = undefined;
    diseaseLeadToDeathOfContributor = false;
    diseaseRejectionReason: BilingualText = new BilingualText();
    diseaseStatus: BilingualText = new BilingualText();
    engagements : EngagementDetailsDTO[];
    establishmentRegNo : number;
    requiredDocuments: BilingualText[];
  }
  
  
