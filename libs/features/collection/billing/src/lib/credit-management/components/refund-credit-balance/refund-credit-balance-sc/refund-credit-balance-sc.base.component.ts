import { Directive } from '@angular/core';
import { TemplateRef, ViewChild } from '@angular/core';
import { AlertService, LookupService, BilingualText, DocumentService, DocumentItem } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { tap, map, catchError } from 'rxjs/operators';
import { BillingConstants } from '../../../../shared/constants/billing-constants';
import { of } from 'rxjs';

@Directive()
export abstract class CreditTransferBaseScComponent {
  bankName: BilingualText;
  isBankTransfer = true;
  iscreditRetained = false;
  bankNameFromApi: BilingualText;
  oldIban: string;
  isIbanEdit = false;
  ibanNumber: string;
  modalRef: BsModalRef;
  AmountToBeRefunded: number;
  documentList: DocumentItem[] = [];
  currentTab = 0;
  fieldArray = [];
  uuid: string;
  accountDetailsChange = false;
  branchValues = [];
  isIbanDetails = false;
  @ViewChild('refundConfirmView', { static: true }) /** Template & directive references */
  refundConfirmView: TemplateRef<HTMLElement>;
  constructor(
    readonly alertService: AlertService,
    readonly lookupService: LookupService,
    readonly modalService: BsModalService,
    readonly documentService: DocumentService
  ) {}
  /**
   *This method is used to fetch Branch look up values for selected bank
   * @param iban
   */
  onGetBankName(iban) {
    this.lookupService.getBankForIban(iban.slice(4, 6)).subscribe(
      res => {
        this.bankNameFromApi = res.items[0]?.value;
        this.bankName = res.items[0]?.value;
      },
      err => this.showErrorMessage(err)
    );
  }
  /**
   * Method to show error messages coming from api
   * @param err
   */
  showErrorMessage(err) {
    if (err && err.error) this.alertService.showError(err.error.message, err.error.details);
  }
  getBankTranser(val) {
    this.isBankTransfer = val;
  }
  getCreditRetainedValue(res) {
    this.iscreditRetained = res;
  }
  /*** Method to show a confirmation popup for cancelling the transaction.
   * @param template template*/
  popUp(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template);
  }

  // * Method to get new bank name and iban
  newBankDetails(bankDet) {
    if (bankDet.iban) {
      if (this.oldIban !== bankDet.iban) {
        this.isIbanEdit = true;
        this.isIbanDetails = false;
      } else this.isIbanEdit = false;
      this.ibanNumber = bankDet.iban;
      this.bankName = bankDet.bankName;
    }
  }
  // * Method to get refunded amount
  setAmountToBeRefunded(refundAmt) {
    this.AmountToBeRefunded = refundAmt;
  }
  // * Method to navigate to doocument page
  navigateToDocumentPage() {
    if (this.ibanNumber === null && this.isBankTransfer)
      this.alertService.showErrorByKey('BILLING.BANK-MANDATORY-VIEW');
    else {
      this.alertService.clearAlerts();
      this.showModal(this.refundConfirmView, 'md');
    }
  }
  showModal(template: TemplateRef<HTMLElement>, size: string) {
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-${size} modal-dialog-centered` };
    this.modalRef = this.modalService.show(template, config);
  }
  // * Method to cancel the pop up modal
  confirmCancel() {
    this.modalRef.hide();
  } /** Method to decline the popUp. */
  decline() {
    this.modalRef.hide();
  }
  /** * Method to fetch the required document for scanning.
   * @param receiptMode receipt mode */
  getDocuments() {
    return this.documentService
      .getRequiredDocuments(BillingConstants.CREDIT_REFUND_ID, BillingConstants.CREDIT_REFUND_TRANSACTION_TYPE)
      .pipe(
        map(docs => this.documentService.removeDuplicateDocs(docs)),
        catchError(error => of(error)),
        tap(res => (this.documentList = res))
      );
  }
}
