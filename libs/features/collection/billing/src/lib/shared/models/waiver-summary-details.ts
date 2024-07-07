/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar } from "@gosi-ui/core";

export class WaiverSummaryDetails {
    penaltyWaiverHistoryDetails: WaiverDetails[];
}

export class WaiverDetails {
    violationsWaiverAmount: number = undefined;
    waiverPeriodPenaltyAmount: number = undefined;
    waiveOffType: BilingualText =  new BilingualText();
    waivedPenaltyPercentage: number = undefined;
    waiverEndMonth: BilingualText =  new BilingualText();
    waiverStartMonth: BilingualText =  new BilingualText();
    waiverStatus: BilingualText =  new BilingualText();
    waiverViolationsPercentage: number = undefined;
    txnDate: GosiCalendar = new GosiCalendar();


}