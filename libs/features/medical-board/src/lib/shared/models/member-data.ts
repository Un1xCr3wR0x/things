import {
  BilingualText,
  GosiCalendar,
  ContactDetails,
  Name,
  NIN,
  Iqama,
  NationalId,
  Passport,
  BorderNumber,
  DocumentSubmitItem
} from '@gosi-ui/core';
import { BankAccountListing } from '../../shared';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class MemberData {
  personId: number = undefined;
  registrationNo: number = undefined;
  mbProfessionalId: number = undefined;
  contractId: number = undefined;
  transactionTraceId: number = undefined;
  birthDate: GosiCalendar = new GosiCalendar();
  name: Name = new Name();
  nationality: BilingualText = new BilingualText();
  identity: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  sex: BilingualText = new BilingualText();
  contactDetail: ContactDetails = new ContactDetails();
  personType?: string = undefined;
  bankAccount?: BankAccountListing;
  contractType: BilingualText;
  hospital: BilingualText;
  medicalBoardType: BilingualText;
  specialty: BilingualText;
  subSpecialty: BilingualText[];
  feesPerVisit: BilingualText;
  fees: number = undefined;
  region: BilingualText[];
  govtEmp: boolean;
  status: BilingualText;
  scanDocuments: DocumentSubmitItem[];
  commentsDto = {
    comments: undefined
  };
  isReturn: boolean;
  govtEmployee: boolean;
  isSubmit?: boolean;
}
