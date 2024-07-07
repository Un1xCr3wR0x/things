/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class BPMReportRequest {
  reportInput: ReportInput = new ReportInput();
}
export class ReportInput {
  reportName: string;
  reportInputParameters: ReportInputParameters = new ReportInputParameters();
}
export class ReportInputParameters {
  reportInputParameter: ReportInputParameter[] = [];
}
export class ReportInputParameter {
  name: string;
  value: string;
}
