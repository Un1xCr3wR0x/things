import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class PendingTransactionsSimis {
  transaction_number: string = undefined;
  transaction_entry_date: GosiCalendar = new GosiCalendar();
  transaction_completion_date: GosiCalendar = new GosiCalendar();
  LONGNAME_EN: BilingualText = new BilingualText();
  LONGNAME_AR: BilingualText = new BilingualText();
  transaction_description: BilingualText = new BilingualText();
  STATUS_EN: BilingualText = new BilingualText();
  STATUS_AR: BilingualText = new BilingualText();
  assiged_role: BilingualText = new BilingualText();
  assigned_user: BilingualText = new BilingualText();
  SYSTEM_EN: BilingualText = new BilingualText();
  SYSTEM_AR: BilingualText = new BilingualText();
}
