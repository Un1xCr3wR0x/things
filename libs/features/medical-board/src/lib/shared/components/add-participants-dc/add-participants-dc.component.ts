import { state } from '@angular/animations';
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { AppConstants, LanguageToken, LovList, BilingualText, AlertService } from '@gosi-ui/core';
import { PaginationDcComponent } from '@gosi-ui/foundation-theme/src';
import { BehaviorSubject } from 'rxjs';
import { MBConstants } from '../../constants';
import { NationalityCategoryEnum } from '../../enums';
import { AddMemberFilterRequest, AddParticipantsList, BulkParticipants, SessionLimitRequest } from '../../models';
import { AlllowedParticipants } from '../../models/allowed-participant';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
export enum ActionEnum {
  replace = 'replace',
  add = 'add'
}
@Component({
  selector: 'mb-add-participants-dc',
  templateUrl: './add-participants-dc.component.html',
  styleUrls: ['./add-participants-dc.component.scss']
})
export class AddParticipantsDcComponent implements OnInit, OnChanges, OnDestroy {
  //Local variables
  heading = 'ADD-PARTICIPANTS';
  pageDetails = {
    currentPage: 1,
    goToPage: 1
  };
  itemsPerPage = 10;
  lang = 'en';
  checkForm: FormArray = new FormArray([]);
  count = 0;
  counter = 0;
  countExceeded = false;
  bulkParticipants: BulkParticipants[] = [];
  replacedParticipant: BulkParticipants[] = [];
  replacedAdhocParticipant: BulkParticipants;
  selectParticipants = [];
  selectedAddparticipant = [];
  replacedMember: AddParticipantsList;
  // replacedParticipant: ParticipantsList;
  isSearched = false;
  replaceList = [];
  specialityArray = [];
  isDisabled: boolean;
  showSpecialityWarning = false;
  allowedSpeciality: boolean;
  // isFilterError:boolean;
  isMaxParticipant = false;
  isNonSpeciality = false;
  isLocation = false;
  alreadyExist = false;
  counts = [];
  replacementList: LovList = new LovList([]);
  replacementForm: FormArray = new FormArray([]);
  modalRef: BsModalRef;
  //Input variables
  @Input() addParticipants: boolean;
  @Input() totalResponse: number;
  @Input() isSessionstatus: boolean;
  @Input() addParticipantsList: AddParticipantsList[];
  @Input() fieldOfficeLists: LovList;
  @Input() action: string;
  @Input() specialityLists: LovList;
  @Input() limit: SessionLimitRequest = new SessionLimitRequest();
  @Input() searchParams = '';
  @Input() allowedParticipant: AlllowedParticipants;
  @Input() specialtyLists: LovList;
  @Input() locationLists: LovList;
  @Input() assessmentTypeLists: LovList;
  @Input() isHold: boolean;
  @Input() selectSpeciality: BilingualText;
  @Input() maxParticipants: number;
  @Input() totalNoOfParticipantRecords: number;
  @Input() configurationType: string;
  @Input() addedParticipantsList: AddParticipantsList[];
  @Input() officeLocation: BilingualText;
  @Input() medicalBoardType: BilingualText;
  @Input() allowedSpecialityList: BilingualText[];
  @Input() temp;
  @Input() showParticipantErrors: Boolean;
  @Input() availableParticipantMsg: BilingualText;
  @Input() isAmb: boolean;
  //Output variables
  @Output() add: EventEmitter<BulkParticipants[]> = new EventEmitter();
  @Output() update: EventEmitter<AddParticipantsList[]> = new EventEmitter();
  @Output() replace: EventEmitter<BulkParticipants[]> = new EventEmitter();
  @Output() replaceAdhoc: EventEmitter<{
    replacedMember: AddParticipantsList;
    replacedParticipants: BulkParticipants;
  }> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  @Output() navigate = new EventEmitter<number>();
  @Output() selectPageNo: EventEmitter<SessionLimitRequest> = new EventEmitter();
  @Output() updateSelect: EventEmitter<null> = new EventEmitter();
  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() filter: EventEmitter<AddMemberFilterRequest> = new EventEmitter();
  @Output() showAddParticipant = new EventEmitter();
  @Output() checkParticipantAvailability: EventEmitter<BulkParticipants> = new EventEmitter();
  @ViewChild('paginationComponent') paginationDcComponent: PaginationDcComponent;
  ninId = NationalityCategoryEnum.NIN_ID;
  iqamaId = NationalityCategoryEnum.IQAMA_ID;
  gccId = NationalityCategoryEnum.GCC_ID;
  borderNo = NationalityCategoryEnum.BORDER_NO;
  showUnavailability: boolean;
  index;
  constructor(
    readonly fb: FormBuilder,
    readonly modalService: BsModalService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.replacementList = new LovList(MBConstants.REPLACEMENT_LIST);
    this.showParticipantErrors = false;
    this.checkParticipantSpecialty();
  }
  ngOnChanges(changes: SimpleChanges) {
    // this.displayWarningMsg;
    if (changes && changes.limit && changes.limit.currentValue) {
      this.limit = changes.limit.currentValue;
      this.pageDetails.currentPage = this.pageDetails.goToPage = this.limit.pageNo + 1;
      // this.displayWarningMsg;
    }
    if (changes && changes.fieldOfficeLists) {
      this.fieldOfficeLists = changes.fieldOfficeLists.currentValue;
    }
    if (changes && changes.totalResponse) {
      this.totalResponse = changes?.totalResponse?.currentValue;
    }
    if (changes && changes.action) {
      this.action = changes?.action?.currentValue;
    }
    if (changes && changes.allowedParticipant) {
      this.allowedParticipant = changes.allowedParticipant.currentValue;
      // this.displayWarningMsg;
    }
    if (changes && changes.specialityLists) {
      this.specialityLists = changes.specialityLists.currentValue;
    }
    if (changes && changes.addedParticipantsList) {
      this.addedParticipantsList = changes.addedParticipantsList.currentValue;
    }
    if (changes && changes.totalNoOfParticipantRecords) {
      this.totalNoOfParticipantRecords = changes.totalNoOfParticipantRecords.currentValue;
    }
    if (changes && changes.allowedSpecialityList) {
      this.allowedSpecialityList = changes.allowedSpecialityList.currentValue;
      // this.displayWarningMsg;
    }
    if (changes && changes.action) {
      this.action = changes.action.currentValue;
      this.setHeading(this.action);
      // this.displayWarningMsg;
    }
    // this.displayWarningMsg;
    // this.checkForm = new FormArray([]);
    // this.replacementForm = new FormArray([]);
    if (changes && changes?.addParticipantsList) {
      this.addParticipantsList = changes?.addParticipantsList?.currentValue;
      this.checkForm = new FormArray([]);
      this.replacementForm = new FormArray([]);
      this.checkParticipantSpecialty();
      this.addParticipantsList?.forEach(() => {
        this.checkForm?.push(this.createParticipantsCheckbox());
        this.replacementForm?.push(this.createReplacementForm());
      });
    }
    if (changes && changes?.maxParticipants) {
      this.maxParticipants = changes?.maxParticipants.currentValue;
    }
    if (changes && changes.showParticipantErrors) {
      this.showParticipantErrors = changes.showParticipantErrors.currentValue;
    }
    if (changes && changes.availableParticipantMsg) {
      this.availableParticipantMsg = changes.availableParticipantMsg.currentValue;
    }
  }
  /**Method to fetch isd code */
  getISDCodePrefix(participant: AddParticipantsList) {
    let prefix = '';
    Object.keys(AppConstants.ISD_PREFIX_MAPPING).forEach(key => {
      if (key === participant.isdCode) {
        prefix = AppConstants.ISD_PREFIX_MAPPING[key];
      }
    });
    return prefix;
  }
  setHeading(action: string) {
    if (action === ActionEnum.replace) {
      this.heading = 'REPLACE-PARTICIPANTS';
    } else if (action === ActionEnum.add) {
      this.heading = 'ADD-PARTICIPANTS';
    }
    this.isDisabled = true;
  }
  /**
   * Method to create particpant checkbox form
   */
  createParticipantsCheckbox() {
    return this.fb.group({
      flag: [false]
    });
  }
  /**
   * Method to create particpant replacement form
   */
  createReplacementForm() {
    return this.fb.group({
      replace: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }
  checkAlreadyReplaced(participant: AddParticipantsList) {
    let isAdded = false;
    this.addedParticipantsList?.forEach(element => {
      if (element.identity === participant.identityNumber) isAdded = true;
    });
    return isAdded;
  }
  onReplaceParticipant(value, participant, i) {
    this.showUnavailability = false;
    if (this.checkAlreadyReplaced(participant) === false) {
      const replacParticipant: BulkParticipants = {
        participantId: participant.participantId,
        assessmentType: participant.assessmentType,
        noOfDaysInQueue: participant.noOfDaysInQueue,
        mobileNumber: participant.mobileNumber,
        identityNumber: participant.identityNumber,
        location: participant.location
      };
      if (this.action === ActionEnum.replace) {
        if (this.configurationType === 'adhoc') {
          this.replacedMember = new AddParticipantsList();
          this.replacedMember.assessmentType = participant.assessmentType;
          this.replacedMember.inviteeId = participant.inviteeId;
          this.replacedMember.name = participant.name;
          this.replacedMember.identity = participant.identityNumber;
          this.replacedMember.location = participant.location;
          this.replacedAdhocParticipant = replacParticipant;
        } else if (this.configurationType === 'status') {
          this.replacedParticipant.push(replacParticipant);
        }
        this.replacementForm?.controls.forEach((val, h) => {
          if (h === i) val.get('replace')?.get('english').setValue(value);
          else val.get('replace').get('english').reset();
        });
        if (this.isAmb) {
          this.verifyrepalce(participant);
        } else {
          this.showParticipantErrors = false;
        }
      }
      this.isDisabled = false;
      this.isLocation = participant.location?.english !== this.officeLocation?.english ? true : false;
      /**
       *  This method is to check the warning message for speciality
       */
      if (this.allowedSpecialityList) {
        let hasMatch = false;
        this.allowedSpecialityList.forEach(element => {
          if (element.english === participant.specialty.english) {
            hasMatch = true;
          }
        });
        this.showSpecialityWarning = !hasMatch;
      }
    } else {
      this.showUnavailability = true;
      this.replacementForm.controls[i].get('replace')?.get('english').setValue(false);
    }

    this.displayWarningMsg(participant, value);
  }
  verifyrepalce(participant) {
    const verifyParticipant: BulkParticipants = {
      participantId: participant?.participantId,
      assessmentType: participant.assessmentType,
      noOfDaysInQueue: participant?.noOfDaysInQueue,
      mobileNumber: participant?.mobileNumber,
      identityNumber: participant?.identityNumber,
      location: participant?.location
    };
    this.checkParticipantAvailability.emit(verifyParticipant);
  }

  checkAlreadyAdded(participant: AddParticipantsList) {
    let isAdded = false;
    this.addedParticipantsList?.forEach(element => {
      if (element.identity === participant.identityNumber) isAdded = true;
    });
    return isAdded;
  }
  selectedParticipants(value, participant, i) {
    this.displayWarningMsg(participant, state);
    this.showUnavailability = false;
    if (this.checkAlreadyAdded(participant) === false) {
      if (value === 'true') {
        this.checkForm?.controls[i]?.get('flag').setValue(true);
        this.specialityArray.push(participant?.specialty?.english);
        if (participant?.subSpecialty?.english) {
          this.specialityArray.push(participant?.subSpecialty?.english);
        }
        const bulkParticipant: BulkParticipants = {
          participantId: participant?.participantId,
          assessmentType: participant.assessmentType,
          noOfDaysInQueue: participant?.noOfDaysInQueue,
          mobileNumber: participant?.mobileNumber,
          identityNumber: participant?.identityNumber,
          location: participant?.location
        };
        if (this.isAmb) {
          this.verifyrepalce(participant);
        } else {
          this.showParticipantErrors = false;
        }

        if (this.allowedParticipant) {
          this.counts = this.specialityArray.reduce((accum, x) => {
            accum[x] = accum[x] ? accum[x] + 1 : 1;
            return accum;
          }, {});
          this.displayWarningMsg(participant, value);
        }

        const particpantValue = {
          assessmentType: participant?.assessmentType,
          name: participant?.name,
          inviteeId: participant?.inviteeId,
          identity: participant?.identityNumber,
          location: participant?.location
        };
        // if (participant?.specialty?.english === null || participant?.specialty?.english == undefined) {
        //   this.isDisabled = true;
        // } else {
        //   this.isDisabled = false;
        // }
        this.updateSelect.emit();
        this.count++;
        if (this.count + this.totalNoOfParticipantRecords > this.maxParticipants) this.countExceeded = true;
        else this.countExceeded = false;
        this.bulkParticipants.push(bulkParticipant);
        this.selectParticipants.push(particpantValue);
        if (this.count >= 1) this.isDisabled = false;
      } else {
        this.isLocation = false;
        this.allowedSpeciality = false;
        this.showSpecialityWarning = false;
        this.showParticipantErrors = false;
        this.specialityArray.shift();
        if (participant.subSpecialty?.english) {
          this.specialityArray.shift();
        }
        if (this.isLocation) {
          for (const [key, ] of Object.entries(this.counts)) {
            if (participant?.location?.english === key || this.officeLocation?.english === key) {
              this.counts[key]--;
            }
          }
        }
        if (participant) {
          for (const [key, ] of Object.entries(this.counts)) {
            if (
              participant?.specialty?.english === key ||
              this.allowedSpecialityList.filter(element => element?.english === key)
            )
              this.counts[key]--;
          }
          // this.displayWarningMsg(participant, value);
        }
        this.checkForm?.controls[i]?.get('flag').setValue(false);
        this.bulkParticipants?.forEach((val, h) => {
          if (val?.identityNumber === participant?.identityNumber) {
            this.bulkParticipants.splice(h, 1);
          }
        });
        this.selectParticipants?.forEach((val, h) => {
          if (val?.identity === participant?.identityNumber) {
            this.selectParticipants.splice(h, 1);
          }
        });
        this.countExceeded = false;
        this.updateSelect.emit();
        this.count--;
        if (this.count === 0) {
          this.isDisabled = true;
          this.isLocation = false;
          this.allowedSpeciality = false;
          this.showSpecialityWarning = false;
          this.showSpecialityWarning = false;
          this.showParticipantErrors = false;
        }
      }
    } else {
      this.showUnavailability = true;
      this.checkForm.controls[i].get('flag')?.setValue(false);
    }
  }
  displayWarningMsg(participant, stateValue) {
    this.allowedParticipant = participant;
    const allowedParticipant = JSON.parse(JSON.stringify(this.allowedParticipant));
    for (const [key, value] of Object.entries(allowedParticipant)) {
      for (const [keys, values] of Object.entries(this.counts)) {
        // if (array.includes(participant.specialty.english) && values !== 0) {
        //   this.isNonSpeciality = true;
        // } else if (participant.subSpecialty?.english) {
        //   if (array.includes(participant.specialty.english) && values !== 0) {
        //     this.isNonSpeciality = true;
        //   }
        // } else if (this.isNonSpeciality) {
        //   this.isNonSpeciality = false;
        // }
        if (keys === key && value < values && keys !== undefined) {
          this.isMaxParticipant = true;
        } else if (this.isMaxParticipant && stateValue === 'false') {
          this.isMaxParticipant = false;
        }
        if (participant.location?.english !== this.officeLocation?.english) {
          this.isLocation = true;
        } else if (this.isLocation) {
          this.isLocation = false;
        }
        /**
         *  This method is to check the warning message for speciality
         */
        if (this.allowedSpecialityList) {
          let hasMatch = false;
          this.allowedSpecialityList.forEach(element => {
            if (element?.english === participant?.specialty?.english) {
              hasMatch = true;
            }
          });
          this.showSpecialityWarning = !hasMatch;
        }
      }
    }
  }
  onClickAddParticipants(): void {
    this.selectedAddparticipant = this.bulkParticipants;
    this.showAddParticipant.emit({ temp: this.temp, selectedAddparticipant: this.selectedAddparticipant });
  }
  onAddParticipants() {
    if (this.action === ActionEnum.replace) {
      if (this.configurationType === 'adhoc') {
        this.replaceAdhoc.emit({
          replacedMember: this.replacedMember,
          replacedParticipants: this.replacedAdhocParticipant
        });
      } else this.replace.emit(this.replacedParticipant);
    } else {
      if (this.bulkParticipants.length > 0 || this.selectParticipants.length > 0) {
        this.add.emit(this.bulkParticipants);
        this.update.emit(this.selectParticipants);
      }
    }
  }
  onCancel() {
    this.cancel.emit();
  }
  getParticipants(id: number) {
    this.navigate.emit(id);
  }
  onSelectPage(page: number) {
    if (page - 1 !== this.limit.pageNo) {
      this.limit.pageNo = page - 1;
      this.pageDetails.currentPage = page;
      this.selectPageNo.emit(this.limit);
    }
  }
  onSearchParticipants(value: string) {
    if (value && (value.length >= 3 || value === null)) {
      this.search.emit(value);
      this.isSearched = true;
      this.searchParams = value;
      this.checkAlreadExist(value);
    }
  }
  //To find the already exist participant error message
  checkAlreadExist(value) {
    const participantId = parseInt(value, 10);
    if (value && this.addedParticipantsList.findIndex(participant => participant.identity === participantId) >= 0) {
      this.alreadyExist = true;
    } else {
      this.alreadyExist = false;
    }
  }
  checkParticipantSpecialty() {
    this.addParticipantsList?.forEach(participant => {
      participant.isNoSpeciality = false;
      if (participant?.specialty?.english === null || participant?.specialty?.english === undefined) {
        participant.isNoSpeciality = true;
      }
    });
  }
  onSearchEnabled(key: string) {
    if (!key && this.isSearched) {
      this.isSearched = false;
      this.searchParams = key;
      this.search.emit(key);
    }
  }
  resetSearch() {
    this.search.emit(null);
    this.alreadyExist = false;
  }

  resetPagination() {
    this.limit.pageNo = 0;
    this.pageDetails.currentPage = 1;
    if (this.paginationDcComponent) this.paginationDcComponent.resetPage();
  }
  unCheck() {
    this.count = 0;
    this.checkForm.reset();
    if (this.addParticipantsList)
      this.addParticipantsList.forEach(() => this.checkForm.push(this.createParticipantsCheckbox()));
  }
  onFilter(filterValue: AddMemberFilterRequest) {
    this.filter.emit(filterValue);
    // this.isFilterError =true;
  }
  /**Method to handle tasks when component is destroyed */
  ngOnDestroy(): void {
    this.unCheck();
  }
}
