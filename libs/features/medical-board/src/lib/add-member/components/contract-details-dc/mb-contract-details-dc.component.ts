/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
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
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AlertService,
  BaseComponent,
  BilingualText,
  Lov,
  LovList,
  markFormGroupTouched,
  markFormGroupUntouched,
  scrollToTop
} from '@gosi-ui/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MemberData, MbProfile } from '../../../shared/models';
import { PersonTypeEnum } from '../../../shared/enums/person-type-enum';

@Component({
  selector: 'mb-contract-details-dc',
  templateUrl: './mb-contract-details-dc.component.html',
  styleUrls: ['./mb-contract-details-dc.component.scss']
})
export class MbContractDetailsDcComponent implements OnInit, OnChanges {
  submitted = false;
  @Output() submit: EventEmitter<Object> = new EventEmitter();
  @Output() previous: EventEmitter<null> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  @Output() formChanged: EventEmitter<null> = new EventEmitter();
  @Output() feespersession: EventEmitter<MemberData> = new EventEmitter();
  @Output() invalidForm: EventEmitter<null> = new EventEmitter();

  //TODO Provide types
  subSpecialtyDetails: BilingualText[] = [];
  regionDetails: BilingualText[] = [];
  @Input() label: string;
  @Input() noPadding = false;
  @Input() doctorType: LovList;
  @Input() medicalboardtype: LovList;
  @Input() specialty: LovList;
  @Input() subspecialty: LovList;
  @Input() region: LovList;
  @Input() hospital: LovList;
  @Input() feespervisit: LovList;
  @Input() person: MemberData;
  @Input() fees: number;
  @Input() hasPerson = false;
  @Input() editMode: boolean;
  @Input() members: MbProfile;

  data: MemberData = new MemberData();
  //TODO Use camel case
  ContractForm: FormGroup;
  showSubspecialty = false;
  ContractedDoctor: boolean;
  VisitingDoctor: boolean;
  Nurse: boolean;
  ShowSubSpecialtyList: LovList = null;
  contractTypeLovList: LovList = new LovList([]);
  doctorType$: Observable<LovList>;
  medicalboardTypeLovList: LovList = new LovList([]);
  feespervisitLovList: LovList = new LovList([]);
  medicalboardtype$: Observable<LovList>;
  feespervisit$: Observable<LovList>;
  specialty$: Observable<LovList>;
  subspecialty$: Observable<LovList>;
  region$: Observable<LovList>;
  hospital$: Observable<LovList>;
  specialtyLovList: LovList = new LovList([]);
  regionLovList: LovList = new LovList([]);
  hospitalLovList: LovList = new LovList([]);
  showFees: boolean;
  docList: LovList = new LovList([]);
  nurseList: LovList = new LovList([]);
  govtOrprivtList: LovList = new LovList([]);
  typeOfContract: BilingualText;
  //TODO Dont use services which can cause side effects in dumb components
  constructor(private fb: FormBuilder) {
    // this.ContractedDoctor = true;
    // this.VisitingDoctor = true;
    // this.Nurse = true;
  }

  ngOnInit(): void {
    this.ContractedDoctor = false;
    this.VisitingDoctor = false;
    this.Nurse = false;
    this.showFees = false;
    this.ContractForm = this.createMemberContractForm();
    this.docList = new LovList([
      { value: { english: 'Contracted Doctor', arabic: 'طبيب متعاقد' }, sequence: 0, code: 1001 },
      { value: { english: 'Visiting Doctor', arabic: ' طبيب متعاون' }, sequence: 1, code: 1003 }
    ]);
    this.nurseList = new LovList([{ value: { english: 'Nurse', arabic: 'ممرض أو ممرضه' }, sequence: 0, code: 1002 }]);
    this.govtOrprivtList = new LovList([
      { value: { english: 'Private', arabic: 'خاص' }, sequence: 0, code: 1001 },
      { value: { english: 'Government', arabic: 'حكومة' }, sequence: 1, code: 1002 }
    ]);
    this.typeOfContract = this.person?.contractType
      ? this.person?.contractType
      : this.members?.contracts[0]?.contractType;
    if (this.typeOfContract) {
      this.ContractForm.get('doctorType')?.patchValue(this.typeOfContract);
      this.ContractedDoctor = this.typeOfContract.english === PersonTypeEnum.ContractedDoctor ? true : false;
      this.VisitingDoctor = this.typeOfContract.english === PersonTypeEnum.VisitingDoctor ? true : false;
      this.Nurse = this.typeOfContract.english === PersonTypeEnum.Nurse ? true : false;
    }
    if (this.doctorType && this.doctorType.items.length > 0) {
      this.contractTypeLovList = new LovList(this.doctorType.items);
      this.setContractTyeToForm();
    }
    if (this.hasPerson) {
      this.populateValues();
    }
    if (this.members.contracts.length) {
      this.bindDataToForm();
    }
    if (this.members?.contracts[0]?.govtEmployee === true) {
      this.ContractForm.get('jobSector')?.get('english')?.setValue('Government');
    } else {
      this.ContractForm?.get('jobSector')?.get('english')?.setValue('Private');
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    const hospital = this.person?.hospital ? this.person?.hospital : this.members.contracts[0].hospital;
    this.ContractForm.get('hospital').patchValue(hospital);

    // if (changes.doctorType && changes.doctorType.currentValue) {
    //   if (this.doctorType && this.doctorType.items.length > 0) {
    //     this.contractTypeLovList = new LovList(this.doctorType.items);
    //     this.setContractTyeToForm();
    //   }
    // }
    // if (changes.hasPerson && changes.hasPerson.currentValue && !this.editMode) {
    //   this.populateValues();
    // }
    // if (changes.members && changes.members.currentValue && this.editMode) {
    //   this.ContractForm.get('doctorType')?.patchValue(this.typeOfContract);
    //   this.bindDataToForm();
    // }
    // if (this.members?.contracts[0]?.govtEmployee === true) {
    //   this.ContractForm.get('jobSector')?.get('english')?.setValue('Government');
    // } else {
    //   this.ContractForm?.get('jobSector')?.get('english')?.setValue('Private');
    // }
  }

  /**Method to bind data to form */
  bindDataToForm(): void {
    this.regionDetails = this.members.contracts[0].region;
    this.subSpecialtyDetails = this.members.contracts[0].subSpecialty;
    this.person.contractId = this.members.contracts[0].contractId;
    this.person.contractType = this.members.contracts[0].contractType;
    this.person.hospital = this.members.contracts[0].hospital;
    this.person.medicalBoardType = this.members?.contracts[0]?.medicalBoardType;
    this.person.region = this.members.contracts[0].region;
    this.person.specialty = this.members.contracts[0].specialty;
    this.person.subSpecialty = this.members.contracts[0].subSpecialty;
    this.person.feesPerVisit = this.members.contracts[0].feesPerVisit;
    this.populateValues();
  }
  populateValues() {
    // const typeOfContract = this.person?.contractType
    //   ? this.person?.contractType
    //   : this.members?.contracts[0]?.contractType;
    // if (this.person.contractId) {
    this.ContractForm.get('doctorType')?.patchValue(this.typeOfContract);
    this.ContractForm.get('doctorType')?.updateValueAndValidity();
    this.ContractForm.updateValueAndValidity();
    this.ContractForm.markAsPristine();
    //this.ContractForm.patchValue({ doctorType: typeOfContract});
    if (this.person.govtEmployee === true) {
      this.ContractForm.get('jobSector')?.get('english')?.patchValue('Government');
      this.ContractForm.updateValueAndValidity();
      this.ContractForm.markAsPristine();
    } else {
      this.ContractForm?.get('jobSector')?.get('english')?.patchValue('Private');
      this.ContractForm.updateValueAndValidity();
      this.ContractForm.markAsPristine();
    }
    // this.selectContractIdType(this.person.contractType);
    this.ContractForm.get('medicalboardtype').patchValue(this.person.medicalBoardType);
    this.ContractForm.updateValueAndValidity();
    this.ContractForm.markAsPristine();
    if (this.person.contractType.english === PersonTypeEnum.ContractedDoctor) {
      this.selectType();
    }
    this.ContractForm.get('hospital').patchValue(this.person.hospital);
    this.ContractForm.updateValueAndValidity();
    this.ContractForm.markAsPristine();
    this.ContractForm.get('specialty').patchValue(this.person.specialty);
    this.ContractForm.updateValueAndValidity();
    this.ContractForm.markAsPristine();
    let value: Lov;
    if (this.person.specialty) {
      this.specialty?.items.forEach(element => {
        if (this.person.specialty.english === element.value.english) {
          value = element;
        }
      });
    }
    this.selectSubSpecialty(value);
    this.ContractForm.get('feespervisit').patchValue(this.person.feesPerVisit);
    this.ContractForm.updateValueAndValidity();
    this.ContractForm.markAsPristine();
    this.regionDetails = this.person.region;
    this.subSpecialtyDetails = this.person.subSpecialty;
    this.ContractForm.updateValueAndValidity();
    markFormGroupTouched(this.ContractForm);
    // }
  }
  //TODO Provide method comments and datatypes for arguments
  selectContractIdType(doctorType) {
    if (doctorType === null) {
      this.ContractForm.get('doctorType').setValue(null);
      this.ContractForm.get('doctorType').updateValueAndValidity();
      this.showFees = false;
    }
    if (this.ContractForm.get('doctorType').valueChanges) {
      this.ContractForm.get('medicalboardtype').reset();
      this.showFees = false;
      this.ContractForm.updateValueAndValidity();
    }
    if (this.ContractForm.get('doctorType').value) {
      doctorType = this.ContractForm.get('doctorType').value;
    }
    this.selectOnChanges(doctorType);
    this.checkFormValidity();
  }

  setContractTyeToForm() {
    this.showFees = false;
    this.selectOnChanges(this.typeOfContract);
  }

  selectOnChanges(doctorType) {
    if (doctorType.english === PersonTypeEnum.ContractedDoctor) {
      this.ContractedDoctor = true;
      this.ContractForm.get('feespervisit').markAsTouched();
      this.ContractForm.get('feespervisit').updateValueAndValidity();
    } else {
      this.ContractedDoctor = false;
    }
    if (doctorType.english === PersonTypeEnum.VisitingDoctor) {
      this.VisitingDoctor = true;
      this.ContractForm.get('medicalboardtype').markAsTouched();
      this.ContractForm.get('medicalboardtype').updateValueAndValidity();
    } else {
      this.VisitingDoctor = false;
    }
    if (doctorType.english === PersonTypeEnum.Nurse) {
      this.Nurse = true;
      this.selectType();
    } else {
      this.Nurse = false;
    }
  }
  subSpecialtyDetail(list) {
    this.subSpecialtyDetails = list;
    list
      .map(res => res['english'])
      .forEach(ele => {
        if (this.subSpecialtyDetails?.map(val => val['english'])?.indexOf(ele) < 0) {
          this.subSpecialtyDetails.push({ english: list.english, arabic: list?.arabic });
        }
      });
  }
  regionDetail(list) {
    this.regionDetails = list;
    list
      .map(res => res['english'])
      .forEach(ele => {
        if (this.regionDetails?.map(val => val['english'])?.indexOf(ele) < 0) {
          this.regionDetails.push({ english: list.english, arabic: list?.arabic });
        }
      });
  }

  /**
   * This method is to Select Subspecialties according to specialty value
   */
  selectSubSpecialty(specialty: Lov) {
    this.ShowSubSpecialtyList = new LovList([]);
    if (this.ContractForm.get('specialty').valueChanges) {
      this.ContractForm.get('subspecialty').reset();
      this.ContractForm.updateValueAndValidity();
    }
    if (specialty === null) {
      this.showSubspecialty = false;
    } else {
      this.showSubspecialty = true;
      this.ShowSubSpecialtyList = new LovList(specialty?.items);
    }
  }
  /**
   * This method is to Validate the form
   */
  createMemberContractForm() {
    return this.fb.group({
      doctorType: this.fb.group({
        english: [null, { validators: Validators.required, updateOn: 'blur' }],
        arabic: ''
      }),
      medicalboardtype: this.fb.group({
        english: [null, { validators: Validators.required, updateOn: 'blur' }],
        arabic: []
      }),
      specialty: this.fb.group({
        english: [null, { validators: Validators.required, updateOn: 'blur' }],
        arabic: []
      }),
      subspecialty: this.fb.group({
        english: [],
        arabic: []
      }),
      region: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: []
      }),
      hospital: this.fb.group({
        english: [null, { validators: Validators.required, updateOn: 'blur' }],
        arabic: []
      }),
      feespervisit: this.fb.group({
        english: [null, { validators: Validators.required, updateOn: 'blur' }],
        arabic: []
      }),
      jobSector: this.fb.group({
        english: ['Private', { validators: Validators.required }],
        arabic: []
      })
    });
  }
  selectJobSector() {}
  selectType() {
    this.data.contractType = this.ContractForm.get('doctorType').value;
    if (this.data.contractType.english === PersonTypeEnum.Nurse) {
      this.data.medicalBoardType = new BilingualText();
      this.data.medicalBoardType.english = 'Appeal Medical Board';
      this.data.medicalBoardType.arabic = 'Appeal Medical Board';
    } else {
      this.data.medicalBoardType = this.ContractForm.get('medicalboardtype').value;
    }
    this.feespersession.emit(this.data);
    this.showFees = true;
  }
  saveContract() {
    scrollToTop();
    this.checkFormValidity();
    this.data.mbProfessionalId = this.person.mbProfessionalId;
    markFormGroupTouched(this.ContractForm);
    if (!this.ContractForm.invalid) {
      this.submitted = true;
      this.getFormValues();
      this.submit.emit(this.person);
    } else {
      this.invalidForm.emit();
    }
  }
  checkFormValidity() {
    const mbtype = this.ContractForm.get('medicalboardtype');
    const special = this.ContractForm.get('specialty');
    const medicalProvider = this.ContractForm.get('hospital');
    const regions = this.ContractForm.get('region');
    const feesPerVisiting = this.ContractForm.get('feespervisit');
    markFormGroupUntouched(this.ContractForm);
    this.disableControl(mbtype);
    this.disableControl(special);
    this.disableControl(medicalProvider);
    this.disableControl(regions);
    this.disableControl(feesPerVisiting);
    this.ContractForm.updateValueAndValidity();
    const doctorType = this.ContractForm.get('doctorType').value;
    if (doctorType.english === PersonTypeEnum.ContractedDoctor) {
      this.enableControl(mbtype);
      this.enableControl(medicalProvider);
      this.enableControl(special);
      this.enableControl(regions);
      this.disableControl(feesPerVisiting);
    } else if (doctorType.english === PersonTypeEnum.VisitingDoctor) {
      this.enableControl(medicalProvider);
      this.enableControl(special);
      this.enableControl(regions);
      this.enableControl(feesPerVisiting);
      this.disableControl(mbtype);
    } else if (doctorType.english === PersonTypeEnum.Nurse) {
      this.disableControl(mbtype);
      this.enableControl(medicalProvider);
      this.enableControl(regions);
      this.disableControl(special);
      this.disableControl(feesPerVisiting);
    } else {
      this.disableControl(mbtype);
      this.enableControl(medicalProvider);
      this.disableControl(special);
      this.enableControl(regions);
      this.disableControl(feesPerVisiting);
    }
    this.updateFormControlsValidity();
  }
  updateFormControlsValidity() {
    const mbtype = this.ContractForm.get('medicalboardtype');
    const special = this.ContractForm.get('specialty');
    const medicalProvider = this.ContractForm.get('hospital');
    const regions = this.ContractForm.get('region');
    const feesPerVisiting = this.ContractForm.get('feespervisit');
    mbtype.updateValueAndValidity();
    special.updateValueAndValidity();
    medicalProvider.updateValueAndValidity();
    regions.updateValueAndValidity();
    feesPerVisiting.updateValueAndValidity();
  }
  /**
   * This method is enables the form control
   * @param formControl
   */
  enableControl(formControl: AbstractControl) {
    if (formControl) formControl.enable();
  }

  /**
   * This method is disables the form control
   * @param formControl
   */
  disableControl(formControl: AbstractControl) {
    if (formControl) formControl.disable();
  }

  getFormValues() {
    this.person.contractType = this.ContractForm.get('doctorType').value;
    this.person.medicalBoardType = this.ContractForm.get('medicalboardtype').value;
    this.person.hospital = this.ContractForm.get('hospital').value;
    if (this.regionDetails === null || this.ContractForm.get('region').value === null) {
      this.ContractForm.get('region').markAsTouched();
      this.ContractForm.get('region').updateValueAndValidity();
    } else {
      this.person.region = this.regionDetails;
    }
    this.person.specialty = this.ContractForm.get('specialty').value;
    this.person.subSpecialty = this.subSpecialtyDetails;
    if (this.person.contractType.english === PersonTypeEnum.Nurse) {
      this.person.medicalBoardType = new BilingualText();
      this.person.specialty = new BilingualText();
      this.person.subSpecialty = new Array<BilingualText>();
    }
    if (this.subSpecialtyDetails === null)
      if (this.person.contractType.english === PersonTypeEnum.VisitingDoctor) {
        this.person.medicalBoardType = new BilingualText();
      }
    if (
      this.person.contractType.english === PersonTypeEnum.ContractedDoctor ||
      this.person.contractType.english === PersonTypeEnum.Nurse
    ) {
      this.person.fees = this.fees;
      this.person.feesPerVisit = null;
    } else if (this.person.contractType.english === PersonTypeEnum.VisitingDoctor) {
      this.person.feesPerVisit = this.ContractForm.get('feespervisit').value;
      this.person.fees = null;
    }
    this.person.govtEmployee = this.ContractForm.get('jobSector').get('english').value === 'Government' ? true : false;
  }
  resetForm() {
    this.ContractForm.get('medicalboardtype').reset();
    this.ContractForm.get('hospital').reset();
    this.ContractForm.get('specialty').reset();
    this.ContractForm.get('subspecialty').reset();
    this.ContractForm.get('region').reset();
    this.ContractForm.get('feespervisit').reset();
  }
}
