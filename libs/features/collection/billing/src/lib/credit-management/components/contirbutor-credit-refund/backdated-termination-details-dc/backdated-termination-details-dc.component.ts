/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { convertToYYYYMMDD, dayDiff, LanguageToken, subtractDays } from '@gosi-ui/core';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import {
  BackdatedTerminationTransactionsDetails,
  CreditBalanceDetails,
  EstablishmentDetails
} from '../../../../shared/models';
import { SelectedTerminationPeriodDetails } from '../../../../shared/models/selected-termination-period-details';
import { BillingRoutingService } from '../../../../shared/services';

@Component({
  selector: 'blg-backdated-termination-details-dc',
  templateUrl: './backdated-termination-details-dc.component.html',
  styleUrls: ['./backdated-termination-details-dc.component.scss']
})
export class BackdatedTerminationDetailsDcComponent implements OnInit, OnChanges {
  /**Local Variables */
  lang = 'en';
  seterrror: boolean;
  arabicName = '';
  allChecked = false;
  disableRefund = true;
  disableGenerateStatement = false;
  refundAmountExceedError = false;
  currentCurrencyLable = 'BILLING.SAR';
  loadSelectedPeriod = false;
  totalRefundAmount = 0;
  modalRef: BsModalRef;
  selectAllCheckbox: FormGroup;
  checkListValue: FormArray = new FormArray([]);
  selectedPeriods: SelectedTerminationPeriodDetails[] = [];

  // Input Variable
  @Input() backdatedTerminationTransactionsDetails: BackdatedTerminationTransactionsDetails;
  @Input() transactionsDetails: BackdatedTerminationTransactionsDetails;
  @Input() establishmentCreditDetails: CreditBalanceDetails = new CreditBalanceDetails();
  @Input() loadSelectedPeriodValue: SelectedTerminationPeriodDetails[] = [];
  @Input() establishmentDetails: EstablishmentDetails;
  @Input() isWorkflow: boolean;
  // Output Variable
  @Output() refundAmount: EventEmitter<null> = new EventEmitter();
  @Output() generate: EventEmitter<null> = new EventEmitter();
  @Output() selectedTerminationPeriod: EventEmitter<SelectedTerminationPeriodDetails[]> = new EventEmitter();
  @Output() refundAmountExceededErrorEmit: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly modalService: BsModalService,
    readonly billingRoutingService: BillingRoutingService
  ) {}

  // this method is used to get values on component initialization
  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.selectAllCheckbox = this.fb.group({
      checkBoxFlag: [false]
    });
  }
  // this method is used to get values on input changes
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.backdatedTerminationTransactionsDetails?.currentValue) {
      this.backdatedTerminationTransactionsDetails = changes?.backdatedTerminationTransactionsDetails?.currentValue;
      this.createFormData();
      if (this.loadSelectedPeriod) {
        this.setFormData();
      }
    }
    if (changes?.transactionsDetails?.currentValue) {
      this.transactionsDetails = changes?.transactionsDetails?.currentValue;
    }
    if (changes?.loadSelectedPeriodValue?.currentValue) {
      this.selectedPeriods = changes?.loadSelectedPeriodValue?.currentValue;
      if (this.selectedPeriods) {
        this.loadSelectedPeriod = true;
      }
    }
    if (
      this.backdatedTerminationTransactionsDetails?.terminatedContributions.length > 0 &&
      this.transactionsDetails?.terminatedContributions.length > 0
    ) {
      this.getSelectedDetails();
    }
  }
  // this method is used to fetch select termination details on validator edit
  getSelectedDetails() {
    if (this.isWorkflow) {
      this.selectedPeriods = [];
      this.backdatedTerminationTransactionsDetails?.terminatedContributions.forEach((element, index) => {
        this.transactionsDetails?.terminatedContributions.forEach(data => {
          if (element.engagementId === data.engagementId) {
            this.checkListValue.controls[index].get('checkBoxFlag').setValue(true);
            this.selectedPeriods.push({
              startDate: this.backdatedTerminationTransactionsDetails?.terminatedContributions[index].startDate,
              endDate: this.backdatedTerminationTransactionsDetails?.terminatedContributions[index].endDate,
              engagementId: this.backdatedTerminationTransactionsDetails?.terminatedContributions[index].engagementId,
              contributorShare: this.backdatedTerminationTransactionsDetails?.terminatedContributions[index]
                .contributorShare,
              transactionDate: this.backdatedTerminationTransactionsDetails?.terminatedContributions[index]
                .transactionDate
            });
          }
        });
      });
      this.selectAllCheck();
      this.selectedTerminationPeriod.emit(this.selectedPeriods);
    }
  }
  // this method is used to create form
  createFormData() {
    for (let i = 0; i < this.backdatedTerminationTransactionsDetails?.terminatedContributions.length; i++) {
      this.checkListValue.push(this.createCheckForm(i));
    }
  }
  // this method is used to ceate check form
  createCheckForm(i): FormGroup {
    return this.fb.group({
      checkBoxFlag: [
        {
          value: false,
          disabled:
            this.backdatedTerminationTransactionsDetails?.terminatedContributions[i]?.alreadyRefunded ||
            convertToYYYYMMDD(
              moment(this.backdatedTerminationTransactionsDetails?.terminatedContributions[i].transactionDate.gregorian)
                .toDate()
                .toString()
            ) > convertToYYYYMMDD(moment(subtractDays(new Date(), 30)).toDate().toString())
              ? true
              : false
        }
      ]
    });
  }
  // -------------------------------------------this method is used to select periods from list------------------------------------------------
  selectPeriods(i) {
    if (this.checkListValue.controls[i].get('checkBoxFlag').value === true) {
      this.selectedPeriods.push({
        startDate: this.backdatedTerminationTransactionsDetails?.terminatedContributions[i].startDate,
        endDate: this.backdatedTerminationTransactionsDetails?.terminatedContributions[i].endDate,
        engagementId: this.backdatedTerminationTransactionsDetails?.terminatedContributions[i].engagementId,
        contributorShare: this.backdatedTerminationTransactionsDetails?.terminatedContributions[i].contributorShare,
        transactionDate: this.backdatedTerminationTransactionsDetails?.terminatedContributions[i].transactionDate
      });
    } else {
      this.selectedPeriods = this.selectedPeriods.filter(item => {
        if (
          item.startDate.gregorian !==
            this.backdatedTerminationTransactionsDetails?.terminatedContributions[i].startDate.gregorian &&
          item.endDate.gregorian !==
            this.backdatedTerminationTransactionsDetails?.terminatedContributions[i].endDate.gregorian
        ) {
          return item;
        }
      });
    }
    this.selectAllCheck();
    this.selectedTerminationPeriod.emit(this.selectedPeriods);
  }

  /** *********Method to check the selected transaction period is greater the 30days******************************************** */
  verifyPeriodEligibility(selectedPeriodDetails: SelectedTerminationPeriodDetails[]) {
    let eligible = true;
    this.disableGenerateStatement = false;
    if (selectedPeriodDetails.length > 0) {
      selectedPeriodDetails.forEach(item => {
        if (dayDiff(new Date(item.transactionDate.gregorian), new Date()) < 30) {
          eligible = false;
          this.disableGenerateStatement = true;
        }
      });
      return eligible;
    } else {
      return false;
    }
  }

  // -------methode to check all periods are checked . if all period are selected then will check select all check box in table header------------------------------
  selectAllCheck() {
    let count = 0;
    this.backdatedTerminationTransactionsDetails?.terminatedContributions.forEach(item => {
      if (!item.alreadyRefunded && dayDiff(new Date(item.transactionDate.gregorian), new Date()) > 30) count += 1;
    });

    if (this.selectedPeriods.length === count && count !== 0) {
      this.selectAllCheckbox.get('checkBoxFlag').setValue(true);
      this.allChecked = true;
    } else {
      this.selectAllCheckbox.get('checkBoxFlag').setValue(false);
      this.allChecked = false;
    }
    this.calcualteRefundAmount();
  }

  /***Method to set backdated checkbox when returning from refund amount page */
  setFormData() {
    this.backdatedTerminationTransactionsDetails.terminatedContributions.forEach((item, index) => {
      this.selectedPeriods.forEach(period => {
        if (item.engagementId === period.engagementId) {
          this.checkListValue.controls[index].get('checkBoxFlag').setValue(true);
        }
      });
    });
    this.selectAllCheck();
    this.disableRefund =
      this.selectedPeriods.length > 0 && this.backdatedTerminationTransactionsDetails?.eligibleForRefund ? false : true;
  }

  //method to calculate total refund amount
  calcualteRefundAmount() {
    this.totalRefundAmount = 0;
    if (this.establishmentDetails?.status?.english === 'Closed') {
      this.backdatedTerminationTransactionsDetails.terminatedContributions.forEach(item => {
        this.totalRefundAmount += item.contributorShare;
      });
    } else {
      this.selectedPeriods.forEach(item => {
        this.totalRefundAmount += item?.contributorShare;
      });
    }
    this.disableRefund =
      this.selectedPeriods.length > 0 && this.backdatedTerminationTransactionsDetails?.eligibleForRefund ? false : true;
  }
  //to check the total refund amount is less than credit balance
  validateRefundAmount() {
    if (this.totalRefundAmount > this.establishmentCreditDetails?.totalCreditBalance) {
      this.refundAmountExceedError = true;
    } else {
      this.refundAmountExceedError = false;
    }
    this.refundAmountExceededErrorEmit.emit(this.refundAmountExceedError);
  }
  //method to select all the periods at once
  selectAll() {
    if (!this.allChecked) {
      this.selectedPeriods = [];
      this.checkListValue.controls.forEach((item, index) => {
        if (
          !this.backdatedTerminationTransactionsDetails?.terminatedContributions[index]?.alreadyRefunded &&
          dayDiff(
            new Date(
              this.backdatedTerminationTransactionsDetails?.terminatedContributions[index]?.transactionDate.gregorian
            ),
            new Date()
          ) > 30
        ) {
          item.get('checkBoxFlag').setValue(true);
          this.selectedPeriods.push({
            startDate: this.backdatedTerminationTransactionsDetails?.terminatedContributions[index].startDate,
            endDate: this.backdatedTerminationTransactionsDetails?.terminatedContributions[index].endDate,
            engagementId: this.backdatedTerminationTransactionsDetails?.terminatedContributions[index].engagementId,
            contributorShare: this.backdatedTerminationTransactionsDetails?.terminatedContributions[index]
              .contributorShare,
            transactionDate: this.backdatedTerminationTransactionsDetails?.terminatedContributions[index]
              .transactionDate
          });
        }
      });
      this.allChecked = true;
    } else {
      this.selectedPeriods = [];
      this.checkListValue.controls.forEach(item => {
        item.get('checkBoxFlag').setValue(false);
      });
      this.allChecked = false;
    }
    this.calcualteRefundAmount();
    this.selectedTerminationPeriod.emit(this.selectedPeriods);
  }
  /**method to trigger navigation on click to refund button */
  navigateToRefundAmount() {
    this.validateRefundAmount();
    if (this.selectedPeriods.length > 0 && !this.refundAmountExceedError) {
      this.refundAmount.emit();
    }
  }
  /**method to navigate to inbox on confirm generate statement modal */
  generateStatement() {
    this.generate.emit();
  }
  /** Method to show modal. */
  showModal(template: TemplateRef<HTMLElement>, size: string): void {
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-${size} modal-dialog-centered` };
    this.modalRef = this.modalService.show(template, config);
  }
  /** Method to hide modal. */
  hideModal(): void {
    this.modalRef.hide();
  }
}
