import { GosiCalendar, BilingualText } from '@gosi-ui/core';

export class AuthorizerDto {
  ageInHijiri?: number;
  dateOfBirth?: GosiCalendar;
  fullName?: string;
  id?: string;
  isValid?: boolean;
  nationality?: BilingualText;
  sex?: BilingualText;
  certificateExpiryDate?: GosiCalendar;
  source?: BilingualText;
  authorisorId?: number;
  type?: BilingualText;
  status?: string;
  name?: string;
}
