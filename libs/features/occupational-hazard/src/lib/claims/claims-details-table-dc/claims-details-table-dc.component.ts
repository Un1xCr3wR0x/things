/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ApplicationTypeEnum, ApplicationTypeToken, LanguageToken, GosiCalendar, DocumentItem } from '@gosi-ui/core';
import { CompanionDetails } from '../../shared';
import { BehaviorSubject } from 'rxjs';
import { ClaimsWrapper } from '../../shared/models/claims-details';
import { Claims } from '../../shared/models/claims-wrapper';
@Component({
  selector: 'oh-claims-details-table-dc',
  templateUrl: './claims-details-table-dc.component.html',
  styleUrls: ['./claims-details-table-dc.component.scss']
})
export class ClaimsDetailsTableDcComponent implements OnInit, OnChanges {
  /**
   * Local variables
   */
  claimsList: ClaimsWrapper;
  lang = 'en';
  class = 'arrow-down-reg';
  icon = 'chevron-down';
  color: string;
  selectedindex: number;
  currentSortColumn = '';
  itemsPerPage = 5;
  showBox: boolean;
  isAppPrivate = false;
  type: string;
  totalExpense = 0;

  /*Input Events*/
  @Input() socialInsuranceNo: number;
  @Input() claimsDetails: ClaimsWrapper;
  @Input() showNewClaims = true;
  @Input() companionDetails: CompanionDetails;
  @Input() registrationNumber: number;
  @Input() injuryId: number;
  @Input() workDisabilityDate: GosiCalendar;
  @Input() claimBreakUpList: Claims[];
  @Input() documents: DocumentItem[] = [];

  /*Output Events*/
  @Output() upload: EventEmitter<number> = new EventEmitter();
  @Output() open: EventEmitter<Object> = new EventEmitter();
  @Output() navigateToCtbtr: EventEmitter<null> = new EventEmitter();
  @Output() navigateToEst: EventEmitter<null> = new EventEmitter();
  /**
   * Creating Instance
   */
  constructor(
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {}

  ngOnInit(): void {
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      this.isAppPrivate = true;
    }
    this.language.subscribe(language => {
      this.lang = language;
    });
  }

  /**
   * This method is to detect changes in input component
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.claimsDetails) {
      this.claimsDetails = changes.claimsDetails.currentValue;
      if (this.claimsDetails) {
        this.claimsDetails.claims.forEach(element => {
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
  }

  getTotalClaims(claims: Claims) {
    if (claims) {
      if (this.claimBreakUpList) {
        this.totalExpense = 0;
        this.claimBreakUpList.forEach(element => {
          if (
            element.invoiceItemId === claims.invoiceItemId &&
            element.invoiceItemId &&
            element.actualPaymentStatus?.english === claims.actualPaymentStatus?.english
          ) {
            element?.expenses?.forEach(item => {
              this.totalExpense = this.totalExpense + item.amount;
            });
          } else if (
            claims.transactionId === element.transactionId &&
            (claims.claimType?.english === 'Total Disability Repatriation Expenses' ||
              claims.claimType?.english === 'Dead Body Repatriation Expenses' ||
              claims.claimType?.english === 'Companion Allowance' ||
              claims.claimType?.english === 'Companion Conveyance Allowance')
          ) {
            this.totalExpense = 0;
            claims?.expenses?.forEach(elements => {
              this.totalExpense = this.totalExpense + elements.amount;
            });
          }
        });
      }
    }
    if (this.totalExpense === 0) {
      return '-';
    } else {
      return this.totalExpense;
    }
  }
  uploadDocuments(event) {
    this.upload.emit(event);
  }

  /*Method to handle Toggle icon in table*/
  toggleFunction(index, icon, type, disabled) {
    if (!disabled) {
      this.selectedindex = index;
      this.type = type;
      this.claimsDetails.claims[index].showBox = !this.claimsDetails.claims[index].showBox;
      if (icon === 'chevron-down') {
        this.claimsDetails.claims[index].icon = 'chevron-up';
        this.class = 'arrow-up-reg';
      } else {
        this.claimsDetails.claims[index].icon = 'chevron-down';
        this.class = 'arrow-down-reg';
      }
    }
  }
  getColor(transactionStatus) {
    switch (transactionStatus.english) {
      case 'Under Review':
      case 'Recovery in Progress':
      case 'Draft':
      case 'Case under review':
      case 'Awaiting parent claim approval':
      case 'Pending':
      case 'Authorized Person update Pending':
      case 'Bank Account verification in progress':
      case 'Returned ':
      case 'On Hold':
      case 'Payment Returned':
      case 'Requested':
      case 'Received':
      case 'Under Processing':
      case 'Suspended':
        {
          this.color = 'orange';
        }
        break;
      case 'Paid':
      case 'Approved':
      case 'Partially Approved':
        {
          this.color = 'green';
        }
        break;
      case 'Approved':
        {
          this.color = 'green';
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
      case 'Denied':
        {
          this.color = 'red';
        }
        break;
      case 'Returned':
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

  navigateToContributor() {
    this.navigateToCtbtr.emit();
  }

  navigateToEstProfile() {
    this.navigateToEst.emit();
  }
}
