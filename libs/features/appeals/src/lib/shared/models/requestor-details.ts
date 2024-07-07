import { BilingualText, Iqama, NIN } from "@gosi-ui/core";

export class RequestorDetails {
    name: BilingualText = new BilingualText();
    id: NIN | Iqama;
    emailId: string;
  }