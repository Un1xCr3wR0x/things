/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  AppConstants,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BaseComponent,
  borderNoValidator,
  CoreContributorService,
  GccCountryEnum,
  IdentifierLengthEnum,
  IdentityTypeEnum,
  iqamaValidator,
  lengthValidator,
  LookupService,
  LovList,
  markFormGroupTouched,
  markFormGroupUntouched,
  NationalityTypeEnum,
  ninValidator,
  Person,
  StorageService
} from '@gosi-ui/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { ManagePersonConstants } from '../../constants';
import { CimRoutesEnum, MaxLength } from '../../enums';
import { ManagePersonRoutingService } from '../../services';
import { ManagePersonService } from '../../services/manage-person.service';

@Component({
  selector: 'cim-search-contributor-dc',
  templateUrl: './search-contributor-dc.component.html',
  styleUrls: ['./search-contributor-dc.component.scss']
})
export class SearchContributorScComponent extends BaseComponent implements OnInit, OnDestroy {
  //Field lengths
  typeNIN = IdentityTypeEnum.NIN;
  typeIQAMA = IdentityTypeEnum.IQAMA;
  typeNATIONALID = IdentityTypeEnum.NATIONALID;
  typePASSPORT = IdentityTypeEnum.PASSPORT;
  ninLength = IdentifierLengthEnum.NIN;
  iqamaLength = IdentifierLengthEnum.IQAMA;
  borderLength = IdentifierLengthEnum.BORDER_ID;
  passportNoMax = IdentifierLengthEnum.PASSPORT;
  maxLength = MaxLength;

  //Local Variables
  verifyPersonForm: FormGroup;
  saudiNationality = true;
  gccNationality: boolean;
  others: boolean;
  gccCountries = GccCountryEnum;
  currentDate: Date = new Date();
  submitted = false;
  modalRef: BsModalRef;
  nationalityList: Observable<LovList>;
  gccCountryList: Observable<LovList>;
  isUserLoggedIn = false;
  isCsr = false;
  label: string;
  searchRequired = false;

  /**
   * Creates an instance of SearchContributorScComponent
   * @memberof  SearchContributorScComponent
   *
   */
  constructor(
    private fb: FormBuilder,
    private manageService: ManagePersonService,
    private alertService: AlertService,
    private lookService: LookupService,
    private storageService: StorageService,
    @Inject(ApplicationTypeToken) readonly appTypeToken: string,
    private router: Router,
    private managePersonRoutingService: ManagePersonRoutingService,
    private contributorService: CoreContributorService
  ) {
    super();
  }

  /**
   * This method handles the initialization tasks.
   *
   */
  ngOnInit() {
    this.managePersonRoutingService.resetLocalToken();
    if (this.router.url.includes('user')) {
      this.isUserLoggedIn = true;
    }
    if (this.isUserLoggedIn === false) {
      this.verifyPersonForm = this.fb.group({
        registrationNo: [null],
        socialInsuranceNo: [null, { validators: [Validators.required], updateOn: 'blur' }]
      });
    } else {
      this.verifyPersonForm = this.mngCreateSearchPersonForm();
    }

    if (this.appTypeToken === ApplicationTypeEnum.PRIVATE) {
      this.isCsr = true;
      this.searchRequired = true;
      //removed Validator.required from registration number field for unified profile
    }
    this.alertService.clearAlerts();
    this.nationalityList = this.lookService.getNationalityList();
    this.gccCountryList = this.lookService.getGccCountryList();
  }

  //Method to search to contributor
  searchContributor() {
    markFormGroupTouched(this.verifyPersonForm);
    let registrationNo = null;
    if (this.appTypeToken === ApplicationTypeEnum.PRIVATE) {
      registrationNo = this.verifyPersonForm.get('registrationNo').value;
    } else {
      registrationNo = this.storageService.getSessionValue(AppConstants.ESTABLISHMENT_REG_KEY);
    }
    this.contributorService.registartionNo = registrationNo;
    const socialInsuranceNo = this.verifyPersonForm.get('socialInsuranceNo').value;
    if (socialInsuranceNo) {
      this.contributorService.selectedSIN = socialInsuranceNo;
      this.manageService.searchContributor(registrationNo, socialInsuranceNo).subscribe(
        res => {
          this.manageService.registrationNo = registrationNo;
          this.manageService.socialInsuranceNo = res.socialInsuranceNo;
          if (res.person.personId) {
            this.manageService.setPersonId(res.person.personId);
            this.contributorService.personId = res.person.personId;
          }
          if (registrationNo) this.fetchEstablishmentDetails(registrationNo);
          else
            this.router.navigate([
              ManagePersonConstants.ROUTE_CONTRIBUTOR_UNIFIED_PROFILE(this.manageService.socialInsuranceNo)
            ]);
        },
        err => {
          this.showErrorMessage(err);
        }
      );
    } else this.alertService.showMandatoryErrorMessage();
  }

  /**
   * Method to fetch establishment details
   * @param registrationNo
   */
  fetchEstablishmentDetails(registrationNo) {
    this.manageService.getEstablishmentProfile(registrationNo).subscribe(
      () => {
        this.storageService.setSessionValue(AppConstants.ESTABLISHMENT_REG_KEY, registrationNo);

        this.router.navigate([
          ManagePersonConstants.ROUTE_CONTRIBUTOR_PROFILE_ENGAGEMENT(
            this.manageService.registrationNo,
            this.manageService.socialInsuranceNo
          )
        ]);
      },
      err => {
        this.showErrorMessage(err);
      }
    );
  }

  /**
   * Method to show error messages coming from api
   * @param err
   */
  showErrorMessage(err) {
    if (err) {
      this.alertService.showError(err.error.message, err.error.details);
    }
  }

  /**
   * This method is used to initialise the form template
   */
  mngCreateSearchPersonForm() {
    return this.fb.group({
      iqama: [
        null,
        {
          validators: Validators.compose([
            Validators.pattern('[0-9]+'),
            Validators.required,
            lengthValidator(this.iqamaLength),
            iqamaValidator
          ]),
          updateOn: 'blur'
        }
      ],
      borderNo: [
        null,
        {
          validators: Validators.compose([
            Validators.pattern('[0-9]+'),
            Validators.required,
            lengthValidator(this.borderLength),
            borderNoValidator
          ]),
          updateOn: 'blur'
        }
      ],
      nationality: this.fb.group({
        english: [null, Validators.required],
        arabic: []
      }),
      birthDate: this.fb.group({
        gregorian: [null, { validators: Validators.required, updateOn: 'blur' }],
        hijiri: ''
      }),

      type: this.typeNIN,
      id: [
        null,
        {
          validators: Validators.compose([Validators.pattern('[0-9]+'), Validators.required]),
          updateOn: 'blur'
        }
      ],
      passport: [
        null,
        {
          validators: Validators.compose([Validators.required, Validators.maxLength(this.passportNoMax)]),
          updateOn: 'blur'
        }
      ],
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
    });
  }

  /**
   * This method is to show the required identifiers to search the person
     Saudi Nationality: National Identifier Number
     Non Saudi : Iqama Number
     GCC nationality: GCC National ID or Passport Number or Iqama Number
   * @param nationality
   * @memberof SearchPersonDcComponent
   */
  selectIdType(nationality) {
    if (nationality === null) {
      this.verifyPersonForm.get('type').setValue(null);
      this.verifyPersonForm.get('type').updateValueAndValidity();
    }
    if (nationality !== this.verifyPersonForm.get('nationality').value) {
      this.verifyPersonForm.get('birthDate').get('gregorian').setValue(null);
      this.selectIdTypeOnChanges(nationality);
    }
  }

  /**
   * This method is to select the id type on ng changes
   * @param nationality
   */
  selectIdTypeOnChanges(nationality) {
    const nin = this.verifyPersonForm.get('newNin');
    const iqama = this.verifyPersonForm.get('iqama');
    const border = this.verifyPersonForm.get('borderNo');
    const id = this.verifyPersonForm.get('id');
    const passportNumber = this.verifyPersonForm.get('passport');
    nin.setValue(null);
    iqama.setValue(null);
    border.setValue(null);
    passportNumber.setValue(null);
    id.setValue(null);
    this.updateFormControlsValidity();
    markFormGroupUntouched(this.verifyPersonForm);
    this.disableControl(nin);
    this.disableControl(iqama);
    this.disableControl(border);
    this.disableControl(id);
    this.disableControl(passportNumber);
    this.verifyPersonForm.updateValueAndValidity();
    this.saudiNationality = false;
    this.gccNationality = false;
    this.others = false;

    if (nationality === NationalityTypeEnum.SAUDI_NATIONAL) {
      this.saudiNationality = true;
      this.enableControl(nin);
      this.verifyPersonForm.get('type').setValue(this.typeNIN);
    } else if (Object.values(this.gccCountries).indexOf(nationality) !== -1) {
      this.gccNationality = true;
      this.enableControl(id);
      this.enableControl(passportNumber);
      this.enableControl(iqama);
      this.enableControl(border);
      id.setValidators([Validators.required, lengthValidator(this.getGccIdLength())]);
      this.verifyPersonForm.get('type').setValue(this.typeNATIONALID);
    } else {
      this.others = true;
      this.enableControl(iqama);
      this.enableControl(border);
      iqama.setValidators([Validators.required, lengthValidator(this.iqamaLength), iqamaValidator]);
      border.setValidators([Validators.required, lengthValidator(this.borderLength), borderNoValidator]);
      this.verifyPersonForm.get('type').setValue(this.typeIQAMA);
    }
    this.updateFormControlsValidity();
  }

  /**
   * This method is used to make the necessary field required and others optional on blur event of the control
   * This functionality should be triggered only for gcc countries
   */
  fieldRequired() {
    const id = this.verifyPersonForm.get('id');
    const iqama = this.verifyPersonForm.get('iqama');
    const border = this.verifyPersonForm.get('borderNo');
    const passportNumber = this.verifyPersonForm.get('passport');
    const nationality = this.verifyPersonForm?.get('nationality')?.get('english').value;
    //Only for gcc coutnries
    if (Object.values(this.gccCountries).indexOf(nationality) !== -1) {
      if (id.value !== null && id.value !== '') {
        id.setValidators([Validators.required, lengthValidator(this.getGccIdLength())]);
        iqama.setValidators([lengthValidator(this.iqamaLength), iqamaValidator]);
        border.setValidators([lengthValidator(this.borderLength), borderNoValidator]);
        passportNumber.setValidators([Validators.maxLength(this.passportNoMax)]);
      } else if (iqama.value !== null && iqama.value !== '') {
        iqama.setValidators([Validators.required, lengthValidator(this.iqamaLength), iqamaValidator]);
        border.setValidators([lengthValidator(this.borderLength), borderNoValidator]);
        id.setValidators([lengthValidator(this.getGccIdLength())]);
        passportNumber.setValidators([Validators.maxLength(this.passportNoMax)]);
      } else if (border.value !== null && border.value !== '') {
        passportNumber.setValidators([Validators.maxLength(this.passportNoMax)]);
        border.setValidators([Validators.required, lengthValidator(this.borderLength), borderNoValidator]);
        iqama.setValidators([lengthValidator(this.iqamaLength), iqamaValidator]);
        id.setValidators([lengthValidator(this.getGccIdLength())]);
      } else if (passportNumber.value !== null && passportNumber.value !== '') {
        passportNumber.setValidators([Validators.required, Validators.maxLength(this.passportNoMax)]);
        border.setValidators([lengthValidator(this.borderLength), borderNoValidator]);
        iqama.setValidators([lengthValidator(this.iqamaLength), iqamaValidator]);
        id.setValidators([lengthValidator(this.getGccIdLength())]);
      } else {
        id.setValidators([Validators.required, lengthValidator(this.getGccIdLength())]);
        border.setValidators([lengthValidator(this.borderLength), borderNoValidator]);
        iqama.setValidators([lengthValidator(this.iqamaLength), iqamaValidator]);
        passportNumber.setValidators([Validators.maxLength(this.passportNoMax)]);
        id.markAsUntouched();
        id.markAsPristine();
        iqama.markAsUntouched();
        iqama.markAsPristine();
        border.markAsUntouched();
        border.markAsPristine();
        passportNumber.markAsUntouched();
        passportNumber.markAsPristine();
      }
    } else if (this.verifyPersonForm.get('nationality').get('english').value !== NationalityTypeEnum.SAUDI_NATIONAL) {
      if (iqama.value !== null && iqama.value !== '') {
        iqama.setValidators([Validators.required, lengthValidator(this.iqamaLength), iqamaValidator]);
        border.setValidators([lengthValidator(this.borderLength), borderNoValidator]);
      } else if (border.value !== null && border.value !== '') {
        border.setValidators([Validators.required, lengthValidator(this.borderLength), borderNoValidator]);
        iqama.setValidators([lengthValidator(this.iqamaLength), iqamaValidator]);
      } else {
        border.setValidators([lengthValidator(this.borderLength), borderNoValidator]);
        iqama.setValidators([Validators.required, lengthValidator(this.iqamaLength), iqamaValidator]);
        iqama.markAsUntouched();
        iqama.markAsPristine();
        border.markAsUntouched();
        border.markAsPristine();
      }
    }
    this.updateFormControlsValidity();
  }

  /**
   * This method fetches the corresponding gcc national id length for different nationalities
   */
  getGccIdLength() {
    const gccNationality = this.verifyPersonForm.get('nationality').get('english');
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
   * This method is used to reflect the validation after the control validitiy is updated
   */
  updateFormControlsValidity() {
    const id = this.verifyPersonForm.get('id');
    const iqama = this.verifyPersonForm.get('iqama');
    const border = this.verifyPersonForm.get('borderNo');
    const passportNumber = this.verifyPersonForm.get('passport');
    id.updateValueAndValidity();
    iqama.updateValueAndValidity();
    passportNumber.updateValueAndValidity();
    border.updateValueAndValidity();
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

  /**
   * This method is to submit the admin details for verification
   * @memberof SearchPersonDcComponent
   */
  verifyPerson() {
    markFormGroupTouched(this.verifyPersonForm);
    this.alertService.clearAlerts();
    this.manageService.getPersonDetails(this.verifyPersonForm.getRawValue()).subscribe(
      res => {
        if (res) {
          const person = new Person();
          for (const key in res) {
            if (res[key]) {
              person[key] = res[key];
            }
          }
          if (person.contactDetail.addresses === undefined) {
            person.contactDetail.addresses = [];
          }
          this.router.navigate([CimRoutesEnum.USER_PROFILE_INFO]);
        }
      },
      err => {
        this.showErrorMessage(err);
      }
    );
  }

  /**Method to clear alert on component destruuction */
  ngOnDestroy(): void {
    this.alertService.clearAllErrorAlerts();
  }
}
