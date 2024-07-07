import { BilingualText } from "@gosi-ui/core";

export class VisitingDoctorSelected {
    name: BilingualText = new BilingualText();
    doctorId: number = undefined;
    mobileNumber: string;
    identityNumber: number = undefined;
    idType?: string = undefined;
    location: BilingualText;
    specialty?: BilingualText;
    assessmentType: BilingualText = new BilingualText();
}