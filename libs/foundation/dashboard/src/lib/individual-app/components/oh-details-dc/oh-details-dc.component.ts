import { Component, HostListener, Input, OnChanges, OnInit, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BilingualText, RoleIdEnum, statusBadgeType } from '@gosi-ui/core';
import { dayDifference } from '@gosi-ui/core/lib/utils/date';
import { EngagementDetails, OHResponse, Treatments, InjuryHistoryData } from '../../models';
import { InjuryHistory } from '@gosi-ui/features/occupational-hazard/lib/shared/models/injury-history';
import { InjuryStatus, OhService, RouteConstants } from '@gosi-ui/features/occupational-hazard/lib/shared';

@Component({
  selector: 'dsb-oh-details-dc',
  templateUrl: './oh-details-dc.component.html',
  styleUrls: ['./oh-details-dc.component.scss']
})
export class OhDetailsDcComponent implements OnInit, OnChanges {
  length = 1;
  @Input() lang: string;
  @Input() ohResponse: OHResponse;
  @Input() engagementDetails: EngagementDetails[];
  @Input() isAppProfile = false;
  @Input() isAppIndividual = false;
  @Input() identifier: number;
  @Input() hideButtonForPpa = false;
  @Output() selectedComplication: EventEmitter<InjuryHistory> = new EventEmitter();
  @Output() navigateToAddInjury: EventEmitter<null> = new EventEmitter();
  injuryHistoryList: InjuryHistoryData[] = [];
  injuryHistoryCarouselList: InjuryHistoryData[] = [];
  treatmentList: Treatments[];
  numberofDays: number;
  currentIndex: number;
  showLeft: boolean;
  showCarouselLeft: boolean;
  showCarouselRight: boolean;
  showRight: boolean;
  width: number;
  mobileView = false;
  prevCardCount: number = 0;
  cardCount: number;
  color: string;
  type: any;
  minHeight = '13rem';
  roleValidation = [];
  registrationNo: number;
  hideInjuryCard: boolean;
  actualStatus: BilingualText;
  benefitPresent: boolean;
  constructor(readonly ohService: OhService, private router: Router) {}
  @HostListener('window:resize', ['$event'])
  onWIndowReSize() {
    this.width = window.innerWidth;
    this.prevCardCount = this.cardCount;
    if (this.width < 972) {
      this.cardCount = 1;
      if (this.prevCardCount != this.cardCount) {
        this.redrawCarousal();
      }
    } else {
      if (this.width < 1326) {
        this.cardCount = 2;
        if (this.prevCardCount != this.cardCount) {
          this.redrawCarousal();
        }
        setTimeout(() => {
          this.mobileView = true;
          this.showRight = this.currentIndex < this.injuryHistoryList?.length - 1 ? true : false;
        }, 1000);
      } else {
        this.cardCount = this.isAppIndividual ? 3 : 2;
        this.redrawCarousal();
        this.mobileView = false;
        this.showRight =
          (this.isAppProfile ? this.currentIndex + 1 : this.currentIndex + 2) < this.injuryHistoryList?.length - 1
            ? true
            : false;
      }
    }
  }
  ngOnInit(): void {
    this.roleValidation.push(RoleIdEnum.CSR);
    if(this.engagementDetails){
      this.engagementDetails.forEach((data:any)=>{
        this.type=data.engagementType
      });
    }   
    this.currentIndex = 0;
    this.showLeft = false;
    this.showCarouselLeft = false;
    this.cardCount = this.isAppIndividual ? 3 : 2;
    //this.createInjuryList(this.ohResponse);
    this.onWIndowReSize();
  }
  ngOnChanges(changes: SimpleChanges) {
    this.onWIndowReSize();
    if (changes && changes.ohResponse && changes.ohResponse.currentValue) {
      this.ohResponse.injuryHistory.forEach(val => {
        this.treatmentList = val.treatments;
        // val.treatments.forEach(treatment => {
        this.numberofDays = dayDifference(
          this.treatmentList[0]?.startDate.gregorian,
          this.treatmentList[this.treatmentList?.length - 1]?.endDate.gregorian
        );
        val.numberofDays = this.numberofDays;
        val.trtmentStartDate = this.treatmentList[0]?.startDate;
        val.trtmentEndDate = this.treatmentList[this.treatmentList?.length - 1]?.endDate;
        // });
      });
      this.showRight =
        (this.isAppProfile ? this.currentIndex + 1 : this.currentIndex + 2) < this.injuryHistoryList?.length - 1
          ? true
          : false;
      this.createInjuryList(this.ohResponse);

      this.injuryHistoryCarouselList = this.injuryHistoryList.slice(0, this.cardCount);
      this.showCarouselRight = this.injuryHistoryList.length > this.cardCount ? true : false;
    }
    if (changes && changes?.engagementDetails && changes?.engagementDetails?.currentValue) {
      this.engagementDetails = changes?.engagementDetails?.currentValue;
      this.engagementDetails.forEach((data: any) => {
        this.type = data.engagementType;
      });
    }
  }
  createInjuryList(ohResponse: OHResponse) {
    ohResponse.injuryHistory.forEach(injury => {
      injury.isComplication = false;
      this.actualStatus = injury.actualStatus;
      this.benefitPresent = injury.benefitPresent;
      if (
        (this.actualStatus.english === InjuryStatus.CURED_WITH_DISABILITY ||
          this.actualStatus.english === InjuryStatus.RESULTED_IN_DEATH) &&
        this.benefitPresent === true
      ) {
        this.hideInjuryCard = true;
      } else {
        this.hideInjuryCard = false;
      }
      if (!this.hideInjuryCard) {
        this.injuryHistoryList.push(injury);
      }
      if (injury?.complicationHistory) {
        injury.complicationHistory.forEach(complication => {
          complication.isComplication = true;
          complication.complicationsInjuryId = injury.injuryId;
          if (complication?.treatments) {
            this.treatmentList = complication?.treatments;
            // val.treatments.forEach(treatment => {
            this.numberofDays = dayDifference(
              this.treatmentList[0]?.startDate.gregorian,
              this.treatmentList[this.treatmentList?.length - 1]?.endDate.gregorian
            );
            complication.numberofDays = this.numberofDays;
            complication.trtmentStartDate = this.treatmentList[0]?.startDate;
            complication.trtmentEndDate = this.treatmentList[this.treatmentList?.length - 1]?.endDate;
          }
          this.injuryHistoryList.push(complication);
        });
      }
    });
  }
  navigateTo() {}
  navigateToOH(injury) {
    if (injury.isComplication) {
      this.selectedComplication.emit(injury);
      if (this.isAppProfile)
        this.router.navigate([
          `home/oh/view/${injury?.establishmentRegNo}/${this.identifier}/${injury?.injuryNo}/${injury?.injuryId}/complication/info`
        ]);
    } else {
      if (this.injuryHistoryList?.length === 1) {
        if (this.isAppProfile)
          this.router.navigate([
            `home/oh/view/${injury?.establishmentRegNo}/${this.identifier}/${injury?.injuryId}/injury/info`
          ]);
        else this.router.navigate(['/home/oh/injury/history']);
      } else {
        this.router.navigate(
          [`home/oh/view/${injury?.establishmentRegNo}/${this.identifier}/${injury?.injuryId}/injury/info`],
          {
            queryParams: {
              fromDashboard: !this.isAppProfile ? true : null
            }
          }
        );
      }
    }
  }
  navigateToReportOH() {
    this.ohService.setSocialInsuranceNo(this.identifier);
    this.ohService.setInjuryId(null);
    this.registrationNo = this.ohService.getRegistrationNumber();
    this.ohService.setRegistrationNo(this.registrationNo);
    this.router.navigate([RouteConstants.ROUTE_INJURY_ADD]);
    // this.navigateToAddInjury.emit();
  }

  onLeftClick() {
    if (this.mobileView) {
      this.currentIndex = this.currentIndex - 1;

      this.showLeft = this.currentIndex > 0 ? true : false;

      this.showRight = this.currentIndex < this.injuryHistoryList?.length - 1 ? true : false;
    } else {
      this.currentIndex = this.isAppProfile ? this.currentIndex - 2 : this.currentIndex - 3;

      this.showLeft = this.currentIndex > 0 ? true : false;

      this.showRight =
        (this.isAppProfile ? this.currentIndex + 1 : this.currentIndex + 2) < this.injuryHistoryList?.length - 1
          ? true
          : false;
    }
  }

  onRightClick() {
    if (this.mobileView) {
      this.currentIndex = this.currentIndex + 1;

      this.showLeft = this.currentIndex > 0 ? true : false;

      this.showRight = this.currentIndex < this.injuryHistoryList?.length - 1 ? true : false;
    } else {
      this.currentIndex = this.isAppProfile ? this.currentIndex + 2 : this.currentIndex + 3;

      this.showLeft = this.isAppProfile
        ? this.currentIndex - 1 > 0
          ? true
          : false
        : this.currentIndex - 2 > 0
        ? true
        : false;

      this.showRight =
        (this.isAppProfile ? this.currentIndex + 1 : this.currentIndex + 2) < this.injuryHistoryList?.length - 1
          ? true
          : false;
    }
  }
  onCarouselLeftClick() {
    this.currentIndex -= this.cardCount;
    if (this.currentIndex == 0) {
      this.showCarouselLeft = false;
    } else {
      this.showCarouselLeft = true;
    }
    this.injuryHistoryCarouselList = [];
    this.injuryHistoryCarouselList = this.injuryHistoryList?.slice(
      this.currentIndex,
      this.currentIndex + this.cardCount
    );
    if (
      this.injuryHistoryCarouselList?.length !== this.cardCount ||
      this.injuryHistoryList?.length - this.cardCount == this.currentIndex
    ) {
      this.showCarouselRight = false;
    } else {
      this.showCarouselRight = true;
    }
  }
  onCarouselRightClick() {
    this.currentIndex += this.cardCount;
    if (this.currentIndex == 0) {
      this.showCarouselLeft = false;
    } else {
      this.showCarouselLeft = true;
    }
    this.injuryHistoryCarouselList = [];
    this.injuryHistoryCarouselList = this.injuryHistoryList?.slice(
      this.currentIndex,
      this.currentIndex + this.cardCount
    );
    if (
      this.injuryHistoryCarouselList?.length !== this.cardCount ||
      this.injuryHistoryList?.length - this.cardCount == this.currentIndex
    ) {
      this.showCarouselRight = false;
    } else {
      this.showCarouselRight = true;
    }
  }
  redrawCarousal() {
    this.currentIndex = 0;
    if (this.currentIndex == 0) {
      this.showCarouselLeft = false;
    } else {
      this.showCarouselLeft = true;
    }
    this.injuryHistoryCarouselList = [];
    this.injuryHistoryCarouselList = this.injuryHistoryList?.slice(
      this.currentIndex,
      this.currentIndex + this.cardCount
    );
    if (
      this.injuryHistoryCarouselList?.length !== this.cardCount ||
      this.injuryHistoryList?.length - this.cardCount == this.currentIndex
    ) {
      this.showCarouselRight = false;
    } else {
      this.showCarouselRight = true;
    }
  }
  /**
   *
   * @param status method to set status
   */
  statusBadge(status: BilingualText) {
    return statusBadgeType(status.english);
  }
  getColor(status) {
    switch (status.english) {
      case 'Approved':
        {
          this.color = 'green';
        }
        break;
      case 'In Progress':
        {
          this.color = 'orange';
        }
        break;
      case 'In progress':
        {
          this.color = 'orange';
        }
        break;
      case 'Pending':
        {
          this.color = 'orange';
        }
        break;
      case 'Cancelled':
      case 'Cancelled By System':
      case 'Cured With Disability':
      case 'Cured Without Disability':
      case 'Closed without continuing treatment':
      case 'Closed':
      case 'Resulted in Death':
        {
          this.color = 'grey';
        }
        break;
      case 'Rejected':
        {
          this.color = 'red';
        }
        break;
    }
    return this.color;
  }
}
