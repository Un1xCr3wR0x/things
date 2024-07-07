/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, Output, EventEmitter, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LookupService, LovList, GosiCalendar, Lov, startOfDay } from '@gosi-ui/core';
import { SystemParameter } from '@gosi-ui/features/contributor';
import { Observable } from 'rxjs';
import { DependentDetails, ValidateRequest } from '../../models';
import moment from 'moment';
import { ActionType } from '../../enum/action-type';
import { Status } from '../../enum';

@Component({
  selector: 'bnt-dependent-modify-status-dc',
  templateUrl: './dependent-modify-status-dc.component.html',
  styleUrls: ['./dependent-modify-status-dc.component.scss']
})
export class DependentModifyStatusDcComponent implements OnInit, OnChanges {
  /**local variables */

  isUserActive = true; //TODO: Remove this section after confirmation
  // relationship: string;
  dependentModifyForm: FormGroup;
  reasonForm: FormGroup;
  listYesNo$ = new Observable<LovList>();
  reasonForModification: Lov;
  maxDateGregorian: Date;
  status = Status;

  /** input and Output  */
  @Input() dependentDetail: DependentDetails;
  @Input() systemParameter: SystemParameter;
  @Input() dependentStatusUpdated: ValidateRequest;
  @Input() dependentStatusResp: ValidateRequest;
  @Input() systemRunDate: GosiCalendar;
  @Input() reasonsList: LovList;

  @Output() cancelEdit = new EventEmitter();
  @Output() saveDependent = new EventEmitter();
  @Output() validateDependentModifyReason = new EventEmitter();
  @Output() statusDate = new EventEmitter();
  // @Output() updateDependentStatus = new EventEmitter();
  // reasonList: Lov[] = [];

  constructor(readonly lookupService: LookupService, readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.listYesNo$ = this.lookupService.getYesOrNoList();
    this.dependentModifyForm = this.createDependentModifyForm();
    this.reasonForm = this.createReasonForm();
    // this.reasonList = this.dependentDetail.reasonForModifyLov;

    //init the radio button if the user is in inactive state
    //No need confirmed from BA
    // if (this.dependentDetail.status.english === Status.INACTIVE) {
    //   this.initializeRadioButton(this.dependentDetail.relationship.english);
    // }
  }

  /*
   * This method is to detect changes in input property
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (changes.systemRunDate && changes.systemRunDate.currentValue) {
        this.maxDateGregorian = moment(changes.systemRunDate.currentValue.gregorian).toDate();
      }
    }
  }

  createDependentModifyForm() {
    return this.fb.group({});
  }

  createReasonForm() {
    return this.fb.group({
      reasonSelect: this.fb.group({
        english: [null, Validators.required],
        arabic: [null]
      }),
      statusDate: this.fb.group({
        gregorian: [null, Validators.required],
        hijiri: [null]
      })
    });
  }

  /** this will initialize the questions for reactivating the user */
  //TODO: Remove this section after confirmation
  // initializeRadioButton(relationship: string) {
  //   //check if the dependent is male
  //   if (
  //     relationship === 'Son' ||
  //     relationship === 'Father' ||
  //     relationship === 'Husband' ||
  //     relationship === 'Brother' ||
  //     relationship === 'Grand Son' ||
  //     relationship === 'Grand Father'
  //   ) {
  //     // check the questions to be asked for male dependents
  //     if (this.dependentDetail.age >= this.systemParameter.DEPENDENT_STUDENT_SON_BAR_AGE_MIN) {
  //       this.makeFieldRequired('disabled');
  //     } else if (this.dependentDetail.age >= this.systemParameter.RETIREMENT_AGE) {
  //       this.makeFieldRequired('currentlyActive');
  //     } else if (
  //       this.dependentDetail.age >= this.systemParameter.DEPENDENT_STUDENT_SON_BAR_AGE_MIN &&
  //       this.dependentDetail.age <= this.systemParameter.DEPENDENT_SON_MAX_AGE
  //     ) {
  //       this.makeFieldRequired('student');
  //     }
  //   }
  //   //check if the dependent is female
  //   else if (
  //     relationship === 'Wife' ||
  //     relationship === 'Daughter' ||
  //     relationship === 'Mother' ||
  //     relationship === 'Sister' ||
  //     relationship === 'Grand Daughter' ||
  //     relationship === 'Grand Mother'
  //   ) {
  //     // check the questions to be asked for Female dependents
  //     this.makeFieldRequired('divorced');
  //     // this.makeFieldRequired('widowed');
  //   }
  // }

  /** this function will save the reason for modification   */
  //TODO: Remove this section after confirmation
  saveReactivateDependent() {
    const dependent = {
      actionType: ActionType.MODIFY,
      dateOfBirth: this.dependentDetail.birthDate,
      personId: this.dependentDetail.personId,
      relationship: this.dependentDetail.relationship,
      disabled: this.depedentStatusSelected('disabled'),
      divorced: this.depedentStatusSelected('divorced'),
      widowed: this.depedentStatusSelected('widowed'),
      student: this.depedentStatusSelected('student'),
      employed: this.depedentStatusSelected('currentlyActive'),
      maritalStatus: this.dependentDetail.maritalStatus,
      disabilityDescription: this.dependentDetail.disabilityDescription
    };
    this.saveDependent.emit(dependent);
  }

  /*
   * This method is for cancel action
   */
  cancel() {
    this.cancelEdit.emit();
  }

  /**
   *  This method is for making field required
   */
  //TODO: Remove this section after confirmation
  makeFieldRequired(field: string) {
    const control = this.fb.group({
      english: [null, Validators.required],
      arabic: null
    });
    this.dependentModifyForm.addControl(field, control);
  }

  /**
   *
   * @param formControlName  disabled,student,active
   * @param value yes/no
   */
  //TODO: Remove this section after confirmation
  radioButtonSelected(formControlName: string, value: string) {
    if (formControlName === 'divorced') {
      if (value === 'No') {
        this.makeFieldRequired('widowed');
      }
      //remove is widowed question if the user selected yes in divorced
      else if (value === 'Yes') {
        if (this.dependentModifyForm.controls.widowed) {
          this.dependentModifyForm.removeControl('widowed');
        }
      }
    }
  }

  reasonSelected(reason: Lov) {
    this.reasonForModification = reason; // to change
    const dependent = {
      actionType: ActionType.MODIFY,
      dateOfBirth: this.dependentDetail.birthDate,
      personId: this.dependentDetail.personId,
      relationship: this.dependentDetail.relationship,
      maritalStatus: this.dependentDetail.maritalStatus,
      disabilityDescription: this.dependentDetail.disabilityDescription,
      reasonForModification: reason.value
    };
    this.validateDependentModifyReason.emit(dependent);
  }

  //TODO: Remove this section after confirmation
  depedentStatusSelected(status: string) {
    let selected = false;
    if (this.dependentModifyForm.get(status)) {
      selected = this.dependentModifyForm.get(status).value.english === 'Yes';
    }
    return selected;
  }

  saveReasonForDepStatusChange() {
    let statusDate: GosiCalendar = new GosiCalendar();
    statusDate = this.reasonForm.get('statusDate').value;
    statusDate.gregorian = startOfDay(statusDate.gregorian);
    const dependent = {
      actionType: ActionType.MODIFY,
      personId: this.dependentDetail.personId,
      statusDate: statusDate,
      reasonForModification: this.reasonForModification.value,
      heirStatus: this.dependentStatusResp.status ? this.dependentStatusResp.status : null,
      status: this.dependentStatusResp.pensionStatus,
      relationship: this.dependentDetail.relationship
    };
    this.statusDate.emit(dependent);
  }
}
