/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export enum AccountStatusEnum {
  NONE = 'NONE',
  ACCOUNT_ACTIVE = 'ACCOUNT_ACTIVE',
  ACCOUNT_CLOSED = 'ACCOUNT_CLOSED',
  ACCOUNT_FROZEN = 'ACCOUNT_FROZEN',
  ACCOUNT_ABANDONED = 'ACCOUNT_ABANDONED',
  ACCOUNT_INCORRECT = 'ACCOUNT_INCORRECT',
  ACCOUNT_UNCLAIMED = 'ACCOUNT_UNCLAIMED',
  ACCOUNT_DORMANT = 'ACCOUNT_DORMANT'
}

export enum MatchStatusEnum {
  NONE = 'NONE',
  MATCHED = 'MATCHED',
  UNMATCHED = 'UNMATCHED'
}

export enum CreditStatusEnum {
  NONE = 'NONE',
  IBAN_IS_CREDITABLE = 'IBAN_IS_CREDITABLE',
  IBAN_IS_NOT_CREDITABLE = 'IBAN_IS_NOT_CREDITABLE'
}

export enum ResponseStatusEnum {
  SUCCESS = 'SUCCESS',
  REQUEST_UNDER_PROCESSING = 'REQUEST_UNDER_PROCESSING'
}
