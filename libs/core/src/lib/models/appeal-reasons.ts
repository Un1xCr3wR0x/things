import { BilingualText } from "./bilingual-text";

export class AppealReason {
    reasonForAppeal: BilingualText = new BilingualText();
    comments: string;
  }
  
  export class AssessedBy {
    isMbo: boolean;
    isContributor: boolean;
    isHoDoctor: boolean;
    isMbManager: boolean;
  }