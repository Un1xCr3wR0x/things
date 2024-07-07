/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export enum PaymentRoutesEnum {
  ADJUSTMENT_HOME = '/home/adjustment',
  ADJUSTMENT_DETAIL = '/home/adjustment/adjustment-details',
  PAY_ADJUSTMENT = '/home/adjustment/pay-adjustment',
  ADD_THIRDPARTY = '/home/adjustment/create-adjustment',
  BENEFITS_ENGAGEMENT_CHANGE = '/home/benefits/validator/benefit-recalculate',
  BENEFITS_REJOINING = '/home/benefits/validator/recalculate-rejoin',
  BENEFITS_VALIDATOR_SANED = '/home/benefits/validator/saned-benefit',
  HEIR_ROUTE = '/home/benefits/validator/heir-recalculation',
  VALIDATOR_EDIT_TPA = '/home/adjustment/create-adjustment/edit',
  VALIDATOR_VIEW_ADD_TPA = 'home/adjustment/validator/tpaView',
  VALIDATOR_VIEW_MANAGE_TPA = 'home/adjustment/validator/maintainTpaView',
  THIRD_PARTY_ADJUSTMENT_DETAIL = '/home/adjustment/thirdPartyAdjustmentView',
  MAINTAIN_THIRDPARTY = '/home/adjustment/manage-adjustment',
  VALIDATOR_EDIT_MAINTAIN_TPA = '/home/adjustment/manage-adjustment/edit',
  ADD_DOCUMENTS_SCREEN = '/home/adjustment/addDocuments',
  VIEW_BENEFIT_PAGE = '/home/benefits/annuity/pensionAcitve',
  PAY_ONLINE = 'home/payment/payonline',
  VALIDATOR_DISABILITY_ASSESSMENT = '/home/benefits/validator/disability-assessment',
  ROUTE_MODIFY_RETIREMENT = 'home/benefits/annuity/pensionAcitve',
  ROUTE_ACTIVE_HEIR_DETAILS = 'home/benefits/annuity/heir-details-active',
  ROUTE_ACTIVE_HEIR_BENEFIT = 'home/benefits/annuity/heir-benefit-active',
  VALIDATOR_IMPRISONMENT_MODIFY = 'home/benefits/validator/approve-imprisonment-modify',
  VALIDATOR_RESTART_CONTRIBUTOR = 'home/benefits/validator/approve-restart-benefit',
  VALIDATOR_STOP_CONTRIBUTOR = 'home/benefits/validator/approve-stop-benefit',
  VALIDATOR_MODIFY_PAYEE = 'home/benefits/validator/modify-benefit-payment'
}
