import { BilingualText, GosiCalendar, Person } from '@gosi-ui/core';

export interface HeirDirectPaymentList {
  contributorDetails: ContributorDetails2;
  heirs: Heir[];
}

export interface ContributorDetails2 {
  birthDate: GosiCalendar;
  identity: Identity[];
  name: Name;
}

export interface Identity {}

export interface Name {
  arabic: Arabic;
  english: English;
  title: BilingualText;
  titleCode: number;
}

export interface Arabic {
  familyName: string;
  firstName: string;
  secondName: string;
  thirdName: string;
}

export interface English {
  name: string;
}

export interface Heir {
  agentId: number;
  agentIdentifier: string;
  agentType: BilingualText;
  bankAccountList: BankAccountList2[];
  benefitAmount: number;
  benefitList: BenefitList[];
  benefitStartDate: GosiCalendar;
  benefitStatus: BilingualText;
  contactDetail: ContactDetail2;
  heirStatus: BilingualText;
  netAmount: number;
  newIban: boolean;
  person: Person;
  relationship: BilingualText;
  bankAccountLists: BankAccountList2;
}

export interface BankAccountList2 {
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

export interface BenefitList {
  adjustedAmount: number;
  adjustmentList: AdjustmentList[];
  benefitType: BilingualText;
  startDate: GosiCalendar;
  status: BilingualText;
  stopDate: GosiCalendar;
}

export interface AdjustmentList {
  adjustmentAmount: number;
  adjustmentReason: BilingualText;
  adjustmentType: BilingualText;
  paymentType: BilingualText;
  percentage: number;
}

export interface ContactDetail2 {
  addresses: Address2[];
  createdBy: number;
  createdDate: GosiCalendar;
  currentMailingAddress: string;
  emailId: EmailId2;
  emergencyContactNo: string;
  faxNo: string;
  lastModifiedBy: number;
  lastModifiedDate: GosiCalendar;
  maskedData: boolean;
  mobileNo: MobileNo2;
  mobileNoVerified: boolean;
  telephoneNo: TelephoneNo2;
}

export interface Address2 {}

export interface EmailId2 {
  primary: string;
  secondary: string;
}

export interface MobileNo2 {
  isdCodePrimary: string;
  isdCodeSecondary: string;
  primary: string;
  secondary: string;
}

export interface TelephoneNo2 {
  extensionPrimary: string;
  extensionSecondary: string;
  primary: string;
  secondary: string;
}

export interface Identity2 {}

export interface Name2 {
  arabic: Arabic2;
  english: English2;
  title: BilingualText;
  titleCode: number;
}

export interface Arabic2 {
  familyName: string;
  firstName: string;
  secondName: string;
  thirdName: string;
}

export interface English2 {
  name: string;
}
