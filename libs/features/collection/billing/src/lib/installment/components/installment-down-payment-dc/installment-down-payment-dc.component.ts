/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms .
 */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lessThanValidator, greaterThanValidator, LovList, BilingualText } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { InstallmentGuaranteeTypes } from '../../../shared/enums/installment-guarantee-types';
import { GuaranteeTerms, InstallmentRequest } from '../../../shared/models';

@Component({
  selector: 'blg-installment-down-payment-dc',
  templateUrl: './installment-down-payment-dc.component.html',
  styleUrls: ['./installment-down-payment-dc.component.scss']
})
export class InstallmentDownPaymentDcComponent implements OnInit, OnChanges {
  /**
   * Local variables
   */
  downPaymentForm: FormGroup;
  amountForm: FormGroup;
  totalDownPaymentAmount: number;
  isexceptionFromDownPayment = false;
  changedPercentage: number;
  gracePeriod: number;
  modalRef: BsModalRef;
  exceptionalDetailsForm: FormGroup;
  extendedGrace = false;
  reason: string;
  extraAddedGracePeriod: number;
  isDisabled = false;
  isDownPayment = false;
  isDownPaid = false;
  isExtraAdded = false;
  guaranteeTypeSpecialRequestForm :FormGroup;
  guaranteeTypeList:LovList;
  /***
   * Input variables
   */
  @Input() installmentRequest: InstallmentRequest;
  @Input() isDownPaymentRequired: boolean;
  @Input() downPaymentDetails: GuaranteeTerms;
  @Input() totalAmount: number;
  @Input() inWorkflow: boolean;
  @Input() isGuaranteeType: boolean;
  @Input() isGuaranteeDisable: boolean;
  @Input() disableToggle: boolean;
  @Input() isAppPublic:boolean;
  @Input() specialRequestFlag:boolean;
  @Input() InstallmentGuaranteeType:LovList;
  @Input() yesOrNoList: LovList;
  //Output variables
  @Output() downPaymentAmount: EventEmitter<number> = new EventEmitter();
  @Output() isDownPaymentEnabled: EventEmitter<boolean> = new EventEmitter();
  @Output() downPaymentPercentage: EventEmitter<number> = new EventEmitter();
  @Output() guaranteeStatus: EventEmitter<BilingualText> = new EventEmitter();
  @Output() guaranteePercentage: EventEmitter<number> = new EventEmitter();
  @Output() guaranteeType: EventEmitter<BilingualText> = new EventEmitter();
  @Output() extensionValues = new EventEmitter<{
    extensionreason: string;
    gracePeriod: number;
    extraGracePeriod: number;
  }>();
  status: string;
  isShow: boolean;
  /**
   *
   * @param fb
   * @param modalService
   */
  constructor(private fb: FormBuilder, readonly modalService: BsModalService) {}
  //Method to intialise tasks
  ngOnInit(): void {
    this.downPaymentForm = this.createPaymentForm();
    this.amountForm = this.createDownPaymentAmountForm();
    this.exceptionalDetailsForm = this.createExceptionalDetailsForm();
    this.amountForm?.get('downPaymentRatio').valueChanges.subscribe(value => {
      this.changedPercentage = value;
      this.totalDownPaymentAmount = Math.round(this.totalAmount * this.changedPercentage) / 100;
      this.amountForm.get('downPaymentAmount').setValue(this.totalDownPaymentAmount);
    });
    this.guaranteeTypeSpecialRequestForm=this.createSpecialRequestForm();
    this.guaranteeStatus.emit(this.yesOrNoList?.items[0]?.value);
    if (this.inWorkflow) {
      this.amountForm.get('downPaymentRatio').setValue(this.installmentRequest.downPaymentPercentage);
      this.downPaymentPercentage.emit(this.installmentRequest.downPaymentPercentage);
      this.totalDownPaymentAmount =
        Math.round(this.installmentRequest.totalDue * this.installmentRequest.downPaymentPercentage) / 100;
      this.amountForm.get('downPaymentAmount').setValue(this.totalDownPaymentAmount);
      this.guaranteeTypeSpecialRequestForm?.get('guaranteeStatus').setValue(this.installmentRequest.guaranteeStatus);
      this.guaranteeStatus.emit(this.installmentRequest?.guaranteeStatus);
      this.guaranteeTypeSpecialRequestForm?.get('guaranteeType').setValue(this.installmentRequest.specialGuaranteeType);
      this.guaranteeType.emit(this.installmentRequest.specialGuaranteeType);
      this.guaranteeTypeSpecialRequestForm.get('guaranteePercentage').setValue(this.installmentRequest.guaranteePercentage);
      this.guaranteePercentage.emit(this.installmentRequest.guaranteePercentage);
    }
    if(this.inWorkflow && this.installmentRequest.guaranteeDetail[0].type.english === 'Special Request'){
      this.specialRequestFlag = true;
    }
    this.getDownPayment();
    this.getStatus();
    this.getGuaranteePercentage();
    this.getGuaranteeType();
    this.guaranteeTypeList = new LovList(this.InstallmentGuaranteeType.items.filter(item=> item.value.english !== 'Other')); 
  }
  createSpecialRequestForm(){
    return this.fb.group({
      guaranteeType: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      guaranteeStatus: this.fb.group({
        english: [this.inWorkflow ? this.installmentRequest?.guaranteeStatus?.english : "Yes", { validators: Validators.required }],
        arabic: ''
      }),
      guaranteePercentage: [
        null,
        { validators: Validators.compose([Validators.min(1), Validators.max(99), Validators.required]) }
      ],
    });
  }
  onRadioSelect(val){
    this.status = val;
    if(this.inWorkflow && this.status ==="Yes"){
      this.isShow = true;
    } else this.isShow = false;
  }
  getDownPayment() {
    this.amountForm.get('downPaymentAmount').valueChanges.subscribe(value => {
      this.downPaymentAmount.emit(value);
    });
  } 
  getStatus(){
    this.guaranteeTypeSpecialRequestForm.get('guaranteeStatus').valueChanges.subscribe(value => {
      this.guaranteeStatus.emit(value);
    })
  }
  getGuaranteeType(){
    this.guaranteeTypeSpecialRequestForm.get('guaranteeType').valueChanges.subscribe(value => {
      this.guaranteeType.emit(value);
    })
  }
  getGuaranteePercentage(){
    this.guaranteeTypeSpecialRequestForm.get('guaranteePercentage').valueChanges.subscribe(value => {
      this.guaranteePercentage.emit(value);
    })
  }
  //Method to create exceptional details form
  createExceptionalDetailsForm(): FormGroup {
    return this.fb.group({
      extensionReason: [
        this.inWorkflow ? this.installmentRequest?.extensionReason : null,
        { validators: Validators.required }
      ],
      currentGracePeriod: [
        !this.inWorkflow
          ? this.downPaymentDetails?.additionalGuarantee?.minGracePeriodInDays
          : this.installmentRequest?.gracePeriod,
        { validators: Validators.required }
      ],
      extendedGracePeriod: [
        this.inWorkflow ? this.installmentRequest?.extendedGracePeriod : '',
        { validators: Validators.compose([Validators.pattern('[1-7]'), Validators.required]) }
      ],

      exceptionalGracePeriod: [
        this.downPaymentDetails?.additionalGuarantee?.minGracePeriodInDays,
        { validators: Validators.required }
      ]
    });
  }
  /**
   *  this method is used to get values on input changes
   * */
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.downPaymentDetails?.firstChange) this.downPaymentForm = this.createPaymentForm();
    if (changes?.downPaymentDetails?.currentValue) {
      if (!this.isDownPaymentRequired) {
        this.downPaymentForm.get('downPaymentRequired').setValue(this.isDownPaymentRequired);
        this.isDisabled = this.isGuaranteeDisable && this.disableToggle ? true : false;
        this.isDownPayment = false;
        this.downPaymentForm.get('downPaymentRequired').updateValueAndValidity();
      } else {
        this.downPaymentForm.get('downPaymentRequired').setValue(this.isDownPaymentRequired);
        this.isDisabled = true;
        this.isDownPayment = true;
        this.downPaymentForm.get('downPaymentRequired').updateValueAndValidity();
      }
      this.extendedGrace = false;
      this.downPaymentDetails = changes?.downPaymentDetails?.currentValue;
      this.amountForm = this.createDownPaymentAmountForm();
      this.amountForm.get('downPaymentRatio').setValue(this.downPaymentDetails.additionalGuarantee.guaranteePercentage);
      this.amountForm
        .get('downPaymentRatio')
        .setValidators([
          greaterThanValidator(this.downPaymentDetails.additionalGuarantee.guaranteePercentage),
          Validators.required,
          lessThanValidator(99)
        ]);
      this.amountForm.get('downPaymentRatio').updateValueAndValidity();
      this.totalDownPaymentAmount =
        Math.round(this.totalAmount * this.downPaymentDetails.additionalGuarantee.guaranteePercentage) / 100;
      this.amountForm.get('downPaymentAmount').setValue(this.totalDownPaymentAmount);
      this.getdownpaymentRatio();
      this.amountForm
        .get('downPaymentGracePeriod')
        .setValue(this.downPaymentDetails.additionalGuarantee.minGracePeriodInDays);
      this.gracePeriod = this.downPaymentDetails.additionalGuarantee.minGracePeriodInDays;
      this.downPaymentPercentage.emit(this.downPaymentDetails.additionalGuarantee.guaranteePercentage);
      this.isDownPaymentEnabled.emit(this.isDownPayment);
    }
    if (changes && changes?.isGuaranteeDisable?.currentValue) {
      this.isDisabled = this.isexceptionFromDownPayment = this.isGuaranteeDisable && this.disableToggle ? true : false;
    }
    if (changes && changes?.isCollectionDeptMrg?.currentValue) {
      this.isDisabled = this.isexceptionFromDownPayment = this.isGuaranteeDisable && this.disableToggle ? true : false;
    }
    this.checkInstallmentChange(changes);
  }
  checkInstallmentChange(changes) {
    if (changes?.installmentRequest?.currentValue) {
      if (this.inWorkflow) {
        this.amountForm = this.createDownPaymentAmountForm();
        this.guaranteeTypeSpecialRequestForm=this.createSpecialRequestForm();     
        this.amountForm.get('downPaymentRatio').setValue(this.installmentRequest.downPaymentPercentage);
        this.downPaymentPercentage.emit(this.installmentRequest.downPaymentPercentage);
        this.amountForm.get('downPaymentAmount').setValue(this.installmentRequest.downPayment);
        this.guaranteeTypeSpecialRequestForm?.get('guaranteeStatus').setValue(this.installmentRequest.guaranteeStatus);
        this.guaranteeStatus.emit(this.installmentRequest?.guaranteeStatus);
        this.guaranteeTypeSpecialRequestForm?.get('guaranteeType').setValue(this.installmentRequest.specialGuaranteeType);
        this.guaranteeType.emit(this.installmentRequest.specialGuaranteeType);
        this.guaranteeTypeSpecialRequestForm.get('guaranteePercentage').setValue(this.installmentRequest.guaranteePercentage);
        this.guaranteePercentage.emit(this.installmentRequest.guaranteePercentage);
        if (this.installmentRequest.downPaymentPercentage === 0) {
          this.isDownPaid = false;
          this.isDownPayment = false;
          if (
            this.installmentRequest?.guaranteeDetail[0]?.type?.english ===
              InstallmentGuaranteeTypes.BANK_GUARANTEE_OF_FULL_DUES ||
            this.installmentRequest.guaranteeDetail[0].type.english === InstallmentGuaranteeTypes.DECEASED_NO_INCOME
          ) {
            this.isDisabled = false;
          } else this.isDisabled = true;
        } else {
          this.isDownPaid = true;
          this.isDownPayment = true;
          this.isDownPaymentEnabled.emit(this.isDownPayment);
          if (
            this.installmentRequest?.guaranteeDetail[0]?.type?.english ===
              InstallmentGuaranteeTypes.BANK_GUARANTEE_OF_FULL_DUES ||
            this.installmentRequest.guaranteeDetail[0].type.english === InstallmentGuaranteeTypes.DECEASED_NO_INCOME
          ) {
            this.isDisabled = false;
          } else this.isDisabled = true;
        }
        this.downPaymentForm = this.createPaymentForm();
        this.gracePeriod = this.installmentRequest.gracePeriod;
        if (this.installmentRequest.extensionReason !== null) this.extendedGrace = true;
        this.reason = this.installmentRequest.extensionReason;
        this.extraAddedGracePeriod = this.installmentRequest.extendedGracePeriod;
        this.gracePeriod = this.installmentRequest.extendedGracePeriod + this.installmentRequest.gracePeriod;
        this.totalAmount = this.installmentRequest.totalDue;
        if (this.installmentRequest.downPaymentPercentage === 50) {
          this.amountForm
            .get('downPaymentRatio')
            .setValidators([greaterThanValidator(50), Validators.required, lessThanValidator(99)]);
          this.amountForm.get('downPaymentRatio').updateValueAndValidity();
        }
      }
    }
  }
  /**
   * Method to create payment form
   */
  createPaymentForm(): FormGroup {
    return this.fb.group({
      downPaymentRequired: [
        this.inWorkflow ? this.isDownPaid : null,
        {
          validators: Validators.compose([Validators.required]),
          updateOn: 'blur'
        }
      ]
    });
  }
  /**
   * Method to create  form
   */
  createDownPaymentAmountForm() {
    return this.fb.group({
      downPaymentRatio: [
        null,
        { validators: Validators.compose([Validators.min(1), Validators.max(99), Validators.required]) }
      ],
      downPaymentAmount: [null, { validators: Validators.required }],
      downPaymentGracePeriod: [null]
    });
  }
  /**
   * Method to get downpayment ratio
   */
  getdownpaymentRatio() {
    this.amountForm.get('downPaymentRatio').valueChanges.subscribe(res => {
      this.totalDownPaymentAmount = Math.round(this.totalAmount * res) / 100;
      this.amountForm.get('downPaymentAmount').setValue(this.totalDownPaymentAmount);
      this.downPaymentAmount.emit(this.totalDownPaymentAmount);
      this.downPaymentPercentage.emit(res);
    });
    this.downPaymentAmount.emit(this.totalDownPaymentAmount);
  }
  /**
   * Method to get grace period value
   */
  gracePeriods(params) {
    this.modalRef.hide();
    this.gracePeriod = params.extendedGrace;
    this.extraAddedGracePeriod = params.extraAddedGrace;
    this.reason = params.reason;
    this.exceptionalDetailsForm.get('extensionReason').setValue(params.reason);

    this.extensionValues.emit({
      extensionreason: params.reason,
      gracePeriod: params.extendedGrace,
      extraGracePeriod: params.extraAddedGrace
    });
    if (Number(params.extraAddedGrace) === 0) {
      this.isExtraAdded = true;
      this.extendedGrace = false;
    } else {
      this.isExtraAdded = false;
      this.extendedGrace = true;
    }
  }

  extendedFlag(para) {
    this.extendedGrace = para;
    if (Number(this.extraAddedGracePeriod) === 0) {
      this.isExtraAdded = true;
      this.extendedGrace = false;
    } else {
      this.extendedGrace = para;
      this.extendedGrace = true;
    }
  }
  isCanceled() {
    this.modalRef.hide();
  }
  showModals(template: TemplateRef<HTMLElement>, size: string): void {
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-${size} modal-dialog-centered` };
    this.modalRef = this.modalService.show(template, config);
  }
  getDownPaymentValue(event) {
    this.isDownPayment = event;
    if (!this.inWorkflow && this.isDownPayment) {
      this.amountForm.get('downPaymentRatio').setValue(1);
      this.getdownpaymentRatio();
    } else this.amountForm.get('downPaymentRatio').setValue(null);
    this.isDownPaymentEnabled.emit(this.isDownPayment);
  }
}
