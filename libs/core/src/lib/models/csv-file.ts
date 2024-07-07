/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class CsvFile {
  name: string = undefined;
  uploadedOn: Date = undefined;
  size: number = undefined;
  documentType: string = undefined;

  constructor(name: string, uploadedOn: Date, size: number) {
    this.name = name;
    this.uploadedOn = uploadedOn;
    this.size = size;
  }
}
