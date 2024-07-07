/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
/**
 *
 * This class is to declare complaints module constants.
 *
 * @export
 * @class RouterConstants
 */

export class RouterConstants {
  public static get ROUTE_GENERAL_COMPLAINT() {
    return '/home/complaints/register/general';
  }
  public static get ROUTE_BULK_REASSIGN() {
    return '/home/complaints/register/reassign';
  }
  public static get ROUTE_PUBLIC_COMPLAINT() {
    return '/home/complaints/register';
  }
  public static get ROUTE_CONTACT_US() {
    return '/home/complaints';
  }
  public static get ROUTE_VALIDATOR_ENQUIRY() {
    return '/home/complaints/validator/enquiry';
  }
  public static get ROUTE_VALIDATOR_COMPLAINT() {
    return '/home/complaints/validator/complaint';
  }
  public static get ROUTE_VALIDATOR_APPEAL() {
    return '/home/complaints/validator/appeal';
  }
  public static get ROUTE_VALIDATOR_PRIVATE_SECTOR_APPEAL() {
    return '/home/complaints/validator/general-appeal';
  }
  public static get ROUTE_VALIDATOR_PLEA() {
    return '/home/complaints/validator/plea';
  }
  public static get ROUTE_VALIDATOR_SUGGESTION() {
    return '/home/complaints/validator/suggestion';
  }
  public static get ROUTE_CONTACT_ITSM() {
    return '/home/complaints/itsm';
  }
  public static get ROUTE_ITSM_DETAILS() {
    return '/home/complaints/itsm/itsmDetails'
  }
  public static get ROUTE_COMPLAINTS_TRANSACTIONS() {
    return '/home/complaints/transactions';
  }
}
