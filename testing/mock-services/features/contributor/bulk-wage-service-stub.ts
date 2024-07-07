import { of } from 'rxjs';

export class BulkWageServiceStub {
  getBulkWageWorkflowDetails() {
    return of(bulkWageResponse);
  }
  downloadActiveContributorsCSV() {
    return of('string');
  }
  processBulkWageUpdate() {
    return of(true);
  }
  getUploadedFileHistory() {
    return of(bulkUpdateNoProcessing);
  }
  getReport() {
    return of('string');
  }
}

export const bulkWageResponse = {
  fileName: 'wage.csv',
  fileSize: '1',
  formSubmissionDate: new Date(),
  noOfRecords: '1'
};

export const bulkUpdateNoProcessing = {
  bulkWageRequests: null,
  bulkWageRequestCount: 0
};

export const bulkUpdateProcessing = {
  bulkWageRequests: [
    {
      requestId: 400,
      fileName: 'Wage update form.csv',
      fileSize: 123,
      countOfFailed: 0,
      countOfSuccessful: 0,
      status: 'Initiated',
      uploadDate: {
        gregorian: new Date('2020-11-04T15:34:38.000Z'),
        hijiri: '1442-03-18'
      },
      transactionTraceId: null
    }
  ],
  bulkWageRequestCount: 1
};

export const bulkUpdateHistory = {
  bulkWageRequests: [
    {
      requestId: 400,
      fileName: 'Wage update form.csv',
      fileSize: 123,
      countOfFailed: 0,
      countOfSuccessful: 0,
      status: 'Completed without errors',
      uploadDate: {
        gregorian: new Date('2020-11-04T15:34:38.000Z'),
        hijiri: '1442-03-18'
      },
      transactionTraceId: null
    },
    {
      requestId: 276,
      fileName: 'Wage update form.csv',
      fileSize: 138,
      countOfFailed: 0,
      countOfSuccessful: 0,
      status: 'Completed without errors',
      uploadDate: {
        gregorian: new Date('2020-11-03T12:19:00.000Z'),
        hijiri: '1442-03-17'
      },
      transactionTraceId: null
    }
  ],
  bulkWageRequestCount: 2
};

export const sampleFile = {
  text: () => undefined,
  lastModified: null,
  name: 'sample.csv',
  size: 1000,
  type: 'application/csv',
  arrayBuffer: null,
  stream: null,
  slice() {
    return null;
  }
};
