import { Component, HostListener, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {
  ContributorStatus,
  getPersonArabicName,
  getPersonEnglishName,
  IdentityTypeEnum,
  AuthTokenService,
  AlertService
} from '@gosi-ui/core';
import { Contributor, ContributorService } from '@gosi-ui/features/contributor/lib/shared';
import moment from 'moment';
import { PersonDetails } from '../../../shared';

@Component({
  selector: 'cim-profile-header-dc',
  templateUrl: './profile-header-dc.component.html',
  styleUrls: ['./profile-header-dc.component.scss']
})
export class ProfileHeaderDcComponent implements OnInit, OnChanges {
  @Input() sin: number;
  @Input() personDetails: PersonDetails;
  @Input() userDetails: Contributor;
  @Input() roleArray: [];
  arabicNameValue: string;
  englishNameValue: string;
  active = ContributorStatus.ACTIVE;
  inactive = ContributorStatus.INACTIVE;
  typeIqama = IdentityTypeEnum.IQAMA;
  typeNin = IdentityTypeEnum.NIN;
  typePassport = IdentityTypeEnum.PASSPORT;
  typeGcc = IdentityTypeEnum.NATIONALID;
  typeBorder = IdentityTypeEnum.BORDER;
  totalAge: number;
  mobileView = false;
  width: number;

  identifier: number;

  // Set all the user types that will be shows in user roles part
  userTypesArray: string[] = ['contributor', 'beneficiary', 'vic'];

  // Flags of the user role status
  isContributorActive: boolean;
  isBeneficiaryActive: boolean;
  isVICActive: boolean;
  hasVICEngagement: boolean;
  isMargin: boolean;

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

  ngOnInit(): void {
    // if (this.userDetails) {
    //   this.setUserflags(this.userDetails);
    // }
    window.scrollTo();
    this.onWindowReSize();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.userDetails && changes.userDetails.currentValue) {
      if (this.userDetails) {
        this.setUserflags(this.userDetails);
      }
    }
    if (changes.personDetails && changes.personDetails.currentValue) {
      this.personDetails = changes.personDetails.currentValue;
      this.arabicNameValue = getPersonArabicName(this.personDetails?.name?.arabic);
      this.englishNameValue = getPersonEnglishName(this.personDetails?.name?.english);
      if (this.englishNameValue && this.englishNameValue?.length > 27) {
        this.isMargin = true;
      } else {
        this.isMargin = false;
      }
      const currentDate = new Date();
      const birthDate = new Date(this.personDetails?.dateOfBirth?.gregorian);
      this.totalAge = moment(currentDate).diff(moment(birthDate), 'years');
    }
  }
  // getUserStatus(identifier: number) {
  //   this.contributorService.getUserStatus(identifier).subscribe(
  //     res => {
  //       this.userDetails = res;
  //       this.setUserflags(res);
  //     },
  //     error => {
  //       this.alertService.showError(error.error.message);
  //     }
  //   );
  // }

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
  onWindowReSize() {
    this.width = window.innerWidth;
    if (this.width < 1024) {
      this.mobileView = true;
    } else {
      this.mobileView = false;
    }
  }
}
