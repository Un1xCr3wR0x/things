import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  endOfMonth,
  BilingualText,
  startOfMonth,
  monthDiff,
  subtractYears,
  convertToYYYYMMDD,
  LanguageToken,
  subtractMonths
} from '@gosi-ui/core';
import moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { BillDetails } from '../../../../shared/models';
import { MofEmployeShareSummary } from '../../../../shared/models/mof-employeShare-summary';
import { Router } from '@angular/router';
import { BillingConstants } from '../../../../shared/constants';

@Component({
  selector: 'blg-mof-emp-share-summary-dc',
  templateUrl: './mof-emp-share-summary-dc.component.html',
  styleUrls: ['./mof-emp-share-summary-dc.component.scss']
})
export class MofEmpShareSummaryDcComponent implements OnInit, OnChanges {
  /**
   * This method isto create an instance of BillingDetailsDcComponent
   * @param fb form builder
   * @param language
   */
  constructor(
    private fb: FormBuilder,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly router: Router
  ) {}

  /* Local variables */
  lang = 'en';
  billingForm: FormGroup;
  minDate: Date;
  maxDate: Date;
  datevalue: Date;
  dateFormat = 'MMMM YYYY';
  monthDifference = 0;
  isDebit: boolean;
  summaryDetails: MofEmployeShareSummary;
  requiredPaymentByMOF: number;
  /* Input variables */
  @Input() selectedDate: string;
  @Input() billDetails: BillDetails;
  @Input() currencyType: BilingualText;
  @Input() initialStartDate: Date;
  @Input() minBillDate: Date;
  @Input() exchangeRate = 1;

  /* Output variables */
  @Output() mofCalender: EventEmitter<string> = new EventEmitter();
  @Output() navigateBack: EventEmitter<null> = new EventEmitter();

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.minDate = endOfMonth(new Date(this.minBillDate));
    this.maxDate = endOfMonth(new Date());
    this.datevalue = endOfMonth(new Date(this.selectedDate));
    this.billingForm = this.createBillDetailsForm();
    this.requiredPaymentByMOF =
      this.billDetails.totalContribution +
      this.billDetails.totalDebitAdjustment -
      this.billDetails.totalCreditAdjustment;
    if (
      this.billDetails.totalContribution + this.billDetails.totalDebitAdjustment >
      this.billDetails.totalCreditAdjustment
    )
      this.isDebit = true;
    else this.isDebit = false;
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.billDetails && changes.billDetails.currentValue) {
      const data = changes.billDetails.currentValue;
      this.getItemizedSummaryvalue(data);

      if (this.billDetails.initialBillStartDate !== undefined) {
        this.minDate = startOfMonth(moment(this.billDetails.initialBillStartDate.gregorian).toDate());
      }
      this.getMinMonth(this.minDate);
    }
    if (this.monthDifference > 12) {
      this.minDate = startOfMonth(subtractYears(new Date(), 1));
    } else if (this.billDetails.initialBillStartDate !== undefined) {
      this.minDate = startOfMonth(moment(this.billDetails.initialBillStartDate.gregorian).toDate());
    }
    if (changes?.currencyType?.currentValue) {
      this.currencyType = changes.currencyType.currentValue;
      this.exchangeRate = changes.exchangeRate.currentValue;
    }
    // this.billingForm = this.createBillDetailsForm();
  }
  getItemizedSummaryvalue(billDetails: BillDetails) {
    this.billDetails = billDetails;
    this.requiredPaymentByMOF =
      this.billDetails.totalContribution +
      this.billDetails.totalDebitAdjustment -
      this.billDetails.totalCreditAdjustment;
    if (
      this.billDetails.totalContribution + this.billDetails.totalDebitAdjustment >
      this.billDetails.totalCreditAdjustment
    )
      this.isDebit = true;
    else this.isDebit = false;
  }

  createBillDetailsForm() {
    return this.fb.group({
      month: this.fb.group({
        gregorian: [this.datevalue],
        hijiri: ['']
      })
    });
  }

  /** This method is to get the bill summary based on start date */
  mofDatePicker(dateValue: string) {
    this.mofCalender.emit(moment(dateValue).toDate().toString());
  }

  /**
   * Method to get number of month from a given date
   * @param date date
   */
  getMinMonth(minDate: Date) {
    this.monthDifference = monthDiff(minDate, new Date());
  }
  navigateBackToDetailedBill() {
    this.router.navigate([BillingConstants.ROUTE_DETAILED_BILL_MOF], {
      queryParams: {
        monthSelected: convertToYYYYMMDD(this.selectedDate),
        billStartDate: this.initialStartDate,
        initialStartDate: convertToYYYYMMDD(moment(this.billDetails.initialBillStartDate.gregorian).toDate().toString())
      }
    });
  }
}
