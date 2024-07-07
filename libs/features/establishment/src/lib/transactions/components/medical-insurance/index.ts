/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  MedicalInsuranceScComponent
} from "@gosi-ui/features/establishment/lib/transactions/components/medical-insurance/medical-insurance-sc/medical-insurance-sc.component";
import {MedicalInsuranceAcknowledgementDcComponent} from "@gosi-ui/features/establishment/lib/transactions/components";

export const MEDICAL_INSURANCE_COMPONENT = [
  MedicalInsuranceScComponent,
  MedicalInsuranceAcknowledgementDcComponent
]

export * from './medical-insurance-sc/medical-insurance-sc.component';
export * from './medical-insurance-acknowledgement-dc/medical-insurance-acknowledgement-dc.component'
