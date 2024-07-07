/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  AlertService,
  convertToYYYYMMDD,
  hijiriToJSON,
  IdentityTypeEnum,
  lengthValidator,
  LovList,
  markFormGroupTouched,
  NationalityTypeEnum,
  NIN,
  ninValidator,
  Person,
  scrollToTop
} from '@gosi-ui/core';
import { Router } from '@angular/router';
import { ContributorRouteConstants, ContributorService, ContributorTypesEnum } from '../../../shared';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'cnt-e-person-nic-sc',
  templateUrl: './e-person-nic-sc.component.html',
  styleUrls: ['./e-person-nic-sc.component.scss']
})
export class EPersonNicScComponent  implements OnInit {


  contributorType: string;
  isApiTriggered = false;
  // parentForm = new FormGroup({ vicSubmitCheck: new FormControl(false, { validators: Validators.requiredTrue }) });



  /**Variable declaration and initialization */
  searchSaudiContributorForm: FormGroup;
  currentDate = new Date();
  personDetails = new Person();
  queryParams = '';
  MIN_LENGTH = 10;
  MAX_LENGTH = 10;
  calenderList: LovList;

  /** Input variables. */
  @Input() personType: string;
  @Input() role = 'contributor';
  @Input() parentForm: FormGroup; //For Add vic

  /** Output event emitters. */
  @Output() verify: EventEmitter<Object> = new EventEmitter();
  @Output() reset: EventEmitter<null> = new EventEmitter();
  @Output() error: EventEmitter<null> = new EventEmitter();


  constructor(
    private fb: FormBuilder,
    readonly router: Router,
    readonly contributorService: ContributorService,
    readonly alertService: AlertService,

    ) {}
  /**
   * Method to handle all initial tasks on component load
   */
  ngOnInit() {
    this.contributorType = 'SAUDI';


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
   * Method to verify person search and get contributor details
   * @param url
   */
  onVerify() {
    if (this.queryParams) {
      this.contributorService
        .getPersonDetails(this.queryParams, this.setOptionsForVerify()).pipe(
          tap(res => {
            this.contributorService.setPersonalInformation(res);
            this.router.navigate([ContributorRouteConstants.ROUTE_E_REGISTER]);
          })
        )
        .subscribe({
          error: err => this.showError(err)

        })
      } else {
        this.showMandatoryFieldsError();
      }
    }

    /** Method to set options for person verify. */
  setOptionsForVerify(): Map<string, boolean> {
    const options: Map<string, boolean> = new Map();
    if (this.contributorType === ContributorTypesEnum.SAUDI)
      options.set('fetchAddressFromWasel', true).set('absherVerificationRequired', true);
    return options;
  }

  /**
   * Method to set alert if a service call fails (Use this as common method for all failed service calls under this feature)
   * @param errorMessage
   */
  showError(error) {
    this.isApiTriggered = false;
    if (error?.error) {
      scrollToTop();
      this.alertService.showError(error.error.message, error.error.details);
    }
  }

  /** Method to set mandatory fields validation (Use this as common method for all under this feature). */
  showMandatoryFieldsError() {
    this.isApiTriggered = false;
    scrollToTop();
    this.alertService.showMandatoryErrorMessage();
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
          validators: Validators.compose([
            Validators.required,
            lengthValidator(this.MIN_LENGTH),
            Validators.maxLength(this.MAX_LENGTH),
            Validators.pattern('[0-9]+'),
            ninValidator
          ]),
          updateOn: 'blur'
        }
      ],
      calenderType: this.fb.group({
        english: ['Gregorian', { validators: Validators.required }],
        arabic: [null],
        updateOn: 'blur'
      }),
      birthDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null],
        updateOn: 'blur'
      })
    });
  }

  /**
   * Method to capture search details and send to parent via event emitter
   */
  verifyContributorDetails() {
    markFormGroupTouched(this.searchSaudiContributorForm);
    if (this.searchSaudiContributorForm.valid) {
      this.setSaudiFormEmitData();
      this.nextPage();
      this.onVerify();
    } else {
      this.error.emit();
    }
  }
  /**
   * Method to set saudi form value to emit via event emitter to parent
   */
  setSaudiFormEmitData() {
    const identity = new NIN();
    const searchData = this.searchSaudiContributorForm.getRawValue();
    this.queryParams = searchData.birthDate.gregorian
      ? `NIN=${searchData.nin}&birthDate=${convertToYYYYMMDD(searchData.birthDate.gregorian)}&role=${this.role}`
      : `NIN=${searchData.nin}&birthDateH=${hijiriToJSON(searchData.birthDate.hijiri)}&role=${this.role}`;
    if (this.personType === ContributorTypesEnum.SECONDED) this.queryParams += `&personType=Seconded`;
    this.personDetails.birthDate = searchData.birthDate;
    this.personDetails.nationalId = searchData.nin;
    this.personDetails.nationality.english = NationalityTypeEnum.SAUDI_NATIONAL;
    identity.idType = IdentityTypeEnum.NIN;
    identity.newNin = searchData.nin;
    this.personDetails.identity = [identity];
  
  }
  resetForm() {
    this.alertService.clearAllErrorAlerts();
    scrollToTop();
    this.searchSaudiContributorForm.get('nin').reset();
    this.searchSaudiContributorForm.get('birthDate').reset();

  }



  nextPage(){
    this.setSaudiFormEmitData();
  }
}
