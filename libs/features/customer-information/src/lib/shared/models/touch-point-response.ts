/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class TouchpointResponse {
    elements: ContactEvents[];
}

export class ContactEvents {
   channel_name_ar: string;
   channel_name_en: string;
   transaction_system_ar: string;
   transaction_system_en: string;
   date: string; 
   time: string;
   nin: string;
   reason: string;
}
