/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {  BilingualText, GosiCalendar } from '@gosi-ui/core';
export class ContractDoctor {
    contractId: number;
    contractType: BilingualText;
    endDate: GosiCalendar;
    fees: number;
    feesPerVisit: BilingualText;
    medicalBoardType:BilingualText;
    status: BilingualText;
    startDate: GosiCalendar;
}
