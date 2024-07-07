/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar, Person } from '@gosi-ui/core';
import { EngagementPeriod } from './engagement-period';

export class PendingEngagement {
    contributorDetails: Person;
    establishmentName:BilingualText;
    registrationNo: number = undefined;
    joiningDate:GosiCalendar = new GosiCalendar();
    engagementPeriod:EngagementPeriod;
    autoCancellationDate:GosiCalendar = new GosiCalendar();
    engagementExpiryDate:GosiCalendar= new GosiCalendar();
}
