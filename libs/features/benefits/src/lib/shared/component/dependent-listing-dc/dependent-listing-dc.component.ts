/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import {
  DependentDetails,
  DependentModify,
  ValidateRequest,
  PersonalInformation,
  AnnuityResponseDto,
  SearchPerson
} from '../../models';
import { BilingualText, GosiCalendar, LovList } from '@gosi-ui/core';
import { SystemParameter } from '@gosi-ui/features/contributor';
import { Observable } from 'rxjs';
import { ListPersonBaseComponent } from '../base/list-person.base.component';
import { ActionType } from '../../enum/action-type';
import { DependentHeirConstants } from '../../constants/dependent-heir-constants';
import { BenefitValues } from '../../enum/benefit-values';
import { EventResponseDto, HeirEvent } from '../../models/questions';
import { DependentListingDesktopMobileBaseComponent } from '../base/dependent-listing-desktop-mobile-base.component';

@Component({
  selector: 'bnt-dependent-listing-dc',
  templateUrl: './dependent-listing-dc.component.html',
  styleUrls: ['./dependent-listing-dc.component.scss']
})
export class DependentListingDcComponent extends DependentListingDesktopMobileBaseComponent implements OnInit {
  ActionType = ActionType;

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
  @Input() disableSave = false;

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
    if (this.actionType) {
      this.checkListValue = this.createFormData(this.isValidator);
      if (this.parentForm) {
        this.parentForm.addControl('listOfDependents', this.checkListValue);
      }
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
