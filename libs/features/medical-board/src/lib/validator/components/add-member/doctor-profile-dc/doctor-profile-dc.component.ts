import { Component, Input, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { getPersonArabicName, IdentityTypeEnum, MobileDetails, BilingualText } from '@gosi-ui/core';
import { MemberDetails } from '../../../../shared/models';
import { MBConstants, SamaStatusEnum, SamaStatusConstants } from '../../../../shared';
import moment from 'moment';

@Component({
  selector: 'mb-doctor-profile-dc',
  templateUrl: './doctor-profile-dc.component.html',
  styleUrls: ['./doctor-profile-dc.component.scss']
})
export class DoctorProfileDcComponent implements OnInit, OnChanges {
  /**Input variables */
  @Input() doctorDetails: MemberDetails;

  //Local Variables
  typeNin = IdentityTypeEnum.NIN;
  typeIqama = IdentityTypeEnum.IQAMA;
  typeBorder = IdentityTypeEnum.BORDER;
  typePassport = IdentityTypeEnum.PASSPORT;
  typeGcc = IdentityTypeEnum.NATIONALID;
  arabicName: string;
  bankStatus: BilingualText;

  /** Method to initialize the component. */
  ngOnInit() {
    this.arabicName = getPersonArabicName(this.doctorDetails?.member.name.arabic);
  }
  /** Method to handle changes in input. */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.doctorDetails && changes.doctorDetails.currentValue) {
      switch (this.doctorDetails?.member?.bankAccount?.verificationStatus) {
        case SamaStatusEnum.SamaVerified: {
          this.bankStatus = SamaStatusConstants.VERIFIED;
          break;
        }
        case SamaStatusEnum.SamaVerificationPending: {
          this.bankStatus = SamaStatusConstants.VERIFICATION_IN_PROGRESS;
          break;
        }
        default: {
          this.bankStatus = SamaStatusConstants.VERIFICATION_IN_PROGRESS;
        }
      }
    }
  }
  /**
   * Method to get Age
   *@param index
   */
  getAge() {
    const age = moment(new Date()).diff(moment(this.doctorDetails?.member?.birthDate?.gregorian), 'year');
    return age;
  }

  /**
   * Method to get the isdcode prefix
   * @param isdCode
   */
  getISDCodePrefix(mobNo: MobileDetails): string {
    let prefix;
    if (mobNo === null || (mobNo && mobNo.primary === null)) {
      prefix = null;
    } else if (mobNo && mobNo.isdCodePrimary === null) {
      prefix = MBConstants.ISD_PREFIX_MAPPING.sa;
    } else {
      Object.keys(MBConstants.ISD_PREFIX_MAPPING).forEach(key => {
        if (mobNo && key === mobNo.isdCodePrimary) {
          prefix = MBConstants.ISD_PREFIX_MAPPING[key];
        }
      });
    }
    return prefix;
  }
}
