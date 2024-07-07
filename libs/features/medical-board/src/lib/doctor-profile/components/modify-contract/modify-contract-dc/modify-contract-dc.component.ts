import { Component, Input, EventEmitter, Output, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { LovList, markFormGroupUntouched } from '@gosi-ui/core';
import { MemberData, Contracts, PersonTypeEnum } from '../../../../shared';

@Component({
  selector: 'mb-modify-contract-dc',
  templateUrl: './modify-contract-dc.component.html',
  styleUrls: ['./modify-contract-dc.component.scss']
})
export class ModifyContractDcComponent implements OnInit, OnChanges {
  contractForm: FormGroup;
  contractCheck: FormGroup;
  contract: Contracts = new Contracts();
  @Input() isEditMode = false;
  @Input() medicalBoardTypeList: LovList;
  @Input() feesPerVisit: LovList;
  @Input() contractedDoctor: boolean;
  @Input() visitingDoctor: boolean;
  @Input() nurse: boolean;
  @Input() person: Contracts;
  @Input() initialData: Contracts;
  @Input() fees: number;
  @Input() noPadding = false;

  @Output() submit: EventEmitter<Object> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  @Output() getFees: EventEmitter<Object> = new EventEmitter();
  data: MemberData = new MemberData();
  showFees: boolean;
  modifyCheck = true;
  @Output() invalidForm: EventEmitter<null> = new EventEmitter();

  constructor(readonly fb: FormBuilder) {}

  /** Method to handle changes in input. */
  ngOnInit() {
    this.contractForm = this.createMemberContractForm();
    this.observeChanges();
  }

  /** Method to handle changes in input. */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.isEditMode && changes.isEditMode.currentValue) this.isEditMode = changes.isEditMode.currentValue;
    if (changes.person && changes.person.currentValue) {
      this.populateValue();
    }
    if (changes.fees && changes.fees.currentValue) {
      this.contractForm.get('fees').patchValue(this.fees);
      this.contractForm.get('fees').updateValueAndValidity();
    }
  }

  selectFeesPerVisit() {
    this.contractForm.get('feespervisit').updateValueAndValidity();
  }
  observeChanges() {
    this.contractForm.valueChanges.subscribe((item: FormControl) => {
      if (this.person.contractType.english === PersonTypeEnum.ContractedDoctor) {
        if (this.contractForm.get('fees').value === this.initialData?.fees) {
          this.modifyCheck = true;
        } else {
          this.modifyCheck = false;
        }
      } else {
        if (this.contractForm.get('feespervisit.english').value === this.initialData.feesPerVisit.english) {
          this.modifyCheck = true;
        } else {
          this.modifyCheck = false;
        }
      }
    });
  }
  selectType() {
    this.data.medicalBoardType = this.contractForm.get('medicalboardtype').value;
    this.data.contractType = this.person.contractType;
    this.getFees.emit(this.data);
    this.showFees = true;
  }
  populateValue() {
    if (this.person.contractType?.english === PersonTypeEnum.ContractedDoctor) {
      this.contractedDoctor = true;
      if (this.isEditMode) {
        this.contractForm.get('medicalboardtype').get('english').setValue(this.person?.transientMBType.english);
      } else {
        this.contractForm.get('medicalboardtype').setValue(this.person.medicalBoardType);
      }

      this.selectType();
    }
    if (this.person.contractType?.english === PersonTypeEnum.VisitingDoctor) {
      this.visitingDoctor = true;
      if (this.isEditMode) {
        const fees: string = this.person?.transientModifyFrees.toString();
        this.contractForm.get('feespervisit').get('english').setValue(fees);
      } else {
        this.contractForm.get('feespervisit').setValue(this.person.feesPerVisit);
      }
      this.contractForm.get('feespervisit').updateValueAndValidity();
    }
    if (this.person.contractType?.english === PersonTypeEnum.Nurse) {
      this.nurse = true;
    }
    this.contractForm.updateValueAndValidity();
    this.contractCheck = this.contractForm;
  }
  /**
   * This method is to Validate the form
   */
  createMemberContractForm() {
    return this.fb.group({
      medicalboardtype: this.fb.group({
        arabic: [],
        english: [null, { validators: Validators.required, updateOn: 'blur' }]
      }),
      feespervisit: this.fb.group({
        english: [null, { validators: Validators.required, updateOn: 'blur' }],
        arabic: []
      }),
      fees: [
        null,
        {
          validators: Validators.required,
          updateOn: 'blur'
        }
      ]
    });
  }
  getFormValues() {
    this.contract = new Contracts();
    const id = this.person.contractId;
    this.contract.contractId = id;
    this.contract.contractType = this.person.contractType;
    if (this.person.contractType.english === PersonTypeEnum.ContractedDoctor) {
      this.contract.medicalBoardType = this.contractForm.get('medicalboardtype').value;
      this.contract.fees = this.contractForm.get('fees').value;
      this.contract.feesPerVisit = null;
    }
    if (this.person.contractType.english === PersonTypeEnum.VisitingDoctor) {
      this.contract.medicalBoardType = null;
      this.contract.fees = null;
      this.contract.feesPerVisit = this.contractForm.get('feespervisit').value;
    }
  }
  saveContractDetail() {
    // this.alertService.clearAlerts();
    this.checkFormValidity();
    this.contractForm.markAllAsTouched();
    if (!this.contractForm.invalid) {
      this.getFormValues();
      this.submit.emit(this.contract);
    } else {
      this.invalidForm.emit();
    }
  }
  /**
   * This method is disables the form control
   * @param formControl
   * @memberof SearchPersonDcComponent
   */
  disableControl(formControl: AbstractControl) {
    if (formControl) formControl.disable();
  }

  /**
   * This method is enables the form control
   * @param formControl
   * @memberof SearchPersonDcComponent
   */
  enableControl(formControl: AbstractControl) {
    if (formControl) formControl.enable();
  }

  checkFormValidity() {
    const mbtype = this.contractForm.get('medicalboardtype');
    const feesPerVisiting = this.contractForm.get('feespervisit');
    const fees = this.contractForm.get('fees');
    markFormGroupUntouched(this.contractForm);
    this.disableControl(mbtype);
    this.disableControl(feesPerVisiting);
    this.disableControl(fees);
    this.contractForm.updateValueAndValidity();
    const doctorType = this.person.contractType;
    if (doctorType.english === PersonTypeEnum.ContractedDoctor) {
      this.enableControl(mbtype);
      this.enableControl(fees);
    } else if (doctorType.english === PersonTypeEnum.VisitingDoctor) {
      this.enableControl(feesPerVisiting);
    }
    this.updateFormControlsValidity();
  }
  updateFormControlsValidity() {
    const mbtype = this.contractForm.get('medicalboardtype');
    const feesPerVisiting = this.contractForm.get('feespervisit');
    const fees = this.contractForm.get('fees');
    mbtype.updateValueAndValidity();
    feesPerVisiting.updateValueAndValidity();
    fees.updateValueAndValidity();
  }
}
