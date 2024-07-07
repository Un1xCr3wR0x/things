/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import {
  AddressDetails,
  AddressTypeEnum,
  BilingualText,
  BorderNumber,
  ContactDetails,
  DocumentSubmitItem,
  EmailType,
  GosiCalendar,
  Iqama,
  MobileDetails,
  Name,
  NationalId,
  NIN,
  Passport,
  PhoneDetails
} from '@gosi-ui/core';
import { BankAccountListing } from './bank-account-list';
import { Contracts } from './contract';

  export class ContractData {
  registrationNo: number = undefined;
  contracts:Contracts[]=new Array<Contracts>();
  contractId: number = undefined;
  transactionTraceId: number = undefined;
  birthDate: GosiCalendar = new GosiCalendar();
  deathDate:  GosiCalendar = new GosiCalendar();
  education: BilingualText;
  lifeStatus: string = undefined;  
  maritalStatus: BilingualText;
  prisoner: boolean; 
  proactive: boolean;
  religion:  BilingualText = new BilingualText();
  specialization:  BilingualText = new BilingualText();
  student: boolean;
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
  personId: number;
  status: BilingualText;
  scanDocuments: DocumentSubmitItem[];
  commentsDto = {
    comments: undefined
  };
  isReturn: boolean;
  govtEmployee: boolean;
  emailId: EmailType = new EmailType();
  faxNo: string = undefined;
  mobileNo: MobileDetails = new MobileDetails();
  telephoneNo: PhoneDetails = new PhoneDetails();
  addresses: AddressDetails[] = [];
  mobileNoVerified? = false;
  currentMailingAddress: string = AddressTypeEnum.NATIONAL;
  emergencyContactNo: number = undefined;
  bilingualMessage
}
