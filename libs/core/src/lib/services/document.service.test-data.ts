import { bindToObject } from '../utils';
import { DocumentResponseItem, DocumentItem } from '../models';

export const documentDataWrapped = {
  fileContent:
    'ZGF0YTphcHBsaWNhdGlvbi9wZGY7YmFzZTY0LEpWQkVSaTB4TGpNTkNpWGk0OC9URFFvTkNqRWdNQ0J2WW1vTkNqdzhEUW92Vkhsd1pTQXZRMkYwWVd4dlp3MEtMMDkxZEd4cGJtVnpJRElnTUNCU0RRb3ZVR0ZuWlhNZ015QXdJRklOQ2o0K0RRcGxibVJ2WW1vTkNnMEtNaUF3SUc5aWFnMEtQRHdOQ2k5VWVYQmxJQzlQZFhSc2FXNWxjdzBLTDBOdmRXNTBJREFOQ2o0K0RRcGxibVJ2WW1vTkNnMEtNeUF3SUc5aWFnMEtQRHdOQ2k5VWVYQmxJQzlRWVdkbGN3MEtMME52ZFc1MElESU5DaTlMYVdSeklGc2dOQ0F3SUZJZ05pQXdJRklnWFNBTkNqNCtEUXBsYm1Sdlltb05DZzBLTkNBd0lHOWlhZzBLUER3TkNpOVVlWEJsSUM5UVlXZGxEUW92VUdGeVpXNTBJRE1nTUNCU0RRb3ZVbVZ6YjNWeVkyVnpJRHc4RFFvdlJtOXVkQ0E4UEEwS0wwWXhJRGtnTUNCU0lBMEtQajROQ2k5UWNtOWpVMlYwSURnZ01DQlNEUW8rUGcwS0wwMWxaR2xoUW05NElGc3dJREFnTmpFeUxqQXdNREFnTnpreUxqQXdNREJkRFFvdlEyOXVkR1Z1ZEhNZ05TQXdJRklOQ2o0K0RRcGxibVJ2WW1vTkNnMEtOU0F3SUc5aWFnMEtQRHdnTDB4bGJtZDBhQ0F4TURjMElENCtEUXB6ZEhKbFlXME5DaklnU2cwS1FsUU5DakFnTUNBd0lISm5EUW92UmpFZ01EQXlOeUJVWmcwS05UY3VNemMxTUNBM01qSXVNamd3TUNCVVpBMEtLQ0JCSUZOcGJYQnNaU0JRUkVZZ1JtbHNaU0FwSUZScURRcEZWQTBLUWxRTkNpOUdNU0F3TURFd0lGUm1EUW8yT1M0eU5UQXdJRFk0T0M0Mk1EZ3dJRlJrRFFvb0lGUm9hWE1nYVhNZ1lTQnpiV0ZzYkNCa1pXMXZibk4wY21GMGFXOXVJQzV3WkdZZ1ptbHNaU0F0SUNrZ1ZHb05Da1ZVRFFwQ1ZBMEtMMFl4SURBd01UQWdWR1lOQ2pZNUxqSTFNREFnTmpZMExqY3dOREFnVkdRTkNpZ2dhblZ6ZENCbWIzSWdkWE5sSUdsdUlIUm9aU0JXYVhKMGRXRnNJRTFsWTJoaGJtbGpjeUIwZFhSdmNtbGhiSE11SUUxdmNtVWdkR1Y0ZEM0Z1FXNWtJRzF2Y21VZ0tTQlVhZzBLUlZRTkNrSlVEUW92UmpFZ01EQXhNQ0JVWmcwS05qa3VNalV3TUNBMk5USXVOelV5TUNCVVpBMEtLQ0IwWlhoMExpQkJibVFnYlc5eVpTQjBaWGgwTGlCQmJtUWdiVzl5WlNCMFpYaDBMaUJCYm1RZ2JXOXlaU0IwWlhoMExpQXBJRlJxRFFwRlZBMEtRbFFOQ2k5R01TQXdNREV3SUZSbURRbzJPUzR5TlRBd0lEWXlPQzQ0TkRnd0lGUmtEUW9vSUVGdVpDQnRiM0psSUhSbGVIUXVJRUZ1WkNCdGIzSmxJSFJsZUhRdUlFRnVaQ0J0YjNKbElIUmxlSFF1SUVGdVpDQnRiM0psSUhSbGVIUXVJRUZ1WkNCdGIzSmxJQ2tnVkdvTkNrVlVEUXBDVkEwS0wwWXhJREF3TVRBZ1ZHWU5Dalk1TGpJMU1EQWdOakUyTGpnNU5qQWdWR1FOQ2lnZ2RHVjRkQzRnUVc1a0lHMXZjbVVnZEdWNGRDNGdRbTl5YVc1bkxDQjZlbnA2ZWk0Z1FXNWtJRzF2Y21VZ2RHVjRkQzRnUVc1a0lHMXZjbVVnZEdWNGRDNGdRVzVrSUNrZ1ZHb05Da1ZVRFFwQ1ZBMEtMMFl4SURBd01UQWdWR1lOQ2pZNUxqSTFNREFnTmpBMExqazBOREFnVkdRTkNpZ2diVzl5WlNCMFpYaDBMaUJCYm1RZ2JXOXlaU0IwWlhoMExpQkJibVFnYlc5eVpTQjBaWGgwTGlCQmJtUWdiVzl5WlNCMFpYaDBMaUJCYm1RZ2JXOXlaU0IwWlhoMExpQXBJRlJxRFFwRlZBMEtRbFFOQ2k5R01TQXdNREV3SUZSbURRbzJPUzR5TlRBd0lEVTVNaTQ1T1RJd0lGUmtEUW9vSUVGdVpDQnRiM0psSUhSbGVIUXVJRUZ1WkNCdGIzSmxJSFJsZUhRdUlDa2dWR29OQ2tWVURRcENWQTBLTDBZeElEQXdNVEFnVkdZTkNqWTVMakkxTURBZ05UWTVMakE0T0RBZ1ZHUU5DaWdnUVc1a0lHMXZjbVVnZEdWNGRDNGdRVzVrSUcxdmNtVWdkR1Y0ZEM0Z1FXNWtJRzF2Y21VZ2RHVjRkQzRnUVc1a0lHMXZjbVVnZEdWNGRDNGdRVzVrSUcxdmNtVWdLU0JVYWcwS1JWUU5Da0pVRFFvdlJqRWdNREF4TUNCVVpnMEtOamt1TWpVd01DQTFOVGN1TVRNMk1DQlVaQTBLS0NCMFpYaDBMaUJCYm1RZ2JXOXlaU0IwWlhoMExpQkJibVFnYlc5eVpTQjBaWGgwTGlCRmRtVnVJRzF2Y21VdUlFTnZiblJwYm5WbFpDQnZiaUJ3WVdkbElESWdMaTR1S1NCVWFnMEtSVlFOQ21WdVpITjBjbVZoYlEwS1pXNWtiMkpxRFFvTkNqWWdNQ0J2WW1vTkNqdzhEUW92Vkhsd1pTQXZVR0ZuWlEwS0wxQmhjbVZ1ZENBeklEQWdVZzBLTDFKbGMyOTFjbU5sY3lBOFBBMEtMMFp2Ym5RZ1BEd05DaTlHTVNBNUlEQWdVaUFOQ2o0K0RRb3ZVSEp2WTFObGRDQTRJREFnVWcwS1BqNE5DaTlOWldScFlVSnZlQ0JiTUNBd0lEWXhNaTR3TURBd0lEYzVNaTR3TURBd1hRMEtMME52Ym5SbGJuUnpJRGNnTUNCU0RRbytQZzBLWlc1a2IySnFEUW9OQ2pjZ01DQnZZbW9OQ2p3OElDOU1aVzVuZEdnZ05qYzJJRDQrRFFwemRISmxZVzBOQ2pJZ1NnMEtRbFFOQ2pBZ01DQXdJSEpuRFFvdlJqRWdNREF5TnlCVVpnMEtOVGN1TXpjMU1DQTNNakl1TWpnd01DQlVaQTBLS0NCVGFXMXdiR1VnVUVSR0lFWnBiR1VnTWlBcElGUnFEUXBGVkEwS1FsUU5DaTlHTVNBd01ERXdJRlJtRFFvMk9TNHlOVEF3SURZNE9DNDJNRGd3SUZSa0RRb29JQzR1TG1OdmJuUnBiblZsWkNCbWNtOXRJSEJoWjJVZ01TNGdXV1YwSUcxdmNtVWdkR1Y0ZEM0Z1FXNWtJRzF2Y21VZ2RHVjRkQzRnUVc1a0lHMXZjbVVnZEdWNGRDNGdLU0JVYWcwS1JWUU5Da0pVRFFvdlJqRWdNREF4TUNCVVpnMEtOamt1TWpVd01DQTJOell1TmpVMk1DQlVaQTBLS0NCQmJtUWdiVzl5WlNCMFpYaDBMaUJCYm1RZ2JXOXlaU0IwWlhoMExpQkJibVFnYlc5eVpTQjBaWGgwTGlCQmJtUWdiVzl5WlNCMFpYaDBMaUJCYm1RZ2JXOXlaU0FwSUZScURRcEZWQTBLUWxRTkNpOUdNU0F3TURFd0lGUm1EUW8yT1M0eU5UQXdJRFkyTkM0M01EUXdJRlJrRFFvb0lIUmxlSFF1SUU5b0xDQm9iM2NnWW05eWFXNW5JSFI1Y0dsdVp5QjBhR2x6SUhOMGRXWm1MaUJDZFhRZ2JtOTBJR0Z6SUdKdmNtbHVaeUJoY3lCM1lYUmphR2x1WnlBcElGUnFEUXBGVkEwS1FsUU5DaTlHTVNBd01ERXdJRlJtRFFvMk9TNHlOVEF3SURZMU1pNDNOVEl3SUZSa0RRb29JSEJoYVc1MElHUnllUzRnUVc1a0lHMXZjbVVnZEdWNGRDNGdRVzVrSUcxdmNtVWdkR1Y0ZEM0Z1FXNWtJRzF2Y21VZ2RHVjRkQzRnUVc1a0lHMXZjbVVnZEdWNGRDNGdLU0JVYWcwS1JWUU5Da0pVRFFvdlJqRWdNREF4TUNCVVpnMEtOamt1TWpVd01DQTJOREF1T0RBd01DQlVaQTBLS0NCQ2IzSnBibWN1SUNCTmIzSmxMQ0JoSUd4cGRIUnNaU0J0YjNKbElIUmxlSFF1SUZSb1pTQmxibVFzSUdGdVpDQnFkWE4wSUdGeklIZGxiR3d1SUNrZ1ZHb05Da1ZVRFFwbGJtUnpkSEpsWVcwTkNtVnVaRzlpYWcwS0RRbzRJREFnYjJKcURRcGJMMUJFUmlBdlZHVjRkRjBOQ21WdVpHOWlhZzBLRFFvNUlEQWdiMkpxRFFvOFBBMEtMMVI1Y0dVZ0wwWnZiblFOQ2k5VGRXSjBlWEJsSUM5VWVYQmxNUTBLTDA1aGJXVWdMMFl4RFFvdlFtRnpaVVp2Ym5RZ0wwaGxiSFpsZEdsallRMEtMMFZ1WTI5a2FXNW5JQzlYYVc1QmJuTnBSVzVqYjJScGJtY05DajQrRFFwbGJtUnZZbW9OQ2cwS01UQWdNQ0J2WW1vTkNqdzhEUW92UTNKbFlYUnZjaUFvVW1GMlpTQmNLR2gwZEhBNkx5OTNkM2N1Ym1WMmNtOXVZUzVqYjIwdmNtRjJaVndwS1EwS0wxQnliMlIxWTJWeUlDaE9aWFp5YjI1aElFUmxjMmxuYm5NcERRb3ZRM0psWVhScGIyNUVZWFJsSUNoRU9qSXdNRFl3TXpBeE1EY3lPREkyS1EwS1BqNE5DbVZ1Wkc5aWFnMEtEUXA0Y21WbURRb3dJREV4RFFvd01EQXdNREF3TURBd0lEWTFOVE0xSUdZTkNqQXdNREF3TURBd01Ua2dNREF3TURBZ2JnMEtNREF3TURBd01EQTVNeUF3TURBd01DQnVEUW93TURBd01EQXdNVFEzSURBd01EQXdJRzROQ2pBd01EQXdNREF5TWpJZ01EQXdNREFnYmcwS01EQXdNREF3TURNNU1DQXdNREF3TUNCdURRb3dNREF3TURBeE5USXlJREF3TURBd0lHNE5DakF3TURBd01ERTJPVEFnTURBd01EQWdiZzBLTURBd01EQXdNalF5TXlBd01EQXdNQ0J1RFFvd01EQXdNREF5TkRVMklEQXdNREF3SUc0TkNqQXdNREF3TURJMU56UWdNREF3TURBZ2JnMEtEUXAwY21GcGJHVnlEUW84UEEwS0wxTnBlbVVnTVRFTkNpOVNiMjkwSURFZ01DQlNEUW92U1c1bWJ5QXhNQ0F3SUZJTkNqNCtEUW9OQ25OMFlYSjBlSEpsWmcwS01qY3hOQTBLSlNWRlQwWU5DZz09',
  fileName: 'sample.pdf',
  fileSize: '2.96 kb',
  selectedDocIndex: 0
};

export const fileUploadTestData = {
  documentName: 'FEAAPPLVD01006806'
};

export const fileContentWrapped = {
  CustomDocMetaData: {
    name: 'xContractNumber',
    value: '123'
  },
  businessKey: '419733482',
  documentTitle: 'Pay Slip Sequence',
  documentName: 'Document',
  documentType: 'Document',
  activedocument: {
    documentContent: 'Document',
    documentType: 'Document',
    name: { arabic: 'تسلسل الأجور', english: 'Pay Slip Sequence' }
  },
  contentId: 'test',
  documentContent: '',
  name: { arabic: 'تسلسل الأجور', english: 'Pay Slip Sequence' },
  contributorSin: 419733482,
  fileContent: 'ZGF0YTppbWFnZS9qcGVnO2Jhc2U2NCwvOWovNEYzUVNrWkpSZ0',
  fileName: 'SPACE.JPG',
  fileSize: '59.65 kb',
  selectedDocIndex: 2,
  transactionId: 'REGISTER CONTRIBUTOR'
};

export const formData = {
  CustomDocMetaData: {
    property: [
      {
        name: 'xContractNumber',
        value: '123'
      }
    ]
  },
  businessKey: 'string',
  documentName: 'string',
  documentTitle: 'string',
  documentType: 'string',
  primaryFile: {
    fileContent: 'string',
    fileName: 'string'
  },
  transactionId: 'REGISTER CONTRIBUTOR'
};

const getDocResp = {
  content: 'string',
  documentName: 'string',
  fileName: 'string',
  id: 'string',
  registrationNumber: 'string',
  contentId: 'string'
};
export const getDocItemResponse = bindToObject(new DocumentResponseItem(), getDocResp);

export const getDocItemWrapper = { file: getDocItemResponse };

export const getCapDocResponse = [
  {
    content: 'string',
    documentName: 'string',
    fileName: 'string',
    id: 'string',
    registrationNumber: '1234',
    contentId: '4321'
  }
];

export const deleteDocResponse = {
  documentName: 'string'
};

export const deleteDocRequest = {
  contributorSin: 1355,
  name: {
    english: 'string'
  }
};
export const docListResp = [
  {
    transactionId: 'string',
    documentContent: 'string',
    documentType: 'string',
    name: {
      arabic: 'string',
      english: 'string'
    },
    required: true,
    reuse: true,
    started: true,
    valid: true,
    contentId: 'string',
    fileName: 'string',
    sequenceNumber: 0,
    uploaded: true,
    isUploading: true,
    size: 'string',
    isContentOpen: true,
    percentageLoaded: 12354,
    icon: 'string',
    businessKey: 4568952,

    uploadFailed: true,
    isScanning: true
  }
];

export const getDocListResponse = docListResp.map(doc => bindToObject(new DocumentItem(), doc));

export const uploadFileRequest = {
  documentContent: 'string',
  documentType: 'string',
  name: { arabic: 'تسلسل الأجور', english: 'Pay Slip Sequence' },
  required: true,
  reuse: true,
  started: true,
  valid: true,
  contentId: 'string',
  fileName: 'string',
  sequenceNumber: 12354,
  uploaded: true,
  isUploading: true,
  size: 'string',
  isContentOpen: true,
  percentageLoaded: 12354,
  icon: 'string',
  businessKey: 'string',
  transactionId: 'string',
  uploadFailed: true,
  isScanning: true
};

export const uploadDocRespone = {
  documentName: 'string '
};

export const documentWithContentId: DocumentItem = new DocumentItem();
documentWithContentId.fileName = 'fileName';
documentWithContentId.documentContent = 'documentContent';
documentWithContentId.started = false;
documentWithContentId.valid = true;
documentWithContentId.uploadFailed = false;
documentWithContentId.contentId = '123';

export const documentContentReponseWithContentId: DocumentResponseItem = {
  fileName: 'fileName',
  content: 'documentContent',
  id: '123',
  contentId: '123',
  registrationNumber: '123',
  documentName: 'documentName',
  sequenceNo: 0,
  sequenceNumber: 0
};

export const documentWithoutContentId: DocumentItem = new DocumentItem();
documentWithoutContentId.fileName = 'fileName';
documentWithoutContentId.documentContent = null;
documentWithoutContentId.started = false;

export const documentContentReponseWithoutContentId: DocumentResponseItem = {
  fileName: 'fileName',
  content: null,
  id: null,
  contentId: '123',
  registrationNumber: '123',
  documentName: 'documentName',
  sequenceNo: 0,
  sequenceNumber: 0
};
