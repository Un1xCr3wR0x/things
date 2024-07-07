import { Component, EventEmitter, OnChanges, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { AlertService, convertToDDMMYY, DocumentItem } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ItemizedGovernmentReceiptsRequest } from '../../../shared/models/Itemized-government-receipts-request';
import * as XLSX from 'xlsx';

@Component({
  selector: 'blg-government-receipts-file-upload-dc',
  templateUrl: './government-receipts-file-upload-dc.component.html',
  styleUrls: ['./government-receipts-file-upload-dc.component.scss']
})
export class GovernmentReceiptsFileUploadDcComponent implements OnInit, OnChanges {
  // Local varibales
  modalRef: BsModalRef;
  receipts = null;
  firstReceiptFile: ItemizedGovernmentReceiptsRequest = new ItemizedGovernmentReceiptsRequest();
  secondReceiptFile: ItemizedGovernmentReceiptsRequest = new ItemizedGovernmentReceiptsRequest();
  uploadFailed = false;
  showProceed = false;
  arrayBuffer;
  document: DocumentItem;
  isSecondDocumentActive = false;

  @Output() submit: EventEmitter<ItemizedGovernmentReceiptsRequest> = new EventEmitter();
  @Output() cancelBtn: EventEmitter<null> = new EventEmitter();

  constructor(private modalService: BsModalService, readonly alertService: AlertService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {}

  // submit file
  submitFile() {
    if (!this.firstReceiptFile.paymentDtoList) {
      this.firstReceiptFile.paymentDtoList = [];
    }
    if (!this.secondReceiptFile.paymentDtoList) {
      this.secondReceiptFile.paymentDtoList = [];
    }
    if (this.firstReceiptFile.paymentDtoList.length > 0 && this.secondReceiptFile.paymentDtoList.length > 0) {
      let receiptsFile = new ItemizedGovernmentReceiptsRequest();
      receiptsFile.filename = this.firstReceiptFile.filename;
      receiptsFile.paymentDtoList = this.firstReceiptFile.paymentDtoList.concat(this.secondReceiptFile.paymentDtoList);
      this.submit.emit(receiptsFile);
    } else if (this.firstReceiptFile.paymentDtoList.length > 0 && this.secondReceiptFile.paymentDtoList.length === 0) {
      this.submit.emit(this.firstReceiptFile);
    } else if (this.firstReceiptFile.paymentDtoList.length === 0 && this.secondReceiptFile.paymentDtoList.length > 0) {
      this.submit.emit(this.secondReceiptFile);
    }
  }

  confirmCancelBtn() {
    this.modalRef.hide();
    this.cancelBtn.emit();
  }

  // hide pop up cancel modal
  declinePopup() {
    this.modalRef.hide();
  }

  // show cancle modal
  popUp(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template);
  }

  // Methos to process the file content.
  processFirstFile(file: File) {
    this.alertService.clearAllErrorAlerts();
    this.uploadFailed = false;
    this.firstReceiptFile = new ItemizedGovernmentReceiptsRequest();
    this.firstReceiptFile.paymentDtoList = [];
    this.firstReceiptFile.filename = file.name.split('.')[0];
    const reader: FileReader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      this.arrayBuffer = reader.result;
      const resultData = new Uint8Array(this.arrayBuffer);
      let arr = new Array();
      for (let i = 0; i != resultData.length; ++i) {
        arr[i] = String.fromCharCode(resultData[i]);
      }
      let bstr = arr.join('');
      let workbook = XLSX.read(bstr, { type: 'binary', cellDates: true });
      let first_sheet_name = workbook.SheetNames[0];
      let worksheet = workbook.Sheets[first_sheet_name];
      let arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: false });
      for (let row of arraylist) {
        let amount = this.validateAmount(row['Amount']);
        let transactionDate = this.validateDate(row['Transfer Date']);
        this.firstReceiptFile.paymentDtoList.push({
          establishmentName: String(row['Establishment Name']),
          transactionDate: transactionDate,
          amount: String(amount),
          referenceNo: String(row['Reference number']),
          paymentOrderNumber: String(row['Payment Order Number'])
        });
      }
    };
  }

  // Method to validate amount.
  validateAmount(amount) {
    return isNaN(amount.replaceAll(',', '')) ? amount : parseFloat(amount.replaceAll(',', '')).toFixed(2);
  }

  // Method to validate date.
  validateDate(date) {
    if (String(new Date(date)) === 'Invalid Date' || !isNaN(date) || !this.isValidDateFormat(date)) {
      return date;
    } else {
      const convertedDate = convertToDDMMYY(String(date));
      if (convertedDate === 'Invalid Date') {
        return date;
      }
      return convertedDate;
    }
  }

  // Method to validate date format returns true in case formatted correctly otherwise false.
  isValidDateFormat(date: String) {
    if (
      (date.match(/\//g) && date.match(/\//g).length > 1 && date.match(/\//g).length < 3) ||
      (date.match(/-/g) && date.match(/-/g).length > 1 && date.match(/-/g).length < 3)
    ) {
      return true;
    }
    return false;
  }
}
