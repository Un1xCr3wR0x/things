/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export enum FlagTypeEnum {
  STOP_HSRD_SERVICES = 'Stop HRSD Services',
  ALLOW_HSRD_SERVICES = 'Allow HRSD Services',
  STOP_GOSI_CERTIFICATE = 'Stop GOSI certificate',
  ALLOW_GOSI_CERTIFICATE = 'Allow GOSI Certificate',
  BLOCK_SERVICE = 'Block Service'
}

export enum BlockFlagReasonEnum{
  STOP_REGISTER_CONTRIBUTOR = 'Register contributor service'
}
