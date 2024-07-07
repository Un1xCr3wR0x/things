import { BilingualText } from './bilingual-text';
import { GosiCalendar } from './gosi-calendar';

export class NotificationResponse {
  assigneeId: string;
  message: BilingualText;
  notificationId: string;
  readFlag: number;
  title: BilingualText;
  date: GosiCalendar = new GosiCalendar();
}
