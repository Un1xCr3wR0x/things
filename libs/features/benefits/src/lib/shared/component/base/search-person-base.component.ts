/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Directive, Input } from '@angular/core';
import { FormGroup, Validators, FormArray, FormControl, FormBuilder } from '@angular/forms';
import {
  IdentifierLengthEnum,
  lengthValidator,
  ninValidator,
  NationalityTypeEnum,
  LovList,
  IdentityTypeEnum,
  iqamaValidator,
  LookupService,
  AppConstants
} from '@gosi-ui/core';
import { BenefitConstants } from '../../constants/benefit-constants';
import { Observable } from 'rxjs';
import { setGccIdMaxLength } from '../../utils/benefitUtil';
import { ManageBenefitService } from '../../services';
import { Router } from '@angular/router';

@Directive()
export abstract class SearchPersonComponent {
  @Input() nationalityList$: Observable<LovList>;

  //Identity types
  ninType = IdentityTypeEnum.NIN;
  iqamaType = IdentityTypeEnum.IQAMA;
  gccType = IdentityTypeEnum.NATIONALID;
  passportType = IdentityTypeEnum.PASSPORT;
  //identifier lengths
  ninLength = IdentifierLengthEnum.NIN;
  iqamaLength = IdentifierLengthEnum.IQAMA;
  passportLength = IdentifierLengthEnum.PASSPORT;
  iqamaControl: FormControl;
  gccIdControl: FormControl;
  passportControl: FormControl;
  searchForm: FormGroup;
  heirId: number;
  heirDOB: string;
  heirDOBType: string;
  heirIdentifier: number;
  heirIdentifierType: string;
  gccIdLength: number;

  constructor(
    readonly fb: FormBuilder,
    readonly manageBenefitService: ManageBenefitService,
    readonly lookUpService: LookupService,
    readonly router: Router
  ) {}

  initializeForms() {
    this.searchForm = this.createSearchPersonForm();
    this.selectIdForm(undefined);
  }

  /**
   * create search person form
   */
  createSearchPersonForm(): FormGroup {
    return this.fb.group({
      nationality: this.fb.group({
        english: [NationalityTypeEnum.SAUDI_NATIONAL, { validators: Validators.required, updateOn: 'blur' }],
        arabic: null
      })
    });
  }

  /**
   * Method to create the identity form
   * @param nationality
   */
  selectIdForm(nationality: string) {
    if (this.searchForm.get('identity')) {
      this.searchForm.removeControl('identity');
    }
    if (BenefitConstants.GCC_NATIONAL.indexOf(nationality) !== -1) {
      setGccIdMaxLength(nationality);
      this.searchForm.addControl('identity', this.createGccForm());
      this.iqamaControl = this.idControl(IdentityTypeEnum.IQAMA).get('iqamaNo') as FormControl;
      this.iqamaControl.setValidators([
        Validators.pattern('[0-9]+'),
        lengthValidator(this.iqamaLength),
        iqamaValidator
      ]);
      this.gccIdControl.setValidators([lengthValidator(this.getGccIdLength())]);
    } else if (nationality !== NationalityTypeEnum.SAUDI_NATIONAL && nationality) {
      this.searchForm.addControl('identity', this.createNonSaudiForm());
      this.iqamaControl = this.idControl(IdentityTypeEnum.IQAMA).get('iqamaNo') as FormControl;
      this.iqamaControl.setValidators([
        Validators.pattern('[0-9]+'),
        lengthValidator(this.iqamaLength),
        // Validators.required,
        iqamaValidator
      ]);
    } else {
      this.searchForm.addControl('identity', this.createSaudiForm());
    }
  }

  /**
   * Method to create gcc form
   */
  createGccForm(): FormArray {
    const array = this.fb.array([]);
    array.push(this.createGccIdForm());
    array.push(this.createIqamaNoFormGroup());
    array.push(this.createPassportFormGroup());
    return array;
  }

  /**
   * Method to create form for non saudi
   */
  createNonSaudiForm(): FormArray {
    const array = this.fb.array([]);
    array.push(this.createIqamaNoFormGroup());
    array.push(this.createPassportFormGroup());
    return array;
  }

  /**
   * Method to create form for saudi
   */
  createSaudiForm(): FormArray {
    const array = this.fb.array([]);
    array.push(
      this.fb.group({
        idType: this.ninType,
        newNin: [
          null,
          {
            validators: Validators.compose([
              Validators.pattern('[0-9]+'),
              Validators.required,
              lengthValidator(this.ninLength),
              ninValidator
            ]),
            updateOn: 'blur'
          }
        ]
      })
    );
    return array;
  }

  /**
   * Create iqama form
   */
  createIqamaNoFormGroup(): FormGroup {
    return this.fb.group({
      idType: this.iqamaType,
      iqamaNo: [
        null,
        {
          validators: Validators.compose([
            Validators.pattern('[0-9]+'),
            // Validators.required,
            lengthValidator(this.iqamaLength),
            iqamaValidator
          ]),
          updateOn: 'blur'
        }
      ]
    });
  }

  /**
   * Create passport id form
   */
  createPassportFormGroup(): FormGroup {
    return this.fb.group({
      idType: this.passportType,
      passportNo: [
        null,
        {
          validators: Validators.compose([Validators.pattern('[a-zA-Z0-9]+$')]),
          updateOn: 'blur'
        }
      ]
    });
  }

  /**
   * Method to crate gcc id form
   */
  createGccIdForm(): FormGroup {
    return this.fb.group({
      idType: this.gccType,
      id: [
        null,
        {
          validators: Validators.compose([Validators.pattern('[0-9]+'), lengthValidator(this.gccIdLength)]),
          updateOn: 'blur'
        }
      ]
    });
  }
  //**to set gcc length */
  getGccIdLength() {
    const gccNationality = this.searchForm.get('nationality').get('english');
    let maxLength = 15;
    if (gccNationality && gccNationality.value) {
      Object.keys(AppConstants.NATIONALITY_ID_LENGTH_MAPPING).forEach(key => {
        if (gccNationality.value === key) {
          maxLength = AppConstants.NATIONALITY_ID_LENGTH_MAPPING[key];
        }
      });
    }
    return maxLength;
  }
  /**
   * Method to get the id controls corresponding to id type
   * @param idType
   */
  idControl(idType: string): FormGroup {
    return this.identityFormArray.find(formGroup => formGroup.get('idType').value === idType) as FormGroup;
  }

  get identityFormArray(): FormGroup[] {
    if (this.searchForm.controls.identity) {
      return (this.searchForm.controls.identity as FormArray).controls as FormGroup[];
    } else {
      return [];
    }
  }
}
