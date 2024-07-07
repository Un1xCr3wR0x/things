/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Inject, Input, Output, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationTypeEnum, ApplicationTypeToken, CsvFile } from '@gosi-ui/core';
import { ContributorRouteConstants } from '../../../../shared/constants';

@Component({
  selector: 'cnt-bulk-wage-upload-dc',
  templateUrl: './bulk-wage-upload-dc.component.html',
  styleUrls: ['./bulk-wage-upload-dc.component.scss']
})
export class BulkWageUploadDcComponent implements OnInit {
  /** Local variables */
  isAppPrivate: boolean;
  uploadForm: FormGroup;

  /** Input variables */
  @Input() isProcessing: boolean;
  @Input() bulkFile: CsvFile;
  @Input() parentForm: FormGroup;
  @Input() isWorkflowInProgress: boolean;
  @Input() totalContributors: number;
  @Input() transactionNo: number;
  @Input() isEditMode: boolean;
  @Input() isPPAEst = false;

  /** Output variables */
  @Output() downloadAll: EventEmitter<null> = new EventEmitter<null>();
  @Output() processFile: EventEmitter<File> = new EventEmitter<File>();

  /** Creates an instance of BulkWageUploadDcComponent. */
  constructor(
    private fb: FormBuilder,
    readonly router: Router,
    @Inject(ApplicationTypeToken) private appToken: string
  ) {
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
  }

  ngOnInit() {
    this.uploadForm = this.fb.group({ changed: false, uploadStatus: false });
    this.parentForm.addControl('uploadForm', this.uploadForm);
  }

  /** Method to download CSV file for all active contributors. */
  downloadForAllActive() {
    this.downloadAll.emit();
  }

  /** Method to process csv file. */
  processCSV(file: File) {
    this.processFile.emit(file);
  }

  /** Method to handle Csv upload. */
  handleCsvUpload(status: boolean) {
    this.uploadForm.get('changed').setValue(true);
    this.uploadForm.get('uploadStatus').setValue(status);
  }

  /** Method to navigate custom list. */
  customList() {
    this.router.navigate([ContributorRouteConstants.ROUTE_CUSTOM_LIST]);
  }
}
