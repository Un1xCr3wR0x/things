/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class MbRouteConstants {
  public static ROUTE_MEDICAL_BOARD_PROFILE(identificationNo): string {
    return `home/medical-board/doctor-profile/${identificationNo}`;
  }
  public static ROUTE_PARTICIPANT_PROFILE(identificationNo): string {
    return `home/medical-board/participant-profile/${identificationNo}/details`;
  }
  /** Route for person detail edit. */
  public static ROUTE_PROFILE_PERSON_DETAILS(identificationNo) {
    return `${MbRouteConstants.ROUTE_MEDICAL_BOARD_PROFILE(identificationNo)}/person-details`;
  }

  /** Route for contact detail edit. */
  public static ROUTE_PROFILE_CONTACT_DETAILS_EDIT(identificationNo) {
    return `${MbRouteConstants.ROUTE_MEDICAL_BOARD_PROFILE(identificationNo)}/contact/edit`;
  }

  /** Route for add member */
  public static get ROUTE_ADD_MEDICAL_MEMBERS(): string {
    return '/home/medical-board/add-members';
  }
  /** Route for add another member . */
  public static get ROUTE_ADD_ANOTHER_MEMBERS(): string {
    return '/home/medical-board/add-members/refresh';
  }

  /** Route for address detail edit. */
  public static ROUTE_PROFILE_ADDRESS_DETAILS_EDIT(identificationNo): string {
    return `${MbRouteConstants.ROUTE_MEDICAL_BOARD_PROFILE(identificationNo)}/address`;
  }

  /** Route for bank detail edit. */
  public static ROUTE_PROFILE_BANK_DETAILS_EDIT(identificationNo): string {
    return `${MbRouteConstants.ROUTE_MEDICAL_BOARD_PROFILE(identificationNo)}/bank`;
  }

  /** Route for contract detail edit. */
  public static ROUTE_PROFILE_DOCTOR_DETAILS_EDIT(identificationNo): string {
    return `${MbRouteConstants.ROUTE_MEDICAL_BOARD_PROFILE(identificationNo)}/doctor-details`;
  }
  /** Route for Add Unavailable Period. */
  public static ROUTE_PROFILE_ADD_UNAVAILABLE_PERIOD(identificationNo): string {
    return `${MbRouteConstants.ROUTE_MEDICAL_BOARD_PROFILE(identificationNo)}/add-unavailable-period`;
  }
  /** Route for modify contract details. */
  public static ROUTE_PROFILE_MODIFY_CONTRACT(identificationNo, contractId): string {
    return `${MbRouteConstants.ROUTE_MEDICAL_BOARD_PROFILE(identificationNo)}/modify-contract/${contractId}`;
  }

  /** Route for terminate contract. */
  public static ROUTE_PROFILE_TERMINATE_CONTRACT(identificationNo, contractId): string {
    return `${MbRouteConstants.ROUTE_MEDICAL_BOARD_PROFILE(identificationNo)}/terminate-contract/${contractId}`;
  }

  /** Route for Add Unavailable Period. */
  public static ROUTE_PROFILE_MODIFY_UNAVAILABLE_PERIOD(identificationNo, calenderId): string {
    return `${MbRouteConstants.ROUTE_MEDICAL_BOARD_PROFILE(identificationNo)}/modify-unavailable-period/${calenderId}`;
  }

  /** Route for contact detail edit. */
  public static get ROUTE_LIST_MEDICAL_MEMBERS(): string {
    return '/home/medical-board/list-members';
  }

  /** Routes for validator view add member. */
  public static get ROUTE_VALIDATOR_ADD_MEMBER(): string {
    return '/home/medical-board/validator/add-member';
  }

  /** Routes for validator view modify contract. */
  public static get ROUTE_VALIDATOR_MODIFY_CONTRACT(): string {
    return '/home/medical-board/validator/modify-contract';
  }

  /** Routes for validator view terminate contract. */
  public static get ROUTE_VALIDATOR_TERMINATE_CONTRACT(): string {
    return '/home/medical-board/validator/terminate-contract';
  }

  /** Route for terminate contract. */
  public static ROUTE_CONTRACT_HISTORY(identificationNo, contractId): string {
    return `${MbRouteConstants.ROUTE_MEDICAL_BOARD_PROFILE(identificationNo)}/contract-history/${contractId}`;
  }

  /** Routes for add member return */
  public static get ROUTE_ADD_MEDICAL_MEMBERS_EDIT(): string {
    return '/home/medical-board/add-members/edit';
  }

  /** Routes for add member return */
  public static get ROUTE_SESSION_CONFIGURATION_DETAILS(): string {
    return `home/medical-board/medical-board-session/session-details`;
  }
  /** Routes for adding Visiting Doctor  */
  public static get ROUTE_ADD_VISITING_DOCTOR_EDIT(): string {
    return `home/medical-board/add-visiting-doctor/edit`;
  }
  /**Routes for Gosi Doctor View */
  public static get ROUTE_GOSI_DOCTOR_VIEW(): string {
    return '/home/medical-board/validator/gosi-doctor-view';
  }
  public static get ROUTE_GOSI_DOCTOR_APPEAL_VIEW(): string {
    return 'home/oh/injury/appeal';
  }
  public static get ROUTE_MEDICAL_SESSION(): string {
    return '/home/medical-board/validator/validator-medical-session';
  }
  public static get ROUTE_ASSESSMENT_VIEW(): string {
    return `/home/medical-board/disability-assessment/view`;
  }
  public static get ROUTE_E_SIGN(): string {
    return `/home/medical-board/disability-assessment/e-sign`;
  }

  /** Routes for clarification from contributor  */
  public static get ROUTE_CONTRIBUTOR_CLARIFICATION(): string {
    return `home/medical-board/validator/contributor-clarification`;
  }
}
