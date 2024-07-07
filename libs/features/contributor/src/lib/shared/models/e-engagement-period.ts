import { BilingualText, GosiCalendar } from "@gosi-ui/core";
import { WageInfo } from "@gosi-ui/features/contributor";

export class EEngagementPeriod {
    contributorAbroad = false;
    coverage: BilingualText = new BilingualText();
    endDate: GosiCalendar = new GosiCalendar();
    occupation: BilingualText = new BilingualText();
    startDate: GosiCalendar = new GosiCalendar();
    wage: WageInfo = new WageInfo();
    canEdit?: boolean = false;
}
