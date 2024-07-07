import { GosiCalendar, BilingualText } from '@gosi-ui/core';

export class AuthorizerDto {
  ageInHijiri: number;
  dateOfBirth: GosiCalendar;
  fullName: string;
  id: string;
  isValid: boolean;
  nationality: BilingualText;
  sex: BilingualText;
}
