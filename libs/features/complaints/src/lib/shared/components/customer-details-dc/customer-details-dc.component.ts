/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  BilingualText,
  DocumentItem,
  GosiCalendar,
  LanguageToken,
  Lov,
  LovList,
  emailValidator,
  iqamaValidator,
  lengthValidator,
  ninValidator,
  getArabicName
} from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { ComplaintConstants, LovListConstants } from '../../constants';
import { ContactService } from '../../services';
import { ActivatedRoute } from '@angular/router';
import { PersonalInformation } from '@gosi-ui/features/contributor';
import { IdentityEnum } from '../../enums';
import { ChangePersonService } from '@gosi-ui/features/customer-information/lib/shared';

@Component({
  selector: 'ces-customer-details-dc',
  templateUrl: './customer-details-dc.component.html',
  styleUrls: ['./customer-details-dc.component.scss']
})
export class CustomerDetailsDcComponent implements OnInit {
  /*
   * Local variables
   */
  MIN_LENGTH = 10;
  MAX_LENGTH = 10;
  businessKey: number;
  contactTypeForm: FormGroup;
  document: DocumentItem = new DocumentItem();
  isSuggestions = false;
  lang = 'en';
  referenceNo: number;
  subTypeLabel: string;
  subTypePlaceholder = ComplaintConstants.TYPE_PLACEHOLDER;
  transactionId: string;
  typeLabel: string;
  typePlaceholder = ComplaintConstants.TYPE_PLACEHOLDER;
  identityTypeList: LovList;
  isTypeSelected = false;
  currentDate: Date = new Date();
  customerName: any;
  customerDateOfBirth: GosiCalendar = new GosiCalendar();
  customerId: any;
  customerAge: any;
  userRoles: LovList;
  commonList: Lov[] = [];
  warningMessage: BilingualText ={english: 'This person is a customer of GOSI. Please select the role of the person in GOSI for which the request has to be raised',arabic: 'هذا الشخص هو أحد عملاء التأمينات الاجتماعية. يرجى تحديد صفة العميل في التأمينات الاجتماعية الذي سيتم رفع الطلب له.'}
  isFromQuickLink = false;
  selectedRole: any;
  maskedData = false;
  missingPhone = false;
  @Input() isPublicApp = false;
  /*
   * Input variables
   */
  @Input() showHeight = false;
  @Input() parentForm: FormGroup = new FormGroup({});
  @Input() person: PersonalInformation;
  @Input() isVerify: boolean = false;
  @Input() isShowNewEmployeeDetails: boolean = false;
  @Input() nin: any;
  @Input() iqamaNo: any;
  @Input() dateofbirth: any;
  /**
   * output variables
   *  */
  @Output() typeSelect: EventEmitter<BilingualText> = new EventEmitter();
  @Output() roleSelect: EventEmitter<BilingualText> = new EventEmitter();
  @Output() isOnReset: EventEmitter<null> = new EventEmitter();
  userList: boolean;

  /**
   *
   * @param language
   * @param location
   * @param fb
   */
  constructor(
    readonly route: ActivatedRoute,
    readonly contactService: ContactService,
    readonly changePersonService: ChangePersonService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly location: Location,
    readonly fb: FormBuilder
  ) {}

  /**
   * method to initialise tasks
   */
  ngOnInit(): void {
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    this.contactTypeForm = this.createContactTypeForm();
    this.identityTypeList = new LovList(LovListConstants.ID_TYPE_LIST);
    this.parentForm.removeControl('contactTypeForm');
    if (this.parentForm) {
      this.parentForm.addControl('contactTypeForm', this.contactTypeForm);
    }
    const personId = this.route.snapshot.paramMap.get('personId');
    this.transactionId = this.route.snapshot.paramMap.get('transactionId');
    if(personId){
    this.contactService.getPersonById(personId).subscribe(data1 => {
      this.isFromQuickLink = true;
     let data: any = data1;
      if(Object.keys(data.name.english).length == 0){
        data.name.english.name = getArabicName(data.name.arabic);
      }

      // Handle Masked Data 
      if(data.contactDetail?.maskedData){
        this.maskedData = true;
        this.contactTypeForm.get('mobileNo').get('primary').setValue("");
        this.contactTypeForm.get('email').setValue("");
      }

      let phoneNumber: string = data.contactDetail?.mobileNo?.primary;
      if(!phoneNumber || phoneNumber.length === 0) {
        this.missingPhone = true;
      }
      this.customerName = data.name;
      this.customerAge = data.ageInHijiri;
      this.customerDateOfBirth = data.birthDate;
      let identity: any = data.identity;
        let iqamaDetails = identity.filter(item => item.idType == 'IQAMA');
        let ninDetails = identity.filter(item => item.idType == 'NIN');
        if(iqamaDetails.length > 0){
        this.customerId = iqamaDetails[0].iqamaNo;
        } else if(ninDetails.length > 0){
        this.customerId = ninDetails[0].newNin;
        } else{
          this.customerId = personId;
        }
        if(!this.transactionId){
      this.getUserRoles(this.customerId);
        }
    })
  } else{
    if(this.isShowNewEmployeeDetails){
      this.customerId = this.nin;
      this.customerDateOfBirth = this.dateofbirth;
    }
    this.customerName = this.person.name;
    if(!this.customerName.english.name){
      this.customerName.english.name = this.person.name.arabic?.firstName + '' + this.person.name.arabic?.secondName +''+ this.person.name.arabic?.familyName;    }
    this.customerAge = this.person.ageInHijiri;
    this.customerDateOfBirth = this.person.birthDate;
    let identity: any = this.person.identity;
        let iqamaDetails = identity.filter(item => item.idType == 'IQAMA');
        let ninDetails = identity.filter(item => item.idType == 'NIN');
        if(iqamaDetails.length > 0){
        this.contactTypeForm.get('idType').get('english').setValue(IdentityEnum.IQAMA_NUMBER);
        this.customerId = iqamaDetails[0].iqamaNo;
        } else if(ninDetails.length > 0){
        this.contactTypeForm.get('idType').get('english').setValue(IdentityEnum.NATIONAL_IDENTIFICATION_NUMBER);
        this.customerId = ninDetails[0].newNin;
        } else{
          this.customerId = this.person.personId;
        }
        
    if(this.customerId){
      this.getUserRoles(this.customerId);
      }
    this.contactTypeForm.get('name').setValue(getArabicName(this.person?.name.arabic));
    this.contactTypeForm.get('idNumber').setValue(this.customerId);
    this.contactTypeForm.get('birthDate').get('hijiri').setValue(this.person?.birthDate.hijiri);
    this.contactTypeForm.get('birthDate').get('gregorian').setValue(this.person?.birthDate.gregorian);
    // Handle Masked Data 
    if(this.person?.contactDetail?.mobileNo?.primary.includes('XXXXX')){
      this.maskedData = true;
      this.contactTypeForm.get('mobileNo').get('primary').setValue('');
      this.contactTypeForm.get('email').setValue('');
    } else {
      this.contactTypeForm.get('mobileNo').get('primary').setValue(this.person?.contactDetail?.mobileNo?.primary);
      this.contactTypeForm.get('email').setValue(this.person?.contactDetail?.emailId?.primary);
    }

    let phoneNumber: string = this.person?.contactDetail?.mobileNo?.primary;
    if(!phoneNumber || phoneNumber.length === 0) {
      this.missingPhone = true;
    }
      }
  }

  getUserRoles(userId){
    this.changePersonService.getPersonRoles(userId).subscribe(res1=>{
      let res: any = res1;  
      if(res.personRoles.length > 1){
        for(var i=0 ; i <res.personRoles.length ; i++){
          const userList = res.personRoles[i].active;
          this.userList = userList;
          if(this.userList === true){
          this.commonList.push({
            value: {
              english: res.personRoles[i].role.english,
              arabic: res.personRoles[i].role.arabic
            },
            sequence: i
          })
          if(this.commonList.length > 1){
            this.userRoles = new LovList(this.commonList);
          }
        }
        }
      }
    })
  }

  /**
   * method to create form group
   */
  createContactTypeForm(): FormGroup {
    return this.fb.group({
      name: [null, { validators: Validators.compose([Validators.required]), updateOn: 'blur' }],
      idType: this.fb.group({
        english: [null, { validators: Validators.compose([Validators.required]), updateOn: 'blur' }],
        arabic: [null]
      }),
      rolelist: this.fb.group({
        english: [null],
        arabic: [null]
      }),
      idNumber: [null],
      birthDate: this.fb.group({
        gregorian: [null, Validators.required],
        hijiri: [null]
      }),
      mobileNo: this.fb.group({
        primary: [
          null,
          {
            validators: Validators.compose([Validators.required, Validators.pattern('[0-9]+')]),
            updateOn: 'blur'
          }
        ],
        isdCodePrimary: [null, { updateOn: 'blur' }]
      }),
      email: [
        null,
        {
          validators: Validators.compose([
            Validators.maxLength(35),
            this.setEmailValidation(),
            this.setEmailRequired()
          ]),

          updateOn: 'blur'
        }
      ]
    });
  }

  /**
   * Method to set email required
   */
  setEmailRequired() {
    if (this.isPublicApp) return Validators.required;
  }

  /**
   * Method to set email validation
   */
  setEmailValidation() {
     return emailValidator;
  }
  /**
   *
   * @param type method to check form on click
   */
  onTypeSelection(type: Lov) {
    this.contactTypeForm.removeControl('idNumber');
    if (type !== null) {
      if (this.contactTypeForm.get('idNumber')) this.contactTypeForm.removeControl('idNumber');
      if (type.code === 1000) {
        this.contactTypeForm.addControl(
          'idNumber',
          this.fb.control(null, {
            validators: Validators.compose([
              Validators.required,
              lengthValidator(this.MIN_LENGTH),
              Validators.maxLength(this.MAX_LENGTH),
              Validators.pattern('[0-9]+'),
              ninValidator
            ]),
            updateOn: 'blur'
          })
        );
      } else if (type.code === 1001) {
        this.contactTypeForm.addControl(
          'idNumber',
          this.fb.control(null, {
            validators: Validators.compose([
              Validators.required,
              lengthValidator(this.MIN_LENGTH),
              Validators.maxLength(this.MAX_LENGTH),
              Validators.pattern('[0-9]+'),
              iqamaValidator
            ]),
            updateOn: 'blur'
          })
        );
      }
    }

    this.contactTypeForm.get('idNumber').updateValueAndValidity();
  }

  selectRoleForm(evnt) {
    this.selectedRole = evnt;
    this.roleSelect.emit(this.selectedRole);
  }

  onReset() {
    this.isOnReset.emit();
  }
}
