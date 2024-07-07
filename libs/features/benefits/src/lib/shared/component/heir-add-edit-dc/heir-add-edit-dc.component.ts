/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  Input,
  OnDestroy,
  AfterViewInit,
  HostListener,
  Output,
  EventEmitter
} from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { LovList, Lov, NationalityTypeEnum, formatDate, AddressTypeEnum } from '@gosi-ui/core';
import { DependentDetails, Question, HeirDetailsRequest, AgeInNewLaw } from '../../models';
import { BenefitConstants, EventsConstants } from '../../constants';
import { QuestionTypes, RelationShipCode, MaritalValues } from '../../enum';
import { getQuestionForHeir, getMotherList, deepCopy } from '../../utils';
import { HeirAddBaseComponent } from '../base/heir-add-base.component';

@Component({
  selector: 'bnt-heir-add-edit-dc',
  templateUrl: './heir-add-edit-dc.component.html',
  styleUrls: ['./heir-add-edit-dc.component.scss']
})
export class HeirAddEditDcComponent
  extends HeirAddBaseComponent
  implements OnInit, OnChanges, OnDestroy, AfterViewInit
{
  // heirNationality: string;
  // showSelectMotherDropDown = false;

  NationalityTypeEnum = NationalityTypeEnum;
  // benefitReason: BilingualText;
  // isEnabledRestoration: Boolean = true;
  /**
   * Input
   */
  @Input() showBorderLine = false;
  @Input() heirList: LovList;

  @Input() listOfDependents: DependentDetails[];
  @Input() relationShipListForUnborn: Observable<LovList>;
  @Input() isIbanVerified = false;
  @Input() isBankAccountRequired = true;
  // @Input() preSelectedAuthperson: AttorneyDetailsWrapper[];
  /**
   * Output
   */
  //contact details input/output variables

  descriptionMaxLength = BenefitConstants.DESCRIPTION_MAX_LENGTH;
  updateFirstTime: boolean;

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    this.isSmallScreen = window.innerWidth <= 992 ? true : false;
  }

  ngOnInit(): void {
    this.isThisAgeInNewLaw.emit([
      { year: 20, hijiriDob: this.dependentDetails.birthDate.hijiri },
      { year: 25, hijiriDob: this.dependentDetails.birthDate.hijiri }
    ] as AgeInNewLaw[]);
  }

  ngAfterViewInit() {
    this.watchForms();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (changes.annuityRelationShipList?.currentValue) {
        this.setValues();
        this.mothersList = getMotherList(this.listOfDependents);
        this.setInputValues();
        if (this.update) {
          this.resetSearch();
          this.updateFirstTime = true;
          this.setRelationAndMaritalStatus(this.annuityRelationShipList);
          if (!this.status || this.status?.english === MaritalValues.single) {
            // As there is no marital status below fun wouldn't get called for single status
            this.selectRelationShipForHeir(this.selectedRelationship, true);
          }
        }
      }
      if (changes.validateApiResponse && changes.validateApiResponse.currentValue) {
        this.heirValidated();
      }
      if (changes?.systemRunDate?.currentValue) {
        this.currentDate = moment(this.systemRunDate.gregorian).toDate();
      }
    }
  }

  selectMaritalStatus(value: Lov) {
    this.resetErrors();
    this.selectedMartialStatus = value.value;
    this.setMaritalStatusDate(this.selectedMartialStatus?.english);
    if (this.latestEvent && this.latestEvent.status.english === this.selectedMartialStatus.english) {
      this.setMaritalStatusDate(this.latestEvent.status?.english, this.latestEvent.eventStartDate, true);
    }
    this.selectRelationShipForHeir(this.selectedRelationship, true);
  }

  showAnnualNotification() {
    if (
      !this.isHeirLumpsum &&
      ((this.isContributorSaudi && this.contactForm.get('currentMailingAddress')?.value === AddressTypeEnum.OVERSEAS) ||
        !this.isContributorSaudi)
    ) {
      return true;
    }
    return false;
  }

  getStatus(status) {
    if (status?.english === MaritalValues.divorcee) {
      return EventsConstants.DIVORCE;
    }
    return status;
  }

  setUpdateQuestionsForm() {
    if (this.update && this.updateFirstTime) {
      this.setPreselectedQuestionsAndControls(this.dependentDetails, this.questionsForm);
    }
  }

  //to be moved to add base
  /*
   * This method is for form validation
   */
  showFormValidation() {
    this.alertService.clearAlerts();
    this.alertService.showMandatoryErrorMessage();
  }

  deathDateSelected() {
    this.depHeirDeathDate =
      this.dependentForm.get('deathDate') && this.dependentForm.get('deathDate').value
        ? moment(this.dependentForm.get('deathDate.gregorian').value)
        : null;
    this.selectRelationShipForHeir(this.selectedRelationship);
  }

  ngOnDestroy() {
    // this.eventErrorWithoutEventCategory = null;
    // this.eligibilityStatusAfterValidation = null;
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
}
