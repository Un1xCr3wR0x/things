
/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar } from '@gosi-ui/core';

/**
 * The wrapper class for add contributor engagement period details.
 *
 * @export
 * @class AddContEngagementDetails
 */

export class ReactivateEngagementPayload {
    editFlow: boolean = undefined;
    comments: string = undefined;
    reactivateReason: BilingualText = new BilingualText();
    crmid: number = undefined;
    penaltyIndicator?: boolean = undefined;
}
