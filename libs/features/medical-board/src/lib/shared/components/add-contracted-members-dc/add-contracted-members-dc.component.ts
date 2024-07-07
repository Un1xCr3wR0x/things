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
import { FormArray, FormBuilder } from '@angular/forms';
import { AppConstants, BilingualText, LanguageToken, LovList, statusBadgeType } from '@gosi-ui/core';
import { PaginationDcComponent } from '@gosi-ui/foundation-theme/src';
import { BehaviorSubject } from 'rxjs';
import { GeneralEnum, NationalityCategoryEnum } from '../../enums';
import {
  AddMemberFilterRequest,
  AddMemberRequest,
  AddMembersResponse,
  ContractedMembers,
  SessionLimitRequest
} from '../../models';

@Component({
  selector: 'mb-add-contracted-members-dc',
  templateUrl: './add-contracted-members-dc.component.html',
  styleUrls: ['./add-contracted-members-dc.component.scss']
})
export class AddContractedMembersDcComponent implements OnInit, OnChanges, OnDestroy {
  selectedMemberList = new BehaviorSubject<AddMembersResponse[]>([]);
  pageDetails = {
    currentPage: 1,
    goToPage: 1
  };
  lang = 'en';
  itemsPerPage = 10;
  currentPage = 1;
  count = 0;
  rotatedeg = 360;
  isSearched = false;
  showWarning = false;
  ninId = NationalityCategoryEnum.NIN_ID;
  iqamaId = NationalityCategoryEnum.IQAMA_ID;
  gccId = NationalityCategoryEnum.GCC_ID;
  borderNo = NationalityCategoryEnum.BORDER_NO;
  index: number;
  memberContractId: number;
  inputCheckForm: FormArray = new FormArray([]);
  addMemberRequest: AddMemberRequest[] = [];
  isDisabled: boolean;
  //Input Variables
  @Input() addMembers: boolean;
  @Input() isContractedMember = false;
  @Input() totalResponse: number;
  @Input() contractedMembers: ContractedMembers[] = [];
  @Input() selectedMembers: ContractedMembers[] = [];
  @Input() limit: SessionLimitRequest = new SessionLimitRequest();
  @Input() specialityLists: LovList;
  @Input() fieldOfficeLists: LovList;
  @Input() searchParams = '';
  @Input() isAmb: boolean;
  @Input() showErrors: boolean;
  @Input() isAdhoc: boolean;
  @Input() availableMsg: BilingualText;
  @Input() addedMembersList: ContractedMembers[] = [];
  //Output Variables
  @Output() updateSelection = new EventEmitter<ContractedMembers[]>();
  @Output() navigate = new EventEmitter<number>();
  @Output() paginate: EventEmitter<SessionLimitRequest> = new EventEmitter();
  @Output() add: EventEmitter<AddMemberRequest[]> = new EventEmitter();
  @Output() update: EventEmitter<ContractedMembers[]> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  @Output() filter: EventEmitter<AddMemberFilterRequest> = new EventEmitter();
  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() checkAvailability: EventEmitter<AddMemberRequest> = new EventEmitter();
  @ViewChild('paginationComponent') paginationDcComponent: PaginationDcComponent;
  showUnavailability: boolean;

  constructor(readonly fb: FormBuilder, @Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.showErrors = false;
    this.showWarning = false;
    this.language.subscribe(language => {
      this.lang = language;
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.limit && changes.limit.currentValue) {
      this.limit = changes.limit.currentValue;
      this.pageDetails.currentPage = this.pageDetails.goToPage = this.limit.pageNo + 1;
    }
    if (changes && changes?.contractedMembers) {
      this.contractedMembers = changes?.contractedMembers?.currentValue;
      // this.contractedMembers?.forEach(() => {
      //   this.inputCheckForm.push(this.createCheckboxForm());
      // });
    }
    if (changes && changes?.addedMembersList) {
      this.addedMembersList = changes?.addedMembersList?.currentValue;
    }
    if (changes?.totalResponse?.currentValue) {
      this.totalResponse = changes?.totalResponse?.currentValue;
      // to show checkbox using count and initializing form using count 
      if(this.inputCheckForm.length === 0) {
        for(let i = 0; i<this.totalResponse ;i++ ){
          this.inputCheckForm.push(this.createCheckboxForm());
        }
      }
    }
    if (changes && changes.specialityLists) {
      this.specialityLists = changes.specialityLists.currentValue;
    }
    if (changes && changes.fieldOfficeLists) {
      this.fieldOfficeLists = changes.fieldOfficeLists.currentValue;
    }
    if (changes && changes.showErrors) {
      this.showErrors = changes.showErrors.currentValue;
    }
    if (changes && changes.availableMsg) {
      this.availableMsg = changes.availableMsg.currentValue;
    }
    if (this.availableMsg) {
      if (this.showErrors) {
        this.showWarning = false;
        this.inputCheckForm.controls[this.absoluteIndex(this.index)].get('flag')?.setValue(false);
        this.contractedMembers[this.absoluteIndex(this.index)].isAvailable = false;
        this.addMemberRequest?.forEach((val, h) => {
          if (val?.contractId === this.memberContractId) this.addMemberRequest.splice(h, 1);
        });
        this.selectedMembers?.forEach((val, h) => {
          if (val?.contractId === this.memberContractId) this.selectedMembers.splice(h, 1);
        });
        this.count--;
      } else {
        if (this.index >= 0) this.showWarning = true;
      }
    }
    if (this.count === 0) this.isDisabled = true;
    else this.isDisabled = false;
  }
  createCheckboxForm() {
    return this.fb.group({
      flag: [false]
    });
  }
  checkAlreadyAdded(member: ContractedMembers){
    let isAdded = false;
    this.addedMembersList.forEach(element => {
      if(element.nationalId===member.nationalId)
        isAdded=true;
    });
    return isAdded;
  }
  selectMember(value, member: ContractedMembers, i) {
    if (this.checkAlreadyAdded(member)===false) {
      this.index = i;
      if (value === 'true') {
        this.inputCheckForm.controls[this.absoluteIndex(i)].get('flag')?.setValue(true);
        const addMemberRequest: AddMemberRequest = {
          contractId: member.contractId,
          memberType: member.contractType,
          mbProfessionalId: member.mbProfessionalId,
          inviteeId: member?.inviteeId
        };
        this.memberContractId = member.contractId;
        if (this.isAmb) {
          this.checkAvailability.emit(addMemberRequest);
        } else {
          this.showWarning = false;
          this.showErrors = false;
        }
        this.count++;
        this.addMemberRequest.push(addMemberRequest);
        this.selectedMembers.push(member);
        if (this.count >= 1) this.isDisabled = false;
      } else {
        this.showWarning = false;
        this.inputCheckForm.controls[this.absoluteIndex(i)].get('flag')?.setValue(false);
        this.addMemberRequest?.forEach((val, h) => {
          if (val?.contractId === member?.contractId) this.addMemberRequest.splice(h, 1);
        });
        this.selectedMembers?.forEach((val, h) => {
          if (val?.contractId === member?.contractId) this.selectedMembers.splice(h, 1);
        });
        this.count--;
        if (this.count === 0) this.isDisabled = true;
      }
      this.showUnavailability=false;
    }
    else {
      this.showUnavailability=true;
      this.inputCheckForm.controls[this.absoluteIndex(i)].get('flag')?.setValue(false);
      this.contractedMembers[this.absoluteIndex(i)].isAvailable=false;
    }
  }
  onAddMembers() {
    if (this.addMemberRequest.length > 0 || this.selectedMembers.length > 0) {
      if (this.addMembers) this.add.emit(this.addMemberRequest);
      else this.update.emit(this.selectedMembers);
    }
  }
  onCancelValues() {
    this.cancel.emit();
  }
  /**
   *
   * @param status method to set status
   */
  statusBadgeTypes(status: string) {
    return statusBadgeType(status);
  }
  getMembers(id: number) {
    this.navigate.emit(id);
  }
  onSelectPage(page: number) {
    if (page - 1 !== this.limit.pageNo) {
      this.limit.pageNo = page - 1;
      this.pageDetails.currentPage = this.currentPage = page;
      this.paginate.emit(this.limit);
    }
  }
  /**
   * method to reset pagination
   */
  resetPagination() {
    this.pageDetails.currentPage = 1;
    this.limit.pageNo = 0;
    if (this.paginationDcComponent) this.paginationDcComponent.resetPage();
  }
  unCheckAll() {
    this.count = 0;
    this.inputCheckForm.reset();
    if (this.contractedMembers)
      this.contractedMembers.forEach(() => this.inputCheckForm.push(this.createCheckboxForm()));
  }
  /**Method to handle tasks when component is destroyed */
  ngOnDestroy(): void {
    this.unCheckAll();
    this.showErrors = false;
    this.showWarning = false;
  }
  onFilterApply(filterData: AddMemberFilterRequest) {
    this.filter.emit(filterData);
  }
  /***
   * Method to find the absolute index
   */
  absoluteIndex(indexOnPage: number): number {
    return this.itemsPerPage * (this.currentPage - 1) + indexOnPage;
  }
  isTooltipNeeded(name: BilingualText) {
    const contributor = name?.english === null ? name?.arabic : this.lang === 'en' ? name?.english : name?.arabic;
    if (contributor && contributor?.length > 10) return 1;
    else return 0;
  }
  onSearchMember(value: string) {
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
  onResetSearch() {
    this.search.emit(null);
  }
  isIconClicked(value: number) {
    this.contractedMembers[this.absoluteIndex(value)].isIconClicked = true;
  }
}
