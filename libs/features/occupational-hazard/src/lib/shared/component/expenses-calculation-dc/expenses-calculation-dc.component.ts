/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef
} from '@angular/core';
import { DocumentItem, LanguageToken, BilingualText } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { Claims } from '../../models/claims-wrapper';
import { DocumentDetails } from '../../models/documet-details';
import moment from 'moment';

@Component({
  selector: 'oh-expenses-calculation-dc',
  templateUrl: './expenses-calculation-dc.component.html',
  styleUrls: ['./expenses-calculation-dc.component.scss']
})
export class ExpensesCalculationDcComponent implements OnInit, OnChanges, AfterViewChecked {
  //Local variables
  claimsList = [];
  type = 0;
  modalRef: BsModalRef;
  totalExpense = 0;
  paymentMethod = '—';
  secondLabel: string;
  label: BilingualText;
  accountNo = '';
  isBankTransfer = false;
  lang = 'en';
  isLabel = false;
  //Input variables
  @Input() documents: DocumentItem[];
  @Input() validatorView: boolean;
  @Input() showDocs = false;
  @Input() claims: Claims;
  @Input() claimBreakUpList: Claims[];
  /** Output variables */
  @Output() upload: EventEmitter<DocumentDetails> = new EventEmitter();
  @Output() navigateToCtbtr: EventEmitter<null> = new EventEmitter();
  @Output() navigateToEst: EventEmitter<null> = new EventEmitter();
  /**
   *
   * @param modalService
   */
  constructor(
    readonly modalService: BsModalService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    private cdRef: ChangeDetectorRef
  ) {}
  /**
   * This method is for initialization tasks
   */
  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }
  /**
   * This method is detect changes in input property
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.claims) {
      this.claims = changes.claims.currentValue;
      if (!this.validatorView) {
        if (this.claimBreakUpList) {
          this.claimBreakUpList.forEach(element => {
            if (
              element.invoiceItemId === this.claims.invoiceItemId &&
              this.claims.actualPaymentStatus?.english === element.actualPaymentStatus?.english
            ) {
              element?.expenses?.forEach(item => {
                this.totalExpense = this.totalExpense + item.amount;
              });
            }
          });
        }
      }
      if (this.claims.paymentMethod?.english) {
        if (this.claims.payeeDetails.payableTo.english === 'Contributor') {
          this.secondLabel = 'OCCUPATIONAL-HAZARD.ALLOWANCE.SELF';
        } else if (this.claims.payeeDetails.payableTo.english === 'Authorized Person') {
          if (this.validatorView && this.claims.paymentMethod.english === 'LC Cheque') {
            this.secondLabel = null;
          } else {
            this.secondLabel = 'OCCUPATIONAL-HAZARD.ALLOWANCE.AUTHORIZED';
          }
        } else if (this.claims.payeeDetails.payableTo.english === 'Establishment') {
          this.secondLabel = 'OCCUPATIONAL-HAZARD.ALLOWANCE.ESTABLISHMENT';
        } else if (this.claims.payeeDetails.payableTo.english === 'Hospital') {
          this.secondLabel = 'OCCUPATIONAL-HAZARD.ALLOWANCE.HOSPITAL';
        }
      } else if (this.claims.payeeDetails.payableTo.english === 'Hospital') {
        this.secondLabel = 'OCCUPATIONAL-HAZARD.ALLOWANCE.HOSPITAL';
      }
      if (this.claims.payeeDetails.payableTo) {
        this.setPaymentMethodLabel(this.claims.paymentMethod);
      } else {
        this.paymentMethod = 'OCCUPATIONAL-HAZARD.NOT-AVAILABLE';
      }
    }
    this.getAccountNumber();
  }
  setPaymentMethodLabel(paymentMethod) {
    if (paymentMethod?.english === 'LC Cheque' || paymentMethod?.english === 'FC Cheque') {
      this.paymentMethod = 'OCCUPATIONAL-HAZARD.ALLOWANCE.CHEQUE';
      this.isLabel = true;
    } else if (paymentMethod?.english === 'Account Transfer') {
      this.isLabel = true;
      this.paymentMethod = 'OCCUPATIONAL-HAZARD.ALLOWANCE.BANK-TRANSFER';
    } else {
      this.paymentMethod = paymentMethod;
    }
  }
  /** Method to show modal. */
  showModal(template: TemplateRef<HTMLElement>, size: string): void {
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-${size} modal-dialog-centered` };
    this.modalRef = this.modalService.show(template, config);
  }
  getPayableTo(payableTo: string, claims) {
    if (payableTo === 'GlobeMed' || payableTo === 'TCS') {
      this.label = claims.payeeDetails.payeeName;
    } else if (
      claims.payeeDetails.payableTo.english === 'Contributor' ||
      claims.payeeDetails.payableTo.english === 'Establishment'
    ) {
      this.label = claims.payeeDetails.payeeId;
    }
    return this.label;
  }
  handleNaviation(claims) {
    if (claims.payeeDetails.payableTo.english === 'Contributor') {
      this.navigateToCtbtr.emit();
    } else if (claims.payeeDetails.payableTo.english === 'Establishment') {
      this.navigateToEst.emit();
    }
  }
  navigateToContributor() {
    this.navigateToCtbtr.emit();
  }
  convertTreatmentDate(expenseDate) {
    if (typeof expenseDate !== 'object') {
      expenseDate = moment(new Date(expenseDate)).format('DD/MM/YYYY');
    }
    return expenseDate;
  }

  navigateToEstProfile() {
    this.navigateToEst.emit();
  }
  /**
   * Methid to hide modal
   */
  hideModal() {
    this.modalRef.hide();
  }
  /**
   * Catching the browser back button
   */
  @HostListener('window:popstate', ['$event'])
  onPopState() {
    this.hideModal();
  }
  /**
   * Navigate to document upload
   */
  uploadDocuments(ReimbId, referenceNo) {
    this.upload.emit({ refernceNo: referenceNo, ReimbId: ReimbId });
  }
  /**
   * Return account number
   */
  getAccountNumber() {
    if (
      (this.claims?.actualPaymentStatus?.english !== 'Paid' && this.claims?.claimType?.english === 'Reimbursement') ||
      !this.claims?.accountNumber
    ) {
      this.accountNo = '';
    } else {
      this.accountNo = 'XXX XXX  ' + ' ' + this.claims?.accountNumber?.toString().slice(-4);
    }
    if (
      this.paymentMethod === 'OCCUPATIONAL-HAZARD.ALLOWANCE.BANK-TRANSFER' &&
      this.claims?.actualPaymentStatus?.english === 'Paid'
    ) {
      this.isBankTransfer = true;
    }
  }
  ngAfterViewChecked() {
    this.getAccountNumber();
    this.cdRef.detectChanges();
  }
  getTotal(claimType: string) {
    this.totalExpense = 0;
    this.claimBreakUpList.forEach(element => {
      if (
        element.invoiceItemId === this.claims.invoiceItemId &&
        element.claimId === this.claims.claimId &&
        this.claims.actualPaymentStatus.english === element.actualPaymentStatus.english &&
        claimType === element.claimType.english
      ) {
        element?.expenses?.forEach(item => {
          this.totalExpense = this.totalExpense + item.amount;
        });
      }
    });
    return this.totalExpense;
  }
}
