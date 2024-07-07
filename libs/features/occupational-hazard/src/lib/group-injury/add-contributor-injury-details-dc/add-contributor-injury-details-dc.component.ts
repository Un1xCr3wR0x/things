/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddressDetails, AlertService, ApplicationTypeEnum, ApplicationTypeToken, ContactDetails, LanguageToken, lengthValidator, LovList, markFormGroupTouched, ninValidator, OccupationList, RouterData, RouterDataToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { GroupInjury, InjuryStatistics, OhConstants, OhService, Person, ProcessType } from '../../shared';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ReportGroupInjuryBase } from '../report-group-injury-details-dc/report-group-injury-base-dc';
import { AddressDcComponent } from '@gosi-ui/foundation/form-fragments';
import { GroupInjuryService } from '../../shared/services/group-injury.service';
import { AllowanceType } from '../../shared/enums/allowance-type';


@Component({
  selector: 'oh-add-contributor-injury-details-dc',
  templateUrl: './add-contributor-injury-details-dc.component.html',
  styleUrls: ['./add-contributor-injury-details-dc.component.scss']
})
export class AddContributorInjuryDetailsDcComponent extends ReportGroupInjuryBase implements OnInit, OnChanges {
  isPersonDead = false;
  disableDeath = false;
  addressValidation = false;
  isContibutorDeletedBefore = false;
  workDisabilityDate : Date  = new Date();
  deathDate: Date = new Date();
  contactDetails: ContactDetails = new ContactDetails();
  addressForms = new FormGroup({});
  //Input variables
  @Input() isContributorFound: boolean;
  @Input() injuryStatistics: InjuryStatistics = new InjuryStatistics();
  @Input() contributorGroupInjuryForm: FormGroup;
  @Input() employeeActivityAtInjuryTime: LovList = new LovList([]);
  @Input() socialInsuranceNo;
  @Input() isAppPrivate: boolean;
  @Input() processType = '';
  @Input() person: Person;
  @Input() booleanList: LovList;
  @Input() isdControl: string;
  @Input() injuryReasonList: LovList;
  @Input() cityList: LovList;
  @Input() countryList: LovList;
  @Input() isAddressOptional = false;
  @Input() isAddressPresent = false;
  @Input() isValidator1 = false;
  @Input() emergencyContact: string;
  @Input() workFlowType: string;
  @Input() prohibitInspection = false;
  @Input() showContributorEditMode: boolean;
  @Input() showContributor: boolean;
  @Input() payeeT: number;
  @Input() contributorInjuryDetails: GroupInjury[] = [];
  @Input() contributorInjury: GroupInjury;
  @Input() isSaved: boolean;
  @Input() fail: boolean;
  //Output variables
  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() resetMode: EventEmitter<GroupInjury[]> = new EventEmitter();
  @Output() savedContributor: EventEmitter<GroupInjury> = new EventEmitter();

  @ViewChild('addressForm', { static: false })
  addressForm: AddressDcComponent;
  
  searchContributorForm: FormGroup;
  personDetails: Person = new Person();
  addressDetails : AddressDetails = new AddressDetails();
  addressList : AddressDetails[] = []; 
 
 
  MIN_LENGTH = 10;
  MAX_LENGTH = 10;

  constructor(
    readonly fb: FormBuilder,
    readonly modalService: BsModalService,
    readonly alertService: AlertService,
    readonly groupInjuryService: GroupInjuryService,
    readonly ohService: OhService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {
    super(fb);
  }

  ngOnInit(): void {
    this.alertService.clearAlerts();
    this.searchContributorForm = this.createSearchSaudiForm();
    this.deathDate = this.currentDate;
    this.workDisabilityDate = this.groupInjuryService.getWorkDisabilityDate();
    this.contributorGroupInjuryForm.get('deathDate').get('gregorian').valueChanges.subscribe(deathDate => {
        if (deathDate) {
          this.deathDate = deathDate;
        } else if (deathDate === null) {
          this.deathDate = this.currentDate;
        }
      });
      if(!this.showContributorEditMode){
        this.payeeT = AllowanceType.CONTRIBUTOR;
      }  
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes.isContributorFound && changes.isContributorFound.currentValue){
      this.isContributorFound = changes.isContributorFound.currentValue;
      if(this.isContributorFound)
      {
        this.isSaved=false;
      }
      else{
        this.isSaved=true;
      }
    }
    if (changes.fail && changes.fail.currentValue) {
      this.fail = changes.fail.currentValue;
      this.save();
    }
    // if (changes.isSaved && changes.isSaved.currentValue) {
    //   this.isSaved = changes.isSaved.currentValue;
    // }
    if (changes && changes.employeeActivityAtInjuryTime) {
      const detectChange = this.checkVisiblityCondition();
      if (detectChange) {
        this.employeeActivityAtInjuryTime = changes.employeeActivityAtInjuryTime.currentValue;
        if (this.employeeActivityAtInjuryTime) {
          this.bindOccupation();
        }
      }
    }
    if (changes && changes.contributorGroupInjuryForm && changes.contributorGroupInjuryForm.currentValue) {
      this.contributorGroupInjuryForm = changes.contributorGroupInjuryForm.currentValue;
       this.isPersonDead = this.contributorGroupInjuryForm.get('injuryLeadsToDeathIndicator').value;  
       if(this.searchContributorForm){
         this.contributorGroupInjuryForm.addControl('searchForm', this.searchContributorForm);
       }    
    }
    if(changes && changes.isAddressPresent){
      this.isAddressPresent = changes.isAddressPresent.currentValue;
      if(this.isAddressPresent && this.contributorGroupInjuryForm){
        this.contributorGroupInjuryForm.removeControl('addressForms');
        this.contributorGroupInjuryForm.updateValueAndValidity();
      }
    }
  }
  checkVisiblityCondition() {
    if ((this.isAppPrivate && this.processType !== ProcessType.ADD) || !this.isAppPrivate) {
      return true;
    } else {
      return false;
    }
  }
  cancelAddContributor(){
    this.resetMode.emit();
  }  
   /**
   * Method to create saudi search form
   */
   createSearchSaudiForm() {
    return this.fb.group({
      nin: [
        null,
        {
          validators: Validators.compose([
            Validators.required,
            lengthValidator(this.MIN_LENGTH),
            Validators.maxLength(this.MAX_LENGTH),
            Validators.pattern('[0-9]+'),
            ninValidator
          ]),
          updateOn: 'blur'
        }
      ]
    });
  }
 
  searchContributor(searchValue){
    this.search.emit(searchValue);
  } 
  showFormValidation() {
    if (this.appToken === ApplicationTypeEnum.PUBLIC) {
      this.alertService.clearAlerts();
    }
    this.alertService.showMandatoryErrorMessage();
  }
  validationCheck() {
    if (this.contributorGroupInjuryForm) {
      if (this.contributorGroupInjuryForm.get('injuryLeadsToDeathIndicator').valueChanges) {
        this.isPersonDead = this.contributorGroupInjuryForm.get('injuryLeadsToDeathIndicator').value;
        const deathDate = this.contributorGroupInjuryForm.get('deathDate').get('gregorian');
        if (this.isPersonDead) {
          if (this.routerData.taskId && !this.isAppPrivate) {
            deathDate.setValidators([Validators.required]);
            this.disableDeath = true;
          } else {
            this.addressValidation = true;
            this.enableField(deathDate);
          }
        } else {
          this.addressValidation = false;
          this.deathDate = new Date();
          deathDate.reset();
          this.disableField(deathDate);
        }
        deathDate.updateValueAndValidity();
      }
    }
  } 
  checkValidityForms(){
    let valid= true;
    if(this.groupInjuryService.getAccidentType()){
      this.contributorGroupInjuryForm.get('accidentType').get('english').setValue(this.groupInjuryService.getAccidentType().english);
      this.contributorGroupInjuryForm.get('accidentType').get('arabic').setValue(this.groupInjuryService.getAccidentType().arabic);
    } 
    markFormGroupTouched(this.contributorGroupInjuryForm);
    this.contributorGroupInjuryForm.markAllAsTouched();
    this.contributorGroupInjuryForm.updateValueAndValidity();
    if((this.contributorGroupInjuryForm.get('occupation')?.get('english').value!== null ) && (this.contributorGroupInjuryForm.get('injuryReason')?.get('english').value!== null )){
      this.contributorGroupInjuryForm.get('occupation').markAllAsTouched();
      this.contributorGroupInjuryForm.get('occupation').updateValueAndValidity();  
      this.contributorGroupInjuryForm.get('injuryReason').markAllAsTouched();
      this.contributorGroupInjuryForm.get('injuryReason').updateValueAndValidity();
    }
    else{
      this.alertService.showMandatoryErrorMessage();
      valid = false;
    }
    if(this.contributorGroupInjuryForm.get('addressForms')){
      this.contributorGroupInjuryForm.get('addressForms').markAllAsTouched();
      this.contributorGroupInjuryForm.get('addressForms').updateValueAndValidity();
      if(this.addressForm?.getAddressValidity() === false) {
        if (this.addressForm) {
          markFormGroupTouched(this.addressForm?.parentForm);
        }
        this.alertService.showMandatoryErrorMessage();
        valid = false;
      }
    }
 
    if(this.contributorGroupInjuryForm.get('contactForm')){
      this.contributorGroupInjuryForm.get('contactForm').markAllAsTouched();
      this.contributorGroupInjuryForm.get('contactForm').updateValueAndValidity();
      if(!this.contributorGroupInjuryForm.get('contactForm').valid){
          valid = false;
      }
    }
    if(this.isPersonDead){
      if(this.contributorGroupInjuryForm.get('deathDate').get('gregorian').value!==null){
        this.contributorGroupInjuryForm.get('deathDate').markAllAsTouched();
        this.contributorGroupInjuryForm.get('deathDate').updateValueAndValidity();
      }
      else{
        valid=false;
      }
    }
   return valid;    
  }
 
  setPayee(payeeType){
    this.payeeT = payeeType;
  }
  save(){
    this.alertService.clearAlerts();
    if(!this.checkValidityForms()){
      this.showFormValidation();
    }else{
      if (this.contributorGroupInjuryForm /* && this.contributorGroupInjuryForm.valid */) {
        this.contributorInjury = this.contributorGroupInjuryForm.getRawValue();    
        this.contributorInjury.accidentType = this.groupInjuryService.getAccidentType();
        this.contributorInjury.allowancePayee = this.payeeT;          
        if(!this.showContributorEditMode && this.ohService.getSocialInsuranceNo()){
          this.contributorInjury.contributorId = this.ohService.getSocialInsuranceNo();
          this.contributorInjury.socialInsuranceNo = this.ohService.getSocialInsuranceNo();
        }
        if(this.contributorGroupInjuryForm.get('contactForm') && this.contributorGroupInjuryForm.get('contactForm').get('mobileNo')){
          this.contributorInjury.emergencyContactNo = this.contributorGroupInjuryForm.get('contactForm').get('mobileNo').value;
        }
        this.contributorInjury.injuryDate = this.ohService.getInjuryDate();        
        if (this.contributorGroupInjuryForm.get('treatmentCompleted.english').value === 'No') {
          this.contributorInjury.treatmentCompleted = false;
        } else if (this.contributorGroupInjuryForm.get('treatmentCompleted.english').value === 'Yes') {
          this.contributorInjury.treatmentCompleted = true;
        } 
        this.contributorInjury.groupInjuryId = OhConstants.GROUP_INJURY_ID+this.contributorInjury.contributorId;       
        
        this.isPersonDead = this.contributorGroupInjuryForm.get('injuryLeadsToDeathIndicator').value;        
        this.contributorInjury.injuryLeadsToDeathIndicator = this.isPersonDead;        
        if(this.contributorGroupInjuryForm?.get('saudiAddress')?.valid){
          this.addressDetails = this.contributorGroupInjuryForm.get('saudiAddress').value;
          this.addressList.push(this.addressDetails);
        }
        
        if(this.contributorGroupInjuryForm?.get('poBoxAddress')?.valid){          
          this.addressDetails = this.contributorGroupInjuryForm.get('poBoxAddress').value;          
          this.addressList.push(this.addressDetails);
        } 
        
        if(this.contributorGroupInjuryForm?.get('foreignAddress')?.valid){         
          this.addressDetails = this.contributorGroupInjuryForm.get('foreignAddress').value;
          this.addressList.push(this.addressDetails);
        }
        this.updateAddress(this.addressList);
        this.contributorInjury.person = this.person;
        if(!this.checkContributorAlreadyAdded()){
          if (!this.showContributorEditMode) {                 
            this.isSaved=true;
            this.fail=false;
            this.contributorInjury.isInjuryReasonNull = false; 
            this.contributorInjury.isEdited = false;
            this.contributorInjury.isDeleted = false;  
            this.contributorInjuryDetails.push(this.contributorInjury);           
            this.savedContributor.emit(this.contributorInjury);          
          }else{
            if(this.contributorInjuryDetails && this.contributorInjury.groupInjuryId){
              this.contributorInjuryDetails.forEach(injury => {
                if(injury.bulkInjuryRequestItemId === this.groupInjuryService.getBulkInjuryRequestItemId()){
                  injury.accidentType = this.contributorInjury.accidentType;
                  injury.allowancePayee = this.contributorInjury.allowancePayee;                  
                  injury.occupation = this.contributorInjury.occupation;
                  injury.injuryReason = this.contributorInjury.injuryReason;   
                  if(injury.injuryReason){
                    injury.isInjuryReasonNull = false;  
                  }                             
                  injury.emergencyContactNo = this.contributorInjury.emergencyContactNo;
                  injury.injuryDate = this.contributorInjury.injuryDate;
                  injury.treatmentCompleted = this.contributorInjury.treatmentCompleted;
                  injury.person =  this.contributorInjury.person;
                  injury.injuryLeadsToDeathIndicator = this.contributorInjury.injuryLeadsToDeathIndicator;
                  if(this.isPersonDead){
                    injury.deathDate = this.contributorInjury.deathDate;
                  }
                  injury.isEdited = true;
                  injury.isDeleted = false;  
                }
              });                        
              this.isSaved=true;
              this.fail=false; 
              this.alertService.showSuccessByKey('OCCUPATIONAL-HAZARD.GROUP-INJURY.CONTRIBUTOR_UPDATED_SUCCESSFULLY');                
            }
          }
          this.resetMode.emit(this.contributorInjuryDetails);    
        } else{
          this.alertService.showErrorByKey('OCCUPATIONAL-HAZARD.GROUP-INJURY.CONTRIBUTOR_ALREADY_ADDED');
        }      
          
      }else {
       this.showFormValidation();
      }
    }    
  }
  updateAddress(addresses: AddressDetails[]){
    if(!this.person.contactDetail){
      this.person.contactDetail = new ContactDetails();
    }
    if(this.person.contactDetail.addresses && this.person.contactDetail.addresses.length>0){
      this.person.contactDetail.addresses = [];
    }
    addresses.forEach(address => {      
          let newAddress = new AddressDetails();
          newAddress.type = address.type;
          newAddress.additionalNo = address.additionalNo;
          newAddress.buildingNo = address.buildingNo;
          newAddress.city = address.city;
          newAddress.cityDistrict = address.cityDistrict;
          newAddress.district = address.district;
          newAddress.country = address.country;
          newAddress.detailedAddress = address.detailedAddress;
          newAddress.postBox = address.postBox;
          newAddress.postalCode = address.postalCode;
          newAddress.streetName  = address.streetName;
          this.person.contactDetail.addresses.push(newAddress);
        }
      );    
  }
  checkContributorAlreadyAdded(){
    let exists = false;
    if(this.contributorInjuryDetails && this.contributorInjuryDetails.length>0){
      this.contributorInjuryDetails.forEach(element => {      
        if(!this.showContributorEditMode){
          if(!element.isDeleted && this.ohService.getSocialInsuranceNo() === element.contributorId){
            exists = true;
          }else {
            if(element.isDeleted && this.ohService.getSocialInsuranceNo() === element.contributorId){
              this.isContibutorDeletedBefore = true;
            //  this.contributorInjuryDetails = this.contributorInjuryDetails.filter(item => item.contributorId !== this.ohService.getSocialInsuranceNo());
            } 
          }

        }        
      });
    }
    return exists;
  }

  filterReason() {
    if (this.processType === ProcessType.MODIFY || this.processType === ProcessType.REOPEN) {
      if (this.viewInjuryDetails && this.viewInjuryDetails.injuryReason && !this.viewInjuryDetails?.reasonActive) {
        this.reasonList = new LovList([]);
        this.reasonList.items = this.injuryreasonList?.items.filter(
          item => item.value.english !== this.viewInjuryDetails.injuryReason.english
        );
        this.injuryreasonList = this.reasonList;
      }
    }
  }
}
