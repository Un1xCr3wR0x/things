/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { AlertService, ApplicationTypeEnum, ApplicationTypeToken, CsvFile } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ThemeConstants } from '../../../constants/themes-constants';

@Component({
  selector: 'gosi-input-file-multi-type-sc',
  templateUrl: './input-file-multi-type-sc.component.html',
  styleUrls: ['./input-file-multi-type-sc.component.scss']
})
export class InputFileMultiTypeScComponent implements OnChanges {
  /** Local variables */
  fileTypes = [
    'application/vnd.ms-excel',
    'application/.csv',
    'text/csv',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  fileUploadSuccess = ThemeConstants.DOCUMENT_UPLOADED;
  upload: File;
  uploadUrl: string;

  modalRef: BsModalRef;
  isAppPrivate: boolean;

  /** Template references. */
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  /** Input variables */
  @Input() documentName: string;
  @Input() isProcessing: boolean;
  @Input() fileDetails: CsvFile;
  @Input() invalidTypeKey: string;
  @Input() sizeExceededError: string;
  @Input() actionKey: string;
  @Input() isWorkflowInProgress: boolean;
  @Input() showProceed = true;
  @Input() uploadFailed? = false;
  /** Outpurt variables */
  @Output() process: EventEmitter<File> = new EventEmitter<File>();
  @Output() uploaded: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() autoUpload: EventEmitter<File> = new EventEmitter<File>();
  @Output() deleted: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** Creates an instance of InputCsvScComponent. */
  constructor(
    private alertService: AlertService,
    private modalService: BsModalService,
    @Inject(ApplicationTypeToken) private appToken: string
  ) {
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
  }

  /** Method to handle changes in input. */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isProcessing && !changes.isProcessing.currentValue && this.upload) this.upload = undefined;
    if (changes.isWorkflowInProgress && !changes.isWorkflowInProgress.currentValue && this.upload)
      this.upload = undefined;
    if (changes?.uploadFailed?.currentValue) {
      this.uploadFailed = changes?.uploadFailed?.currentValue;
    }
  }

  /** Method to handle file upload. */
  handleFileUpload(fileList: FileList): void {
    if (fileList.length > 0) {
      this.alertService.clearAllErrorAlerts();
      const file = fileList[0];
      const extension = file.name.split('.')[file.name.split('.').length - 1];
      if (
        !this.fileTypes.includes(file.type) ||
        (extension.toLowerCase() !== 'csv' && extension.toLowerCase() !== 'xls' && extension.toLowerCase() !== 'xlsx')
      ) {
        this.uploadFailed = true;
        this.alertService.showErrorByKey(this.invalidTypeKey);
      } else if (file.size / 1024 / 1024 > 5) {
        this.uploadFailed = true;
        this.alertService.showErrorByKey(this.sizeExceededError);
      } else {
        this.uploadFailed = false;
        this.upload = file;
      }
      this.uploaded.emit(this.uploadFailed);
      this.autoUpload.emit(this.upload);
    }
  }

  /** Method to show template. */
  showTemplate(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template, {
      class: 'modal-dialog-centered',
      backdrop: true,
      ignoreBackdropClick: true
    });
  }

  /** Method to delete uploaded document. */
  deleteDocument() {
    this.upload = undefined;
    this.uploadUrl = undefined;
    this.deleted.emit(true);
    this.declinePopUp();
  }

  /** Method to decline pop up. */
  declinePopUp() {
    this.modalRef.hide();
  }

  /** Method to start file processing. */
  startProcessing() {
    this.process.emit(this.upload);
  }
}
