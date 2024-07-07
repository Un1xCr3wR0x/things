import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import {
  BilingualText,
  BPMResponse,
  GosiCalendar,
  isIqamaNumber,
  Person,
  BPMTask,
  AuthTokenService,
  AlertService
} from '@gosi-ui/core';
import { EngagementDetails, PersonDetails, SearchEngagementValues } from '../../models';
import { Contributor, ContributorService } from '@gosi-ui/features/contributor/lib/shared';

@Component({
  selector: 'dsb-contributor-details-dc',
  templateUrl: './contributor-details-dc.component.html',
  styleUrls: ['./contributor-details-dc.component.scss']
})
export class ContributorDetailsDcComponent implements OnInit, OnChanges {
  name: BilingualText = new BilingualText();
  noOfMonths = 0;
  mobileView: boolean;
  noOfDays = 0;
  width: number;
  totalDays: number;
  totalMonths: number;
  firstEmployment: GosiCalendar = new GosiCalendar();
  sin: number;
  latestEmployment: GosiCalendar = new GosiCalendar();
  isIqama: boolean;
  @Input() contributorResponse: Person;
  @Input() personDetails: PersonDetails;
  @Input() engagementDetails: EngagementDetails[];
  @Input() lang: string;
  @Input() identifier: number;
  @Input() engagementList: SearchEngagementValues;
  @Input() overallEngagements: EngagementDetails[];
  @Input() roleArray: [];
  @Input() inboxtaskCount: number;
  @Input() bpmTask: BPMResponse;
  @Output() navigate: EventEmitter<null> = new EventEmitter();
  @Output() navigateToView: EventEmitter<BPMTask> = new EventEmitter();

  individualId: number;
  userDetails: Contributor;

  // Set all the user types that will be shows in user roles part
  userTypesArray: string[] = ['contributor', 'beneficiary', 'vic'];

  // Flags of the user role status
  isContributorActive: boolean;
  isBeneficiaryActive: boolean;
  isVICActive: boolean;
  hasVICEngagement: boolean;

  /**
   ** @param authTokenService
   ** @param contributorService
   ** @param alertService
   */
  constructor(
    readonly authTokenService: AuthTokenService,
    readonly contributorService: ContributorService,
    readonly alertService: AlertService
  ) {}

  ngOnInit() {
    this.name.arabic = 'نظام لال دين';
    this.name.english = 'NAJEY HAMAD A ALJAME';
    this.onWindowResize();

    // Get the user Id from auth Service and use it in getUserStatus to set the user roles
    this.individualId = this.authTokenService.getIndividual();
    this.getUserStatus(this.individualId);
  }

  getUserStatus(individualId: number) {
    this.contributorService.getUserStatus(individualId).subscribe(
      res => {
        this.userDetails = res;
        this.setUserflags(res);
      },
      error => {
        this.alertService.showError(error.error.message);
      }
    );
  }

  setUserflags(userDetails: Contributor) {
    // Set the contributor active flag
    this.isContributorActive = userDetails.hasNonVICEngagement ? (userDetails.hasLiveEngagement ? true : false) : false;
    // Set the beneficiary active flag
    this.isBeneficiaryActive = userDetails.isBeneficiary ? true : false;
    // Set the VIC active flag
    this.isVICActive = userDetails.hasVICEngagement
      ? userDetails.hasLiveEngagement
        ? userDetails.vicIndicator
          ? true
          : false
        : false
      : false;
    // Set flag to check if user has any VIC engagement or not
    this.hasVICEngagement = userDetails.hasVICEngagement ? true : false;
  }

  showRole(userType: string) {
    switch (userType) {
      case 'contributor':
        return true;
      case 'beneficiary':
        return this.isBeneficiaryActive ? true : false;
      case 'vic':
        return this.hasVICEngagement ? true : false;
    }
  }

  getClassName(userType: string) {
    switch (userType) {
      case 'contributor':
        return this.isContributorActive ? '' : 'inactive';
      case 'beneficiary':
        return this.isBeneficiaryActive ? '' : 'inactive';
      case 'vic':
        return this.isVICActive ? '' : 'inactive';
    }
  }

  getUserTypeName(userType: string) {
    switch (userType) {
      case 'contributor':
        return 'DASHBOARD.SUBSCRIBER';
      case 'beneficiary':
        return 'DASHBOARD.BENEFICIARY';
      case 'vic':
        return 'DASHBOARD.VIC';
    }
  }

  isActive(userType: string) {
    switch (userType) {
      case 'contributor':
        return this.isContributorActive ? true : false;
      case 'beneficiary':
        return this.isBeneficiaryActive ? true : false;
      case 'vic':
        return this.isVICActive ? true : false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.width = window.innerWidth;
    if (this.width < 1041) {
      this.mobileView = true;
    } else this.mobileView = false;
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.engagementDetails && changes.engagementDetails.currentValue) {
      this.engagementDetails = changes.engagementDetails.currentValue;
      this.setContributorDetails();
    }
    if (changes.personDetails && changes.personDetails.currentValue) {
      this.personDetails = changes.personDetails.currentValue;
    }
    if (changes.bpmTask && changes.bpmTask.currentValue) {
      this.bpmTask = changes.bpmTask.currentValue;
    }
    if (changes.overallEngagements && changes.overallEngagements.currentValue) {
      this.overallEngagements = changes.overallEngagements.currentValue;
      this.overallEngagements.reverse();
      this.firstEmployment =
        this.overallEngagements[0]?.status !== 'CANCELLED'
          ? this.overallEngagements[0]?.joiningDate
          : this.getNextAvailableJoiningDate();
      this.setContributorDetails();
    }
    if (changes && changes.engagementList && changes.engagementList.currentValue) {
      this.totalMonths =
        this.engagementList?.totalContributionDays / 30 +
        this.engagementList?.totalRPAContributionMonths +
        this.engagementList?.totalVicContributionDays / 30;
      this.noOfMonths = Math.floor(this.totalMonths);
      this.noOfDays =
        (this.engagementList?.totalContributionDays % 30) + (+this.engagementList?.totalVicContributionDays % 30);
    }
    if (changes.identifier && changes.identifier.currentValue) {
      this.identifier = changes.identifier.currentValue;
      if (isIqamaNumber(this.identifier.toString()) === true) {
        this.isIqama = true;
      } else this.isIqama = false;
    }
  }
  setContributorDetails() {
    this.sin = this.engagementDetails[0]?.socialInsuranceNo;
    if (!this.sin) {
      this.sin = this.overallEngagements[0]?.socialInsuranceNo;
    }
  }
  getNextAvailableJoiningDate() {
    let i: number;
    for (i = 1; i < this.overallEngagements.length; i++) {
      if (this.overallEngagements[i].status !== 'CANCELLED') {
        return this.overallEngagements[i]?.joiningDate;
      }
    }
  }
  navigateToInbox() {
    this.navigate.emit();
  }
  navigateToInboxItem(task: BPMTask) {
    this.navigateToView.emit(task);
  }
}
