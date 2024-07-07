import { GosiCalendar, BilingualText, ContactDetails, TransactionReferenceData, Name } from '@gosi-ui/core';

export const adjustmentOtherPaymentDetails = {
  paymentMethod: { english: '', arabic: '' },
  additionalPaymentDetails: '',
  amountPaid: 1234,
  comments: '',
  paymentReferenceNo: 1234,
  amountTransferred: 1234,
  bankName: { english: '', arabic: '' },
  bankType: { english: '', arabic: '' },
  referenceNo: 1234,
  transactionDate: new GosiCalendar(),
  receiptMode: { english: '', arabic: '' },
  uuid: ''
};
export const contributor = {
  active: false,
  approvalStatus: '',
  engagements: [
    {
      approvalDate: new GosiCalendar(),
      companyWorkerNumber: '',
      contributorAbroad: false,
      engagementPeriod: [
        {
          startDate: new GosiCalendar(),
          endDate: new GosiCalendar(),
          occupation: new BilingualText(),
          wage: {
            basicWage: 1234,
            commission: 1234,
            housingBenefit: 1234,
            otherAllowance: 1234,
            totalWage: 1234,
            contributoryWage: 1234
          },
          minDate: new Date(),
          coverageType: new BilingualText()
        }
      ],
      formSubmissionDate: new GosiCalendar(),
      joiningDate: new GosiCalendar(),
      prisoner: false,
      proactive: false,
      scanDocuments: [
        {
          contentId: '',
          type: new BilingualText(),
          sequenceNumber: 1234
        }
      ],
      student: false,
      transactionReferenceData: [new TransactionReferenceData()],
      workType: new BilingualText(),
      leavingDate: new GosiCalendar(),
      leavingReason: new BilingualText(),
      isContributorActive: false,
      backdatingIndicator: false,
      penaltyIndicator: false
    }
  ],
  mergedSocialInsuranceNo: 1234,
  mergerStatus: '',
  person: {
    personId: 1234,
    birthDate: new GosiCalendar(),
    deathDate: new GosiCalendar(),
    contactDetail: new ContactDetails(),
    education: new BilingualText(),
    maritalStatus: new BilingualText(),
    name: new Name(),
    nationality: new BilingualText(),
    identity: [],
    sex: new BilingualText(),
    specialization: new BilingualText(),
    lifeStatus: '',
    govtEmp: false,
    userPreference: { commPreferences: '' }
  },
  socialInsuranceNo: 1234,
  type: '',
  vicIndicator: false
};
export const heirAdjustment = {
  adjustmentAmount: 10,
  adjustmentPercentage: 10,
  adjustmentReason: {
    arabic: 'مبلغ الشراء',
    english: 'Buy In'
  },
  adjustmentType: {
    arabic: 'مدين',
    english: 'Debit'
  },
  eligible: true,
  gosiAdjustmentErrorMessages: [{ arabic: 'يصرف', english: 'Active' }],
  heirList: [
    {
      adjustmentAmount: 10,
      directPaymentStatus: true,
      heirPersonId: 1234,
      identity: [{ idType: 'NIN', iqamaNo: 1234, borderNo: '', expiryDate: new GosiCalendar() }],
      name: {
        arabic: {
          familyName: '',
          firstName: '',
          secondName: '',
          thirdName: ''
        },
        english: {
          name: ''
        },
        title: { arabic: 'يصرف', english: 'Active' },
        titleCode: 10
      },
      netAdjustmentAmount: 10,
      previousAdjustmentAmount: 10,
      relationship: { arabic: 'يصرف', english: 'Active' }
    }
  ],
  infoMessages: [{ arabic: 'يصرف', english: 'Active' }],
  notes: '',
  referenceNo: 1234
};
