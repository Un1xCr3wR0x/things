/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class ContributorRouteConstants {
  /** Route for add contributor search. */
  public static get ROUTER_CONTRIBUTOR_SEARCH(): string {
    return '/home/contributor/search';
  }

  /** Routes for contributor profile. */
  public static get ROUTE_CONTRIBUTOR_PROFILE_SEARCH(): string {
    return '/home/profile/contributor/search';
  }
  public static ROUTE_NORMAL_PROFILE(regNo: number, sin: number): string {
    return `/home/profile/contributor/${regNo}/${sin}/engagement/individual`;
  }
  public static ROUTE_UNIFIED_PROFILE(sin: number): string {
    return `/home/profile/contributor/${sin}/engagement/unified`;
  }
  public static ROUTE_CONTRIBUTOR_PROFILE(regNo: number, sin: number, flag: boolean): string {
    return flag ? this.ROUTE_UNIFIED_PROFILE(sin) : this.ROUTE_NORMAL_PROFILE(regNo, sin);
  }

  /** Routes for transactions. */
  public static get ROUTE_ADD_CONTRACT(): string {
    return '/home/contributor/contract/add-contract';
  }
  public static get ROUTE_ADD_CONTRIBUTOR(): string {
    return '/home/contributor/add';
  }
  public static get ROUTE_ADD_SECONDED(): string {
    return 'home/contributor/seconded/add';
  }
  public static get ROUTE_CONTRIBUTOR_REGISTER_PROACTIVE(): string {
    return '/home/contributor/add/proactive';
  }
  public static get ROUTE_UPDATE_INDIVIDUAL_WAGE(): string {
    return '/home/contributor/wage/individual/update';
  }
  public static get ROUTE_UPDATE_INDIVIDUAL_WAGE_EDIT(): string {
    return '/home/contributor/wage/individual/update/edit';
  }
  public static get ROUTE_CHANGE_ENGAGEMENT(): string {
    return '/home/contributor/engagement/change';
  }
  public static get ROUTE_TERMINATE_CONTRIBUTOR(): string {
    return '/home/contributor/terminate';
  }
  public static get ROUTE_CANCEL_ENGAGEMENT(): string {
    return '/home/contributor/cancel';
  }
  public static get ROUTE_TRANSFER_INDIVIDUAL_ENGAGEMENT(): string {
    return '/home/contributor/transfer/individual';
  }
  public static get ROUTE_CUSTOM_LIST(): string {
    return '/home/contributor/wage/bulk/custom-list';
  }
  public static get ROUTE_MANAGE_WAGE_TABS(): string {
    return '/home/contributor/wage/update';
  }
  public static get ROUTE_BULK_WAGE_UPDATE(): string {
    return '/home/contributor/wage/update/bulk';
  }
  public static get ROUTE_COMPLIANCE(): string {
    return '/home/contributor/compliance/e-inspection';
  }
  public static get ROUTE_VIC_TERMINATE(): string {
    return '/home/contributor/terminate-vic';
  }
  public static get ROUTE_VIC_REACTIVATE(): string {
    return '/home/contributor/reactivate-vic';
  }
  public static get ROUTE_VIC_WAGE_UPDATE(): string {
    return '/home/contributor/wage/update/vic-wage';
  }
  public static get ROUTE_VIC_CANCEL(): string {
    return '/home/contributor/cancel-vic';
  }
  public static get ROUTE_VIEW_CONTRACT(): string {
    return '/home/contributor/contract/view';
  }
  public static get ROUTE_CANCEL_CONTRACT(): string {
    return '/home/contributor/contract/cancel-contract';
  }
  public static get ROUTE_CONTRACT_DETAILS(): string {
    return '/home/contributor/contract/preview';
  }
  public static get ROUTE_CONTRACT_DOCUMENT(): string {
    return '/home/contributor/contract/contract-document';
  }
  public static get ROUTE_ADD_AUTHORIZATION(): string {
    return '/home/contributor/add-authorization';
  }

  /** Routes for validator view. */
  public static get ROUTE_VALIDATOR_CONTRIBUTOR(): string {
    return '/home/contributor/validator/add-contributor';
  }
  public static get ROUTE_VALIDATOR_MANAGE_WAGE(): string {
    return '/home/contributor/validator/update-wage';
  }
  public static get ROUTE_CHANGE_ENGAGEMENT_VALIDATOR(): string {
    return '/home/contributor/validator/change-engagement';
  }
  public static get ROUTE_CHANGE_ENGAGEMENT_IND_VALIDATOR(): string {
    return '/home/contributor/validator/change-engagement/request';
  }
  public static get ROUTE_ADD_CONTRACT_VALIDATOR(): string {
    return '/home/contributor/validator/add-contract';
  }
  public static get ROUTE_CANCEL_CONTRACT_VALIDATOR(): string {
    return '/home/contributor/validator/cancel-contract';
  }
  public static get ROUTE_MANAGE_E_REGISTER_VALIDATOR(): string {
    return '/home/contributor/validator/modify-e-register';
  }
  public static get ROUTE_VALIDATOR_REACTIVATE(): string {
    return '/home/contributor/validator/Reactivate-engagement';
  }
  public static get ROUTE_VALIDATOR_ENTERRPA(): string {
    return '/home/contributor/validator/enter-rpa';
  }
  public static get ROUTE_MANAGE_COMPLIANCE_VALIDATOR(): string {
    return '/home/contributor/validator/violate-engagement';
  }
  public static get ROUTE_CANCEL_ENGAGMENT_INSPECTION(): string {
    return '/home/contributor/validator/cancel-contract';
  }
  public static get ROUTE_TERMINATE_CONTRIBUTOR_VALIDATOR(): string {
    return '/home/contributor/validator/terminate-contributor';
  }
  public static get ROUTE_TERMINATE_CONTRIBUTOR_IND_VALIDATOR(): string {
    return '/home/contributor/validator/terminate-contributor/request';
  }
  public static get ROUTE_REGISTER_SECONDMENT_VALIDATOR(): string {
    return '/home/contributor/validator/register-secondment';
  }
  public static get ROUTE_REGISTER_STUDYLEAVE_VALIDATOR(): string {
    return '/home/contributor/validator/register-studyleave';
  }
  public static get ROUTE_CANCEL_ENGAGEMENT_VALIDATOR(): string {
    return '/home/contributor/validator/cancel-engagement';
  }
  public static get ROUTE_CANCEL_ENGAGEMENT_IND_VALIDATOR(): string {
    return '/home/contributor/validator/cancel-engagement/request';
  }

  public static get ROUTE_ADD_SECONDED_VALIDATOR(): string {
    return '/home/contributor/validator/add-seconded';
  }
  public static get ROUTE_TRANSFER_CONTRIBUTOR_VALIDATOR(): string {
    return '/home/contributor/validator/transfer-contributor';
  }
  public static get ROUTE_TRANSFER_ALL_CONTRIBUTOR_VALIDATOR(): string {
    return '/home/contributor/validator/transfer-all-contributor';
  }
  public static get ROUTE_BULK_WAGE_UPDATE_VALIDATOR(): string {
    return '/home/contributor/validator/bulk-wage';
  }
  public static get ROUTE_ADD_VIC_VALIDATOR(): string {
    return '/home/contributor/validator/add-vic';
  }
  public static get ROUTE_TERMINATE_VIC_VALIDATOR(): string {
    return '/home/contributor/validator/terminate-vic';
  }
  public static get ROUTE_VIC_INDIVIDUAL_WAGE_VALIDATOR(): string {
    return '/home/contributor/validator/vic-wage-update';
  }
  public static get ROUTE_CANCEL_VIC_VALIDATOR(): string {
    return '/home/contributor/validator/cancel-vic';
  }
  public static get ROUTE_ADD_AUTHORIZATION_VALIDATOR(): string {
    return '/home/contributor/validator/add-authorization';
  }
  public static get ROUTE_MODIFY_COVERAGE_VALIDATOR(): string {
    return '/home/contributor/validator/modify-coverage';
  }
  public static get ROUTE_REACTIVATE_VALIDATOR(): string {
    return '/home/contributor/validator/Reactivate-engagement';
  }
  public static get ROUTE_REACTIVATE_VIC_VALIDATOR(): string {
    return '/home/contributor/validator/Reactivate-VIC-engagement';
  }

  /** Routes for validator edit / establishment admin re-edit. */
  public static get ROUTE_ADD_CONTRIBUTOR_EDIT(): string {
    return '/home/contributor/add/edit';
  }
  public static get ROUTE_CHANGE_ENGAGEMENT_EDIT(): string {
    return '/home/contributor/engagement/change/edit';
  }
  public static get ROUTE_CHANGE_ENGAGEMENT_REQUEST(): string {
    return '/home/contributor/engagement/change/request';
  }
  public static get ROUTE_TERMINATE_CONTRIBUTOR_EDIT(): string {
    return '/home/contributor/terminate/edit';
  }
  public static get ROUTE_TERMINATE_CONTRIBUTOR_REQUEST(): string {
    return '/home/contributor/terminate/request';
  }
  public static get ROUTE_CANCEL_ENGAGEMENT_EDIT(): string {
    return '/home/contributor/cancel/edit';
  }
  public static get ROUTE_CANCEL_ENGAGEMENT_REQUEST(): string {
    return '/home/contributor/cancel/request';
  }
  public static get ROUTE_REACTIVATE_ENGAGEMENT(): string {
    return '/home/contributor/reActivate';
  }
  public static get ROUTE_REACTIVATE_ENGAGEMENT_EDIT(): string {
    return '/home/contributor/reActivate/edit';
  }
  public static get ROUTE_REACTIVATE_VIC_ENGAGEMENT_EDIT(): string {
    return '/home/contributor/reactivate-vic/edit';
  }
  public static get ROUTE_ADD_SECONDED_EDIT(): string {
    return '/home/contributor/seconded/add/edit';
  }
  public static get ROUTE_TRANSFER_CONTRIBUTOR_EDIT(): string {
    return '/home/contributor/transfer/individual/edit';
  }
  public static get ROUTE_TRANSFER_ALL_CONTRIBUTOR_EDIT(): string {
    return '/home/contributor/transfer/all/edit';
  }
  public static get ROUTE_BULK_WAGE_UPDATE_EDIT(): string {
    return '/home/contributor/wage/update/bulk/edit';
  }
  public static get ROUTE_ADD_VIC_EDIT(): string {
    return '/home/contributor/add-vic/edit';
  }
  public static get ROUTE_VIC_INDIVIDUAL_WAGE_EDIT(): string {
    return '/home/contributor/wage/update/vic-wage/edit';
  }
  public static get ROUTE_TERMINATE_VIC_EDIT(): string {
    return '/home/contributor/terminate-vic/edit';
  }
  public static get ROUTE_CANCEL_VIC_EDIT(): string {
    return '/home/contributor/cancel-vic/edit';
  }
  public static get ROUTE_ADD_CONTRACT_EDIT(): string {
    return '/home/contributor/contract/add-contract/edit';
  }
  public static get ROUTE_ADD_AUTHORIZATION_EDIT(): string {
    return '/home/contributor/add-authorization/edit';
  }

  /** Contract Stand Alone App routes. */
  public static get ROUTE_CONTRACT_APP_LOGIN(): string {
    return '/home/authenticate/contract/login';
  }
  public static get ROUTE_VALIDATE_CONTRACT(): string {
    return '/home/authenticate/contract/validate';
  }
  public static get ROUTE_INVALID_CONTRACT(): string {
    return '/home/authenticate/contract/invalid';
  }
  public static get ROUTE_INDIVIDUAL_CONTRACT(): string {
    return '/home/contributor/contract/individual-contract';
  }
  public static get MODIFY_ENG(): string {
    return '/home/contributor/individual/engagement-date';
  }
  public static get ROUTE_INDIVIDUAL_CONTRACT_VIEW(): string {
    return '/home/contributor/contract/individual-contract-view';
  }
  public static get ROUTE_INDIVIDUAL_CONTRACT_AUTH(): string {
    return '/home/contributor/contract/individual-contract-auth';
  }

  // routing for registration via e-insception
  public static get ROUTE_E_REGISTER(): string {
    return '/home/contributor/add-Engagement/registered';
  }
  // routing for registration via e-insception validator  editing
  public static get ROUTE_E_REGISTER_EDIT(): string {
    return '/home/contributor/add-Engagement/registered/edit';
  }
  // Routing for RPA
  public static get ROUTE_ENTER_RPA(): string {
    return '/home/contributor/enter-rpa';
  }
  // Routing for Cancel RPA Validator
  public static get ROUTE_CANCELRPA_VALIDATOR(): string {
    return '/home/contributor/validator/cancel-rpa';
  }
}
