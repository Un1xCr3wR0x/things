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
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BaseComponent,
  BilingualText,
  LanguageToken,
  LookupService,
  Lov,
  LovList,
  markFormGroupUntouched
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, noop, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MbProfile, MemberData, Contracts, ContractData } from '../../../shared/models';
import { DoctorService } from '../../../shared/services';
import { Router, ActivatedRoute } from '@angular/router';
import { MbRouteConstants } from '../../../shared';
import { PersonTypeEnum } from '../../../shared/enums/person-type-enum';

@Component({
  selector: 'mb-doctor-details-sc',
  templateUrl: './doctor-details-sc.component.html',
  styleUrls: ['./doctor-details-sc.component.scss']
})
export class DoctorDetailsScComponent extends BaseComponent implements OnInit, OnChanges {
  submitted = false;
  @Output() submit: EventEmitter<Object> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  @Output() invalidForm: EventEmitter<null> = new EventEmitter();
  @Output() formChanged: EventEmitter<null> = new EventEmitter();

  //TODO Provide types
  subSpecialtyDetails: BilingualText[] = [];
  regionDetails: BilingualText[] = [];

  @Input() medicalboardtype: LovList;
  @Input() specialty: LovList;
  @Input() label: string;
  @Input() noPadding = false;
  @Input() doctorType: LovList;
  @Input() subspecialty: LovList;
  @Input() region: LovList;
  @Input() fees: number;
  @Input() hospital: LovList;
  @Input() feespervisit: LovList;
  @Input() hasPerson = false;
  data: MemberData = new MemberData();
  //TODO Use camel case
  memberperson: ContractData;
  person: MbProfile;
  ContractForm: FormGroup; //TODO pascal case
  lang: string;
  modalRef: BsModalRef;
  showSubspecialty = false;
  ContractedDoctor: boolean;
  VisitingDoctor: boolean;
  nurse: boolean;
  ShowSubSpecialtyList: LovList = null;
  contractTypeLovList: LovList = new LovList([]);
  doctorType$: Observable<LovList>;
  medicalboardtype$: Observable<LovList>;
  feespervisit$: Observable<LovList>;
  specialty$: Observable<LovList>;
  subspecialty$: Observable<LovList>;
  region$: Observable<LovList>;
  hospital$: Observable<LovList>;
  contract: Contracts = new Contracts();
  identificationNo: number;
  govtOrprivtList: LovList = new LovList([]);
  govtEmployee: boolean;

  //TODO Dont use services which can cause side effects in dumb components
  constructor(
    private fb: FormBuilder,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    private modalService: BsModalService,
    readonly lookUpService: LookupService,
    readonly doctorService: DoctorService,
    readonly alertService: AlertService,
    readonly route: ActivatedRoute,
    readonly router: Router,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {
    super();
    this.ContractedDoctor = true;
    this.VisitingDoctor = true;
    this.nurse = true;
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        tap(params => {
          if (params && params.get('identificationNo')) this.identificationNo = +params.get('identificationNo');
        })
      )
      .subscribe(noop, err => this.alertService.showError(err?.error?.message));
    this.ContractedDoctor = false;
    this.VisitingDoctor = false;
    this.nurse = false;
    this.ContractForm = this.createMemberContractForm();
    this.lookUpService.getSpecialityList().subscribe(res => {
      this.specialty = res;
    });
    this.region$ = this.lookUpService.getRegionsList();
    this.hospital$ = this.lookUpService.getHospitalList();
    if (this.appToken === ApplicationTypeEnum.MEDICAL_BOARD) {
      this.getContractMemberDetails(this.identificationNo);
    } else {
      this.getPersonDetails(this.identificationNo);
    }
    this.govtOrprivtList = new LovList([
      { value: { english: 'Private', arabic: 'خاص' }, sequence: 0, code: 101 },
      { value: { english: 'Government', arabic: 'حكومة' }, sequence: 1, code: 102 }
    ]);
  }
  getPersonDetails(identificationNo) {
    this.doctorService
      .getPersonDetails(identificationNo)
      .pipe(
        tap(res => {
          this.person = res;
          //TODO setDetailsToForm to set all the details from person to contract form
          this.ContractForm.get('specialty').patchValue(this.person?.contracts[0]?.specialty);
          let value: Lov;
          if (this.person?.contracts[0]?.contractType?.english === PersonTypeEnum.Nurse) {
            this.nurse = true;
            this.ContractForm.patchValue({ hospital: this.person?.contracts[0]?.hospital });
            this.regionDetails = this.person?.contracts[0]?.region;
          }
          if (this.person?.contracts[0]?.specialty) {
            this.specialty?.items?.forEach(element => {
              if (this.person?.contracts[0]?.specialty?.english === element.value.english) {
                value = element;
              }
            });
          }
          this.person?.contracts[0]?.govtEmployee
            ? this.ContractForm.get('jobSector')?.get('english')?.setValue('Government')
            : this.ContractForm.get('jobSector')?.get('english')?.setValue('Private');

          this.selectSubSpeciality(value);
          this.ContractForm.patchValue({ hospital: this.person?.contracts[0]?.hospital });
          this.regionDetails = this.person?.contracts[0]?.region;
          this.subSpecialtyDetails = this.person?.contracts[0]?.subSpecialty;
          this.ContractForm.updateValueAndValidity();
        })
      )
      .subscribe(noop, err => this.showErrorMessage(err));
  }

  getContractMemberDetails(identificationNo) {
    this.doctorService
      .getContractMemberDetail(identificationNo)
      .pipe(
        tap(res => {
          this.person = res;
          //TODO setDetailsToForm to set all the details from person to contract form
          this.ContractForm.get('specialty').patchValue(this.person?.contracts[0]?.specialty);
          let value: Lov;
          if (this.person?.contracts[0]?.contractType?.english === PersonTypeEnum.Nurse) {
            this.nurse = true;
            this.ContractForm.patchValue({ hospital: this.person?.contracts[0]?.hospital });
            this.regionDetails = this.person?.contracts[0]?.region;
          }
          if (this.person?.contracts[0]?.specialty) {
            this.specialty?.items?.forEach(element => {
              if (this.person?.contracts[0]?.specialty?.english === element.value.english) {
                value = element;
              }
            });
          }
          this.person?.contracts[0]?.govtEmployee
            ? this.ContractForm.get('jobSector')?.get('english')?.setValue('Government')
            : this.ContractForm.get('jobSector')?.get('english')?.setValue('Private');

          this.selectSubSpeciality(value);
          this.ContractForm.patchValue({ hospital: this.person?.contracts[0]?.hospital });
          this.regionDetails = this.person?.contracts[0]?.region;
          this.subSpecialtyDetails = this.person?.contracts[0]?.subSpecialty;
          this.ContractForm.updateValueAndValidity();
        })
      )
      .subscribe(noop, err => this.showErrorMessage(err));
  }
  /**
   * This method is Initialize the data to prepopulate
   */

  getPersonContract(identificationNo) {
    this.doctorService.getContractDataDetail(identificationNo).subscribe(
      res => {
        this.memberperson = res;
        this.ContractForm.get('specialty').patchValue(this.memberperson.contracts[0].specialty);
        let value: Lov;
        if (this.memberperson.contracts[0].contractType.english === PersonTypeEnum.Nurse) {
          this.nurse = true;
          this.ContractForm.patchValue({ hospital: this.memberperson.contracts[0].hospital });
          this.regionDetails = this.memberperson.contracts[0].region;
        }
        if (this.memberperson.contracts[0].specialty) {
          this.specialty.items?.forEach(element => {
            if (this.memberperson.contracts[0].specialty.english === element.value.english) {
              value = element;
            }
          });
        }
        this.memberperson.contracts[0].govtEmployee
          ? this.ContractForm.get('jobSector')?.get('english')?.setValue('Government')
          : this.ContractForm.get('jobSector')?.get('english')?.setValue('Private');

        this.selectSubSpeciality(value);
        this.ContractForm.patchValue({ hospital: this.memberperson.contracts[0].hospital });
        this.regionDetails = this.memberperson.contracts[0].region;
        this.subSpecialtyDetails = this.memberperson.contracts[0].subSpecialty;
        this.ContractForm.updateValueAndValidity();
      },
      err => this.showErrorMessage(err)
    );
  }
  showErrorMessage(err) {
    if (err && err.error) {
      this.alertService.showError(err.error.message, err.error.details);
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.doctorType && changes.doctorType.currentValue) {
      if (this.doctorType && this.doctorType.items.length > 0) {
        this.contractTypeLovList = new LovList(this.doctorType.items);
      }
    }
    if (this.person.govtEmployee === true) {
      this.ContractForm.get('jobSector')?.get('english')?.setValue('Government');
    } else this.ContractForm.get('jobSector')?.get('english')?.setValue('Private');
  }

  /**
   * This method is to Select Subspecialties according to specialty value
   */
  selectSubSpeciality(specialty: Lov) {
    this.ShowSubSpecialtyList = new LovList([]);
    if (this.ContractForm.get('specialty').valueChanges) {
      this.ContractForm.get('subspecialty').reset();
      this.ContractForm.updateValueAndValidity();
    }
    if (specialty === null) {
      this.showSubspecialty = false;
    } else {
      this.showSubspecialty = true;
      this.ShowSubSpecialtyList = new LovList(specialty.items);
    }
  }
  /**
   * This method is to Validate the form
   */
  createMemberContractForm() {
    return this.fb.group({
      region: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: []
      }),
      specialty: this.fb.group({
        english: [null, { validators: Validators.required, updateOn: 'blur' }],
        arabic: []
      }),
      hospital: this.fb.group({
        english: [null, { validators: Validators.required, updateOn: 'blur' }],
        arabic: []
      }),
      subspecialty: this.fb.group({
        english: [],
        arabic: []
      }),
      jobSector: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: []
      })
    });
  }
  selectJobSector(type) {
    if (type === 'Government') {
      this.govtEmployee = true;
    } else if (type === 'Private') {
      this.govtEmployee = false;
    }
  }
  saveMemberDetil() {
    this.alertService.clearAlerts();
    this.checkFormValidity();
    if (this.appToken === ApplicationTypeEnum.MEDICAL_BOARD) {
      if (!this.ContractForm.invalid) {
        this.getFormValues();
        this.doctorService
          .saveContractDoctorDetail(this.contract, this.identificationNo)
          .pipe(
            tap(res => {
              this.doctorService.responseMessage = res.message;
              this.router.navigate([MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(this.identificationNo)]);
            })
          )
          .subscribe(noop, err => {
            this.showErrorMessage(err);
          });
      } else {
        this.alertService.showMandatoryErrorMessage();
      }
    } else {
      if (!this.ContractForm.invalid) {
        this.getFormValues();
        this.doctorService
          .saveDoctorDetail(this.contract)
          .pipe(
            tap(res => {
              this.doctorService.responseMessage = res.message;
              this.router.navigate([MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(this.identificationNo)]);
            })
          )
          .subscribe(noop, err => {
            this.showErrorMessage(err);
          });
      } else {
        this.alertService.showMandatoryErrorMessage();
      }
    }
  }
  getSubSpecialtyDetail(list) {
    this.subSpecialtyDetails = list;
    list
      .map(res => res['english'])
      ?.forEach(ele => {
        if (this.subSpecialtyDetails?.map(val => val['english'])?.indexOf(ele) < 0) {
          this.subSpecialtyDetails.push({ english: list?.english, arabic: list?.arabic });
        }
      });
  }

  getRegionDetail(list) {
    this.regionDetails = list;
    list
      .map(res => res['english'])
      .forEach(ele => {
        if (this.regionDetails?.map(val => val['english'])?.indexOf(ele) < 0) {
          this.regionDetails.push({ english: list?.english, arabic: list?.arabic });
        }
      });
  }

  checkFormValidity() {
    const special = this.ContractForm.get('specialty');
    const medicalProvider = this.ContractForm.get('hospital');
    const regions = this.ContractForm.get('region');
    const jobSector = this.ContractForm.get('jobSector');
    markFormGroupUntouched(this.ContractForm);
    this.disableControl(special);
    this.disableControl(medicalProvider);
    this.disableControl(regions);
    this.disableControl(jobSector);
    this.ContractForm.updateValueAndValidity();
    const doctorType = this.person?.contracts[0]?.contractType;
    if (doctorType?.english === PersonTypeEnum.ContractedDoctor) {
      this.enableControl(medicalProvider);
      this.enableControl(special);
      this.enableControl(regions);
      this.enableControl(jobSector);
    } else if (doctorType?.english === PersonTypeEnum.VisitingDoctor) {
      this.enableControl(medicalProvider);
      this.enableControl(special);
      this.enableControl(regions);
      this.enableControl(jobSector);
    } else if (doctorType?.english === PersonTypeEnum.Nurse) {
      this.enableControl(medicalProvider);
      this.enableControl(regions);
      this.disableControl(special);
      this.disableControl(jobSector);
    } else {
      this.enableControl(medicalProvider);
      this.disableControl(special);
      this.enableControl(regions);
      this.disableControl(jobSector);
    }
    this.updateFormControlsValidity();
  }
  updateFormControlsValidity() {
    const special = this.ContractForm.get('specialty');
    const medicalProvider = this.ContractForm.get('hospital');
    const regions = this.ContractForm.get('region');
    const jobSector = this.ContractForm.get('jobSector');
    special.updateValueAndValidity();
    medicalProvider.updateValueAndValidity();
    regions.updateValueAndValidity();
    jobSector.updateValueAndValidity();
  }
  /**
   * This method is enables the form control
   * @param formControl
   * @memberof SearchPersonDcComponent
   */
  enableControl(formControl: AbstractControl) {
    if (formControl) formControl.enable();
  }

  /**
   * This method is disables the form control
   * @param formControl
   * @memberof SearchPersonDcComponent
   */
  disableControl(formControl: AbstractControl) {
    if (formControl) formControl.disable();
  }

  getFormValues() {
    const id = this.person?.contracts[0]?.contractId;
    this.contract.contractId = id;
    this.contract.hospital = this.ContractForm.get('hospital').value;
    if (this.regionDetails === null || this.ContractForm.get('region').value === null) {
      this.ContractForm.get('region').markAsTouched();
      this.ContractForm.get('region').updateValueAndValidity();
    } else {
      this.contract.region = this.regionDetails;
    }
    this.contract.specialty = this.ContractForm.get('specialty').value;
    this.contract.subSpecialty = this.subSpecialtyDetails;
    if (this.person?.contracts[0]?.contractType?.english === PersonTypeEnum.Nurse) {
      this.contract.specialty = new BilingualText();
      this.contract.subSpecialty = new Array<BilingualText>();
    }
    const jobSector = this.ContractForm.get('jobSector').value;
    this.contract.govtEmployee = jobSector?.english === 'Government' ? true : false;
  }

  popUpCancel(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template);
  }

  /**
   * This method is to confirm cancelation the form
   */
  confirmCancel() {
    this.alertService.clearAlerts();
    this.modalRef.hide();
    this.router.navigate([MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(this.identificationNo)]);
  }

  /**
   * This method is to decline cancelation the form   *
   */
  decline() {
    this.modalRef.hide();
  }
}
