import { BilingualText } from '@gosi-ui/core';

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