/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms .
 */
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  addDays,
  bindToForm,
  greaterThanValidator,
  LanguageToken,
  lessThanValidator,
  LovList,
  subtractDays
} from '@gosi-ui/core';

import { InstallmentRequest, InstallmentDetails } from '../../../shared/models';
import moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { InstallmentGuaranteeDetailsBaseDc } from './installment-guarantee-details-base-dc';
import { BsModalService } from 'ngx-bootstrap/modal';
import { OutOfMarketStatus } from '../../../shared/enums/out-of-market-status';
import { InstallmentGuarantee, InstallmentGuaranteeTypes } from '../../../shared/enums';
import { EstablishmentOwnersWrapper, Owner } from '@gosi-ui/features/establishment/lib/shared/models';

@Component({
  selector: 'blg-installment-guarantee-details-dc',
  templateUrl: './installment-guarantee-details-dc.component.html',
  styleUrls: ['./installment-guarantee-details-dc.component.scss']
})
export class InstallmentGuaranteeDetailsDcComponent
  extends InstallmentGuaranteeDetailsBaseDc
  implements OnInit, OnChanges
{
  // local variables
  specialRequestFlag  = false;
  owners: Owner[] = [];
  deathFlag:boolean=true;
  //input variable
  @Input() installmentGuaranteeType: LovList;
  @Input() guaranteeTypeBanking: LovList;
  @Input() guaranteeTypePensionRegistered: LovList;
  @Input() guaranteeTypePensionOutOfMarket: LovList;
  @Input() guaranteeTypeOthersRegistered: LovList;
  @Input() guaranteeTypeOthersOutOfMarket: LovList;
  @Input() guaranteeTypePromissoryNote: LovList;
  @Input() yesOrNoList: LovList;
  @Input() saudiBank: LovList;
  @Input() parentForm: FormGroup;
  @Input() installmentDetails: InstallmentDetails;
  @Input() installmentRequest: InstallmentRequest;
  @Input() inWorkflow: boolean;
  @Input() showSearch: boolean;
  @Input() isGuaranteeDisable: boolean;
  @Input() installmentAmount = 0;
  @Input() isCollectionDeptMrg: boolean;
  @Input() isAppPublic: boolean;
  @Input() establishmentOwnersWrap:EstablishmentOwnersWrapper;
  /** Output variables */
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  @Output() type: EventEmitter<null> = new EventEmitter();
  @Output() downPaymentAmount: EventEmitter<number> = new EventEmitter();
  @Output() isDownPaymentEnabled: EventEmitter<boolean> = new EventEmitter();
  @Output() save: EventEmitter<null> = new EventEmitter();
  @Output() downPaymentPercentage: EventEmitter<number> = new EventEmitter();
  @Output() guaranteeStatus: EventEmitter<string> = new EventEmitter();
  @Output() guaranteePercentage: EventEmitter<number> = new EventEmitter();
  @Output() guaranteeType: EventEmitter<string> = new EventEmitter();
  @Output() extensionValues = new EventEmitter<{
    extensionreason: string;
    gracePeriod: number;
    extraGracePeriod: number;
  }>();
  hideGuranteeDetails = false;

  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly fb: FormBuilder,
    private modalService: BsModalService
  ) {
    super(fb);
  }
  ngOnChanges(changes: SimpleChanges) {

    if(changes && changes?.establishmentOwnersWrap?.currentValue){
      this.owners=this.establishmentOwnersWrap.owners;
            // check all owners dead & est = outofmarket
      if( this.outOfMarketFlag && this.owners && this.checkOwnersDeathStatus()){
        this.setOutOfmarketForms();
        //console.log(this.typeList,'typelist');

      }
      else if (
        changes && this.isAppPublic
        && (this.guaranteeModeForm.get('category.english').value === null
        || this.guaranteeTypeModeForm.get('guaranteeType.english').value === null)
      ) {
        this.setGuarantee();
      }
    }
    if (changes && changes?.installmentDetails?.currentValue) {
      this.outOfMarketFlag = this.installmentDetails?.outOfMarket;
      this.totalAmount = this.installmentDetails.dueAmount.total;
      this.installmentDetails?.installmentPlan?.forEach(res => {
        res.guaranteeDetail.forEach(resp => {
          resp.terms.forEach(val => {
            this.isDownPaymentRequired = val.downPaymentRequired;
            if (this.isFirstChange) {
              if (this.downPaymentDetails)
                this.downPaymentDetails.additionalGuarantee.guaranteePercentage = this.installmentRequest.downPaymentPercentage;
            } else this.downPaymentDetails = val;
            this.pensionAmount = val.totalPensionAmount;
          });
        });
      });
      if (changes && changes?.isCollectionDeptMrg?.currentValue) {
        this.isCollectionDeptMrg = changes.isCollectionDeptMrg.currentValue;
      }
      if (
        this.pensionTypeForm &&
        this.guaranteeTypeModeForm?.get('guaranteeType.english')?.value === OutOfMarketStatus.EST_OWNER_HAS_PENSION_GOSI
      ) {
        this.pensionTypeForm.get('amount').patchValue(Number(this.pensionAmount));
        this.setPensionDetails();
        this.disablePensionAmount = true;
      }
      this.setCurrentGuaranteeTypeList();
      this.setGuarnteeDetails(true);
    }

    if (changes && changes.installmentRequest?.currentValue) {
      this.isDownPaymentRequired = this.installmentRequest?.downPaymentPercentage === 0 ? false : true;
      this.outOfMarketFlag = this.installmentRequest?.outOfMarket;

      if (this.inWorkflow) {
        this.setGuarnteeDetails(false);
      }
      if (this.installmentRequest?.guaranteeDetail[0]?.type.english === OutOfMarketStatus.EST_OWNER_HAS_PENSION_PPA) {
        this.disablePensionAmount = false;
      } else this.disablePensionAmount = true;
    }

    if (changes && changes?.installmentAmount?.currentValue) {
      this.installmentAmount = changes?.installmentAmount?.currentValue;
      if (this.pensionTypeForm) this.pensionTypeForm.get('installmentAmount').patchValue(this.installmentAmount);
      if (this.otherTypeForm && this.otherTypeForm.get('installmentAmount'))
        this.otherTypeForm.get('installmentAmount').patchValue(this.installmentAmount);
    }

    this.checkForLovOnchange(changes);
//     if(changes && !(this.outOfMarketFlag && this.owners && this.checkOwnersDeathStatus())
// && this.isAppPublic
//       && (this.guaranteeModeForm.get('category.english').value === null
//         || this.guaranteeTypeModeForm.get('guaranteeType.english').value === null)){
//       this.typeList = this.guaranteeTypeOthersRegistered;
//       // if(this.outOfMarketFlag && this.owners && this.checkOwnersDeathStatus()){
//       //   this.setOutOfmarketForms()
//       // }
//       // else{
//         this.setGuarantee();
//       // }
//       console.log(this.outOfMarketFlag,this.owners,this.checkOwnersDeathStatus(),'data');


//     }
  }

  checkForLovOnchange(changes: SimpleChanges) {
    if (changes && changes.guaranteeTypePromissoryNote) {
      this.guaranteeTypePromissoryNote = changes.guaranteeTypePromissoryNote.currentValue;
    }
    if (changes && changes.guaranteeTypeOthersOutOfMarket) {
      this.guaranteeTypeOthersOutOfMarket = changes.guaranteeTypeOthersOutOfMarket.currentValue;
    }
    if (changes && changes.guaranteeTypeOthersRegistered) {
      this.guaranteeTypeOthersRegistered = changes.guaranteeTypeOthersRegistered.currentValue;
    }
    if (changes && changes.guaranteeTypePensionOutOfMarket) {
      this.guaranteeTypePensionOutOfMarket = changes.guaranteeTypePensionOutOfMarket.currentValue;
    }
    if (changes && changes.guaranteeTypePensionRegistered) {
      this.guaranteeTypePensionRegistered = changes.guaranteeTypePensionRegistered.currentValue;
    }
    this.setCurrentGuaranteeTypeList();
  }
  /**------------------------------------------End of ngOnChanges------------------------------------------------ */

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.createGuaranteeForms();
  }

  checkOwnersDeathStatus(){
    this.owners.forEach(owner =>{
      // checking owners is alive/not
      if(!owner.person?.deathDate?.gregorian){
        this.deathFlag=false;
      }
    })
    return this.deathFlag;
  }
  setOutOfmarketForms(){
    this.guaranteeModeForm.get('category.english').setValue('Other');
    this.onGuarateeSelect();
    this.guaranteeTypeModeForm.get('guaranteeType.english').setValue('Deceased / no source of income');
    this.onSelectGuaranteeType();
  }
  createGuaranteeForms() {
    this.guaranteeModeForm = this.createGuaranteeModeForm();
    this.guaranteeTypeModeForm = this.createGuaranteeTypeForm();
    this.bankingTypeForm = this.createBankGuaranteeForm();
    this.promissoryTypeForm = this.createPromissoryGuaranteeForm();
    this.pensionTypeForm = this.createPensionGuaranteeForm();
    if (this.parentForm) {
      this.parentForm.addControl('guaranteeModeForm', this.guaranteeModeForm);
      this.parentForm.addControl('guaranteeTypeModeForm', this.guaranteeTypeModeForm);
    }
  }

  setGuarnteeDetails(newDetails: boolean) {
    if (this.installmentRequest && this.installmentRequest.guaranteeDetail[0]) {
      this.guaranteeMode = this.installmentRequest.guaranteeDetail[0]?.category?.english;
      this.setGuaranteeTypeDetails(this.guaranteeMode);
      this.setCurrentGuaranteeTypeList();
      this.isGuaranteeMode = this.isGuarantee = true;
      if (this.guaranteeModeForm.get('category.english') && this.guaranteeMode)
        this.guaranteeModeForm.get('category.english').setValue(this.guaranteeMode);
      if (this.guaranteeTypeModeForm.get('guaranteeType') && !newDetails)
        this.guaranteeTypeModeForm.get('guaranteeType').setValue(this.installmentRequest?.guaranteeDetail[0]?.type);
      this.guaranteeTypeModeForm.get('guaranteeType').updateValueAndValidity();
      if (this.isBanking) {
        bindToForm(this.bankingTypeForm, this.installmentRequest.guaranteeDetail[0]);
        if (this.installmentRequest?.guaranteeDetail[0]?.endDate !== null)
          this.bankingTypeForm
            .get('endDate.gregorian')
            .setValue(new Date(this.installmentRequest?.guaranteeDetail[0]?.endDate?.gregorian));
        if (this.installmentRequest?.guaranteeDetail[0]?.startDate !== null)
          this.bankingTypeForm
            .get('startDate.gregorian')
            .setValue(new Date(this.installmentRequest.guaranteeDetail[0]?.startDate?.gregorian));
      } else if (this.isPromissory) {
        bindToForm(this.promissoryTypeForm, this.installmentRequest.guaranteeDetail[0]);
        if (this.installmentRequest?.guaranteeDetail[0]?.endDate !== null)
          this.promissoryTypeForm
            .get('endDate.gregorian')
            .setValue(new Date(this.installmentRequest.guaranteeDetail[0]?.endDate?.gregorian));
        if (this.installmentRequest?.guaranteeDetail[0]?.startDate !== null)
          this.promissoryTypeForm
            .get('startDate.gregorian')
            .setValue(new Date(this.installmentRequest.guaranteeDetail[0]?.startDate?.gregorian));
      } else if (this.isPension) {
        bindToForm(this.pensionTypeForm, this.installmentRequest.guaranteeDetail[0]);
        this.pensionTypeForm
          .get('amount')
          .patchValue(Number(this.installmentRequest?.guaranteeDetail[0]?.guaranteeAmount));
        this.pensionTypeForm
          .get('installmentAmount')
          .setValidators([
            greaterThanValidator(
              Math.round(
                (Number((this.installmentRequest?.guaranteeDetail[0]?.guaranteeAmount * 25) / 100) + Number.EPSILON) *
                  100
              ) / 100
            ),
            lessThanValidator(this.installmentRequest?.guaranteeDetail[0]?.guaranteeAmount),
            Validators.required
          ]);
        this.pensionTypeForm.get('installmentAmount').patchValue(this.installmentAmount);
        this.pensionTypeForm.get('installmentAmount').updateValueAndValidity();
      } else if (this.isOthers) {
        if (this.outOfMarketFlag) {
          this.setOthersForm();
          if (this.guaranteeTypeModeForm.get('guaranteeType.english').value === 'Establishment owner is on a job') {
            this.otherTypeForm.get('amount').patchValue(this.installmentRequest?.guaranteeDetail[0]?.guaranteeAmount);
            this.otherTypeForm.get('installmentAmount').patchValue(this.installmentAmount);
          } else {
            if (this.installmentRequest?.guaranteeDetail[0]?.deathDate !== null)
              this.otherTypeForm
                .get('deathDate.gregorian')
                .setValue(new Date(this.installmentRequest?.guaranteeDetail[0]?.deathDate?.gregorian));
          }
        }
      }
    }
    this.setGuaranteeAmountValidation();
  }
  setPensionDetails() {
    const amount = Number(this.pensionTypeForm.get('amount').value);
    this.pensionTypeForm
      .get('installmentAmount')
      .setValidators([
        greaterThanValidator(Number(Math.round((Number((amount * 25) / 100) + Number.EPSILON) * 100) / 100)),
        lessThanValidator(Number(amount)),
        Validators.required
      ]);
    this.pensionTypeForm
      .get('installmentAmount')
      .patchValue(Math.round((Number((amount * 25) / 100) + Number.EPSILON) * 100) / 100);
    this.pensionTypeForm.get('installmentAmount').updateValueAndValidity();
  } // Method to create guranteemode  form
  //Method to get downpayment
  getIsDownPayment(isDownPayment) {
    this.isDownPaymentEnabled.emit(isDownPayment);
  }
  //Mehtod to create guarantee details form
  onGuarateeSelect() {
    this.isGuaranteeMode = false;
    if (this.installmentRequest?.guaranteeDetail.length > 0) this.installmentRequest.guaranteeDetail = [];
    this.bankingTypeForm.reset();
    this.promissoryTypeForm.reset();
    this.pensionTypeForm.reset();
    this.guaranteeTypeModeForm.reset();
    this.guaranteeMode = this.guaranteeModeForm.get('category.english').value;
    if (this.guaranteeMode !== null) {
      this.isGuarantee = true;
    } else {
      this.isGuarantee = this.isBanking = this.isPension = this.isPromissory = this.isOthers = false;
    }
    this.setGuaranteeTypeDetails(this.guaranteeMode);
    this.setCurrentGuaranteeTypeList();
  } //Method to get type list
  setCurrentGuaranteeTypeList() {
    if (this.isBanking) this.typeList = this.guaranteeTypeBanking;
    else if (this.isPromissory) this.typeList = this.guaranteeTypePromissoryNote;
    else if (this.isPension) {
      if (this.outOfMarketFlag) this.typeList = this.guaranteeTypePensionOutOfMarket;
      else this.typeList = this.guaranteeTypePensionRegistered;
    } else if (this.isOthers) {
      if(this.outOfMarketFlag ){
        this.typeList = this.guaranteeTypeOthersOutOfMarket
        if(!this.checkOwnersDeathStatus()){
          this.typeList.items=this.guaranteeTypeOthersOutOfMarket.items.filter(
            item=> item.value.english !== 'Deceased / no source of income'
          );
        }
      }
      else{
        this.typeList=this.guaranteeTypeOthersRegistered;
      }
    }
  } //Method to set guarantee mode details form
  setGuaranteeTypeDetails(guaranteeMode) {
    if (guaranteeMode) {
      if (guaranteeMode === 'Bank Guarantee') {
        this.specialRequestFlag=false;
        this.bankingTypeForm = this.createBankGuaranteeForm();
        this.bankingTypeForm.get('startDate.gregorian').valueChanges.subscribe(value => {
          if (value === null) {
            this.installmentMinDate = null;
            this.bankingTypeForm.get('endDate').get('gregorian').setValue(null);
          } else {
            this.installmentMinDate = addDays(moment(value).toDate(), 1);
          }
        });
        this.isBanking = true;
      } else this.isBanking = false;

      if (guaranteeMode === 'Promissory Note') {
        this.specialRequestFlag=false;
        this.isPromissory = true;
        this.installmentMinDate = moment(this.promissoryTypeForm.value.startDate).toDate();
        this.promissoryTypeForm = this.createPromissoryGuaranteeForm();
        this.promissoryTypeForm.get('startDate.gregorian').valueChanges.subscribe(date => {
          if (date === null) {
            this.installmentMinDate = null;
            this.promissoryTypeForm.get('endDate').get('gregorian').setValue(null);
          } else {
            this.installmentMinDate = addDays(moment(date).toDate(), 1);
          }
        });
      } else this.isPromissory = false;

      if (guaranteeMode === 'Pension') {
        this.specialRequestFlag=false;
        this.pensionTypeForm = this.createPensionGuaranteeForm();
        this.isPension = true;
      } else this.isPension = false;

      if (guaranteeMode === 'Other') {
        this.otherTypeForm = this.createOthersDeathDateForm();
        this.enableSalaryAmount = false;
        this.enableDeathDate = false;
        this.maxDeathDate = new Date();
        this.isOthers = true;
      } else this.isOthers = false;
    }
  } //Method to get minimum date
  mindateChange() {
    if (this.guaranteeMode === 'Bank Guarantee' && this.bankingTypeForm) {
      this.bankingTypeForm
        .get('endDate')
        .get('gregorian')
        .valueChanges.subscribe(value => {
          if (value == null) this.installmentMaxDate = null;
          else this.installmentMaxDate = subtractDays(moment(value).toDate(), 1);
        });
    } else if (this.guaranteeMode === 'Promissory Note' && this.promissoryTypeForm) {
      this.installmentMaxDate = subtractDays(
        moment(this.promissoryTypeForm.get('endDate').get('gregorian').value).toDate(),
        1
      );
      this.promissoryTypeForm
        .get('endDate')
        .get('gregorian')
        .valueChanges.subscribe(value => {
          if (value == null) this.installmentMaxDate = null;
        });
    }
  } //Method to get gurantee type value
  onSelectGuaranteeType() {
    this.isGuaranteeType = true;
    this.isFirstChange = false;
    if(this.parentForm.get('guaranteeTypeModeForm').value.guaranteeType.english == 'Special Request'){
      this.specialRequestFlag=true;
    }
    if(this.parentForm.get('guaranteeTypeModeForm').value.guaranteeType.english == 'No Guarantee'){
      this.specialRequestFlag=false;
    }
    if (!this.parentForm.get('guaranteeTypeModeForm')) {
      this.parentForm.addControl('guaranteeTypeModeForm', this.guaranteeTypeModeForm);
    }
    if (this.guaranteeMode === 'Pension' && this.outOfMarketFlag) {
      this.disableToggle = this.isCollectionDeptMrg ? false : true;
    }
    if (this.guaranteeTypeModeForm.get('guaranteeType.english').value !== null) {
      this.isGuaranteeMode = true;
    } else {
      this.isGuaranteeMode = false;
    }
    this.setGuaranteeAmountValidation();
    if (this.guaranteeMode === InstallmentGuarantee.OTHER && this.outOfMarketFlag) this.setOthersForm();
    if (
      this.guaranteeTypeModeForm?.get('guaranteeType.english').value === OutOfMarketStatus.EST_OWNER_HAS_PENSION_PPA
    ) {
      this.disablePensionAmount = false;
      this.pensionTypeForm.get('amount').patchValue(null);
      this.pensionTypeForm.get('installmentAmount').patchValue(null);
    }
    this.type.emit();
  }
  setOthersForm() {
    if (this.guaranteeTypeModeForm.get('guaranteeType.english').value === InstallmentGuaranteeTypes.EST_OWNER_ON_JOB) {
      this.disableToggle = this.isCollectionDeptMrg ? false : true;
      this.otherTypeForm.removeControl('deathDate');
      this.otherTypeForm = this.createOthersSalaryAmountForm();
      this.otherTypeForm.get('amount').valueChanges.subscribe(amount => {
        this.otherTypeForm.get('installmentAmount').reset();
        this.otherTypeForm
          .get('installmentAmount')
          .patchValue(Math.round((Number((amount * 25) / 100) + Number.EPSILON) * 100) / 100);
        this.otherTypeForm
          .get('installmentAmount')
          .setValidators([
            greaterThanValidator(Math.round((Number((amount * 25) / 100) + Number.EPSILON) * 100) / 100),
            lessThanValidator(amount),
            Validators.required
          ]);
      });
      this.enableSalaryAmount = true;
      this.enableDeathDate = false;
    } else if (this.guaranteeTypeModeForm.get('guaranteeType.english').value === OutOfMarketStatus.DECEASED_NO_INCOME) {
      this.otherTypeForm.removeControl('amount');
      this.enableSalaryAmount = false;
      this.enableDeathDate = true;
      this.otherTypeForm = this.createOthersDeathDateForm();
    }
    this.parentForm.removeControl('otherTypeForm');
    this.parentForm.addControl('otherTypeForm', this.otherTypeForm);
  } /*** Method to show a confirmation popup for reseting the form.*/
  popUp(template: TemplateRef<HTMLElement>) {
    this.modalRefs = this.modalService.show(template);
  } /** Method to navigate to next page*/
  saveAndNext() {
    if (this.guaranteeMode === 'Bank Guarantee') {
      this.parentForm.addControl('bankingTypeForm', this.bankingTypeForm);
      this.parentForm.removeControl('promissoryTypeForm');
      this.parentForm.removeControl('pensionTypeForm');
      this.parentForm.removeControl('otherTypeForm');
    } else if (this.guaranteeMode === 'Promissory Note') {
      this.parentForm.addControl('promissoryTypeForm', this.promissoryTypeForm);
      this.parentForm.removeControl('bankingTypeForm');
      this.parentForm.removeControl('pensionTypeForm');
      this.parentForm.removeControl('otherTypeForm');
    } else if (this.guaranteeMode === 'Pension') {
      this.parentForm.addControl('pensionTypeForm', this.pensionTypeForm);
      this.parentForm.removeControl('bankingTypeForm');
      this.parentForm.removeControl('promissoryTypeForm');
      this.parentForm.removeControl('otherTypeForm');
    } else if (this.guaranteeMode === 'Other') {
      this.parentForm.addControl('otherTypeForm', this.otherTypeForm);
      this.parentForm.removeControl('bankingTypeForm');
      this.parentForm.removeControl('promissoryTypeForm');
      this.parentForm.removeControl('pensionTypeForm');
    }
    this.save.emit();
  } /** Method to decline the popUp. */
  decline() {
    if (this.modalRefs) this.modalRefs.hide();
  } /** Method to confirm cancellation of the form. */
  cancelModal() {
    if (this.modalRefs) this.modalRefs.hide();
    this.cancel.emit();
  } //set downpayment amount
  setDownPayment(amount: number) {
    this.downPaymentAmount.emit(amount);
  }
  getguaranteeStatus(status: string){
    this.guaranteeStatus.emit(status);
  }
  getguaranteePercentage(amount: number){
    this.guaranteePercentage.emit(amount);
  }
  getguaranteeType(value: string){
    this.guaranteeType.emit(value);
  }
  //Method to get downpayment percentage values
  getDownPaymentPercentage(res: number) {
    this.downPaymentPercentage.emit(res);
  } //Method to get extended values
  getExtendedValues(params) {
    this.extensionValues.emit({
      extensionreason: params.extensionreason,
      gracePeriod: params.gracePeriod,
      extraGracePeriod: params.extraGracePeriod
    });
  }

  setGuarantee(){
      this.installmentGuaranteeType.items.forEach(item => {
        if(item.value.english === 'Other'){
          this.guaranteeModeForm.get('category.english').setValue(item.value.english);
          this.guaranteeModeForm.get('category.arabic').setValue(item.value.arabic);
          this.onGuarateeSelect();
          this.guaranteeTypeModeForm.get('guaranteeType.english')
            .setValue(this.guaranteeTypeOthersRegistered.items[0].value.english);
          this.guaranteeTypeModeForm.get('guaranteeType.arabic')
            .setValue(this.guaranteeTypeOthersRegistered.items[0].value.arabic);
          this.onSelectGuaranteeType();
          this.hideGuranteeDetails = true;
        }
      });
      }
}
