import { Component, Input, EventEmitter, Output, OnInit, OnChanges, SimpleChanges, TemplateRef } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup, AbstractControl } from '@angular/forms';
import { LovList, Lov, BilingualText, lessThanValidator, startOfDay } from '@gosi-ui/core';
import { PersonTypeEnum, CreateSessionService } from '../../../../shared';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
  ContractedMembers,
  IndividualSessionDetails,
  RescheduleSessionData,
  UnAvailableMemberListResponse
} from '../../../../shared/models';

@Component({
  selector: 'mb-medicalboard-member-details-dc',
  templateUrl: './medicalboard-member-details-dc.component.html',
  styleUrls: ['./medicalboard-member-details-dc.component.scss']
})
export class MedicalboardMemberDetailsDcComponent implements OnInit, OnChanges {
  @Input() label: string;
  @Input() specialityList: LovList;
  @Input() subspecialityList: LovList[];
  @Input() parentForm: FormGroup;
  @Input() isSubspeciality = false;
  @Input() isRegularSession = false;
  @Input() isAdhocSession = false;
  @Input() officeLocation: BilingualText;
  @Input() isPrimaryMedicalBoard = true;
  @Input() isAmb = true;
  @Input() isEditMode = false;
  @Input() configurationDetails: IndividualSessionDetails;
  @Input() selectedMembers: ContractedMembers[];
  @Input() selectedDoctors: ContractedMembers[];
  @Input() isModify = false;
  @Input() unAvailableMemberList: UnAvailableMemberListResponse[];
  @Input() officeLocationChangeValue: BilingualText;
  @Output() add: EventEmitter<null> = new EventEmitter();
  @Output() addMember: EventEmitter<null> = new EventEmitter();
  @Output() addDoctor: EventEmitter<null> = new EventEmitter();
  @Output() select = new EventEmitter<{ speciality: Lov; index: number }>();
  @Output() remove: EventEmitter<number> = new EventEmitter();
  @Output() onRemove: EventEmitter<null> = new EventEmitter();
  @Output() navigateToProfile: EventEmitter<number> = new EventEmitter();
  @Input() sessionData: RescheduleSessionData;
  @Input() submitDisable;
  @Input() isInCharge: boolean;
  @Input() isNotOfficer: boolean;
  blankList = new LovList([]);
  membersList = [];
  adhocList = [];
  adhocValues = { name: 'member 1', nin: 1234 };
  medicalBoardForm: FormArray = new FormArray([]);
  isDisabled = true;
  memberIndex = 0;
  isMembersLength = true;
  modalRef: BsModalRef;
  noOfConctractedDr = 0;
  noOfGosiDr = 0;
  disabled = false;
  showMsg = false;
  unavai = false;
  UnavailableDrRemoved = false;
  isTimeDisabled = false;

  constructor(
    readonly fb: FormBuilder,
    readonly modalService: BsModalService,
    readonly sessionService: CreateSessionService
  ) {}

  /**
   * Method to detect chnages in input property
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.isEditMode) this.isEditMode = changes.isEditMode.currentValue;
    if (changes && changes.configurationDetails) {
      this.configurationDetails = changes.configurationDetails.currentValue;
      this.isSessionAlreadyStarted();
    }

    if (changes && changes.isPrimaryMedicalBoard) {
      this.isPrimaryMedicalBoard = changes.isPrimaryMedicalBoard.currentValue;
      this.medicalFormValidation();
    }
    if (changes && changes.isAmb) {
      this.isAmb = changes.isAmb.currentValue;
    }
    if (changes && changes.selectedMembers && changes.selectedMembers.currentValue) {
      this.selectedMembers = changes.selectedMembers.currentValue;
      this.setData();
    }
    if (changes && changes.selectedDoctors) {
      this.selectedDoctors = changes.selectedDoctors.currentValue;
    }
    if (this.unAvailableMemberList) {
      this.unAvailableTime();
      this.setData();
    }
    if (
      changes.configurationDetails?.firstChange === false &&
      this.configurationDetails &&
      this.isEditMode &&
      changes.isEditMode?.firstChange === undefined
    ) {
      this.bindToform(this.configurationDetails);
    }
  }
  ngOnInit() {
    this.sessionService.getSelectedMembers().subscribe(members => {
      if (members && members.length) this.setData();
    });
  }
  /**
   * Method to remove a doctor in pmb
   */
  setData() {
    this.noOfGosiDr = this.selectedMembers?.filter(
      val => val.contractType?.english === PersonTypeEnum.GosiDoctor
    )?.length;
    this.noOfConctractedDr = this.selectedMembers.filter(
      val => val.contractType?.english === PersonTypeEnum.ContractedDoctor
    )?.length;
    this.selectedMembers.forEach(item => {
      if (item?.contractType?.english === PersonTypeEnum.Nurse) {
        item.isHide = true;
      } else item.isHide = false;
      if (item?.contractType?.english === PersonTypeEnum.ContractedDoctor) {
        if (this.noOfConctractedDr > 1) item.isHide = true;
        else item.isHide = false;
      } else {
        if (item?.contractType?.english === PersonTypeEnum.GosiDoctor) {
          if (this.noOfGosiDr > 1) item.isHide = true;
          else item.isHide = false;
        }
      }
      if (item.isUnavailableDr) {
        item.isHide = true;
      }
      // } else {
      //   item.isHide = false;
      // }
    });
  }
  /**
   * Method to do check unavailable member in selected time
   */
  unAvailableTime() {
    this.selectedMembers.forEach(member => {
      this.unAvailableMemberList.filter(unavilable => {
        if (member.nationalId === unavilable.identity) {
          member.isUnavailableDr = true;
        }
      });
    });
  }
  /**
   * Method to do medical form validation
   */
  medicalFormValidation() {
    this.medicalBoardForm.reset();
    this.parentForm.removeControl('primarymedicalForm');
    this.parentForm.removeControl('appealmedicalForm');
    if (this.isEditMode && this.configurationDetails?.memberDetails?.length > 0) {
      this.membersList = this.configurationDetails?.memberDetails;
    } else if (this.isEditMode === false) {
      if (this.isPrimaryMedicalBoard) {
        this.membersList = [1];
        if (this.isRegularSession) {
          this.membersList.forEach(() => {
            this.medicalBoardForm.push(this.createMedicalBoardForm());
          });
          if (this.parentForm) this.parentForm.addControl('primarymedicalForm', this.medicalBoardForm);
        }
      } else {
        this.medicalBoardForm = new FormArray([]);
        this.membersList = [1, 2, 3];
        if (this.isRegularSession) {
          this.membersList.forEach(() => {
            this.medicalBoardForm.push(this.createMedicalBoardForm());
          });
          if (this.parentForm) {
            this.parentForm.removeControl('primarymedicalForm');
            this.parentForm.addControl('appealmedicalForm', this.medicalBoardForm);
          }
        }
      }
    }
  }
  /**
   * Method to bind to form
   * @param sessionDetails
   */
  bindToform(configurationDetails) {
    configurationDetails?.doctorDetails?.forEach((doctor, i) => {
      this.membersList.push(i + 1);
      this.medicalBoardForm?.push(this.createMedicalBoardForm());
      this.bindMembercontrolToForm(this.medicalBoardForm?.controls[i]?.get('speciality'), doctor.speciality);
      this.specialityList?.items.forEach((item, h) => {
        if (item?.value?.english === doctor?.speciality?.english) {
          this.onSelect(item, i);
        }
      });

      /**
       * Method to Prepopulate data of allocation percentage
       */
      this.medicalBoardForm?.controls[i]?.get('allocationPercentage').setValue(doctor?.allocationPercentage);
      this.medicalBoardForm?.controls[i]?.get('allocationPercentage').updateValueAndValidity();
      this.bindMembercontrolToForm(this.medicalBoardForm?.controls[i]?.get('subspeciality'), doctor?.subSpeciality);
    });
    if (this.isPrimaryMedicalBoard) {
      this.medicalBoardForm?.controls.forEach((value, i) => {
        if (i > 0) this.medicalBoardForm?.controls[i]?.get('speciality')?.get('english')?.clearValidators();
      });
    } else if (!this.isPrimaryMedicalBoard) {
      this.medicalBoardForm?.controls.forEach((value, i) => {
        if (i > 2) this.medicalBoardForm?.controls[i]?.get('speciality')?.get('english')?.clearValidators();
      });
    }
    if (this.isPrimaryMedicalBoard) this.parentForm?.addControl('primarymedicalForm', this.medicalBoardForm);
    else {
      this.parentForm?.removeControl('primarymedicalForm');
      this.parentForm?.addControl('appealmedicalForm', this.medicalBoardForm);
    }
    /**
     * Method to check if the session has started
     */
  }
  isSessionAlreadyStarted() {
    if (this.isEditMode && !this.isRegularSession) {
      const starttime = this.configurationDetails?.startTime.split('::');
      starttime[1] = starttime[1] !== undefined ? starttime[1] : '00';
      const startTime = starttime[0] + ':' + starttime[1];
      let hours = new Date().getHours().toString();
      hours = hours.length === 1 ? '0' + hours.toString() : hours;
      let _min = new Date().getMinutes().toString();
      _min = _min.length === 1 ? '0' + _min.toString() : _min;
      const currentTime = hours + ':' + _min;
      if (moment(this.configurationDetails?.startDate?.gregorian).isBefore(startOfDay(new Date()))) {
        this.isTimeDisabled = true;
      } else if (
        moment(this.configurationDetails?.startDate?.gregorian).isSame(startOfDay(new Date())) &&
        startTime < currentTime
      ) {
        this.isTimeDisabled = true;
      }
    }
  }
  absoluteIndex(i: number) {
    if (this.isPrimaryMedicalBoard) return i - 1;
    else if (!this.isPrimaryMedicalBoard) return i;
  }
  setIndex(i: number) {
    if (this.isPrimaryMedicalBoard) return i + 2;
    else if (!this.isPrimaryMedicalBoard) return i + 1;
  }
  /**
   * Method to bind controls to form
   * @param formValue
   * @param value
   */
  bindMembercontrolToForm(formValue: AbstractControl, value: BilingualText) {
    if (value) {
      formValue?.get('english')?.setValue(value?.english);
      formValue?.get('arabic')?.setValue(value?.arabic);
    } else {
      formValue?.get('english')?.setValue(null);
      formValue?.get('arabic')?.setValue(null);
    }
  }

  /**
   * Method to create form for allocationPercentage
   */

  createMedicalBoardForm() {
    return this.fb.group({
      speciality: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      subspeciality: this.fb.group({
        english: [null],
        arabic: [null]
      }),
      allocationPercentage: [
        null,
        {
          validators: Validators.compose([Validators.required, Validators.min(1), Validators.max(100)]),
          updateOn: 'blur'
        }
      ]
    });
  }

  /**
   * Method to create form
   */

  createAdhocForm() {
    return this.fb.group({
      speciality: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      name: [null, { validators: Validators.required }],
      nin: [null, { validators: Validators.required }]
    });
  }
  /**
   * Method to add new members
   */
  onAddMember() {
    if (this.medicalBoardForm.valid) {
      this.membersList.push(this.membersList.length);
      this.medicalBoardForm.push(this.createMedicalBoardForm());
      this.add.emit();
    }
  }
  onAddContractedMembers() {
    this.addMember.emit();
  }
  onAddGosiDoctors() {
    this.addDoctor.emit();
  }
  /**
   * Method to trigger event while selecting speciality
   * @param speciality
   * @param index
   */
  onSelect(speciality: Lov, index: number) {
    this.select.emit({ speciality: speciality, index: index });
    if (index >= 0) {
      this.medicalBoardForm?.controls[index]?.get('speciality')?.valueChanges.subscribe(() => {
        this.medicalBoardForm?.controls[index]?.get('subspeciality').reset();
      });
    }
  }
  /**
   * Method to delete the value of Prepopulated
   */

  onDeleteField(index: number) {
    this.membersList.splice(index, 1);
    this.medicalBoardForm.controls[index].get('speciality').reset();
    this.medicalBoardForm.controls[index].get('subspeciality').reset();
    this.medicalBoardForm.controls[index].get('allocationPercentage').reset();
    this.medicalBoardForm.removeAt(index);
  }
  onRemoveMember(index: number, isDrUnavailable: boolean) {
    this.remove.emit(index);
    this.onRemove.emit();
    if (isDrUnavailable) {
      this.UnavailableDrRemoved = true;
      // this.selectedMembers[index].isUnavailableDr=false;
    }

    // this.modalRef?.hide();
  }
  cancelRemoving() {
    this.modalRef.hide();
  }
  showRemoveModal(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template);
  }
  navigationToProfile(identificationNo: number) {
    this.navigateToProfile.emit(identificationNo);
  }
  onValidateForm() {
    for (let i = 0; i < 1; i++) {
      if (this.medicalBoardForm?.controls[i]?.get('speciality')?.valid) {
        this.memberIndex++;
      } else {
        this.isDisabled = true;
      }
    }
    if (this.memberIndex === 1) this.isDisabled = false;
    this.medicalBoardForm.controls.forEach((value, index) => {
      if (index >= 2) {
        if (value.valid) this.isDisabled = false;
        else this.isDisabled = true;
      }
    });
  }
  getMembers(element, index) {
    if (index < 1) this.onValidateForm();
    else {
      if (
        this.medicalBoardForm.controls[index].get('name').valid &&
        this.medicalBoardForm.controls[index].get('nin').valid &&
        this.medicalBoardForm.controls[index].get('speciality').valid
      )
        this.isDisabled = false;
      else this.isDisabled = true;
    }
  }
  onValidateRegularSessionForm() {
    if (this.isPrimaryMedicalBoard) {
      this.medicalBoardForm?.controls[0]?.get('speciality').clearValidators();
      this.medicalBoardForm?.controls[0]?.get('speciality').disable();
    } else {
      this.medicalBoardForm?.controls[0]?.get('speciality').setValidators(Validators.required);
      this.medicalBoardForm?.controls[0]?.get('speciality').enable();
    }
  }
}
