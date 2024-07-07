/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { MbProfile } from './profile';
import { Contracts } from './contract';
import { TerminatedContracts } from './terminated-contract';

export class MemberDetails {
  member: MbProfile;
  modifiedContract: Contracts;
  terminatedContract: TerminatedContracts;
}
