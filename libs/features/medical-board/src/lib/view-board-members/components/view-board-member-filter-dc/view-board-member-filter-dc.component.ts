/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BilingualText, LanguageToken, LovList } from '@gosi-ui/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { MemberFilter, MemberRequest } from '../../../shared';

@Component({
  selector: 'mb-view-board-member-filter-dc',
  templateUrl: './view-board-member-filter-dc.component.html',
  styleUrls: ['./view-board-member-filter-dc.component.scss']
})
export class ViewBoardMemberFilterDcComponent implements OnInit {
  /**
   * Component local variables
   */
  lang = 'en';
  memberFilterForm: FormGroup;
  statusFilterForm: FormGroup;
  selectedMemberOptions: Array<BilingualText>;
  selectedSpecialityOptions: Array<BilingualText>;
  selectedServiceRegionOptions: Array<BilingualText>;
  selectedStatusOptions: Array<BilingualText>;
  memberValue: BilingualText[] = [];
  speciality: BilingualText[] = [];
  serviceRegion: BilingualText[] = [];
  statusValue: BilingualText[] = [];
  memberFilter: MemberFilter = new MemberFilter();
  memberRequest: MemberRequest = new MemberRequest();

  /**
   *Input variables
   */
  @Input() region: LovList;
  @Input() specialty: LovList;
  @Input() doctorType: LovList;

  /**
   *observables
   */
  specialty$: Observable<LovList>;
  region$: Observable<LovList>;
  doctorType$: Observable<LovList>;

  /**
   * Status list Values
   */
  transactionStatusList = [
    {
      english: 'Active',
      arabic: 'نشيط'
    },
    {
      english: 'Inactive',
      arabic: 'غير نشيط'
    }
  ];

  /**
   *Output variables
   */
  @Output() memberDetailsFilter: EventEmitter<MemberFilter> = new EventEmitter();

  constructor(private fb: FormBuilder, @Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}
  /** Method to initialize the component. */
  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.statusFilterForm = this.fb.group({
      items: new FormArray([])
    });
    this.transactionStatusList.forEach(() => {
      const control = new FormControl(false);
      (this.statusFilterForm.controls.items as FormArray).push(control);
    });
    this.memberFilterForm = this.createFilterForm();
  }

  /**
   * This method is to filter the list based on the multi filters
   */
  applyFilter(): void {
    if (this.selectedMemberOptions && this.selectedMemberOptions.length >= 1) {
      this.memberValue = this.selectedMemberOptions;
    } else {
      this.memberValue = null;
    }
    if (this.selectedStatusOptions && this.selectedStatusOptions.length >= 1) {
      this.statusValue = this.selectedStatusOptions;
    } else {
      this.statusValue = null;
    }
    if (this.selectedSpecialityOptions && this.selectedSpecialityOptions.length >= 1) {
      this.speciality = this.selectedSpecialityOptions;
    } else {
      this.speciality = null;
    }
    if (this.selectedServiceRegionOptions && this.selectedServiceRegionOptions.length >= 1) {
      this.serviceRegion = this.selectedServiceRegionOptions;
    } else {
      this.serviceRegion = null;
    }
    this.memberFilter.doctorType = this.memberValue;
    this.memberFilter.listOfRegion = this.serviceRegion;
    this.memberFilter.specialty = this.speciality;
    this.memberFilter.listOfStatus = this.statusValue;
    this.memberDetailsFilter.emit(this.memberFilter);
  }

  /**
   * This method is to create filter form
   */
  createFilterForm() {
    return this.fb.group({
      specialty: this.fb.group({
        english: [null],
        arabic: []
      }),
      region: this.fb.group({
        english: [null],
        arabic: []
      }),
      doctorType: this.fb.group({
        english: [null],
        arabic: []
      })
    });
  }

  /**
   * This method is to clear the filters
   */
  clearAllFiters(): void {
    this.selectedMemberOptions = null;
    this.selectedSpecialityOptions = null;
    this.selectedStatusOptions = null;
    this.selectedServiceRegionOptions = null;
    this.statusFilterForm.reset();
    this.memberFilterForm.reset();
    this.memberDetailsFilter.emit(this.memberFilter);
  }

  /**
   * This method is to clear the filter member values
   */
  memberFilterClear() {
    this.selectedMemberOptions = null;
  }

  /**
   * This method is to clear the filter region values
   */
  regionFilterClear() {
    this.selectedServiceRegionOptions = null;
  }

  /**
   * This method is to clear the filter speciality values
   */
  specialityFilterClear() {
    this.selectedSpecialityOptions = null;
  }

  /**
   * This method is to clear the filter status values
   */
  statusFilterClear() {
    this.selectedStatusOptions = null;
    this.statusFilterForm.reset();
  }
}
