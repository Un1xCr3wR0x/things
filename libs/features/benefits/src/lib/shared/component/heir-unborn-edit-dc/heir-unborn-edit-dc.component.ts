import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  BorderNumber,
  CommonIdentity,
  GosiCalendar,
  Iqama,
  Lov,
  LovList,
  Name,
  NationalId,
  NIN,
  Passport
} from '@gosi-ui/core';
import { DependentHeirConstants } from '../../constants';
import moment from 'moment';
import { DependentDetails, UnbornEdit } from '../../models';
import { getIdLabel, getIdRemoveNullValue } from '../../utils';

@Component({
  selector: 'bnt-heir-unborn-edit-dc',
  templateUrl: './heir-unborn-edit-dc.component.html',
  styleUrls: ['./heir-unborn-edit-dc.component.scss']
})
export class HeirUnbornEditDcComponent implements OnInit, OnChanges {
  reasonForm: FormGroup;
  maxDate: Date;
  isDeathOfChild = false;
  birthOfChild = false;
  isSmallScreen: boolean;
  unbornMaxDate: Date;
  unbornMinDate: Date;

  /**
   * Input
   */
  @Input() reasonsList: LovList;
  @Input() unbornDetails: DependentDetails;
  @Input() motherDetails: DependentDetails;
  @Input() systemRunDate: GosiCalendar;
  @Input() eligibilityStartDate: GosiCalendar;

  /**
   * Output
   */
  @Output() saveUnborn: EventEmitter<UnbornEdit> = new EventEmitter<UnbornEdit>();
  @Output() cancelEdit: EventEmitter<boolean> = new EventEmitter<boolean>();
  idValue: string;
  idLabel: string;

  constructor(readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.reasonForm = this.createReasonForm();
    this.isSmallScreen = window.innerWidth <= 768 ? true : false;
    if (this.unbornDetails?.unbornModificationReason) {
      this.prefillTheForm();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.systemRunDate && changes.systemRunDate.currentValue) {
      this.maxDate = moment(changes.systemRunDate.currentValue.gregorian).toDate();
    }
    if (changes?.eligibilityStartDate?.currentValue) {
      this.eligibilityStartDate = changes?.eligibilityStartDate.currentValue;
      this.unbornMinDate = moment(this.eligibilityStartDate?.gregorian).toDate();
      this.unbornMaxDate = moment(this.eligibilityStartDate.gregorian).add(9, 'M').toDate();
    }
    if (changes.motherDetails && changes.motherDetails.currentValue) {
      this.setMotherIdentity(this.motherDetails);
    }
  }

  prefillTheForm() {
    this.reasonForm.get('unbornModificationReason').patchValue(this.unbornDetails?.unbornModificationReason);
    const reasonLov = new Lov();
    reasonLov.value = this.unbornDetails?.unbornModificationReason;
    this.reasonSelected(reasonLov);
    if (reasonLov.value.english === DependentHeirConstants.Death) {
      this.reasonForm.get('deathDate').patchValue(this.unbornDetails?.deathDate);
    } else {
      this.reasonForm.get('dateOfBirth').patchValue(this.unbornDetails?.dateOfBirth);
      this.reasonForm.get('noOfChildren').patchValue(this.unbornDetails?.noOfChildren);
    }
  }
  setMotherIdentity(dependentDetails: DependentDetails) {
    if (dependentDetails.identity) {
      const idObj: CommonIdentity | null = dependentDetails.identity.length
        ? getIdRemoveNullValue(dependentDetails.identity)
        : null;
      if (idObj) {
        this.idValue = idObj.id.toString();
        this.idLabel = getIdLabel(idObj);
      }
    }
  }

  createReasonForm() {
    return this.fb.group({
      unbornModificationReason: this.fb.group({
        english: [null, Validators.required],
        arabic: [null]
      })
    });
  }

  reasonSelected(reason: Lov) {
    if (!reason) return;
    this.isDeathOfChild = false;
    this.birthOfChild = false;
    if (reason.value.english === DependentHeirConstants.Death) {
      this.isDeathOfChild = true;
      this.reasonForm.removeControl('dateOfBirth');
      this.reasonForm.removeControl('noOfChildren');
      this.reasonForm.addControl(
        'deathDate',
        this.fb.group({
          gregorian: [null, Validators.required],
          hijiri: [null],
          entryFormat: [null]
        })
      );
    } else {
      this.birthOfChild = true;
      this.reasonForm.removeControl('deathDate');
      this.reasonForm.addControl(
        'dateOfBirth',
        this.fb.group({
          gregorian: [null, Validators.required],
          hijiri: [null],
          entryFormat: [null]
        })
      );
      this.reasonForm.addControl('noOfChildren', new FormControl(null, Validators.required));
    }
  }

  cancel() {
    this.cancelEdit.emit(true);
  }

  save() {
    if (this.reasonForm.valid) {
      const reasonFormValue = this.reasonForm.getRawValue();
      reasonFormValue['unbornDetails'] = this.unbornDetails;
      this.saveUnborn.emit(reasonFormValue);
    }
  }
}
