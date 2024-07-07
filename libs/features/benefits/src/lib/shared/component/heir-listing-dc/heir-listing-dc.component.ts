/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, EventEmitter, Output, HostListener } from '@angular/core';
import { FormArray, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import {
  LovList,
  BilingualText,
  GosiCalendar,
  IdentityTypeEnum,
  CommonIdentity,
  checkIqamaOrBorderOrPassport
} from '@gosi-ui/core';
import {
  AttorneyDetailsWrapper,
  DependentDetails,
  BenefitDetails,
  AnnuityResponseDto,
  SearchPerson,
  PersonalInformation,
  HeirPersonIds,
  HeirDetailsRequest,
  ValidateRequest,
  SystemParameter,
  UnbornEdit,
  BankAccountList
} from '../../models';
import { ListPersonBaseComponent } from '../base/list-person.base.component';
import { ActionType, HeirStatus, BenefitValues } from '../../enum';
import { getIdentityLabel } from '../../utils';

@Component({
  selector: 'bnt-heir-listing-dc',
  templateUrl: './heir-listing-dc.component.html',
  styleUrls: ['./heir-listing-dc.component.scss']
})
export class HeirListingDcComponent extends ListPersonBaseComponent implements OnInit {
  heirFormGroup: FormArray;
  isSmallScreen: boolean;
  ActionType = ActionType;
  isCheckedBox = false;
  statusEdit = new FormControl('', Validators.required);
  heirStatusEnums = HeirStatus;
  benefitValues = BenefitValues;
  /**
   * Input Variables
   */
  // For heir modify
  // @Input() page: string;
  //For payment
  @Input() attorneyDetailsWrapper: AttorneyDetailsWrapper[];
  @Input() payeeList: LovList;
  @Input() paymentMethodList: LovList;
  @Input() systemRunDate: GosiCalendar;
  @Input() heirList: LovList;
  @Input() listOfGuardians: DependentDetails[];
  @Input() annuityRelationShip: LovList;
  @Input() maritalStatusList: LovList;
  @Input() heirStatus: LovList = null;
  @Input() saveApiResp: BilingualText;
  @Input() nationalityList$: Observable<LovList>;
  @Input() heirStatusArr: string[];
  @Input() preselctdAttorney = <AttorneyDetailsWrapper[]>[];
  @Input() isHeadingLight = true;
  @Input() listOfValues: DependentDetails[];
  @Input() bankDetails: BankAccountList;
  @Input() bankDetailsArray: BankAccountList[];
  @Input() bankNameArray: BilingualText[];

  @Input() benefitDetails: BenefitDetails;
  @Input() annuityResponse: AnnuityResponseDto;
  @Input() benefitType: string;
  @Input() heirValidated = false;
  @Input() guardianDetails: PersonalInformation;
  @Input() reasonForBenefit: HeirDetailsRequest;
  @Input() heirStatusUpdated: ValidateRequest;
  @Input() unborn: PersonalInformation;
  @Input() contributorDeathOrMissingDate: GosiCalendar;
  //start or stop waive
  @Input() waiveTowardsList$: Observable<LovList>;
  @Input() genderList: LovList;
  /**
   * Unborn
   */
  @Input() referenceNo: number;
  @Input() benefitRequestId: number;
  @Input() isBankAccountRequired = true;
  /**
   * Pension Reform
   */
  @Input() eligibleForPensionReform = false;
  /**
   * Output Variables
   */
  @Output() search = new EventEmitter();
  @Output() getBankForid: EventEmitter<number> = new EventEmitter();
  @Output() getBankAtIndex: EventEmitter<{ id: number; index: number }> = new EventEmitter();
  @Output() searchForGuardian: EventEmitter<SearchPerson> = new EventEmitter();
  @Output() validateHeir: EventEmitter<DependentDetails> = new EventEmitter();
  @Output() statusDate = new EventEmitter();
  @Output() getAuthPeronContactDetails: EventEmitter<HeirPersonIds> = new EventEmitter();
  @Output() searchPerson: EventEmitter<SearchPerson> = new EventEmitter();
  @Output() addValidatedHeir: EventEmitter<DependentDetails> = new EventEmitter();
  @Output() getRelationshipListByGender: EventEmitter<BilingualText> = new EventEmitter();
  // @Output() validateUnborn: EventEmitter<DependentDetails> = new EventEmitter();
  /**
   * Reasion for modification
   */

  @Output() editHeirModifyReason = new EventEmitter();
  @Output() openEligibilityRulesPopup = new EventEmitter();
  /**
   * Unborn
   */
  @Output() unbornEdited: EventEmitter<UnbornEdit> = new EventEmitter<UnbornEdit>();
  @Output() addNewBorn: EventEmitter<DependentDetails> = new EventEmitter<DependentDetails>();
  // @HostListener('click', ['$event.target']) onClick(e){
  //   this.listOfValues.map(item=>{
  //     item.isOpenPopOver = false;
  //     return item;
  //   })
  // }
  /*
   * This method is for initialisation tasks
   */
  ngOnInit(): void {
    this.getScreenSize();
    // this.checkActionType()
    if (this.heirActionType) {
      // Get prepopulated values
      this.checkListValue = this.createFormData(this.isValidator, true, this.heirActionType);
      if (this.parentForm) {
        this.parentForm.addControl('listOfHeirs', this.checkListValue);
      }
    }
  }

  /*
   * This method is for delete heir
   */
  deleteHeir(heirDetail) {
    this.delete.emit(heirDetail);
  }

  searchHeir(data) {
    this.search.emit(data);
  }

  validate(data: DependentDetails) {
    this.validateHeir.emit(data);
  }

  // unbornValidate(data: DependentDetails) {
  //   this.validateUnborn.emit(data);
  // }

  resetUnbornSearch() {
    this.resetSearch.emit();
  }

  getBankDetails(id: number) {
    this.getBankForid.emit(id);
  }
  getBankDetailsAtIndex(id: number, index: number) {
    this.getBankAtIndex.emit({ id: id, index: index });
  }
  findGuardian(data: SearchPerson) {
    this.searchForGuardian.emit(data);
  }

  searchUnborn(data: SearchPerson) {
    this.searchPerson.emit(data);
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    const scrWidth = window.innerWidth;
    this.isSmallScreen = scrWidth <= 992 ? true : false;
  }

  authPeronContactDetails(ids: HeirPersonIds, actionType: string) {
    const selectedHeir = this.listOfValues.filter(item => item.personId === ids.HeirId);
    // To keep the modified contact details for selected auth person
    if (selectedHeir.length && selectedHeir[0].lastModifiedAuthPersonId !== ids.authPersonId) {
      this.getAuthPeronContactDetails.emit(ids);
    }
  }

  validateHeirModifyReason(event) {
    this.editHeirModifyReason.emit(event);
  }

  updateStatusDate(event) {
    this.statusDate.emit(event);
  }
  checkIdentity(index: number) {
    if (this.listOfValues) {
      const value = checkIqamaOrBorderOrPassport(this.listOfValues[index]?.identity);
      return value?.id;
    }
  }
  checkIdentityLabel(index: number) {
    if (this.listOfValues) {
      const value = checkIqamaOrBorderOrPassport(this.listOfValues[index]?.identity);
      return getIdentityLabel(value);
    }
  }

  heirAdd(heir: DependentDetails) {
    this.addValidatedHeir.emit(heir);
  }

  saveUnborn(data: UnbornEdit) {
    this.unbornEdited.emit(data);
  }

  newBorn(data: DependentDetails, index: number) {
    data.replaceItemWithIndex = index;
    this.addNewBorn.emit(data);
  }

  openEligibilityRules() {
    this.openEligibilityRulesPopup.emit();
  }
}
