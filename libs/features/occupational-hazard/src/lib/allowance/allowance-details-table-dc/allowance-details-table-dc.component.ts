/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ApplicationTypeEnum, ApplicationTypeToken, GosiCalendar, LanguageToken, DocumentItem } from '@gosi-ui/core';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { CompanionDetails } from '../../shared';
import { AllowanceWrapper } from '../../shared/models/allowance-details';
import { AuditRejectAllowanceDetails } from '../../shared/models/audit-reject-details';

@Component({
  selector: 'oh-allowance-details-table-dc',
  templateUrl: './allowance-details-table-dc.component.html',
  styleUrls: ['./allowance-details-table-dc.component.scss']
})
export class AllowanceDetailsTableDcComponent implements OnInit, OnChanges {
  /**
   * Local variables
   */
  allowanceList: AllowanceWrapper;
  lang = 'en';
  class = 'arrow-down-reg';
  currentPage = 1;
  itemsPerPages = 6;
  color: string;
  selectedindex: number;
  currentSortColumn = '';
  currentSortDirection = 'ASC';
  icon = 'chevron-down';
  itemsPerPage = 5;
  showBox: boolean;
  daysDifference: number;
  isAppPrivate = false;
  type: string;
  /*Input Events*/
  @Input() socialInsuranceNo: number;
  @Input() registrationNumber: number;
  @Input() documents: DocumentItem[] = [];
  @Input() companionDetails: CompanionDetails;
  @Input() injuryId: number;
  @Input() allowanceDetails: AllowanceWrapper;
  @Input() rejectedList: AuditRejectAllowanceDetails[];
  @Output() open: EventEmitter<Object> = new EventEmitter();
  @Output() sortAllowances: EventEmitter<Object> = new EventEmitter();
  @Input() workDisabilityDate: GosiCalendar;
  @Input() pageDetails = {
    currentPage: 1,
    goToPage: '1'
  };

  @Output() selectPageNo: EventEmitter<number> = new EventEmitter();
  /**
   * Creating Instance
   */
  constructor(
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {}

  /**
   * This method is to detect changes in input component
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.allowanceDetails) {
      this.allowanceDetails = changes.allowanceDetails.currentValue;
      if (this.allowanceDetails) {
        this.allowanceDetails.allowances.forEach(element => {
          element.icon = 'chevron-down';
        });
      }
    }
    if (changes && changes.companionDetails) {
      this.companionDetails = changes.companionDetails.currentValue;
    }
    if (changes && changes.workDisabilityDate) {
      this.workDisabilityDate = changes.workDisabilityDate.currentValue;
    }
    if (changes && changes.rejectedList) {
      this.rejectedList = changes.rejectedList.currentValue;
      if (this.rejectedList && this.rejectedList) {
        this.rejectedList.reduce((acc, val) => {
          if (val.rejectionRequestDate) {
            if (acc && !acc.find(el => el.rejectionRequestDate.hijiri === val.rejectionRequestDate.hijiri)) {
              const rejectedList = {
                id: undefined,
                startDate: val.rejectionRequestDate,
                endDate: null,
                allowanceType: val.allowanceType,
                type: undefined,
                treatmentType: undefined,
                recoveryMethod: undefined,
                totalAllowance: undefined,
                injuryIdList: undefined,
                totalAmount: undefined,
                amount: undefined,
                accountNumber: undefined,
                actualPaymentStatus: undefined,
                paymentStatus: undefined,
                paymentMethod: undefined,
                paymentDate: undefined,
                differenceInDays: undefined,
                isRejected: true,
                claimId: undefined,
                claimsPayee: undefined,
                allowancePayee: undefined,
                payableTo: undefined,
                contributorWage: undefined,
                calculationWrapper: undefined,
                transactionId: val.claimId,
                companionDetails: undefined,
                benefitStartDate: undefined,
                benefitEndDate: undefined,
                simisAllowance: undefined,
                day: [],
                recoveryAppliedOn: val.recoveryAppliedOn,
                payeeDetails: {
                  payableTo: undefined,
                  payeeId: undefined,
                  payeeName: undefined
                }
              };
              if (this.allowanceDetails?.allowances) {
                this.allowanceDetails.allowances.splice(0, 0, rejectedList);
              } else {
                this.allowanceDetails.allowances.push(rejectedList);
              }
              acc.push(val);
            }
            return acc;
          }
        }, []);
      }
    }
  }
  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      this.isAppPrivate = true;
    }
  }

  /*Method to handle Toggle icon in table*/
  toggleFunction(index, icon, type, disabled) {
    if (!disabled) {
      this.selectedindex = index;
      this.type = type;
      this.allowanceDetails.allowances[index].showBox = !this.allowanceDetails.allowances[index].showBox;
      if (icon === 'chevron-down') {
        this.allowanceDetails.allowances[index].icon = 'chevron-up';
        this.class = 'arrow-up-reg';
      } else {
        this.allowanceDetails.allowances[index].icon = 'chevron-down';
        this.class = 'arrow-down-reg';
      }
    }
  }
  getColor(transactionStatus) {
    switch (transactionStatus.english) {
      case 'Paid':
        {
          this.color = 'green';
        }
        break;
      case 'Approved':
        {
          this.color = 'green';
        }
        break;
      case 'Under Review':
      case 'Case under review':
      case 'Pending':
      case 'Returned':
      case 'Returned2':
      case 'On Hold':
      case 'Payment Returned':
      case 'Bank Account verification in progress':
      case 'Awaiting parent claim approval':
      case 'Recovery in Progress':
        {
          this.color = 'orange';
        }
        break;
      case 'Cancelled':
        {
          this.color = 'grey';
        }
        break;
      case 'Rejected':
      case 'Invalid Wage':
      case 'Case rejected':
      case 'Overlapped':
        {
          this.color = 'red';
        }
        break;
      case 'Recovered':
        {
          this.color = 'red';
        }
        break;
    }
    return this.color;
  }

  /**
   * This method is for finding number of days under treatment
   */
  getDaysDifference(startDate, endDate) {
    const startDates = moment(startDate.gregorian);
    const endDates = moment(endDate.gregorian);
    this.daysDifference = endDates.diff(startDates, 'days');
    return this.daysDifference + 1;
  }
  /**
   *
   * @param page method to trigger the page select event
   */
  selectPage(page: number): void {
    if (this.pageDetails.currentPage !== page) {
      this.showBox = false;
      this.icon = 'chevron-down';
      this.class = 'arrow-down-reg';
      this.pageDetails.currentPage = this.currentPage = page;
      this.selectPageNo.emit(this.currentPage - 1);
    }
  }
  getAmount(date) {
    let amount = 0;
    this.rejectedList.forEach(element => {
      if (element?.rejectionRequestDate?.hijiri === date) {
        amount = amount + element.rejectedAllowance;
      }
    });
    return amount.toFixed(2);
  }
  getStatus(date) {
    let recovered = true;
    this.rejectedList.forEach(element => {
      if (element?.rejectionRequestDate?.hijiri === date) {
        if (element.status.english !== 'Recovered') {
          recovered = false;
        }
      }
    });
    if (recovered) {
      return 'OCCUPATIONAL-HAZARD.RECOVERED';
    } else {
      return 'OCCUPATIONAL-HAZARD.RECOVERED-IN-PROGRESS';
    }
  }
  /**
   * Method to sort by allowance period
   */
  sort() {
    this.sortAllowances.emit();
  }
}
