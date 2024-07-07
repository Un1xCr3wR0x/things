/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import {
  Alert,
  BilingualText,
  GosiCalendar,
  Name,
  NIN,
  Iqama,
  NationalId,
  Passport,
  BorderNumber
} from '@gosi-ui/core';
import { UpdateWageRequest } from './update-wage-request';

/** This class is modal for contributor wage details */
export class ContributorWageDetails extends UpdateWageRequest {
  name: Name = new Name();
  nationality: BilingualText = new BilingualText();
  anyPendingRequest = false;
  identity: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  joiningDate: GosiCalendar = new GosiCalendar();
  proactive = false;
  //Handle error message from update wage api
  message: Alert = new Alert();
  transactionRefNo: number = undefined;
  pendingWorkflowType: string = undefined;
  deathDate: GosiCalendar = new GosiCalendar();
  govtEmp: boolean = undefined;
}
