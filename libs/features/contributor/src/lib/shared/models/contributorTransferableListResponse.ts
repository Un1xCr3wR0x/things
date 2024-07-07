/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from "@gosi-ui/core";
import { TransferableEngagements } from "./transferableEngagements";


export class ContributorTransferableListResponse{
    referenceNo: number = undefined;
    transferFromEstName: BilingualText = new BilingualText();
    totalContributorCount: number = undefined;
    transferableEngagements: TransferableEngagements[] = [];

}



