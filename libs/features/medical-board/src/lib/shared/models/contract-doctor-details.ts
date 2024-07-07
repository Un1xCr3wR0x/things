
/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BankDataDetails, Contracts } from '.';
import { ContactDetails } from '@gosi-ui/core';
import { MemberContract } from './member-contract';
export class ContractDoctorDetails {
    bankAccount?: BankDataDetails;
    contactDetail: ContactDetails = new ContactDetails();
    memberDetails:  MemberContract = new MemberContract();
}