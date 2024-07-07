import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { BilingualText, getPersonNameAsBilingual, GosiCalendar, LovList } from '@gosi-ui/core';
import { Observable } from 'rxjs';
import {
  AnnuityResponseDto,
  DependentDetails,
  DependentModify,
  PersonalInformation,
  SystemParameter,
  ValidateRequest
} from '../../models';
import { DependentHeirConstants } from '../../constants';
import { BenefitValues, ActionType } from '../../enum';
import { DependentListingDesktopMobileBaseComponent } from '../base/dependent-listing-desktop-mobile-base.component';

// import {  PersonalInformation } from '../../shared';

@Component({
  selector: 'bnt-dependent-listing-mobile-view-dc',
  templateUrl: './dependent-listing-mobile-view-dc.component.html',
  styleUrls: ['./dependent-listing-mobile-view-dc.component.scss']
})
export class DependentListingMobileViewDcComponent
  extends DependentListingDesktopMobileBaseComponent
  implements OnInit
{
  // constructor() {

  // }
  ActionType = ActionType;
  dependentInEnglish = [];
  dependentInArabic = [];

  //For dependent edit
  @Input() systemRunDate: GosiCalendar;
  @Input() systemParameter: SystemParameter;
  @Input() annuityRelationShip$: Observable<LovList>;
  @Input() maritalStatus$: Observable<LovList>;
  @Input() heirStatus$: Observable<LovList>;
  @Input() heirStatusArr: string[];
  @Input() eligibilityStartDate: GosiCalendar;
  @Input() dependentStatusResp: ValidateRequest;
  @Input() isLumpsum = false;
  @Input() isEligibleForBackdated = false;
  // @Input() events$: Observable<EventResponseDto>;
  @Input() annuityResponse: AnnuityResponseDto;
  @Input() benefitRequestId: number;
  @Input() genderList: LovList;
  @Input() calcHijiriAgeInMonths: number;
  @Input() isSmallScreen: boolean;

  //For dependent edit
  @Output() update: EventEmitter<DependentModify> = new EventEmitter();
  @Output() validate: EventEmitter<DependentModify> = new EventEmitter();
  @Output() dependentModifyReason: EventEmitter<DependentModify[]> = new EventEmitter();
  @Output() statusDate = new EventEmitter();
  @Output() newDependentStatus = new EventEmitter();
  @Output() search = new EventEmitter();
  @Output() showIneligibilityDetails: EventEmitter<DependentDetails> = new EventEmitter();
  @Output() getRelationshipListByGender: EventEmitter<BilingualText> = new EventEmitter();
  //Status change
  @Input() actionType: string;
  @Input() contributorDetails: PersonalInformation;

  notEligibleText = DependentHeirConstants.notEligible();
  benefitValues = BenefitValues;

  ngOnInit(): void {
    // console.log(this.listOfValues[0].name)
    if (this.actionType) {
      this.checkListValue = this.createFormData(this.isValidator);
      if (this.parentForm) {
        this.parentForm.addControl('listOfDependents', this.checkListValue);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.listOfValues?.currentValue) {
      this.listOfValues.forEach(dependent => {
        const nameObj = getPersonNameAsBilingual(dependent.name);
        this.dependentInEnglish.push(nameObj.english);
        this.dependentInArabic.push(nameObj.arabic);
        dependent.nameInEnglish = nameObj.english?.length > 0 ? nameObj.english : '-';
        dependent.nameInArabic = nameObj.arabic;
      });
    }
  }

  updateDependent(data: DependentModify) {
    this.update.emit(data);
  }

  validateDependentModifyReason(data: DependentModify[]) {
    this.dependentModifyReason.emit(data);
  }

  validateDependent(data: DependentModify) {
    this.validate.emit(data);
  }

  updateStatusDate(data) {
    this.statusDate.emit(data);
  }

  showIneligibilityReasons(details: DependentDetails) {
    this.showIneligibilityDetails.emit(details);
  }
}
