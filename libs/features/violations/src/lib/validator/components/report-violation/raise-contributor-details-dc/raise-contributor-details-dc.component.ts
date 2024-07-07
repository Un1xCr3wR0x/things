import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CommonIdentity, LanguageToken } from '@gosi-ui/core';
import { getDateFormat, ViolationConstants } from '@gosi-ui/features/violations/lib/shared';
import moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { ViolationTransaction } from '../../../../shared/models';

@Component({
  selector: 'vol-raise-contributor-details-dc',
  templateUrl: './raise-contributor-details-dc.component.html',
  styleUrls: ['./raise-contributor-details-dc.component.scss']
})
export class RaiseContributorDetailsDcComponent implements OnInit {
  contributorDetail = [];
  lang: String = 'en';
  violationType: String;
  isUpperArrow: boolean;
  @Input() transactionDetails: ViolationTransaction;
  @Input() parentForm: FormGroup;
  @Input() assigneeIndex: number;
  @Input() isCancelEngagement: boolean;
  @Input() isIncorrectWage: boolean;
  @Input() isAddNewEngagement: boolean;
  @Input() isIncorrectReason: boolean;
  @Input() isWrongBenefits: boolean;
  @Input() isViolatingProvision: boolean;

  @Output() navigate: EventEmitter<number> = new EventEmitter();
  /**
   * @param language
   */
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<String>) {}

  ngOnInit(): void {
    this.language.subscribe(lang => (this.lang = lang));
    this.violationType = this.transactionDetails?.violationType?.english;
  }

  /**
   * Method to navigate to  profile page
   */
  navigateToProfile(index: number) {
    this.navigate.emit(index);
  }
  /**
   * Metyhod to check if sin needed
   * @param identity
   */
  isSinNeeded(identity: Array<CommonIdentity>) {
    const types = ['NIN', 'IQAMA', 'GCCID'];
    let issin = false;
    if (identity.length > 0) {
      for (const item of identity) {
        issin = types.includes(item.idType);
        if (issin === true) break;
      }
      if (issin) return 1;
      else return 0;
    } else return 0;
  }
  /**
   * Method to get age
   * @param index
   */
  getAge(index: number) {
    const age = moment(new Date()).diff(
      moment(this.transactionDetails?.contributors[index]?.dateOfBirth?.gregorian),
      'year'
    );
    return age;
  }
  // method for accordion arrow change
  resetInnerArrow() {
    this.isUpperArrow = false;
  }
  changeArrow() {
    this.isUpperArrow = !this.isUpperArrow;
  }

  getDateType(format: string): string {
    return getDateFormat(format);
  }

  checkIfLumpsum(benefitType: string) {
    let lumpsum = false;

    // ViolationConstants.BENEFIT_TYPE_LUMPSUM_LIST.forEach(item => {
    //   if (item==benefitType) {
    //     lumpsum = true;
    //   }
    // });
    if (ViolationConstants.BENEFIT_TYPE_LUMPSUM_LIST.includes(benefitType)) {
      lumpsum = true;
    }

    return lumpsum;
  }
}
