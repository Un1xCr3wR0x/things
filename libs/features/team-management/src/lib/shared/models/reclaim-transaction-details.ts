
import { BilingualText, GosiCalendar, TransactionParams } from "@gosi-ui/core";

export class ReclaimTransactionDetails {
    customActions: string;
    title: BilingualText;
    transactionRefNo: number;
    lastActionedDate: GosiCalendar = new GosiCalendar();
    status: BilingualText;
    channel: BilingualText;
    assigneeName: string;
    assigneeRole: BilingualText;
    establishmentName: BilingualText;
    params: TransactionParams;
    taskId: string;
  
}