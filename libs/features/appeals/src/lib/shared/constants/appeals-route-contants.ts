/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class AppealRouteConstants {
  public static ROUTE_APPEALS(): string {
    return `home/appeals`;
  }
  /** Route for person detail edit. */
  public static ROUTE_APPEALS_VALIDATOR() {
    return `${AppealRouteConstants.ROUTE_APPEALS()}/validator`;
  }
  /** Routes for validator view appeal. */
  public static get ROUTE_VALIDATOR_APPEAL(): string {
    return `${AppealRouteConstants.ROUTE_APPEALS_VALIDATOR()}/appeal`;
  }

  /** Routes for validator view appeal. */
  public static get ROUTE_VALIDATOR_APPEAL_PRIVATE_SECTOR(): string {
    return `${AppealRouteConstants.ROUTE_APPEALS_VALIDATOR()}/appeal`;
  }

  /** Routes To view transaction. */
  public static ROUTE_APPEAL_TRANSACTION_VIEW(transactionId: any): string {
    return `home/transactions/view/300410/${transactionId}`;
  }

  /** Routes To view user profile. */
  public static ROUTE_APPEAL_USER_VIEW(nin: any): string {
    return `home/profile/individual/internal/${nin}/overview`;
  }
}
