/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from '@gosi-ui/core';
import { MedicalInsurancePolicy } from '@gosi-ui/core/lib/models/medical-insurance-policy';
import { AdminRoles } from './admin-roles';

export class BranchList {
  name: BilingualText = new BilingualText();
  registrationNo: number = undefined;
  status: BilingualText = new BilingualText();
  location: BilingualText = new BilingualText();
  fieldOffice: BilingualText = new BilingualText();
  billStatus: string = undefined;
  billAmount: number = undefined;
  certificateStatus = false;
  establishmentType: BilingualText = new BilingualText();
  legalEntity: BilingualText = new BilingualText();
  delinked?: boolean = undefined;
  recordActionType?: string;
  roles?: BilingualText[] = []; // To assemble admin roles from backend
  adminRole?: AdminRoles[] = []; //Roles and start dates from backend
  noOfBranches?: number;
  proactiveStatus?: number = undefined;
  showCompleteInfo?: boolean;
  gccCountry?: boolean;
  activeRegNo?: number; //authorised regNo to be used in admin apis
  medicalInsurancePolicy?: MedicalInsurancePolicy;
}
