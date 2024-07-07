import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  Input,
  EventEmitter,
  Output,
  AfterViewInit,
  HostListener
} from '@angular/core';
import * as moment from 'moment';
import { ActionType } from '../../enum/action-type';
import { BenefitConstants, EventsConstants } from '../../constants';
import { getStatusDate } from '../../utils/validateDependentUtils';
import {
  Lov,
  formatDate,
  LovList,
  BilingualText,
  Name,
  AddressTypeEnum
} from '@gosi-ui/core';
import { DependentDetails } from '../../models/dependent-details';
import {
  calendarWithStartOfDay,
  removeNullFromIdentities,
  getMotherList,
  getRequestDateFromForm
} from '../../utils';
import { MaritalValues } from '../../enum/marital-values';
import { HeirDetailsRequest, PersonalInformation } from '../../models';
import { HeirAddBaseComponent } from '../base/heir-add-base.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'bnt-heir-add-dc',
  templateUrl: './heir-add-dc.component.html',
  styleUrls: ['./heir-add-dc.component.scss']
})
export class HeirAddDcComponent extends HeirAddBaseComponent implements OnInit, OnChanges, AfterViewInit {
  notificationDate: Date;
  descriptionMaxLength = BenefitConstants.DESCRIPTION_MAX_LENGTH;
  currentDate: Date;

  @Input() lang: string;
  @Input() isLumpsum = false;
  @Input() contributorDetails: PersonalInformation; //Not used
  @Input() benefitRequestId: number;
  @Input() showBorderLine = false;
  @Input() listOfDependents: DependentDetails[];
  @Input() relationShipListForUnborn: Observable<LovList>;
  @Input() heirList: LovList;

  @Output() getRelationshipListByGender: EventEmitter<BilingualText> = new EventEmitter();

  isSmallScreen: boolean;
  updateFirstTime: boolean;
  depHeirDeathDate;

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    this.isSmallScreen = window.innerWidth <= 992 ? true : false;
  }

  /*
   * This method is for initialisation tasks
   */
  ngOnInit(): void {
    this.maxDate = moment(this.systemRunDate?.gregorian).toDate();
    this.notificationDate = moment(this.systemRunDate?.gregorian).add(1, 'y').toDate();
    this.isSmallScreen = window.innerWidth <= 768 ? true : false;
    this.selectGender();
    this.getLabel();
    this.setValues();
  }
  ngAfterViewInit() {
    this.selectGender();
    this.watchForms();
  }
  ngOnChanges(changes: SimpleChanges) {
    this.personDetailsForm = this.getForm();
    this.mothersList = getMotherList(this.listOfDependents);
    this.setInputValues();
    this.selectGender();
    if (changes) {
      if (
        changes.annuityRelationShipList &&
        changes.annuityRelationShipList.currentValue &&
        changes.update &&
        changes.update.currentValue === true
      ) {
        this.resetSearch();
        this.setSavedValues();
        this.updateFirstTime = true;
        this.setRelationAndMaritalStatus(this.annuityRelationShipList);
        if (!this.dependentForm.get('maritalStatusDate.gregorian'))
          this.selectRelationShipForHeir(this.selectedRelationship);
      }
      if (changes.validateApiResponse && changes.validateApiResponse.currentValue) {
        this.heirValidated();
      }
      if (changes?.systemRunDate?.currentValue) {
        this.currentDate = moment(this.systemRunDate.gregorian).toDate();
      }
      // if (changes.ageInNewLaw?.currentValue) {
      //   this.calculateAgeAndEligibility();
      // }resetSearch
    }
  }
  selectGender() {
    this.getRelationshipListByGender.emit(this.personDetailsForm.get('gender')?.value);
  }

  selectMaritalStatus(value: Lov) {
    this.selectedMartialStatus = value.value;
    this.setMaritalStatusDate(this.selectedMartialStatus?.english);
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

  /*
   * This method is for save dependent
   */
  save(update: boolean) {
    this.resetErrors();
    const dependent = {
      actionType: !this.dependentDetails?.newlyAdded && update ? ActionType.MODIFY : ActionType.ADD,
      dateOfBirth: this.searchPersonData?.dob ? this.searchPersonData?.dob : this.dependentDetails.birthDate,
      personId: this.dependentDetails?.personId,
      relationship: this.selectedRelationship?.value,
      events: [],
      maritalStatusDateUpdatedFromUi: this.maritalStatusDateUpdatedFromUi,
      maritalStatusDate: this.dependentForm?.get('maritalStatusDate')
        ? calendarWithStartOfDay(this.dependentForm?.get('maritalStatusDate').value)
        : null,
      maritalStatus: this.dependentForm.get('maritalStatus') ? this.dependentForm.get('maritalStatus')?.value : null,
      deathDate: this.dependentForm.get('deathDate')
        ? calendarWithStartOfDay(this.dependentForm.get('deathDate')?.value)
        : null,
      benefitRequestId: this.benefitRequestId,
      benefitStartDate: this.benefitStartDate,
      modificationRequestDate: this.isModifyPage ? getRequestDateFromForm(this.parentForm) : null,
      statusDate: getStatusDate(this.dependentForm),
      disabilityDescription: this.dependentForm.get('disabilityDescription')
        ? this.dependentForm.get('disabilityDescription').value
        : null,
      identity: this.searchPersonData?.identity
        ? removeNullFromIdentities(this.searchPersonData?.identity)
        : removeNullFromIdentities(this.dependentDetails?.identity),
      name: new Name().fromJsonToObject(this.personDetailsForm.get('name')?.value) || this.dependentDetails?.name,
      sex: this.personDetailsForm.get('gender').value,
      nonSaudiDependentAdded: true,
      nationality: this.searchPersonData?.nationality || this.dependentDetails?.nationality
      // nin: this.dependentForm.get('nationalId').value
    } as DependentDetails;

    if (this.setQuestionsEventsControlsForValidate(dependent as DependentDetails)) {
      if (update) {
        this.saveDependent.emit(dependent);
      } else {
        if (this.personDetailsForm.valid) {
          this.validateDependent.emit(dependent);
        }
      }
    }
  }

  /**
   *
   */
  heirStatusSelected(status: string) {
    let selected = false;
    if (this.dependentForm.get(status)) {
      selected = this.dependentForm.get(status).value.english === 'Yes';
    }
    return selected;
  }

  deathDateSelected() {
    this.depHeirDeathDate =
      this.dependentForm.get('deathDate') && this.dependentForm.get('deathDate').value
        ? moment(this.dependentForm.get('deathDate.gregorian').value)
        : null;
    this.selectRelationShipForHeir(this.selectedRelationship);
  }

  getDateFormat(lang) {
    return formatDate(lang);
  }
  getContributorStatus(benefitReason: HeirDetailsRequest) {
    if (benefitReason?.reason) {
      return benefitReason?.reason;
    } else {
      return !this.isAlive ? this.deadBilingual : this.missingBilingual;
    }
    // if (this.isPension) {
    //   return benefitReason?.reason;
    // } else {
    //   return !this.isAlive ? this.deadBilingual : this.missingBilingual;
    // }
  }
  getMaritalStatusFemale() {
    if (this.status?.english === MaritalValues.widower) {
      return EventsConstants.WIDOWHOOD;
    } else if (this.status?.english === MaritalValues.divorcee) {
      return EventsConstants.DIVORCE;
    } else {
      return this.status;
    }
  }
}
