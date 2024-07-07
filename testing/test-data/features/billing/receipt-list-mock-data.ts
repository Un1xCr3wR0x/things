export const receiptListMockData = {
  noOfRecords: 10,
  receiptDetailDto: [
    {
      parentReceiptNo: '25791532',
      receiptDate: {
        gregorian: new Date('2020-03-17T13:00:22.000Z'),
        hijiri: '1441-07-22'
      },
      amountReceived: 21203.45,
      referenceNo: 213213,
      receiptStatus: {
        arabic: 'جديد',
        english: 'New'
      },
      receiptMode: {
        arabic: 'شيك شخصي',
        english: 'Personnel Cheque'
      },
      chequeNumber: 25611,
      approvalStatus: 12
    },
    {
      parentReceiptNo: '25791470',
      receiptDate: {
        gregorian: new Date('2020-03-05T09:57:35.000Z'),
        hijiri: '1441-07-10'
      },
      amountReceived: 14759.2,
      referenceNo: 1235652,
      receiptStatus: {
        arabic: 'جديد',
        english: 'New'
      },
      receiptMode: {
        arabic: 'شيك شخصي',
        english: 'Personnel Cheque'
      },
      chequeNumber: 25611,
      approvalStatus: 12
    }
  ],
  total: 12586
};
