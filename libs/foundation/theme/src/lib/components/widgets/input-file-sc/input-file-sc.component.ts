/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import {
  AlertService,
  AppConstants,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BilingualText,
  DocumentItem,
  DocumentResponseItem,
  DocumentService,
  FileExtensionEnum,
  FileIcon,
  SseApiService
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ThemeConstants } from '../../../constants/themes-constants';
import { FileOperation } from './file-operations';
/** Types of files can upload */
enum FileTypeUpload {
  pdf = 'application/pdf',
  jpeg = 'image/jpeg',
  png = 'image/png',
  jpg = 'image/jpg'
}
const documentSize = AppConstants.DOCUMENT_SIZE;
@Component({
  selector: 'gosi-input-file-sc',
  templateUrl: './input-file-sc.component.html',
  styleUrls: ['./input-file-sc.component.scss']
})
export class InputFileScComponent extends FileOperation implements OnInit, OnDestroy, OnChanges {
  /**
   * Input variables retrieved from parent component
   */
  @Input() isItsmPage: boolean = false;
  @Input() document: DocumentItem;
  @Input() index: number;
  @Input() businessKey: number;
  @Input() transactionId: string;
  @Input() isSequenceNo = false;
  @Input() byPassDeleteAPI = false;
  @Input() noFilesError = false;
  @Input() hideDeleteAction = false;
  //Determine whether the component is using for upload or scan
  @Input() isScan = false;
  @Input() referenceNo: number;
  //Receiving uuid from child component
  @Input() uuid: string;
  @Input() optionalUuid = true;
  @Input() showSequenceNumber = false;
  @Input() isScanAndUpload = false;
  @Input() canUpdateDocument: boolean = false;
  /**
   * Output variables to communicate with parent component
   */
  @Output() delete: EventEmitter<DocumentItem> = new EventEmitter();
  @Output() refresh: EventEmitter<DocumentItem> = new EventEmitter();
  @Output() uploadedEvent: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  /**Local variables */
  fileTypes = ['image/jpg', 'image/jpeg', 'application/pdf', 'image/png'];
  sizeExceededError = ThemeConstants.DOCUMENT_SIZE_EXCEEDED;
  invalidFileTypeError = ThemeConstants.INVALID_FILE_TYPE;
  invalidFileTypeErrorITSM: BilingualText = new BilingualText();
  fileUploadSuccess = ThemeConstants.DOCUMENT_UPLOADED;
  fileUrl;
  documentType: string;
  bsModal: BsModalRef;
  downloadable: boolean;
  @Input() parentForm: FormGroup;

  /** Constructor  method to initialize*/
  constructor(
    readonly alertService: AlertService,
    readonly documentService: DocumentService,
    public sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private sseService: SseApiService,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {
    super();
  }

  /** Method to perform tasks while initializing components*/
  ngOnInit() {
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      this.isScanAndUpload = true;
    }
    if (this.isItsmPage == true){
      this.isScanAndUpload = false;
    }
  }

  setIcon() {
    if (this.document) {
      if (this.document.fileName !== undefined && this.document.fileName !== null) {
        this.documentType = this.document.fileName
          .slice(this.document.fileName.length - 3, this.document.fileName.length)
          .toLowerCase();
        if (this.documentType === 'pdf') {
          this.document.icon = FileIcon.pdf;
        } else {
          this.document.icon = FileIcon.jpeg;
        }
      }
    }
    return this.document.icon;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (changes.document && changes.document.currentValue) {
        this.document = changes.document.currentValue;
      }
      if(changes.noFilesError && changes.noFilesError.currentValue){
        this.noFilesError = changes.noFilesError.currentValue;
      }
    }
  }

  /**
   * Method to get the file type
   */
  get fileType() {
    if (this.document) {
      if (this.document.fileName !== undefined && this.document.fileName !== null) {
        this.documentType = this.document.fileName
          .slice(this.document.fileName.length - 3, this.document.fileName.length)
          .toLowerCase();
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  /**
   * This method is used to handle the changes in the input variables
   * @param changes
   * @memberof InputBaseComponent
   */
  checkTypeError() {
    if (this.document.started && !this.document.uploaded) {
      this.document.uploadFailed = true;
    }
  }

  inputFile() {
    if (this.checkForFormAndValidity()) {
      this.fileInput.nativeElement.click();
    }
  }
   /**handling drag and drop event**/
  fileDropped(file){
     if(!this.document.documentContent){
     // const input=document.getElementById('fileInput') as HTMLInputElement;
      this.handleFileInput(file);
     }
  }

  /**handling the file which uploaded by user**/
  handleFileInput(fileList: FileList): void {
    this.document.percentageLoaded = 0;
    this.document.started = true;
    const file = fileList[0];
    const fileSize = file.size / 1024 / 1024;
    if (this.fileTypes.includes(file.type) && fileSize <= documentSize) {
      const fileReader: FileReader = new FileReader();
      const self = this;
      this.document.icon = FileIcon.jpeg;
      this.document.documentType = file.type;
      if (file.type === FileTypeUpload.pdf) {
        this.document.icon = FileIcon.pdf;
      }
      fileReader.readAsDataURL(file);
      fileReader.onloadend = function () {
        self.document.documentContent = fileReader.result
          .toString()
          .substr(fileReader.result.toString().indexOf(',') + 1);
        self.uploadDocument(file);
      };
    } else if (fileSize > documentSize) {
      this.checkTypeError();
      this.alertService.showErrorByKey(this.sizeExceededError);
    } else {
      this.checkTypeError();
      if(!this.isItsmPage){
      this.alertService.showErrorByKey(this.invalidFileTypeError);
      }
      else if(this.isItsmPage) {
        this.invalidFileTypeErrorITSM.english = 'Invalid file type. Please upload only PDF file or Image';
        this.invalidFileTypeErrorITSM.arabic = 'صيغة الملف المرفق غير مسموح بها. الرجاء ارفاق ملف PDF او صورة';
        this.alertService.showError(this.invalidFileTypeErrorITSM);
      }
    }
    this.fileInput.nativeElement.value = '';
  }
  checkForFormAndValidity() {
    let valid = false;
    if (this.parentForm) {
      this.alertService.clearAllErrorAlerts();
      if (this.parentForm.valid) valid = true;
      else {
        valid = false;
        this.parentForm.markAllAsTouched();
        this.alertService.showMandatoryErrorMessage();
      }
    } else valid = true;

    return valid;
  }

  /**
   * Method used to upload document to server
   */
  uploadDocument(file: File) {
    this.alertService.clearAlerts();
    this.noFilesError = false;
    const fileSizeKB = file.size / 1024;
    const fileExt = file.name.split('.').pop();
    this.document.fileName = this.businessKey
      ? this.document.name.english + '_' + this.businessKey + '.' + fileExt
      : this.document.name.english + '.' + fileExt;
    if(this.isItsmPage == true){
      this.document.fileName = file.name;
    }
    this.setIcon();
    this.document.size = fileSizeKB.toFixed(2) + ' kb';
    this.document.businessKey = this.businessKey;
    this.document.transactionId = this.transactionId;
    this.document.percentageLoaded = 0;
    this.document.isUploading = true;
    this.document.referenceNo = this.referenceNo;
    this.document.uuid = this.uuid;
    /** Invoking api to upload document */

    if (!this.isItsmPage) {
      this.handleUploadDocument().subscribe(
        event => {
          this.handleUploadEventSuccess(event);
        },
        err => {
          this.handleUploadEventError(err);
        }
      );
    }
    else {
      this.document.isUploading = false;
    }
  }

  handleUploadDocument(): Observable<HttpEvent<{ dDocName: string; message: BilingualText }>> {
    if (this.document.transactionReferenceIds?.length > 0) {
      return forkJoin(
        this.document.transactionReferenceIds.map((id, index) => {
          const doc = new DocumentItem().fromJsonToObject(this.document);
          doc.referenceNo = id;
          doc.transactionId = this.document.transactionIds[index];
          return this.documentService.uploadFile(doc);
        })
      ).pipe(
        switchMap(res => {
          if (res?.length > 0) {
            return of(res[res?.length - 1]);
          }
        })
      );
    }
    return this.documentService.uploadFile(this.document);
  }

  handleUploadEventSuccess(event: HttpEvent<{ dDocName: string; message: BilingualText }>) {
    if (event.type === HttpEventType.Response) {
      this.document.contentId = event?.body?.dDocName;
    }
    if (event.type === HttpEventType.UploadProgress) {
      this.document.percentageLoaded = Math.round((100 * event.loaded) / event.total);
    } else if (event instanceof HttpResponse) {
      this.document.uploaded = true;
      this.document.uploadFailed = false;
      this.document.isUploading = false;
    }
    this.uploadedEvent.emit(true);
  }

  handleUploadEventError(err) {
    this.document.uploaded = false;
    this.document.documentContent = null;
    this.document.isUploading = false;
    this.document.uploadFailed = true;
    this.document.icon = null;
    this.showErrorMessage(err);
    this.uploadedEvent.emit(false);
  }

  /**
   * This method to delete document
   */
  deleteDocument() {
    this.declinePopUp();
    if(this.byPassDeleteAPI){
      this.deleteDocumentFromViewOnly();
    }
    else if (!this.isItsmPage) {
      this.deleteUploadedDocument().subscribe(
        () => {
          this.resetDocument();
          this.delete.emit(this.document);
          this.uploadedEvent.emit(true);
          this.closeDocument();
        },
        err => {
          this.showErrorMessage(err);
          this.uploadedEvent.emit(false);
        }
      );
    }
    else  {
      this.deleteDocumentFromViewOnly();
    }
  }
  /**
   * This Method can be used to delete the file from the view in case the API
   * doesn't work and the user wants to delete the file from view
   */

  deleteDocumentFromViewOnly(){
    this.resetDocument();
    this.delete.emit(this.document);
    this.uploadedEvent.emit(true);
    this.closeDocument();
  }

  deleteDocumentWithReferenceNo(referenceNo: number): Observable<DocumentResponseItem> {
    return this.documentService.deleteDocument(
      this.businessKey,
      this.document.name.english,
      referenceNo,
      this.uuid,
      this.document.sequenceNumber,
      this.document.identifier,
      this.document.documentTypeId
    );
  }

  deleteUploadedDocument() {
    if (this.document.transactionReferenceIds?.length > 0) {
      return forkJoin(
        this.document.transactionReferenceIds.map(id => {
          return this.deleteDocumentWithReferenceNo(id);
        })
      ).pipe(
        switchMap(res => {
          if (res?.length > 0) {
            return of(res[res?.length - 1]);
          }
        })
      );
    }
    return this.deleteDocumentWithReferenceNo(this.referenceNo);
  }

  /**
   * This method is create popUp for comfirmation
   */
  popUp(template: TemplateRef<object>) {
    this.bsModal = this.modalService.show(template, {
      class: 'modal-dialog-centered'
    });
  }

  /**
   * This method is hide popUp for comfirmation
   */
  declinePopUp() {
    this.bsModal.hide();
  }

  /**
   * Method to reset the document item to the initial level
   */
  resetDocument() {
    this.document.documentContent = null;
    this.document.started = false;
    this.document.valid = false;
    this.document.fileName = null;
    this.document.uploaded = false;
    this.document.isUploading = false;
    this.document.isScanning = false;
    this.document.size = null;
    this.document.isContentOpen = false;
    this.document.percentageLoaded = null;
    this.document.icon = null;
    this.document.uploadFailed = false;
    this.document.contentId = null;
  }

  /**
   * This method is to preview the document
   * @param template
   * @memberof VerifyEstablishmentFormDCComponent
   */
  previewDocument() {
    this.fileUrl = null;
    if (this.document.documentContent && this.document.documentContent !== 'NULL') {
      this.fileUrl =
        this.documentType === FileExtensionEnum.PDF
          ? this.getDocumentUrl()
          : 'data:image/jpeg;base64,' + this.document.documentContent;
    }
    this.documentService.selectedIndex = this.index;
    this.document.isContentOpen = true;
  }

  /**
   * to close the previewed document
   */
  closeDocument() {
    if (this.document) {
      this.document.isContentOpen = false;
      this.documentService.selectedIndex = null;
    }
  }

  /**
   * This method is to generate a Url with document content
   */
  // getDocumentUrl() {
  //   this.documentType = this.document.fileName
  //     .slice(this.document.fileName.length - 3, this.document.fileName.length)
  //     .toLowerCase();
  //   let byteCharacters = atob(this.document.documentContent);
  //   if (byteCharacters.includes('data:application/pdf;base64,')) {
  //     byteCharacters = byteCharacters.replace('data:application/pdf;base64,', '');
  //     byteCharacters = atob(byteCharacters);
  //   }
  //   const byteArrays = [];
  //   for (let offset = 0; offset < byteCharacters.length; offset += 512) {
  //     const slice = byteCharacters.slice(offset, offset + 512),
  //       byteNumbers = new Array(slice.length);
  //     for (let i = 0; i < slice.length; i++) {
  //       byteNumbers[i] = slice.charCodeAt(i);
  //     }
  //     const byteArray = new Uint8Array(byteNumbers);
  //     byteArrays.push(byteArray);
  //   }

  //   if (this.documentType === 'pdf') {
  //     this.document.icon = FileIcon.pdf;
  //     const blob = new Blob(byteArrays, {
  //       type: `application/${this.documentType}`
  //     });
  //     return this.sanitizer.bypassSecurityTrustResourceUrl(
  //       URL.createObjectURL(blob) + '#toolbar=0&navpanes=0'
  //     );
  //   } else {
  //     return byteCharacters;
  //   }
  // }

  /**
   * This method is used to open images in new tabs;
   */
  // openImage() {
  //   const img = new Image();
  //   img.src = atob(this.document.documentContent);
  //   const w = window.open('');
  //   w.document.write(img.outerHTML);
  // }
  openDocument() {
    this.fileUrl = null;
    if (this.document.documentContent && this.document.documentContent !== 'NULL') {
      this.fileUrl = this.getDocumentUrl();
    }
  }
  /**
   * Calls the WCC with transaction id and document type
   */
  doScan() {
    if (this.checkForFormAndValidity()) {
      this.document.isScanning = true;
      /**
    this.sseService.getServerSentEvent().subscribe(
      (data: MessageEvent) => {
        const contentId = JSON.parse(data.data);
        if (contentId.contentID) {
          this.documentService.getDocumentContent(contentId.contentID).subscribe(documentResponse => {
            this.document = this.documentService.setContentToDocument(this.document, documentResponse);
            if (this.document.documentContent) {
              this.sseService.closeEventSource();
            }
          });
        } else {
          of(this.document);
        }
      }
      //err => {}
    );*/
      //WCC scan
      const scanUrl = encodeURI(
        this.documentService.getWccScanUrl(
          this.businessKey,
          this.transactionId,
          this.document.name.english,
          this.uuid,
          this.referenceNo,
          this.document.transactionReferenceIds,
          this.document.sequenceNumber,
          this.document.userAccessList,
          this.document.identifier,
          this.document.documentTypeId,
          this.document.description
        )
      );
      window.open(scanUrl, '_blank');
    }
  }

  /**
   * This method is used to check if the documents has been scanned
   * @param documentItem
   */
  refreshDocument() {
    this.refresh.emit(this.document);
    this.openDocument();
  }

  /**
   * This method is to show HTTP Errors
   * @param err
   */
  showErrorMessage(err) {
    this.alertService.showError(err.error.message, err.error.details);
  }

  /** This method to close document on component destruction  */
  ngOnDestroy(): void {
    this.closeDocument();
  }
}
