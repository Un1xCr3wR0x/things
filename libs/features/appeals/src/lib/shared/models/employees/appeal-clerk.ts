
import { BilingualText, DocumentItem, WorkFlowActions } from '@gosi-ui/core';

export class AppealClerk {
    finalDecision: BilingualText;
    finalDecisionDate: Date;
    finalDecisionComments: string;
    transactionNumber: number;
    appealTransactionNumber: number;
    appealDocumentList: DocumentItem[] = [];
    fileResultOfObjection : string[];
    fileMinutesOfMeeting : string[];
    outcome?: WorkFlowActions;
}