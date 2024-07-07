/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from "@gosi-ui/core";

export class CustomerSurveyResponse {
    elements: SurveyDetailes[];
}

export class SurveyDetailes {
    totalcount: number;
    transactiontraceid: number;
    uuid: string;
    transactionid: number;
    transactionnamearb: string;
    transactionnameeng: string;
    channel: string;
    lastmodifiedtimestamp: string;
    enganswer: string;
    engoption: string;
    arboption: string;
    personidentifier: string;
    CorrespondingChannel?: BilingualText;
}

