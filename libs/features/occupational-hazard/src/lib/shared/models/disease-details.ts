/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
    BilingualText,
    GosiCalendar,
    DocumentSubmitItem,
    TransactionReferenceData,
    MobileDetails  
  } from '@gosi-ui/core';
  import { ValidationComments } from './validation-comment';
  import { OccupationDetails } from './occupation';
  import { EngagementDetailsDTO } from './engagement-detailsDTO';
  import { HealthInspection } from './health-inspection';
  
  export class Disease {
    diseaseId?: number = undefined;
    accidentType: BilingualText = new BilingualText();
    auditStatus: string = undefined;
    allowancePayee: number;
    allowancePaymentType : BilingualText;
    rejectionAllowedIndicator?: boolean;
    autoValidationComments?: ValidationComments[] = [];
    city: BilingualText = new BilingualText();
    cityDistrict: BilingualText = new BilingualText();
    closingDate: GosiCalendar = new GosiCalendar();
    engagementStartDate: GosiCalendar = new GosiCalendar();
    comments: string = undefined;
    country: BilingualText = new BilingualText();
    deathDate: GosiCalendar = new GosiCalendar();
    establishmentId : number[]=[];
    treatmentCompleted = false;
    detailedPlace: string = undefined;
    emergencyContactNo: MobileDetails = new MobileDetails();
    employeeInformedDate: GosiCalendar = new GosiCalendar();
    employerInformedOn: GosiCalendar = new GosiCalendar();
    employeeInformedOn: GosiCalendar=new GosiCalendar();
    diseaseDiagnosed :GosiCalendar=new GosiCalendar();  
    finalDiagnosis: string = undefined;
    foregoExpenses?: Boolean;
    governmentSector: BilingualText = new BilingualText();
    hasRejectionInProgress?: Boolean;
    hasActiveEngagement?: Boolean;
    hasOpenComplication?: Boolean;
    hasRejectedComplication?: Boolean;
    hasPendingChangeRequest?: Boolean;  
    latitude: string = undefined;
    listOfTransactionReferenceData?: TransactionReferenceData[];
    lineOfTreatment: BilingualText = new BilingualText();
    modifyDiseaseIndicator? = false;
    longitude: string = undefined;  
    place: BilingualText = new BilingualText();
    reopenAllowedIndicator?: Boolean;
    reasonForDelay: BilingualText = new BilingualText();
    rejectInitiatedDate: GosiCalendar = new GosiCalendar();
    reopenInitiatedDate: GosiCalendar = new GosiCalendar();
    diseaseRejectionReason: BilingualText = new BilingualText();
    reopenReason: BilingualText = new BilingualText();
    requiredDocuments: BilingualText[];
    scanDocuments: DocumentSubmitItem[];
    status: BilingualText = new BilingualText();
    totalDiseaseCount?: number = undefined;
    tpaCode?: string;
    workDisabilityDate: GosiCalendar = new GosiCalendar();
    workFlowStatus?: number = undefined;
    navigationIndicator?: number = undefined;
    modifiedDiseaseDetails?: Disease;
    reasonActive?: Boolean;  
    diseaseDiagnosisDate: GosiCalendar = new GosiCalendar();
    workDisabiltyDate: GosiCalendar = new GosiCalendar();
    contributorInformedDate: GosiCalendar = new GosiCalendar();
    diseaseDiagnosis : BilingualText = new BilingualText();
    diseaseCause : BilingualText[] = [];
    diseaseDescription:  string = undefined;
    diseaseLeadToDeathOfContributor?: Boolean;
    diseaseLeadsToDeathIndicator : BilingualText = new BilingualText();
    engagements : EngagementDetailsDTO[];
    establishmentRegNo : number;
    occupationDetails : OccupationDetails[] = [];
    injuryStatus: { arabic: string; english: string; };
    diseaseStatus : BilingualText = new BilingualText();
    diseaseDescriptionArray: string[] = [];
    isOccupationChanged? = false;
    inspectionReason: BilingualText = new BilingualText();
    establishmentName: BilingualText[] = [];
    transferredInjuryid: number;
    isTransferredInjury: boolean;
    gosiDoctorSubmitdto : HealthInspection;
  }
  
  export class ReopenDisease {
    reOpenReason: BilingualText = new BilingualText();
  }