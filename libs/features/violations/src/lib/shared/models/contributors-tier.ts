import { BilingualText, GosiCalendar } from "@gosi-ui/core";
import { ViolationList } from "./violation-list";

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class ContributorsTier{
    contributorId:number;
    violationAmount:number;
    penaltyCalculationEquation?:BilingualText;
    repetitionTierType:number;
    repetitionTierTypeBilingual:BilingualText;
    violationStartDate?:GosiCalendar;
    violationsList?:ViolationList[];
}