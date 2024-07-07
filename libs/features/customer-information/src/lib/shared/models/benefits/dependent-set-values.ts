/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BorderNumber, Iqama, Name, NationalId, NIN, Passport } from '@gosi-ui/core';

export class DependentSetValues {
  identity: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  name: Name = new Name();
  sin: number;
  personId: number;
  benefitRequestId: number;
  benefitType: string;
  referenceNo: number;
  constructor(
    identity: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [],
    name: Name,
    personId: number,
    sin: number,
    reqId: number,
    type: string,
    referenceNo: number
  ) {
    this.identity = identity;
    this.name = name;
    this.personId = personId;
    this.sin = sin;
    this.benefitRequestId = reqId;
    this.benefitType = type;
    this.referenceNo = referenceNo;
  }
}
