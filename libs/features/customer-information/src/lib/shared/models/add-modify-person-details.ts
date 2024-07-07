/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, Person } from '@gosi-ui/core';

export class AddModifyPersonDetails {
  bilingualMessage: BilingualText;
  referenceNo: number;
}
export class SubmitModifyPersonDetails {
  message: string;
  referenceNo: number;
}
export class AlertDetailsArray {
  value: string;
  idName: BilingualText;
  personId:number;
  person:Person;
  idType:string;
}

