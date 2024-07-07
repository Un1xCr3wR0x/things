/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { ApplicationTypeEnum, ApplicationTypeToken, GosiCalendar, LanguageToken, DocumentItem } from '@gosi-ui/core';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { ComplicationConstants } from '../../shared';
import { AllowanceWrapper } from '../../shared/models/allowance-details';
import { Allowance } from '../../shared/models/allowance-wrapper';
import { AuditRejectAllowanceDetails } from '../../shared/models/audit-reject-details';

@Component({
  selector: 'oh-allowance-details-timeline-dc',
  templateUrl: './allowance-details-timeline-dc.component.html',
  styleUrls: ['./allowance-details-timeline-dc.component.scss']
})
export class AllowanceDetailsTimelineDcComponent implements OnInit, OnChanges, AfterViewInit {
  /**
   * Local variables
   */
  accordionPanel = 0;
  lang = 'en';
  isAdded = false;
  daysDifference: number;
  isAppPrivate = false;
  isRejected = false;
  detailsClubbed: Allowance[] = [];
  treatmentTypeClubbed: Allowance[] = [];
  rejectdetailsClubbed: AuditRejectAllowanceDetails[] = [];
  showError = true;
  currentPage = 0;
  pageLimit = ComplicationConstants.PAGE_LIMIT_LOAD;
  pageTotal: number;
  allowanceDetailList: Allowance[] = [];

  /**
   * Input variables
   */
  @Input() socialInsuranceNo: number;
  @Input() documents: DocumentItem[] = [];
  @Input() allowanceDetails: AllowanceWrapper;
  @Input() allowanceList: Allowance[];
  @Input() rejectedList: AuditRejectAllowanceDetails[];
  @Input() registrationNumber: number;
  @Input() injuryId: number;
  @Input() workDisabilityDate: GosiCalendar;
  @Output() loadMore: EventEmitter<object> = new EventEmitter();

  /**
   * Creating Instance
   */

  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    private cdRef: ChangeDetectorRef
  ) {}
  /**
   * This method is for initialization tasks
   */
  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      this.isAppPrivate = true;
    }
  }

  /**
   * This method is to detect changes in input component
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.workDisabilityDate) {
      this.workDisabilityDate = changes.workDisabilityDate.currentValue;
    }
    if (changes && changes.allowanceList) {
      this.allowanceList = changes.allowanceList.currentValue;
      this.ngAfterViewInit();
    }
    if (changes && changes.injuryId) {
      this.injuryId = changes.injuryId.currentValue;
    }
    if (changes && changes.allowanceDetails) {
      /*Method to Eliminate duplicates in an array*/
      this.allowanceDetails = changes.allowanceDetails.currentValue;
      this.pageTotal = this.allowanceDetails.totalCount;
    }
    if (changes && changes.rejectedList) {
      this.rejectedList = changes.rejectedList.currentValue;
      this.rejectedListChanges();
    }
  }
  /**
   * This method is for finding number of days under treatment
   */
  getTreatmentDaysDifference(startDate, endDate) {
    const startDates = moment(startDate.gregorian);
    const endDates = moment(endDate.gregorian);
    this.daysDifference = endDates.diff(startDates, 'days');
    return this.daysDifference + 1;
  }
  /**
   *
   * @param loadmoreObj Load more event
   */
  onLoadMore(loadmoreObj) {
    this.currentPage = loadmoreObj.currentPage;
    this.loadMore.emit(loadmoreObj);
  }
  rejectedListChanges() {
    if (this.rejectedList && this.rejectedList?.length > 0) {
      this.rejectedList?.reduce((acc, val) => {
        if (val.rejectionRequestDate) {
          if (acc && !acc?.find(el => el.rejectionRequestDate.hijiri === val.rejectionRequestDate.hijiri)) {
            const rejectedList = {
              id: undefined,
              startDate: val.rejectionRequestDate,
              endDate: null,
              allowanceType: val.allowanceType,
              type: undefined,
              paymentStatus: undefined,
              paymentMethod: undefined,
              paymentDate: undefined,
              differenceInDays: undefined,
              injuryIdList: undefined,
              totalAmount: undefined,
              amount: undefined,
              accountNumber: undefined,
              isRejected: true,
              claimId: undefined,
              claimsPayee: undefined,
              allowancePayee: undefined,
              payableTo: undefined,
              contributorWage: undefined,
              calculationWrapper: undefined,
              treatmentType: undefined,
              recoveryMethod: undefined,
              totalAllowance: undefined,
              actualPaymentStatus: undefined,
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
            if (this.detailsClubbed) {
              this.detailsClubbed.splice(0, 0, rejectedList);
            } else {
              this.detailsClubbed.push(rejectedList);
            }

            this.isRejected = true;
            acc.push(val);
          }
          return acc;
        }
      }, []);
    }
    this.treatmentTypeClubbed = this.allowanceList?.reduce((acc, val) => {
      if (
        val.startDate?.hijiri &&
        val.endDate?.hijiri &&
        (val?.allowanceType?.english === 'Reissue Allowance' || val?.treatmentType?.english)
      ) {
        if (
          acc &&
          !acc.find(
            el =>
              el?.startDate?.hijiri === val?.startDate?.hijiri &&
              el?.endDate?.hijiri === val?.endDate?.hijiri &&
              el.treatmentType?.english === val.treatmentType?.english
          )
        ) {
          acc.push(val);
        }
        return acc;
      }
    }, []);
  }
  /**
   * Updating values on load more
   */
  ngAfterViewInit() {
    if (this.allowanceList && this.allowanceList?.length > 0) {
      this.detailsClubbed = this.allowanceList?.reduce((acc, val) => {
        if (val.startDate?.hijiri && val.endDate?.hijiri) {
          if (
            acc &&
            !acc.find(
              el => el?.startDate?.hijiri === val?.startDate?.hijiri && el?.endDate?.hijiri === val?.endDate?.hijiri
            )
          ) {
            acc.push(val);
          }
          return acc;
        }
      }, []);
      if (this.rejectedList?.length > 0) {
        this.isAdded = true;
      }
    }
    this.rejectedListChanges();
    this.cdRef.detectChanges();
  }
}
