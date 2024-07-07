import { GosiCalendar, Name } from "@gosi-ui/core";

export class TransferableEngagements{
    name: Name = new Name();
    engagementId: number = undefined;
    joiningDate: GosiCalendar = new GosiCalendar();
    personIdentifier: number = undefined;
}