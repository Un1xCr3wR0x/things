/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export enum EstablishmentErrorKeyEnum {
  VERIFY_OWNER = 'ESTABLISHMENT.ERROR.OWNER-NOT-VERIFIED', // Verify the person for owner before proceeding,
  VERIFY_ADMIN = 'ESTABLISHMENT.ERROR.ADMIN-NOT-VERIFIED', // Verify the person for admin  before proceeding,
  MAIN_IS_GCC = 'ESTABLISHMENT.ERROR.MAIN-IS-GCC',
  NOT_MAIN = 'ESTABLISHMENT.ERROR.ERR_MAIN_IS_BRANCH_ESTABLISHMENT',
  MAIN_NOT_ACTIVE = 'ESTABLISHMENT.ERROR.ERR_NOT_ACTIVE_ESTABLISHMENT',
  NO_LICENSE = 'ESTABLISHMENT.ERROR.MAIN_EST_LICENSE_DATE_NA',
  LEGAL_ENTITY_DIFF = 'ESTABLISHMENT.ERROR.LEGAL-ENTITY-NOT-MATCH', //Error during registration of branch
  LEGAL_ENTITY_MISMATCH = 'ESTABLISHMENT.WARNING.LEGAL-ENTITY-MISMATCH', //Error during modification of branch details
  EST_REG_PENDING = 'ESTABLISHMENT.WARNING.EST-REG-PENDING', //Warning during accessing proactive pending est profile
  NO_SUCH_MAIN = 'ESTABLISHMENT.ERROR.NO-MAIN',
  NO_CHANGES = 'ESTABLISHMENT.ERROR.NO-MODIFICATION-FOUND',
  DUPLICATE_LICENSE = 'ESTABLISHMENT.ERROR.ERR_LICENSE_NUMBER_EXIST',
  DUPLICATE_DEPARTMENT_ID = 'ESTABLISHMENT.ERROR.ERR_DEPARTMENT_ID_EXIST',
  DUPLICATE_GCC_EST = 'ESTABLISHMENT.ERROR.ERR_ACTIVE_GCC_ESTABLISHMENT',
  NO_CHANGES_MCI = 'ESTABLISHMENT.ERROR.NO-MODIFICATION-FOUND-MCI',
  PPA_MAIN_EST_ERROR = 'ESTABLISHMENT.ERROR.PPA-AS-MAIN-EST-ERROR', //Story 584152
  MULTIPLE_REOPEN = 'ESTABLISHMENT.WARNING.MULTIPLE-REOPEN'
}
