import { BilingualText, GosiCalendar } from "@gosi-ui/core";

export class PersonDetailsDTO {
    nationality: BilingualText;
    identifier: any;
    nameEng: string;
    nameArb: string;
    gender: BilingualText;
    dob: GosiCalendar = new GosiCalendar();
}