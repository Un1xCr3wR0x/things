import { BilingualText, ContactDetails, GosiCalendar } from '@gosi-ui/core';

export class HeirDirectPaymentDto {
  heirMiscPaymentRequestDto: HeirMiscPaymentRequestDto[];
  referenceNo: number;
}

export class HeirMiscPaymentRequestDto {
  agentId: number;
  agentIdentifier: string;
  agentPersonId: number;
  agentType: BilingualText;
  bankAccount: BankAccountDto;
  bankAccountId: number;
  bankAccountUpdated: boolean;
  benefitAmount: number;
  benefitStatus: BilingualText;
  contactDetail: ContactDetails;
  dateOfBirth: GosiCalendar;
  heirStatus: BilingualText;
  ibanBankAccountNo: string;
  identifier: string;
  isNewContactDetails: boolean;
  newIban: boolean;
  newOverseasAddress: boolean;
  personId: number;
  relationship: BilingualText;
  startDate: BilingualText;
}

export class BankAccountDto {
  approvalStatus: string;
  bankAccountId: number;
  bankCode: number;
  bankName: BilingualText;
  bankWarningMessage: BilingualText;
  comments: string;
  disableApprove: boolean;
  ibanBankAccountNo: string;
  isNonSaudiIBAN: boolean;
  isSamaVerified: boolean;
  samaAlreadyVerified: boolean;
  serviceType: string;
  status: BilingualText;
  swiftCode: string;
  verificationStatus: string;
}

export class ContactDetail {
  addresses: Address[];
  createdBy: number;
  createdDate: GosiCalendar;
  currentMailingAddress: string;
  emailId: EmailId;
  emergencyContactNo: string;
  faxNo: string;
  lastModifiedBy: number;
  lastModifiedDate: GosiCalendar;
  maskedData: boolean;
  mobileNo: MobileNo;
  mobileNoVerified: boolean;
  telephoneNo: TelephoneNo;
}

export class Address {}

export class EmailId {
  primary: string;
  secondary: string;
}

export class MobileNo {
  isdCodePrimary: string;
  isdCodeSecondary: string;
  primary: string;
  secondary: string;
}

export class TelephoneNo {
  extensionPrimary: string;
  extensionSecondary: string;
  primary: string;
  secondary: string;
}
