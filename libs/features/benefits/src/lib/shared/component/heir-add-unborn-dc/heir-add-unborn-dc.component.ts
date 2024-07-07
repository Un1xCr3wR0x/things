/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, HostListener, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HeirUnbornRequest, DependentDetails } from '../../models';
import { LovList, Name, Lov, GosiCalendar, startOfDay } from '@gosi-ui/core';
import { BenefitValues } from '../../enum/benefit-values';
import { HeirBenefitService } from '../../services';
import { ActionType } from '../../enum/action-type';
import { getMotherList } from '../../utils/heirOrDependentUtils';

@Component({
  selector: 'bnt-heir-add-unborn-dc',
  templateUrl: './heir-add-unborn-dc.component.html',
  styleUrls: ['./heir-add-unborn-dc.component.scss']
})
export class HeirAddUnbornDcComponent implements OnInit, OnChanges {
  isSmallScreen: boolean;
  minDate: Date;
  heirList: LovList;
  heir: Lov[] = [];
  addUnbornForm: FormGroup;
  disabled = false;

  //Input and Output variables
  @Input() hideOptionalLabel = true;
  @Input() heirDetails: DependentDetails[];
  @Input() parentForm: FormGroup;
  @Input() unbornHeir: DependentDetails;
  @Input() contributorDeathOrMissingDate: GosiCalendar;
  // @Input() addUnbornForm: FormGroup;

  //output variables
  @Output() save = new EventEmitter();
  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  motherId: number;

  constructor(readonly heirBenefitService: HeirBenefitService, private fb: FormBuilder) {}

  ngOnInit(): void {
    const date = new Date();
    this.minDate = new Date(date.setDate(date.getDate()));
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.heirDetails && changes.heirDetails.currentValue) {
      this.addUnbornForm = this.createUnbornForm();
      this.heirDetails = changes.heirDetails.currentValue;
      this.heirList = getMotherList(this.heirDetails);

      if (this.heirList && this.heirList.items && this.heirList.items.length === 1) {
        this.disabled = true;
        this.motherId = this.heirList.items[0].code;
        this.addUnbornForm.get('mothersId').patchValue(this.heirList.items[0].value);
        this.addUnbornForm.get('mothersId').updateValueAndValidity();
      }
    }
    if (changes.unbornHeir && changes.unbornHeir.currentValue) {
      this.unbornHeir = changes.unbornHeir.currentValue;
      if (this.unbornHeir && this.unbornHeir.expectedDob && this.unbornHeir.expectedDob.gregorian) {
        this.addUnbornForm
          .get('expectedDob')
          .get('gregorian')
          .patchValue(new Date(this.unbornHeir.expectedDob.gregorian));
        this.addUnbornForm.get('mothersId').patchValue(this.unbornHeir.motherId);
        this.addUnbornForm.get('mothersId').updateValueAndValidity();
        this.addUnbornForm.get('expectedDob').updateValueAndValidity();
      }
    }
  }
  /*
   * This method  is to create heir form
   */
  createUnbornForm() {
    if (!this.addUnbornForm) {
      return this.fb.group({
        mothersId: this.fb.group({
          english: [null, { updateOn: 'blur', validators: Validators.required }],
          arabic: [null, { updateOn: 'blur' }]
        }),
        expectedDob: this.fb.group({
          gregorian: [null, { validators: Validators.required }],
          hijiri: [null]
        })
      });
    } else {
      return this.addUnbornForm;
    }
  }
  cancelTransaction() {
    this.cancel.emit(true);
    // this.addUnbornForm.reset();
  }

  selectedMother(event: Lov) {
    this.motherId = event.code;
  }

  saveDetails() {
    if (this.addUnbornForm.valid) {
      const heirRequestDetails = new HeirUnbornRequest();
      if (this.addUnbornForm.get('expectedDob')) {
        heirRequestDetails.expectedDob = this.addUnbornForm.get('expectedDob').value;
        heirRequestDetails.expectedDob.gregorian = startOfDay(heirRequestDetails.expectedDob.gregorian);
      }
      heirRequestDetails.motherId = this.motherId;
      heirRequestDetails.orphan = false;
      heirRequestDetails.unborn = true;
      heirRequestDetails.relationship = { arabic: 'حمل مستكن', english: 'Unborn' };
      heirRequestDetails.dependentSource = BenefitValues.gosi;
      if (this.unbornHeir && this.unbornHeir.expectedDob) {
        heirRequestDetails.actionType = ActionType.MODIFY;
      } else {
        heirRequestDetails.actionType = ActionType.ADD;
      }
      // heirRequestDetails.dateOfBirth = heirRequestDetails.expectedDob
      this.heirBenefitService.setUnbornRequest(heirRequestDetails);
      this.save.emit(heirRequestDetails);
    } else {
      this.addUnbornForm.markAllAsTouched();
    }
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    const scrWidth = window.innerWidth;
    this.isSmallScreen = scrWidth <= 992 ? true : false;
  }
}
