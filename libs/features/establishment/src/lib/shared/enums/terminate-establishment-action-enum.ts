/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export enum TerminateEstActionEnum {
  SUBMIT = 'SUBMIT',
  CANCEL = 'CANCEL',
  /** Validator approve establishment action. */
  VALIDATOR_APPROVE = 'VAPPROVE',
  /** Validator reject establishment action. */
  VALIDATOR_REJECT = 'VREJECT',
  /** Validator return establishment action. */
  VALIDATOR_RETURN = 'VRETURN',
  /** Fc approve establishment action. */
  FC_APPROVE = 'FCAPPROVE',
  /** Fc return establishment action. */
  FC_RETURN = 'FCRETURN',
  /** Validator 2 approve establishment action. */
  VALIDATOR2_APPROVE = 'V2APPROVE',
  /** Validator 2 return establishment action. */
  VALIDATOR2_RETURN = 'V2RETURN',
  /** Fc return 2 establishment action. */
  FC_RETURN2 = 'FCRETURN2',
  /** Validator submit establishment action. */
  VALIDATOR_SUBMIT = 'VSUBMIT',
  /** Validator 1 edit establishment action. */
  VALIDATOR1_EDIT = 'V1EDIT',
  /** Validator2 reject establishment action. */
  VALIDATOR2_REJECT = 'V2REJECT'
}
