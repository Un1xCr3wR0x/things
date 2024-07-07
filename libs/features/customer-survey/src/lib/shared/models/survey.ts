import { BilingualText, GosiCalendar } from '@gosi-ui/core';

/** The wrapper class for engagement details. */
export class Smile {
  name: string;
  image: string;
  id: any;
  rating: any;
  newUrl: any;
}
export class SurveyDetails {
  subChannelQuestions: SubChannels[];
  traceId: number;
  transactionId: number;
  transactionName: BilingualText = new BilingualText();
  transactionDate: any;
  channel: BilingualText = new BilingualText();
  personIdentifier: number;
}

export class SubChannels {
  ratingBasedQuestions: RatingBasedQuestions[];
  subChannel = new BilingualText();
  id: any;
}
export class RatingBasedQuestions {
  questions: Questions[];
  rating: string;
}
export class Questions {
  questionId: any;
  required: any;
  options: Options[];
  question: BilingualText = new BilingualText();
}

export class Options {
  optionId: string;
  option: BilingualText = new BilingualText();
}

export class fieldList {
  label: any;
  control: any;
}

export class SelectedOptions {
  options: any;
  optionId: any;
}
export class SurveyRequest {
  questionId: any;
  bilingualAnswers: any[];
}
