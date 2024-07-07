import { RoleIdEnum } from '../enums';
import { DefaultRoute } from '../models';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export abstract class RouterConstantsBase {
  public static get ROUTE_VALIDATOR_COMPLAINTS(): string {
    return 'home/complaints/validator';
  }
  public static get TRANSACTION_COMPLAINT(): string {
    return 'Complaint';
  }
  public static get TRANSACTION_ENQUIRY(): string {
    return 'Enquiry';
  }
  public static get TRANSACTION_APPEAL(): string {
    return 'Appeal';
  }
  public static get TRANSACTION_PLEA(): string {
    return 'Plea';
  }
  public static get TRANSACTION_SUGGESTION(): string {
    return 'Suggestion';
  }
  public static get TRANSACTIONS_UNDER_COMPLAINTS(): string[] {
    return [
      this.TRANSACTION_COMPLAINT,
      this.TRANSACTION_ENQUIRY,
      this.TRANSACTION_APPEAL,
      this.TRANSACTION_PLEA,
      this.TRANSACTION_SUGGESTION
    ];
  }
  public static get ROUTE_DASHBOARD_SEARCH(): string {
    return '/dashboard/search';
  }
  public static get ROUTE_ESTABLISHMENT_SEARCH(): string {
    return '/dashboard/search/establishment';
  }
  public static get ROUTE_TRANSACTION_SEARCH(): string {
    return '/dashboard/search/transaction';
  }
  public static get ROUTE_INDIVIDUAL_SEARCH(): string {
    return '/dashboard/search/individual';
  }

  public static get ROUTE_REASSIGN_HISTORY(): string {
    return '/home/complaints/register/reassign/history';
  }
  public static ROUTE_VIOLATION_HISTORY(registrationNo: number): string {
    return `/home/violations/violation-history/${registrationNo}`;
  }
  public static ROUTE_VIOLATIONS_COMMITMENT_INDICATORS(registrationNo: number): string {
    return `/home/violations/commitment-indicator/${registrationNo}`;
  }
  public static ROUTE_PROFILE_BILL_DASHBOARD(registrationNo: number, identifier: number): string {
    return `/home/establishment/profile/${registrationNo}/user/${identifier}/bill/bill-account`;
  }
  public static ROUTE_PROFILE_PRIVATE_BILL_DASHBOARD(registrationNo: number): string {
    return `/home/establishment/profile/${registrationNo}/view/bill/bill-account`;
  }

  public static ROUTE_PROFILE_PRIVATE_CONTRIBUTOR_LIST(registrationNo: number): string {
    return `/home/establishment/profile/${registrationNo}/view/contributor-list`;
  }
  public static ROUTE_PROFILE_CONTRIBUTOR_LIST(registrationNo: number, identifier: number): string {
    return `/home/establishment/profile/${registrationNo}/user/${identifier}/contributor-list`;
  }
  public static ROUTE_ESTABLISHMENT_TRANSACTION_HISTORY(registrationNo: number): string {
    return `/home/transactions/list/establishment/${registrationNo}`;
  }
  public static get ROUTE_TRANSACTION_HISTORY(): string {
    return `/home/transactions/list/history`;
  }
  public static get ROUTE_NOTIFICATIONS(): string {
    return `/home/transactions/list/notifications`;
  }
  public static get ROUTE_MY_TRANSACTIONS(): string {
    return `/home/transactions/list`;
  }
  public static get ROUTE_BULK_REASSIGN(): string {
    return '/home/team/reassign';
  }
  public static get ROUTE_BILL_DASHBOARD(): string {
    return `/home/billing/establishment/dashboard/view`;
  }
  public static ROUTE_ESTABLISHMENT_CERTIFICATE(registrationNo: number): string {
    return `/home/establishment/certificates/${registrationNo}/view`;
  }

  public static ROUTE_CONTRIBUTOR_PROFILE_ENGAGEMENTS(socialInsuranceNumber: number): string {
    // return `/home/profile/contributor/${socialInsuranceNumber}/engagement/unified`;
    //return `/home/profile/individual/internal/${socialInsuranceNumber}/engagements`
    return 'home/billing/vic/dashboard';
  }

  public static ROUTE_CONTRIBUTOR_PROFILE_INFO(socialInsuranceNumber: number): string {
    return `/home/profile/contributor/${socialInsuranceNumber}/info`;
  }

  public static ROUTE_INDIVIDUAL_PROFILE_INFO(personId: number): string {
    return `/home/profile/individual/internal/${personId}`;
  }
  public static ROUTE_INDIVIDUAL_PROFILE_ENGAGEMENT(regNo: number, personId: number): string {
    return `/home/profile/individual/internal/${personId}/engagements/establishment/${regNo}`;
  }

  public static ROUTE_ESTABLISHMENT_PROFILE(registrationNo: number, identifier: number): string {
    return `/home/establishment/profile/${registrationNo}/user/${identifier}`;
  }
  public static ROUTE_ESTABLISHMENT_REGISTER(registrationNo: number): string {
    return `/home/complaints/register/register-complaint?registrationNo=${registrationNo}`;
  }
  public static get REGEX_ROUTE_ESTABLISHMENT_PROFILE(): string {
    return `/home/establishment/profile/[0-9]*/.*`;
  }
  public static get REGEX_ROUTE_CONTRIBUTOR_PROFILE(): string {
    return `/home/profile/contributor/.*`;
  }
  public static get PRIVATE_DEFAULT_ROUTE_LIST(): DefaultRoute[] {
    return [
      {
        roles: [RoleIdEnum.CSR, RoleIdEnum.CALL_CENTRE_AGENT, RoleIdEnum.FEATURE_360_ALL_USER],
        url: this.ROUTE_ESTABLISHMENT_SEARCH,
        isNegate: false
      },
      {
        roles: [RoleIdEnum.BULK_REASSIGN_USER],
        url: this.ROUTE_BULK_REASSIGN,
        isNegate: false
      },
      {
        roles: [RoleIdEnum.CSR, RoleIdEnum.CALL_CENTRE_AGENT, RoleIdEnum.FEATURE_360_ALL_USER],
        url: this.ROUTE_MY_TRANSACTIONS,
        isNegate: true
      }
    ];
  }
  public static ESTABLISHMENT_RESUME_ROUTE(transactionRefId: number, transactionid: number): string {
    return `home/establishment/transaction/resume/${transactionid}/${transactionRefId}`;
  }
  public static ROUTE_CONTRACT_DOCTOR(): string {
    return `home/medical-board/doctor-profile/person-details`;
  }
  public static get TRANSACTION_REPLACE_GCC_ADMIN(): string {
    return 'Establishment-replaceGCCAdmin';
  }
  public static get ROUTE_UNDER_MAINTANENCE(): string {
    return '/system-maintanance';
  }
  public static get ROUTE_INVALID_TOKEN(): string {
    return '/invalid-token';
  }
  public static get ROUTE_CONTACTUS(): string {
    return `/home/complaints/contact`;
  }
  public static get ROUTE_INDIVIDUAL_CONTACT(): string {
    return '/home/complaints/contact/write-to-us';
  }
  public static get ROUTE_INDIVIDUAL_INBOX(): string {
    return '/home/transactions/list';
  }
  public static get ROUTE_INDIVIDUAL_DASHBOARD(): string {
    return '/home/dashboard/individual';
  }
  public static ROUTE_ESTABLISHMENT_HEALTH_INSURANCE(registrationNo: number): string {
    return `/home/establishment/health-insurance-list/${registrationNo}`;
  }
  public static ROUTE_TERMS_AND_CONDITIONS(registrationNo: number): string {
    return `/home/establishment/health-insurance-list/${registrationNo}/terms-and-conditions`;
  }
  public static ROUTE_REDIERCT_TO_SELECTED_COMPANY(registrationNo: number): string {
    return `/home/establishment/health-insurance-list/${registrationNo}/terms-and-conditions/redierct-to-selected-insurance-company`;
  }
  public static get INDIVIDUAL_ROUTE_LIST(): DefaultRoute[] {
    return [
      {
        roles: [RoleIdEnum.SUBSCRIBER, RoleIdEnum.VIC],
        url: this.ROUTE_INDIVIDUAL_DASHBOARD,
        isNegate: false
      },
      {
        roles: [RoleIdEnum.GUEST],
        url: this.ROUTE_INDIVIDUAL_INBOX,
        isNegate: false
      }
    ];
  }
  public static get ROUTE_LOGIN(): string {
    return '/do-login';
  }
  public static get CONTRACTEDDOC_ROUTE_LIST(): DefaultRoute[] {
    return [
      {
        roles: [RoleIdEnum.CONTRACTED_DOCTOR],
        url: this.ROUTE_CONTRACT_DOCTOR(),
        isNegate: false
      }
    ];
  }
  public static ROUTE_ENGAGEMENT(identifier): string {
    return `/home/profile/individual/internal/${identifier}/engagements`;
  }
}
