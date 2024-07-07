import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CalendarTypeEnum, IdentityTypeEnum, Iqama, Lov, LovList, NIN, NationalityTypeEnum, Person, convertToYYYYMMDD, hijiriToJSON, iqamaValidator, lengthValidator, markFormGroupTouched, ninValidator } from '@gosi-ui/core';
import { ContributorTypesEnum } from '@gosi-ui/features/contributor';
import { LovListConstants } from '../../constants';

@Component({
  selector: 'gosi-ui-customer-verify-dc',
  templateUrl: './customer-verify-dc.component.html',
  styleUrls: ['./customer-verify-dc.component.scss']
})
export class CustomerVerifyDcComponent implements OnInit {

  /**Variable declaration and initialization */
  searchSaudiContributorForm: FormGroup;
  currentDate = new Date();
  personDetails = new Person();
  queryParams = '';
  MIN_LENGTH = 10;
  MAX_LENGTH = 10;
  calenderList: LovList;
  typeGregorian = CalendarTypeEnum.GREGORIAN;
  typeHijira = CalendarTypeEnum.HIJRI;
  identityTypeList: LovList;

  /** Input variables. */
  @Input() personType: string;
  @Input() role = 'default';
  @Input() parentForm: FormGroup; //For Add vic
  @Input() calendarType = CalendarTypeEnum.GREGORIAN;

  /** Output event emitters. */
  @Output() verify: EventEmitter<Object> = new EventEmitter();
  @Output() reset: EventEmitter<null> = new EventEmitter();
  @Output() error: EventEmitter<null> = new EventEmitter();
  @Output() onSelected = new EventEmitter<string>();

  constructor(private fb: FormBuilder) {}
  /**
   * Method to handle all initial tasks on component load
   */
  ngOnInit() {
    
    this.identityTypeList = new LovList(LovListConstants.ID_TYPE_LIST);
    const item = [
      {
        value: { english: 'Gregorian', arabic: 'ميلادي' },
        sequence: 1
      },
      {
        value: { english: 'Hijiri', arabic: 'هجري' },
        sequence: 2
      }
    ];
    this.calenderList = new LovList(item);
    this.searchSaudiContributorForm = this.createSearchSaudiForm();
    if (this.parentForm) this.parentForm.addControl('saudiSearch', this.searchSaudiContributorForm);
    this.detectFormChange();
  }
  /**
   * Method to detect change in calender type (hijiri or gregorian) and set the form validation accordingly
   */
  detectFormChange() {
    if (this.searchSaudiContributorForm) {
      this.searchSaudiContributorForm.get('calenderType.english').valueChanges.subscribe(calender => {
        if (calender === 'Gregorian') {
          this.searchSaudiContributorForm.get('birthDate.gregorian').setValidators([Validators.required]);
          this.searchSaudiContributorForm.get('birthDate.hijiri').reset();
          this.searchSaudiContributorForm.get('birthDate.hijiri').clearValidators();
        } else {
          this.searchSaudiContributorForm.get('birthDate.hijiri').setValidators([Validators.required]);
          this.searchSaudiContributorForm.get('birthDate.gregorian').reset();
          this.searchSaudiContributorForm.get('birthDate.gregorian').clearValidators();
        }
        this.searchSaudiContributorForm.updateValueAndValidity();
      });
    }
  }
  /**
   * Method to create saudi search form
   */
  createSearchSaudiForm() {
    return this.fb.group({
      nin: [
        null,
        {
          updateOn: 'blur'
        }
      ],
      // calenderType: this.fb.group({
      //   english: ['Gregorian', { validators: Validators.required }],
      //   arabic: [null],
      //   updateOn: 'blur'
      // }),
      calenderType: this.fb.group({
        english: [this.typeGregorian, { validators: Validators.required, updateOn: 'blur' }],
        arabic: [this.typeHijira, { validators: Validators.required, updateOn: 'blur' }]
      }),
      birthDate: this.fb.group({
        gregorian: [null],
        hijiri: [null],
        updateOn: 'blur'
      }),
      idType: this.fb.group({
        english: [null, { validators: Validators.compose([Validators.required]), updateOn: 'blur' }],
        arabic: [null]
      }),
    });
  }

  /**
   * Method to capture search details and send to parent via event emitter
   */
  verifyContributorDetails() {
    markFormGroupTouched(this.searchSaudiContributorForm);
    if (this.searchSaudiContributorForm.valid) {
      this.setSaudiFormEmitData();
    } else {
      this.error.emit();
    }
  }
  /**
   * Method to set saudi form value to emit via event emitter to parent
   */
  setSaudiFormEmitData() {
    const identityNin = new NIN();
    const identityIqama = new Iqama();
    const searchData = this.searchSaudiContributorForm.getRawValue();
    if(searchData.idType.english == 'Iqama Number'){
      this.queryParams = searchData.birthDate.gregorian
      ? `iqamaNo=${searchData.nin}&birthDate=${convertToYYYYMMDD(searchData.birthDate.gregorian)}&role=${this.role}`
      : `iqamaNo=${searchData.nin}&birthDateH=${hijiriToJSON(searchData.birthDate.hijiri)}&role=${this.role}`;
      if (this.personType === ContributorTypesEnum.SECONDED) this.queryParams += `&personType=Seconded`;
    this.personDetails.birthDate = searchData.birthDate;
    this.personDetails.nationality.english = NationalityTypeEnum.SAUDI_NATIONAL;
    identityIqama.idType = IdentityTypeEnum.NIN;
    identityIqama.iqamaNo = searchData.nin;
    this.personDetails.identity = [identityIqama];
    }
    else if(searchData.idType.english == 'NIN' || searchData.idType.english == 'National Identification Number'){
    this.queryParams = searchData.birthDate.gregorian
      ? `NIN=${searchData.nin}&birthDate=${convertToYYYYMMDD(searchData.birthDate.gregorian)}&role=${this.role}`
      : `NIN=${searchData.nin}&birthDateH=${hijiriToJSON(searchData.birthDate.hijiri)}&role=${this.role}`;
    if (this.personType === ContributorTypesEnum.SECONDED) this.queryParams += `&personType=Seconded`;
    this.personDetails.birthDate = searchData.birthDate;
    this.personDetails.nationality.english = NationalityTypeEnum.SAUDI_NATIONAL;
    identityNin.idType = IdentityTypeEnum.NIN;
    identityNin.newNin = searchData.nin;
    this.personDetails.identity = [identityNin];
    }
    this.verify.emit({
      queryParams: this.queryParams,
      personDetails: this.personDetails
    });
  }
  /**
   *
   * @param type
   * Method to change calendar type
   */
  changeType(type) {
    if (type !== this.calendarType) {
      this.calendarType = type;
    }
  }

  resetForm() {
    this.reset.emit();
  }

  /**
   *
   * @param type method to check form on click
   */
  onTypeSelection(type: Lov) {
    this.searchSaudiContributorForm.removeControl('nin');
    if (type !== null) {
      if (this.searchSaudiContributorForm.get('nin')) this.searchSaudiContributorForm.removeControl('nin');
      if (type.code === 1000) {
        this.searchSaudiContributorForm.addControl(
          'nin',
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
        this.searchSaudiContributorForm.addControl(
          'nin',
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

    this.searchSaudiContributorForm.get('idNumber').updateValueAndValidity();
  }
}
