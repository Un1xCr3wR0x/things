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
  ViewChild
} from '@angular/core';
import { FormArray, FormBuilder , NumberValueAccessor} from '@angular/forms';
import { BilingualText, LanguageToken, LovList, statusBadgeType } from '@gosi-ui/core';
import { PaginationDcComponent } from '@gosi-ui/foundation-theme/src';
import { BehaviorSubject } from 'rxjs';
import { NationalityCategoryEnum } from '../../enums';
import { AddMemberFilterRequest, AddMemberRequest, ContractedMembers, SessionLimitRequest } from '../../models';

@Component({
  selector: 'mb-add-gosi-doctors-dc',
  templateUrl: './add-gosi-doctors-dc.component.html',
  styleUrls: ['./add-gosi-doctors-dc.component.scss']
})
export class AddGosiDoctorsDcComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * Local Variables
   */
  pageDetails = {
    currentPage: 1,
    goToPage: 1
  };
  itemsPerPage = 10;
  currentPage = 1;
  lang = 'en';
  rotatedeg = 360;
  multiCheckForm: FormArray = new FormArray([]);
  addDoctorRequest: AddMemberRequest[] = [];
  isSearched = false;
  noOfDoctors = 0;
  ninId = NationalityCategoryEnum.NIN_ID;
  iqamaId = NationalityCategoryEnum.IQAMA_ID;
  gccId = NationalityCategoryEnum.GCC_ID;
  borderNo = NationalityCategoryEnum.BORDER_NO;
  isDisabled: boolean;
  //Input Variables
  @Input() searchParams = '';
  @Input() addDoctors: boolean;
  @Input() totalRecords: number;
  @Input() fieldOfficeLists: LovList;
  @Input() gosiDoctors: ContractedMembers[] = [];
  @Input() selectedDoctors: ContractedMembers[] = [];
  @Input() limitItem: SessionLimitRequest = new SessionLimitRequest();
  @Input() addedDoctorsList:  ContractedMembers[] = [];
  //Output Variables
  @Output() update = new EventEmitter<ContractedMembers[]>();
  @Output() navigate = new EventEmitter<number>();
  @Output() select: EventEmitter<SessionLimitRequest> = new EventEmitter();
  @Output() add: EventEmitter<AddMemberRequest[]> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  @Output() onFilter: EventEmitter<AddMemberFilterRequest> = new EventEmitter();
  @Output() search: EventEmitter<string> = new EventEmitter();
  @ViewChild('paginationComponent') paginationDcComponent: PaginationDcComponent;
  showUnavailability: boolean;
  index: number;
  /**
   *
   * @param fb
   * @param language
   */
  constructor(readonly fb: FormBuilder, @Inject(LanguageToken) readonly language: BehaviorSubject<string>) { }

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.limitItem && changes.limitItem?.currentValue) {
      this.limitItem = changes.limitItem?.currentValue;
      this.pageDetails.currentPage = this.pageDetails.goToPage = this.limitItem.pageNo + 1;
    }
    if (changes && changes?.gosiDoctors) {
      this.gosiDoctors = changes?.gosiDoctors?.currentValue;
      this.gosiDoctors?.forEach(() => {
        this.multiCheckForm.push(this.createMultiCheckboxForm());
      });
    }
    if (changes && changes?.addedDoctorsList) { 
      this.addedDoctorsList = changes?.addedDoctorsList?.currentValue;
    }
    if (changes && changes.totalRecords) {
      this.totalRecords = changes?.totalRecords?.currentValue;
    }
    if (this.noOfDoctors === 0) this.isDisabled = true;
    else this.isDisabled = false;
  }
  createMultiCheckboxForm() {
    return this.fb.group({
      checkFormFlag: [false]
    });
  }
  checkAlreadyAdded(doctor: ContractedMembers){
    let isAdded = false;
    this.addedDoctorsList.forEach(element => {
      if(element.mbProfessionalId===doctor.mbProfessionalId)
        isAdded=true;
    });
    return isAdded;
  }
  selectDoctor(value, doctor: ContractedMembers, i) {
    if (this.checkAlreadyAdded(doctor)===false) {
      this.index = i;
      if (value === 'true') {
        this.multiCheckForm.controls[this.absoluteIndex(i)].get('flag')?.setValue(true);
        const addDoctorRequest: AddMemberRequest = {
          contractId: doctor.contractId,
          memberType: doctor.contractType,
          mbProfessionalId: doctor.mbProfessionalId,
          inviteeId: doctor?.inviteeId
        };
        this.noOfDoctors++;
        this.addDoctorRequest.push(addDoctorRequest);
        this.selectedDoctors.push(doctor);
        if (this.noOfDoctors >= 1) this.isDisabled = false;
      } else {
        this.multiCheckForm.controls[this.absoluteIndex(i)].get('flag')?.setValue(false);
        this.addDoctorRequest?.forEach((val, h) => {
          if (val?.contractId === doctor?.contractId) this.addDoctorRequest.splice(h, 1);
        });
        this.selectedDoctors?.forEach((val, h) => {
          if (val?.contractId === doctor?.contractId) this.selectedDoctors.splice(h, 1);
        });
        this.noOfDoctors--;
        if (this.noOfDoctors === 0) this.isDisabled = true;
      }
      this.showUnavailability = false;
    }
    else {
      this.showUnavailability = true;
      this.multiCheckForm.controls[this.absoluteIndex(i)].get('checkFormFlag')?.setValue(false);
      this.gosiDoctors[this.absoluteIndex(i)].isAvailable=false;
    }
  }
  onAddGosiDoctor() {
    if (this.addDoctorRequest.length > 0 || this.selectedDoctors.length > 0) {
      if (this.addDoctors) this.add.emit(this.addDoctorRequest);
      else this.update.emit(this.selectedDoctors);
    }
  }
  onApplyFilter(filterValues: AddMemberFilterRequest) {
    this.onFilter.emit(filterValues);
  }
  onCancelTemplate() {
    this.cancel.emit();
  }
  /**
   *
   * @param status method to set status
   */
  statusBadgeTypes(status: string) {
    return statusBadgeType(status);
  }
  getDoctor(personId: number) {
    this.navigate.emit(personId);
  }
  onPaginate(pageNo: number) {
    if (pageNo - 1 !== this.limitItem.pageNo) {
      this.limitItem.pageNo = pageNo - 1;
      this.pageDetails.currentPage = pageNo;
      this.select.emit(this.limitItem);
    }
  }
  /**
   * Method to search for doctor
   * @param value
   */
  onSearchDoctors(value: string) {
    if (value && (value.length >= 3 || value === null)) {
      this.search.emit(value);
      this.isSearched = true;
      this.searchParams = value;
    }
  }
  /**
   * Method to enable search
   * @param key
   */
  onEnableSearch(key: string) {
    if (!key && this.isSearched) {
      this.isSearched = false;
      this.searchParams = key;
      this.search.emit(key);
    }
  }
  //Method to trigger search event
  onSearchReset() {
    this.search.emit(null);
  }
  /**
   * method to reset pagination
   */
  resetPagination() {
    this.pageDetails.currentPage = 1;
    this.limitItem.pageNo = 0;
    if (this.paginationDcComponent) this.paginationDcComponent.resetPage();
  }
  unCheckAllCheckbox() {
    this.noOfDoctors = 0;
    this.multiCheckForm.reset();
    if (this.gosiDoctors) this.gosiDoctors.forEach(() => this.multiCheckForm.push(this.createMultiCheckboxForm()));
  }
  /**Method to handle tasks when component is destroyed */
  ngOnDestroy(): void {
    this.unCheckAllCheckbox();
  }
  /***
   * Method to find the absolute index
   */
  absoluteIndex(indexOnPage: number): number {
    return this.itemsPerPage * (this.currentPage - 1) + indexOnPage;
  }
  isTooltipNeeded(values: BilingualText) {
    const doctorValue = values?.english === null ? values?.arabic : this.lang === 'en' ? values?.english : values?.arabic;
    if (doctorValue?.length > 10) return 1;
    else return 0;
  }
  onIconClicked(value: number) {
    this.gosiDoctors[value].isIconClicked = true;
  }
}
