/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export enum EstablishmentActionEnum {
  REG_NEW_EST = 'ESTABLISHMENT.REG-NEW-EST',
  CHG_MAIN_EST = 'ESTABLISHMENT.CHANGE-MAIN-ESTABLISHMENT',
  DELINK_NEW_GRP = 'ESTABLISHMENT.DELINK-NEW-GROUP',
  DELINK_OTHER = 'ESTABLISHMENT.DELINK-OTHER-GROUP',
  CLOSE_GROUP = 'ESTABLISHMENT.CLOSE-ESTABLISHMENT-GROUP',
  SET_MAIN = 'ESTABLISHMENT.SET-AS-MAIN',
  DELINK_NEW_EST = 'ESTABLISHMENT.DELINK-NEW-EST',
  CLOSE_EST = 'ESTABLISHMENT.CLOSE-ESTABLISHMENT',
  REOPEN_EST = 'ESTABLISHMENT.REOPEN-ESTABLISHMENT',
  SAFETY_CHECK = 'ESTABLISHMENT.INITIATE-OCCUPATIONAL-SAFETY-CHECK'
}