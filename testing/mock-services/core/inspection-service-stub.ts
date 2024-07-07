import { of } from 'rxjs';

export class InspectionServiceStub {
  getInspectionByTransactionId() {
    return of([inspectionDetails]);
  }

  getInspectionList() {
    return of([inspectionDetails]);
  }
}

export const inspectionDetails = {
  inspectionTypeInfo: {
    type: 'EA',
    status: 'Inspection Completed',
    reason: 'NA',
    registrationNumber: '506835437',
    socialInsuranceNumber: '376060721',
    injuryID: null
  },
  inspectionDecision: [
    {
      name: 'decision',
      value: 'CANCEL',
      comments: null
    },
    {
      name: 'InspectionDate',
      value: '2020-08-19',
      comments: 'APPROVE'
    }
  ],
  inspectionRefNo: 'GOSI/EA/2020/41597',
  reInspectionDate: null,
  previousVisitDate: null,
  inspectionRequestdate: {
    gregorian: new Date('2021-05-05T10:25:20.000Z')
  },
  inspectionStatus: 1111,
  origin: 1,
  correlationId: 'rasedEA202192185211',
  fieldActivityNumber: 'FAN-EA-2021-49322'
};
