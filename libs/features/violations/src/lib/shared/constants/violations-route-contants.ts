/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { RouteEnum } from '../enums/route-enum';

export class ViolationRouteConstants {
  public static ROUTE_VIOLATIONS(): string {
    return `home/violations`;
  }

  /** Route for person detail edit. */
  public static ROUTE_VIOLATIONS_VALIDATOR() {
    return `${ViolationRouteConstants.ROUTE_VIOLATIONS()}/validator`;
  }

  /** Route for person detail edit. */
  public static ROUTE_VIOLATIONS_HISTORY() {
    return `${ViolationRouteConstants.ROUTE_VIOLATIONS()}/violation-history`;
  }

  /** Route for person detail edit. */
  public static ROUTE_VIOLATIONS_PROFILE(transactionId, regno) {
    return `${ViolationRouteConstants.ROUTE_VIOLATIONS()}/${regno}/violation-profile/${transactionId}`;
  }
  public static ROUTE_CANCEL_VIOLATIONS_PROFILE(transactionId, regno) {
    return `${ViolationRouteConstants.ROUTE_VIOLATIONS_PROFILE(transactionId, regno)}/cancel-violation`;
  }
  public static ROUTE_MODIFY_VIOLATIONS_PROFILE(transactionId, regno) {
    return `${ViolationRouteConstants.ROUTE_VIOLATIONS_PROFILE(transactionId, regno)}/modify-penalty`;
  }
  public static ROUTE_EDIT_CANCEL_VIOLATIONS_PROFILE(transactionId, regno) {
    return `${ViolationRouteConstants.ROUTE_VIOLATIONS_PROFILE(transactionId, regno)}/cancel-violation/edit`;
  }
  public static ROUTE_EDIT_MODIFY_VIOLATIONS_PROFILE(transactionId, regno) {
    return `${ViolationRouteConstants.ROUTE_VIOLATIONS_PROFILE(transactionId, regno)}/modify-penalty/edit`;
  }
  public static ROUTE_EXCLUDE_CONTRIBUTOR() {
    return `${ViolationRouteConstants.ROUTE_VIOLATIONS_VALIDATOR()}/excluded-contributor`;
  }
  public static ROUTE_PENALTY_CALCULATION_DETAILS() {
    return `${ViolationRouteConstants.ROUTE_VIOLATIONS_VALIDATOR()}/penalty-calculation-details`;
  }
  public static ROUTE_RAISE_VIOLATIONS(regNo) {
    return `${ViolationRouteConstants.ROUTE_VIOLATIONS()}/raise-violations/${regNo}/new-violation`;
  }
  /** Route for raise violation edit page. */
  public static ROUTE_RAISE_VIOLATIONS_EDIT(regNo) {
    return `${ViolationRouteConstants.ROUTE_RAISE_VIOLATIONS(regNo)}/edit`;
  }
  /** Route for contributor profile. */
  public static ROUTE_CONTRIBUTOR_PROFILE_PAGE(regNo: number, sin: number) {
    return `/home/profile/individual/internal/${sin}/engagements/establishment/${regNo}`;
    // `/home/profile/contributor/${regNo}/${sin}/engagement/individual`;
  }
  /** Route for establishment profile. */
  public static ROUTE_ESTABLISHMENT_PROFILE_PAGE(regNo: number) {
    return `/home/establishment/profile/${regNo}/view`;
  }
  /** Routes for validator view incorrect termination. */
  public static get ROUTE_VALIDATOR_INCORRECT_TERMINATION(): string {
    return '/home/violations/validator/incorrect-termination';
  }
  /** Routes for validator view incorrect wage. */
  public static get ROUTE_VALIDATOR_INCORRECT_WAGE(): string {
    return '/home/violations/validator/incorrect-wage';
  }
  /** Routes for validator view modify joining date. */
  public static get ROUTE_VALIDATOR_MODIFY_JOINING_DATE(): string {
    return '/home/violations/validator/modify-joining-date';
  }
  /** Routes for validator view add new engagement. */
  public static get ROUTE_VALIDATOR_ADD_NEW_ENGAGEMENT(): string {
    return '/home/violations/validator/add-new-engagement';
  }
  /** Routes for validator view modify leaving date. */
  public static get ROUTE_VALIDATOR_MODIFY_LEAVING_DATE(): string {
    return '/home/violations/validator/modify-termination-date-backdated-termination';
  }
  /** Routes for validator view cancel engagement. */
  public static get ROUTE_VALIDATOR_CANCEL_ENGAGEMENT(): string {
    return '/home/violations/validator/cancel-engagement';
  }
  /** Routes for validator view modify violation. */
  public static get ROUTE_VALIDATOR_MODIFY_VIOLATION(): string {
    return '/home/violations/validator/modify-violations';
  }
  /** Routes for validator view cancel violation. */
  public static get ROUTE_VALIDATOR_CANCEL_VIOLATION(): string {
    return '/home/violations/validator/cancel-violations';
  }
  /** Routes for validator view wrong benefits. */
  public static get ROUTE_VALIDATOR_WRONG_BENEFITS(): string {
    return '/home/violations/validator/wrong-benefits';
  }
  /** Routes for validator view violating provisions. */
  public static get ROUTE_VALIDATOR_VIOLATING_PROVISIONS(): string {
    return '/home/violations/validator/violating-provisions';
  }
/** Routes for validator view violating provisions. */
public static get ROUTE_VALIDATOR_INJURY_VIOLATION(): string {
  return '/home/violations/validator/injury-violation';
}
  /** Route for contributor transaction tracking view. */
  public static ROUTE_TRANSACTION_TRACKING(id: string, refId: number) {
    return `/home/transactions/view/${id}/${refId}`;
  }
  /** Routes for transaction view */
  public static ROUTE_TRANSACTIONS(route, id: number, refId: number) {
    if (route === RouteEnum.TRANSACTION_TRACE_MODIFY) {
      return `home/transactions/view/${id}/${refId}/violations/transactions/modify-penalty`;
    } else if (route === RouteEnum.TRANSACTION_TRACE_MODIFY) {
      return `home/transactions/view/${id}/${refId}/violations/transactions/cancel-violation`;
    } else {
      return `home/violation-profile/${id}`;
    }
  }
  /** Routes for validator view Raise violation. */
  public static get ROUTE_VALIDATOR_RAISE_VIOLATION(): string {
    return '/home/violations/validator/raise-violations';
  }
  public static ROUTE_VALIDATOR_FO_VIOLATIONS(transactionId):string{
    return `/home/transactions/view/300393/${transactionId}/violations/transactions/raise-violation`;
  }
  /** Routes for validator view appeal on violation internal user. */
  public static get ROUTE_VALIDATOR_APPEAL_ON_VIOLATION_INTERNAL(): string {
    return '/home/violations/validator/appeal-on-violation';
  }
  /** Routes for validator view appeal on violation external user. */
  public static get ROUTE_VALIDATOR_APPEAL_ON_VIOLATION_EXTERNAL(): string {
    return '/home/violations/validator/appeal-on-violations';
  }
  /** Routes for validator view appeal on violation external user. */
  public static ROUTE_APPEAL_ON_VIOLATION(regNo: number, violationId: number): string {
    return `${ViolationRouteConstants.ROUTE_VIOLATIONS()}/${regNo}/violation-appeal/${violationId}`;
  }
  // Route to Transaction Tracking for specific violation
  public static ROUTE_FOR_TRANSACTION_TRACKING(referenceNo):string{
    return `/home/transactions/view/300410/${referenceNo}/complaints/transactions/general-appeal`;
  }
  
}
