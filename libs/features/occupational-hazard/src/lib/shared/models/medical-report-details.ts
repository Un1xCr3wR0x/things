import { BilingualText } from "@gosi-ui/core"

export class MedicalReportDetails {
    reqDocs: Docs[];
    hospitals: Hospitals[];
}
export class Docs {
    docName: BilingualText;
    speciality: BilingualText;
}
export class Hospitals {
    name: BilingualText;
    location: BilingualText;
}