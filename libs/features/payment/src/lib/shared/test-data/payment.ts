export const paymentDetail = {
  bankAccountList: [
    {
      bankAccountId: 0,
      bankCode: 0,
      bankName: {
        arabic: 'string',
        english: 'string'
      },
      ibanBankAccountNo: 'string',
      isNonSaudiIBAN: true,
      isSamaVerified: true
    }
  ],
  benefitList: [
    {
      adjustedAmount: 0,
      adjustmentList: [
        {
          adjustmentAmount: 0,
          adjustmentReason: {
            arabic: 'string',
            english: 'string'
          },
          adjustmentType: {
            arabic: 'string',
            english: 'string'
          },
          paymentType: {
            arabic: 'string',
            english: 'string'
          },
          percentage: 0,
          startDate: {
            gregorian: new Date("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
            hijiri: 'yyyy-MM-dd',
            entryFormat: 'GREGORIAN'
          }
        }
      ],
      benefitType: {
        arabic: 'string',
        english: 'string'
      },
      startDate: {
        gregorian: new Date("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        hijiri: 'yyyy-MM-dd'
      },
      status: {
        arabic: 'string',
        english: 'string'
      },
      stopDate: {
        gregorian: new Date("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        hijiri: 'yyyy-MM-dd'
      }
    }
  ],
  netAmount: 0,
  person: {
    age: 0,
    birthDate: {
      gregorian: new Date("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
      hijiri: 'yyyy-MM-dd'
    },
    identity: [
      {
        idType: 'NIN',
        newNin: 1234
      }
    ],
    name: {
      arabic: 'string',
      english: 'string'
    },
    nameBilingual: {
      arabic: 'string',
      english: 'string'
    }
  }
};
