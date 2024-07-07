import { DependentDetails } from '@gosi-ui/features/benefits/lib/shared';
import { GosiCalendar } from '@gosi-ui/core';

export class AnnualNotificationCertificate {
  description?: string;
  dependents: DependentDetails[];
  notificationDate: GosiCalendar;
}

// export class AnnualNotificationDetailsDto {
//   description?: string;
//   dependents: DependentDetails[];
//   notificationDate: GosiCalendar
// }
