/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { LanguageToken } from '@gosi-ui/core';
import moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { Allowance } from '../../models/allowance-wrapper';
import { AuditRejectAllowanceDetails } from '../../models/audit-reject-details';
import { RejectedAllowance } from '../../models/rejected-allowance';
import { RejectedAllowancesList } from '../../models/rejected-allowances-list';

@Component({
  selector: 'oh-rejection-additional-details-dc',
  templateUrl: './rejection-additional-details-dc.component.html',
  styleUrls: ['./rejection-additional-details-dc.component.scss']
})
export class RejectionAdditionalDetailsDcComponent implements OnInit, OnChanges {
  constructor(@Inject(LanguageToken) private language: BehaviorSubject<string>) {}
  lang = 'en';
  rejectionDetails: RejectedAllowance[] = [];
  rejectionDetailsList: RejectedAllowancesList[];
  details;
  isDateClubbed = false;
  rejectedListClubbed: AuditRejectAllowanceDetails[] = [];
  @Input() rejectedList: AuditRejectAllowanceDetails[];
  @Input() detailsClubbed: Allowance;
  ngOnInit(): void {
    this.language.subscribe(lang => (this.lang = lang));
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.detailsClubbed) {
      this.detailsClubbed = changes.detailsClubbed.currentValue;
    }
    if (changes && changes.rejectedList) {
      this.rejectedList = changes.rejectedList.currentValue;
    }
    if (this.detailsClubbed && this.rejectedList) {
      this.rejectedList.forEach(element => {
        if (this.detailsClubbed?.startDate?.hijiri === element?.rejectionRequestDate?.hijiri) {
          this.getRejectedValues();
        }
      });
    }
  }
  getRejectedValues() {
    if (!this.isDateClubbed) {
      this.rejectedList.reduce((acc, val) => {
        if (
          acc &&
          !acc.find(
            el =>
              el?.rejectedAllowanceDates?.startDate?.hijiri === val?.rejectedAllowanceDates?.startDate?.hijiri &&
              el?.rejectedAllowanceDates?.endDate?.hijiri === val?.rejectedAllowanceDates?.endDate?.hijiri
          )
        ) {
          this.details = {
            transactionId: val.claimId,
            rejectionReason: val.rejectionReason,
            rejectedPeriod: {
              startDate: val.rejectedAllowanceDates.startDate,
              endDate: val.rejectedAllowanceDates.endDate
            },
            comments: val.comments,
            rejectionDetails: [],
            recoveryAppliedOn: val.recoveryAppliedOn,
            rejectedRequestDate: val.rejectionRequestDate
          };
          if (val.rejectionRequestDate.hijiri === this.detailsClubbed.startDate.hijiri) {
            this.rejectedListClubbed.push(val);
            this.rejectionDetails.push(this.details);
          }
          acc.push(val);
        }
        return acc;
      }, []);
      this.rejectedListClubbed.forEach((element, index) => {
        this.rejectedList.forEach(item => {
          if (
            element?.rejectedAllowanceDates?.startDate?.hijiri === item?.rejectedAllowanceDates?.startDate?.hijiri &&
            element?.rejectedAllowanceDates?.endDate?.hijiri === item?.rejectedAllowanceDates?.endDate?.hijiri
          ) {
            if (item.rejectionRequestDate.hijiri === this.detailsClubbed.startDate.hijiri) {
              const value = {
                allowanceType: item.allowanceType,
                treatmentType: item.allowanceSubType,
                amount: item.rejectedAllowance,
                visits: item.rejectedVisits,
                total: 0,
                distance: item.rejectedDistance
              };
              this.rejectionDetails[index]?.rejectionDetails.push(value);
            }
          }
        });
      });
      const dateLength = this.rejectedListClubbed.length;

      this.rejectionDetails?.reduce((acc, val) => {
        if (
          acc &&
          acc.find(
            el =>
              el?.rejectedPeriod?.startDate?.hijiri === val?.rejectedPeriod?.startDate?.hijiri &&
              el?.rejectedPeriod?.endDate?.hijiri === val?.rejectedPeriod?.endDate?.hijiri &&
              el.rejectionReason.english !== val.rejectionReason.english
          )
        ) {
          this.details = {
            transactionId: val.transactionId,
            rejectionReason: val.rejectionReason,
            rejectedPeriod: {
              startDate: val.rejectedPeriod.startDate,
              endDate: val.rejectedPeriod.endDate
            },
            comments: val.comments,
            rejectionDetails: [],
            recoveryAppliedOn: val.recoveryAppliedOn,
            rejectedRequestDate: val.rejectedRequestDate
          };
          const rejectionDetails = this.rejectedList.filter(res => res.claimId === val.transactionId);
          if (rejectionDetails[0].rejectionRequestDate.hijiri === this.detailsClubbed.startDate.hijiri) {
            this.rejectedListClubbed.push(rejectionDetails[0]);
            this.rejectionDetails.push(this.details);
          }
          acc.push(val);
        }
        return acc;
      }, []);
      const reasonLength = this.rejectedListClubbed.length;
      if (reasonLength > dateLength) {
        this.rejectedListClubbed.forEach((element, index) => {
          if (index === dateLength - 1) {
            this.rejectedList.forEach(item => {
              if (
                element?.rejectedAllowanceDates?.startDate?.hijiri ===
                  item?.rejectedAllowanceDates?.startDate?.hijiri &&
                element?.rejectedAllowanceDates?.endDate?.hijiri === item?.rejectedAllowanceDates?.endDate?.hijiri &&
                element.rejectionReason.english === item.rejectionReason.english
              ) {
                if (item.rejectionRequestDate.hijiri === this.detailsClubbed.startDate.hijiri) {
                  const value = {
                    allowanceType: item.allowanceType,
                    treatmentType: item.allowanceSubType,
                    amount: item.rejectedAllowance,
                    visits: item.rejectedVisits,
                    total: 0,
                    distance: item.rejectedDistance
                  };
                  this.rejectionDetails[index]?.rejectionDetails.push(value);
                }
              }
            });
          }
        });
      }

      this.isDateClubbed = true;
    }
  }
  getDays(startDate, endDate) {
    const started = moment(startDate);
    const ended = moment(endDate);
    return ended.diff(started, 'days') + 1;
  }
  getTotal(item) {
    let total = 0;
    item.rejectionDetails.forEach(element => {
      total = total + element.amount;
    });
    return total.toFixed(2);
  }
  getType(treatmentType, allowanceType) {
    if (
      treatmentType.english.toLowerCase().includes('inpatient') ||
      treatmentType.english.toLowerCase().includes('outpatient')
    ) {
      return allowanceType;
    } else {
      return treatmentType;
    }
  }
  getSubType(treatmentType) {
    if (treatmentType.english.toLowerCase().includes('inpatient')) {
      return 'inpatient';
    } else if (treatmentType.english.toLowerCase().includes('outpatient')) {
      return 'outpatient';
    }
  }
}
