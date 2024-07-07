/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertService, AppConstants, BilingualText, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject, identity } from 'rxjs';
import { MBConstants } from '../../constants/mb-constants';
import {
  AddParticipantsList,
  BulkParticipants,
  IndividualSessionDetails,
    SessionSpecialityDetails
} from '../../models';
import { AlllowedParticipants } from '../../models/allowed-participant';

@Component({
  selector: 'mb-add-participant-modal-dc',
  templateUrl: './add-participant-modal-dc.component.html',
  styleUrls: ['./add-participant-modal-dc.component.scss']
})
export class AddParticipantModalDcComponent implements OnInit, OnChanges {
  /**
   *Local Variable
   */
  addParticipantForm: FormGroup = new FormGroup({});
  isNonSpeciality = false;
  isMaxParticipant = false;
  lang = 'en';
  prefix = '';
  bulkParticipants = [];
  selectParticipants = [];
  selectedAddparticipantbyNIN: {} = {};
  countExceeded = false;
  count = 0;
  max = 10;
  valid: '';
  showModal = false;
  showAddedParticipant = false;
  isDisabled = true;
  isModalParticipantLocation = false;
  showUnavailability: boolean;
  modalSpeciality: string;
  modalLocation: BilingualText;
  selectedAddparticipant: {} = {};
    /**
   *Input Variable
   */
  @Input() searchParams = '';
  @Input() type: string;
  @Input() parentForm: FormGroup = new FormGroup({});
  @Input() isHold: boolean;
  @Input() searchedParticipant: AddParticipantsList;
  @Input() totalNoOfParticipantRecords: number;
  @Input() maxParticipants: number;
  @Input() allowedSpecialityList: BilingualText[];
  @Input() allowedParticipant: AlllowedParticipants;
  @Input() addedParticipantsList: AddParticipantsList[];
  @Input() addParticipantsList: AddParticipantsList[];
  @Input() officeLocation: BilingualText;
  @Input() configurationDetails: IndividualSessionDetails;
  @Input() temp;
  @Input() isSessionstatus: boolean;
    /**
   *Output Variable
   */
  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() statusEvent: EventEmitter<BulkParticipants[]> = new EventEmitter();
  @Output() adhocEvent: EventEmitter<AddParticipantsList[]> = new EventEmitter();
  @Output() cancelEvent: EventEmitter<null> = new EventEmitter();
  @Output() addByNINParticipant = new EventEmitter();
  /**
   *
   * @param fb
   * @param language
   */
  constructor(
    readonly fb: FormBuilder,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.language.subscribe(lang => (this.lang = lang));
    this.showModal = false;
    this.isDisabled = true;
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.searchedParticipant) {
      this.searchedParticipant = changes.searchedParticipant.currentValue;
      if(this.searchedParticipant?.identityNumber){
        this.isDisabled = false;
        this.showModal = true;
      } else {
        this.showModal = false;
        this.isDisabled = true;
      }
      // this.participantListApi(this.searchedParticipant?.identityNumber)
    }
    if (changes && changes.totalNoOfParticipantRecords)
      this.totalNoOfParticipantRecords = changes.totalNoOfParticipantRecords.currentValue;
    if (changes && changes.maxParticipants) this.maxParticipants = changes.maxParticipants.currentValue;
    if (changes && changes.addedParticipantsList) {
      this.addedParticipantsList = changes.addedParticipantsList.currentValue;
    }
    if (this.totalNoOfParticipantRecords >= this.maxParticipants) {
      this.countExceeded = true;
    } else this.countExceeded = false;
  }

  /**
   *This method is used while entering a key in search place
   */

  onSearchEnabled(key: string) {
    const keys = parseInt(key, 10);
    if ((keys && keys.toString().length !== 10) || keys === 0) {
      this.showModal = false;
      this.showAddedParticipant = false;
      this.isDisabled = true;
    }
    if (!key && this.showModal) {
      this.showModal = false;
      this.search.emit(key);
    }
  }

  /**
   *This method is used while clicking search button
   */

  onSearchParticipant(value: string) {
    const numValue = parseInt(value, 10);
    if ((numValue && numValue.toString().length === 10) || numValue.toString().length >= 5) {
      this.checkAlreadyExistParticipant(numValue);
    }
  }

  /**
   *This is used to remove every value in search area
   */

  resetSearch() {
    // this.search.emit(null);
    this.searchedParticipant = new AddParticipantsList();
    this.showModal = false;
    this.showAddedParticipant = false;
    this.isDisabled = true;
  }

  /**
   *This is used to check whether the already added value and searched value are true to show err msg
   */

  checkAlreadyExistParticipant(numValue) {
    if (numValue && this.addedParticipantsList.findIndex(participant => participant.identity === numValue) >= 0) {
      this.showAddedParticipant = true;
      this.showModal = false;
      this.isDisabled = true;
    } else {
      this.search.emit(numValue);
      // this.isDisabled = false;
      // this.showModal = true;
      // this.showAddedParticipant = false;
      // this.participantListApi(numValue);
    }
  }

  /**
   *  This is used to check whether the  searched value and api value are
   * equal and to show modal and add participant
   */

  participantListApi(numValue) {
    if (
    numValue &&
    this.addParticipantsList?.findIndex(apiParticipantMember => apiParticipantMember?.identityNumber === numValue) >=
    0
    ) {
      this.search.emit(numValue);
      this.showAddedParticipant = false;
      this.showModal = true;
          this.isDisabled = false;
          }
  }

  /**
   *This is used to show warning message for Speciality
   */

  showWarningMessage(searchedParticipant) {
    const modalParticipantSpeciality = this.modalSpeciality;
    if (
      this.allowedSpecialityList?.findIndex(
        apiAllowedSpeciality => apiAllowedSpeciality?.english === modalParticipantSpeciality
      ) >= 0
    ) {
      this.isNonSpeciality = false;
    } else this.isNonSpeciality = true;
  }
  /**
   *This is used to show warning message for location
   */
  showLocationWarning() {
    if (this.modalLocation?.english !== this.officeLocation?.english) {
      this.isModalParticipantLocation = true;
    }
  }
  /**
   *This is used to show warning message for  adhoc  member Speciality
   */

  showAdhocWarningMessage() {
    const modalParticipantSpeciality = this.modalSpeciality;
    if (
      this.configurationDetails?.memberDetails?.findIndex(
        eachMember =>
          eachMember?.speciality?.length && eachMember?.speciality[0]?.english === modalParticipantSpeciality
      ) >= 0
    ) {
      this.isNonSpeciality = false;
    } else {
      this.isNonSpeciality = true;
    }
  }
  /**Method to fetch isd code */

  getISDCodePrefix() {
    Object.keys(AppConstants.ISD_PREFIX_MAPPING).forEach(key => {
      if (key === this.searchedParticipant?.isdCode) {
        this.prefix = AppConstants.ISD_PREFIX_MAPPING[key];
      }
      this.modalLocation = this.searchedParticipant?.location;
      this.modalSpeciality = this.searchedParticipant?.specialty?.english;
      this.showLocationWarning(); //To get Location of adding participant
      this.showWarningMessage(this.searchedParticipant); //To get speciality of adding participant
      if (this.type === 'adhoc') {
        this.showAdhocWarningMessage();
      }
    });
    return this.prefix;
  }

  /**
   *This is while clicking add participants button
   */
  confirmAddParticipant() {
    this.bulkParticipants = [];
    if (this.searchedParticipant !== null) {
      const bulkParticipant = {
        ...new BulkParticipants(),
        participantId: this.searchedParticipant.participantId,
        assessmentType: this.searchedParticipant.assessmentType,
        noOfDaysInQueue: this.searchedParticipant.noOfDaysInQueue,
        mobileNumber: this.searchedParticipant.mobileNumber,
        identityNumber: this.searchedParticipant.identityNumber,
        location: this.searchedParticipant.location
      };
      const particpantValue = {
        assessmentType: this.searchedParticipant.assessmentType,
        name: this.searchedParticipant.name,
        inviteeId: this.searchedParticipant.inviteeId,
        identity: this.searchedParticipant.identityNumber,
        location: this.searchedParticipant.location
      };
      this.selectParticipants.push(particpantValue);
      this.bulkParticipants.push(bulkParticipant);
      if (this.type === 'status') this.statusEvent.emit(this.bulkParticipants);
      else this.adhocEvent.emit(this.selectParticipants);
    } else this.cancelAddParticipant();
  }
  onClickAddParticipantsNIN(): void {
    this.selectedAddparticipant = this.searchedParticipant;
    this.addByNINParticipant.emit({ temp: this.temp, selectedAddparticipantbyNIN: this.searchedParticipant });
  }

  //Cancel hold session
  cancelAddParticipant() {
    this.cancelEvent.emit();
  }
}
