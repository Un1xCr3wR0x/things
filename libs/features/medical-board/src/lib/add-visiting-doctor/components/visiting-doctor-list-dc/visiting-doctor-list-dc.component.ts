/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, EventEmitter, Output, Input, SimpleChanges, Inject, ViewChild, OnChanges } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { LanguageToken, LovList } from '@gosi-ui/core';
import { PaginationDcComponent } from '@gosi-ui/foundation-theme';
import { BehaviorSubject } from 'rxjs';
import { MBConstants, MbList, SessionLimitRequest } from '../../../shared';
import { VisitingFilterRequest } from '../../../shared/models/visiting-filter-request';

@Component({
  selector: 'mb-visiting-doctor-list-dc',
  templateUrl: './visiting-doctor-list-dc.component.html',
  styleUrls: ['./visiting-doctor-list-dc.component.scss']
})
export class VisitingDoctorListDcComponent implements OnInit, OnChanges {
  pageDetails = {
    currentPage: 1,
    goToPage: 1
  };
  currentPage = 1;
  lang: string;
  // selectedVisitingDoctor = [];
  disableRadio= false;
  visitingForm: FormArray = new FormArray([]);
  visitingDoctorList: LovList = new LovList([]);
  addedDoctor: MbList;
  isSearched = false;
  @Input() locationList: LovList;
  @Input() regionList: LovList;
  @Input() specialtyList: LovList;
  @Input() doctorList: MbList[] = [];
  @Input() totalResponse: number;
  @Input() limit: SessionLimitRequest = new SessionLimitRequest();
  @Input() searchParams = '';
  @Input() itemsPerPage: number;
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  @Output() filter: EventEmitter<VisitingFilterRequest> = new EventEmitter();
  @Output() add: EventEmitter<MbList> = new EventEmitter();
  @Output() navigate = new EventEmitter<number>();
  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() paginate: EventEmitter<number> = new EventEmitter();
  @ViewChild('paginationComponent') paginationDcComponent: PaginationDcComponent;
  isDisabled: boolean;
  constructor(readonly fb: FormBuilder, @Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.visitingForm?.push(this.createVisitingForm());
    this.visitingDoctorList = new LovList(MBConstants.REPLACEMENT_LIST);
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.isDisabled = true;
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes?.doctorList) {
      this.doctorList = changes?.doctorList?.currentValue;
      this.doctorList?.forEach(() => {
        this.visitingForm?.push(this.createVisitingForm());
      });
    }
    if (changes && changes.limit && changes.limit.currentValue) {
      this.limit = changes.limit.currentValue;
      this.pageDetails.currentPage = this.pageDetails.goToPage = this.limit.pageNo + 1;
    }
    if (changes && changes.totalResponse) {
      this.totalResponse = changes?.totalResponse?.currentValue;
    }
  }
  createVisitingForm() {
    return this.fb.group({
      addDoctor: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }

  onsearchVisitingDoctor(value: string) {
    if (value && (value.length >= 3 || value === null)) {
      this.search.emit(value);
      this.isSearched = true;
      this.searchParams = value;
    }
  }
  onSearchEnable(key: string) {
    if (!key && this.isSearched) {
      this.isSearched = false;
      this.searchParams = key;
      this.search.emit(key);
    }
  }
  resetSearch() {
    this.search.emit(null);
  }
  selectedDoctor(value, doctor, i) {
    this.isDisabled = false;
    const selectedVisitingDoctor: MbList = {
      name: doctor.name,
      identity: doctor.identity,
      mobileNo: doctor.mobileNo,
      specialty: doctor.specialty,
      region: doctor.region,
      doctorType: doctor.doctorType,
      status: doctor.status,
      fee: doctor.fee,
      mbProfessionId: doctor.mbProfessionId,
      contractId: doctor.contractId,
      nameOfTheMedicalProvider: doctor.nameOfTheMedicalProvider,
      idType: doctor.idType
    };

    // if ((this.selectedVisitingDoctor.length = 1)) {
    //   this.disableRadio = true;
    // }
    // this.disableRadio = false;
    this.visitingForm?.controls.forEach((val, h) => {
      if (h === i) val.get('addDoctor')?.get('english').setValue(value);
      else val.get('addDoctor').get('english').reset();
      this.addedDoctor = selectedVisitingDoctor;
    });
  }
  onFilter(filterValue: VisitingFilterRequest) {
    this.filter.emit(filterValue);
  }
  getDoctor(id: number) {
    this.navigate.emit(id);
  }
  onCancel() {
    this.cancel.emit();
  }
  onAddDoctor() {
    this.add.emit(this.addedDoctor);
  }
  onSelectPage(page: number) {
    // this.paginate.emit(page);
    if (this.pageDetails.currentPage !== page) {
      this.pageDetails.currentPage = page;
      this.paginate.emit(this.pageDetails.currentPage);
    }
  }
  resetPagination() {
    this.pageDetails.currentPage = 1;
    this.limit.pageNo = 0;
    if (this.paginationDcComponent) this.paginationDcComponent.resetPage();
  }
}
