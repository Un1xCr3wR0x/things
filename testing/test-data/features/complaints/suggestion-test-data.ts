import { BilingualText } from '@gosi-ui/core';
export class SuggestionResponse {
  complaintId: number;
  description: string;
  status: BilingualText = new BilingualText();
  transactionId: number;
  date: Date;
}
export const suggestionListData = {
  items: [
    {
      status: {
        arabic: 'مكتملة',
        english: 'Completed'
      },
      description: 'establishment',
      complaintId: 1111,
      transactionId: 123456,
      date: '2020-02-02T10:48:49.112Z'
    }
  ]
};
