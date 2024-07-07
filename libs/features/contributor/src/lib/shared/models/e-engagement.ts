import { BilingualText, GosiCalendar } from "@gosi-ui/core";
import { EEngagementDetails } from "./e-engagement-details";

export class EEngagement{
    actualEstablishment?: BilingualText = new BilingualText();
    commercialRegistrationNumber?:number = undefined;
    engagementRequestDto?: EEngagementDetails = new EEngagementDetails();
    // For individual app
    establishmentName?: string = undefined;
    gosiRegistrationNumber?: number = undefined;
    hrsdEstablishmentId?: number = undefined;
    nin?:number;
    ownerId?:number;
    unifiedNationalNumber?:number;
    formSubmissionDate?: GosiCalendar = new GosiCalendar();
    editFlow?:boolean = false;
    // EstablishmentUnifiedNumber?: number = undefined;
    // EstablishmentOwnerID?: number = undefined;
}