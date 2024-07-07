import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, BilingualText, downloadFile, RegistrationNoToken, RegistrationNumber } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { noop, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { BillingConstants, ReportConstants } from '../../../shared/constants';
import { ItemizedGovernmentReceiptsRequest, RecordGovernmentPaymentResponse } from '../../../shared/models';
import { ItemizedGovernmentReceiptsResponse } from '../../../shared/models/Itemized-government-receipts-response';
import { EstablishmentService, RecordGovernmentReceiptsService } from '../../../shared/services';
import { ManageWageConstants } from '@gosi-ui/features/contributor';

@Component({
  selector: 'blg-record-government-receipts-sc',
  templateUrl: './record-government-receipts-sc.component.html',
  styleUrls: ['./record-government-receipts-sc.component.scss']
})
export class RecordGovernmentReceiptsScComponent implements OnInit {
  currentTab = 0;
  modalRef: BsModalRef;
  governmentReceiptsForm: FormGroup = new FormGroup({});
  pageNo = 0;
  pageSize = 10;
  receipts: ItemizedGovernmentReceiptsResponse;
  allowContinue = false;
  disableNotification = false;
  receiptdetails: ItemizedGovernmentReceiptsResponse;
  recordPaymentResponse: RecordGovernmentPaymentResponse = new RecordGovernmentPaymentResponse();
  isSucsessSearch = false;
  containsFailedReceipts: boolean;
  minimumLength = 0;
  isExponential = false;
  numberOfReceipts = 0;
  @ViewChild('confirmModal', { static: true })
  confirmModal: TemplateRef<HTMLElement>;

  constructor(
    private fb: FormBuilder,
    readonly establishmentService: EstablishmentService,
    readonly alertService: AlertService,
    readonly route: ActivatedRoute,
    readonly router: Router,
    readonly modalService: BsModalService,
    readonly recordGovReceiptsService: RecordGovernmentReceiptsService,
    @Inject(RegistrationNoToken) readonly establishmentRegistrationNo: RegistrationNumber
  ) {}

  ngOnInit(): void {
    this.createGovernmentReceiptsForm();
  }

  /** Method to handle search operation */
  onSearch(referenceNo) {
    this.disableNotification = false;
    if (referenceNo) {
      this.pageNo = 0;
      this.recordGovReceiptsService.getUploadedReceipts(this.pageNo, this.pageSize, referenceNo).subscribe(
        res => {
          this.receipts = res;
          this.isSucsessSearch = true;
        },
        err => {
          this.alertService.showError(err.error.message);
        }
      );
    }
  }

  onKeyUp(value) {}

  uploadReceiptsFile() {
    this.currentTab = 1;
  }

  /** Method to change the current tab to the previous one */
  previousTab() {
    this.currentTab = 0;
  }

  showModal(template: TemplateRef<HTMLElement>) {
    this.alertService.clearAlerts();
    this.modalRef = this.modalService.show(template, {backdrop: "static"});
    this.disableNotification = true;
  }

  /** Method to change the current tab to upload tab */
  uploadTab() {
    this.currentTab = 1;
  }

  /** Method to create gov receipt form */
  createGovernmentReceiptsForm() {
    this.governmentReceiptsForm = this.fb.group({
      showUploadedReceipts: [false]
    });
  }

  /* Method to handle file details on submit */
  onFileSubmit(receipts: ItemizedGovernmentReceiptsRequest) {
    this.alertService.clearAlerts();
    this.isExponential = false;
    this.numberOfReceipts = 0;
    receipts.paymentDtoList.forEach(r => {
      if (r.referenceNo.includes('E+')) {
        this.isExponential = true;
        this.numberOfReceipts += 1;
      }
    });
    if (!this.isExponential) {
      this.recordGovReceiptsService.uploadReceipts(receipts).subscribe(
        res => {
          this.containsFailedReceipts = res.includes('Failed');
          this.showModal(this.confirmModal);
          this.saveCsvFile(res);
        },
        err => {
          this.alertService.showError(err.error.message);
        }
      );
    } else {
      this.showModal(this.confirmModal);
    }
  }

  /** Method to download CSV. */
  saveCsvFile(data: string): void {
    const universalBOM = '\ufeff'; //Byte Order Mask to force UTF-8 when csv opened in excel
    const csv = new Blob([universalBOM + data], { type: 'text/csv;charset=UTF-8' });
    const aElement = document.createElement('a');
    aElement.href = URL.createObjectURL(csv);
    aElement.download = 'Upload receipt response.csv';
    document.body.appendChild(aElement);
    aElement.click();
    document.body.removeChild(aElement);
    URL.revokeObjectURL(aElement.href);
  }

  /* Method to show all uploaded payment receipts */
  showUploadedReceipts() {
    this.alertService.clearAlerts();
    this.disableNotification = false;
    this.pageNo = 0;
    if (this.governmentReceiptsForm.get('showUploadedReceipts').value) {
      this.recordGovReceiptsService.getUploadedReceipts(this.pageNo, this.pageSize, undefined).subscribe(
        res => {
          this.receipts = res;
        },
        err => {
          this.alertService.showError(err.error.message);
        }
      );
    }
  }

  /* Method to navigate between the pages */
  getSelectPageNo(selectedPage: number) {
    this.alertService.clearAlerts();
    this.pageNo = selectedPage;
    this.disableNotification = false;
    if (selectedPage !== undefined && selectedPage !== null) {
      this.recordGovReceiptsService.getUploadedReceipts(selectedPage, this.pageSize, undefined).subscribe(
        res => {
          this.receipts = res;
        },
        err => {
          this.alertService.showError(err.error.message);
        }
      );
    }
  }

  /* Method to get payment by reference number*/
  getPaymentByReferenceNo() {
    this.alertService.clearAlerts();
    this.disableNotification = true;
    const referenceNo = this.governmentReceiptsForm.get('receivePayment').get('referenceNo').value;
    if (referenceNo) {
      this.recordGovReceiptsService.getUploadedReceipts(this.pageNo, this.pageSize, referenceNo).subscribe(
        res => {
          this.receiptdetails = res;
          this.allowContinue = true;
        },
        err => {
          this.alertService.showError(err.error.message);
          this.allowContinue = false;
        }
      );
    }
  }

  /* Method to redirect into receive payment screen when continue button clicked */
  submitAndContinue() {
    const registrationNo = this.governmentReceiptsForm.get('receivePayment').get('registrationNo').value;
    if (registrationNo) {
      this.establishmentService.getEstablishment(registrationNo).subscribe(
        res => {
          if (res.status.english && res.status.english === BillingConstants.REG_STATUS || res.status.english === BillingConstants.REOPENED_STATUS) {
            if (!res.gccCountry) {
              this.modalRef.hide();
              this.establishmentRegistrationNo.value = res.registrationNo;
              this.router.navigate([BillingConstants.RECEIVE_PAYMENT], {
                state: {
                  paymentDetails: {
                    receiptDetails: this.receiptdetails.uploadReceipts[0]
                  }
                }
              });
            } else {
              this.alertService.showErrorByKey('BILLING.REJECT-GCC-TRNSACTION');
            }
          } else {
            this.alertService.showErrorByKey('BILLING.ESTABLISHMENT-STATUS-ERROR');
          }
        },
        err => {
          this.alertService.showError(err.error.message);
        }
      );
    }
  }

  /* Method to handle receive payment pop up cancle */
  cancelReceivePayment() {
    this.alertService.clearAlerts();
    this.modalRef.hide();
    this.receiptdetails = undefined;
    this.disableNotification = false;
  }

  /* Method to reset the page when the search value is removed */
  resetReceiptList() {
    if (this.governmentReceiptsForm.get('showUploadedReceipts').value) {
      this.isSucsessSearch = false;
      this.showUploadedReceipts();
    } else {
      this.isSucsessSearch = false;
    }
  }

  /** Method to navigate into Gov payment screen after clicking on ok button of the confirm modal */
  navigateToGovPayment() {
    this.currentTab = 0;
    this.modalRef.hide();
  }

  /** Method to hide the modal */
  hideModal() {
    this.modalRef.hide();
  }
}
