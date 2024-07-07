/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  Inject,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ApplicationTypeEnum,
  ApplicationTypeToken,
  dayDiff,
  LovList,
  NationalityTypeEnum,
  RouterData,
  RouterDataToken,
  LanguageToken
} from '@gosi-ui/core';
import { ProcessType } from '../../shared/enums';
import { ReportInjuryBase } from './report-injury-base-dc';
import { ValidatorConstants } from '../../shared';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'oh-report-injury-dc',
  templateUrl: './report-injury-dc.component.html',
  styleUrls: ['./report-injury-dc.component.scss']
})
export class ReportInjuryDcComponent extends ReportInjuryBase implements OnInit, OnChanges, AfterViewChecked {
  constructor(
    readonly fb: FormBuilder,
    readonly router: Router,
    readonly cdr: ChangeDetectorRef,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    @Inject(ApplicationTypeToken) readonly appTypeToken: string
  ) {
    super(fb);
  }
  //This method is to handle initialization tasks
  ngOnInit() {
    this.reportInjuryForm = this.createInjuryForm();
    this.items.push({ value: { english: 'Contributor', arabic: ' مشترك' }, sequence: 1 });
    this.items.push({ value: { english: 'Establishment', arabic: 'منشأة' }, sequence: 2 });
    this.payeeList = new LovList(this.items);
    this.language.subscribe(language => {
      this.lang = language; 
    });
    if (this.parentForm) {
      this.parentForm.addControl('reportInjury', this.reportInjuryForm);
    }
    if (
      this.processType === ProcessType.REOPEN ||
      this.processType === ProcessType.MODIFY ||
      this.processType === ProcessType.EDIT
    ) {
      this.disableEst = true;
    }
    if (this.processType === ProcessType.REOPEN) {
      this.reportInjuryForm.get('emergencyContactNo').get('primary').setValidators([Validators.required]);
    } else {
      this.reportInjuryForm.get('emergencyContactNo').get('primary').clearValidators();
    }
    if (this.reportInjuryForm) {
      this.reportInjuryForm
        .get('employeeInformedDate')
        .get('gregorian')
        .valueChanges.subscribe(employeeInformedDate => {
          this.contributorInformedDate = employeeInformedDate;
          this.employerInformedDateMinDate = employeeInformedDate;
          if (!this.isAppPrivate && this.processType !== ProcessType.REOPEN) {
            this.employerInformedDate = this.currentDate;
          }
          this.validationCheck();
        });
      this.reportInjuryForm
        .get('employerInformedDate')
        .get('gregorian')
        .valueChanges.subscribe(employerInformedDate => {
          this.employerInformedDate = employerInformedDate;
          this.validationCheck();
        });
      this.reportInjuryForm
        .get('injuryDate')
        .get('gregorian')
        .valueChanges.subscribe(injuryDate => {
          if (injuryDate.gregorian !== null) {
            setTimeout(() => {
              this.contributorInjuryDate = injuryDate;
              this.validationCheck();
              if (
                this.processType !== ProcessType.MODIFY &&
                this.processType !== ProcessType.EDIT &&
                this.processType !== ProcessType.REOPEN
              ) {
                this.reportInjuryForm.get('workDisabilityDate').get('gregorian').setValue(injuryDate);
              }
            }, 500);
          }
        });
      this.reportInjuryForm
        .get('deathDate')
        .get('gregorian')
        .valueChanges.subscribe(deathDate => {
          if (deathDate) {
            this.deathDate = deathDate;
          } else if (deathDate === null) {
            this.deathDate = this.currentDate;
          }
        });
    }
  }
  /**
   * Setting ISD code
   */
  getISDCodePrefix(value) {
    let prefix = 'sa';
    Object.keys(ValidatorConstants.ISD_PREFIX_MAPPING).forEach(key => {
      if (key === value) {
        prefix = ValidatorConstants.ISD_PREFIX_MAPPING[key];
      }
    });
    this.reportInjuryForm.get('emergencyContactNo').get('isdCodePrimary').setValue(prefix);
    return this.reportInjuryForm.get('emergencyContactNo').get('isdCodePrimary');
  }
  // Check whether to Show injury Details or not
  showInjuryDetails(showInjury) {
    setTimeout(() => {
      this.showInjury = showInjury;
    }, 1000);
  }
  validateExistingInjury(date) {
    if (date && this.previousInjury?.length > 0) {
      let foundElement = true;
      this.previousInjury.forEach(element => {
        if (new Date(element?.injuryDate?.gregorian).toDateString() === date.toDateString()) {
          this.alertEmit.emit(true);
          foundElement = false;
        } else if (foundElement) {
          this.alertEmit.emit(false);
        }
      });
    }
  }
  // binding the map values
  ngAfterViewChecked() {
    if (
      this.processType === ProcessType.EDIT ||
      this.processType === ProcessType.MODIFY ||
      this.processType === ProcessType.REOPEN ||
      this.isEdit
    ) {
      if (this.reportInjuryForm && this.viewInjuryDetails && this.isValueBinded) {
        this.isValueBinded = false;
        this.bindValues();
      }
      if (
        this.reportInjuryForm &&
        this.reportInjuryForm.get('placeForm') &&
        this.viewInjuryDetails &&
        this.isWorkflowStatus
      ) {
        this.isWorkflowStatus = false;
        this.bindValues();
        if (this.viewInjuryDetails.country) {
          this.reportInjuryForm.get('placeForm').get('country').setValue(this.viewInjuryDetails.country);
        }
        if (!this.showCity) {
          this.reportInjuryForm.get('placeForm').get('latitude').clearValidators();
          this.reportInjuryForm.get('placeForm').get('longitude').clearValidators();
          this.reportInjuryForm.get('placeForm').get('city').get('english').clearValidators();
          this.reportInjuryForm.get('placeForm').get('city').get('arabic').clearValidators();
          this.reportInjuryForm.get('placeForm').get('latitude').setValue(null);
          this.reportInjuryForm.get('placeForm').get('longitude').setValue(null);
        } else {
          setTimeout(() => {
            this.setValuesInMap();
          }, 500);
        }
        this.reportInjuryForm.get('placeForm').get('latitude').updateValueAndValidity();
        this.reportInjuryForm.get('placeForm').get('longitude').updateValueAndValidity();
        this.reportInjuryForm.get('payeeType').updateValueAndValidity();
        this.reportInjuryForm.get('placeForm').get('city').updateValueAndValidity();
        this.reportInjuryForm.get('placeForm').get('cityDistrict').updateValueAndValidity();
        this.reportInjuryForm.updateValueAndValidity();
      }
    }
    this.cdr.detectChanges();
  }
  //@param changes Capturing the input on changes
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.isValidator1) {
      this.isValidator1 = changes.isValidator1.currentValue;
    }
    if (changes && changes.employeeActivityAtInjuryTime) {
      const detectChange = this.checkVisiblityCondition();
      if (detectChange) {
        this.employeeActivityAtInjuryTime = changes.employeeActivityAtInjuryTime.currentValue;
        if (this.employeeActivityAtInjuryTime) {
          this.bindOccupation();
        }
      }
    }
    if (changes && changes.injuryTypeList) {
      this.injuryTypeList = changes.injuryTypeList.currentValue;
      setTimeout(() => {
        if (
          (this.processType !== ProcessType.MODIFY && this.processType !== ProcessType.REOPEN) ||
          this.viewInjuryDetails?.reasonActive
        ) {
          this.injuryList = this.injuryTypeList;
        } else {
          if (
            this.injuryTypeList?.items?.length > 0 &&
            this.viewInjuryDetails &&
            !this.viewInjuryDetails?.reasonActive
          ) {
            this.invalidICDScenario();
          }
        }
      }, 500);
    }
    if (changes && changes.injuryreasonList) {
      this.injuryreasonList = changes.injuryreasonList.currentValue;
      this.injuryList = this.injuryTypeList;
      setTimeout(() => {
        if (
          (this.processType !== ProcessType.MODIFY && this.processType !== ProcessType.REOPEN) ||
          this.viewInjuryDetails?.reasonActive
        ) {
          this.reasonList = this.injuryreasonList;
        } else {
          if (this.injuryreasonList?.items?.length > 0 && !this.viewInjuryDetails?.reasonActive) {
            this.invalidICDScenario();
          }
        }
      }, 500);
    }
    if (changes && changes.processType) {
      this.processType = changes.processType.currentValue;
      this.setDetails();
      this.showData();
    }
    if (changes && changes.viewInjuryDetails?.currentValue) {
      this.viewInjuryDetails = changes.viewInjuryDetails.currentValue;
      this.checkReopenConditions();
      this.bindValues();
      this.reopenOldDataCheck();
    }
    this.setReopenReason();
    if (changes && changes.engagementDetails) {
      this.engagementDetails = changes.engagementDetails.currentValue;
    }
    if (changes && changes.occupation) {
      this.occupation = changes.occupation?.currentValue;
      this.setOccupation(this.occupation, changes.occupation?.previousValue);
    }
    if (this.reportInjuryForm === null) {
      this.reportInjuryForm = this.createInjuryForm();
      this.setOccupation(this.occupation, changes.occupation?.previousValue);
    }
  }
  checkVisiblityCondition() {
    if ((this.isAppPrivate && this.processType !== ProcessType.ADD) || !this.isAppPrivate) {
      return true;
    } else {
      return false;
    }
  }

  reopenOldDataCheck() {
    if (this.viewInjuryDetails && !this.viewInjuryDetails?.reasonActive) {
      this.showToggle = false;
      this.showInjury = true;
    }
    if (this.viewInjuryDetails && this.processType === ProcessType.REOPEN && this.showInjury === false) {
      this.bindObjectToForm(this.reportInjuryForm, this.viewInjuryDetails);
      this.reportInjuryForm.updateValueAndValidity();
      if (!this.reportInjuryForm.valid) {
        this.showInjury = true;
        this.showToggle = false;
      }
    }
  }
  setDetails() {
    if (this.hideInjury && this.processType === ProcessType.REOPEN) {
      this.showInjury = false;
      this.hideInjury = false;
    }
  }
  //Set Reopen Reason
  setReopenReason() {
    if ((this.taskid && this.viewInjuryDetails) || (this.viewInjuryDetails && this.isEdit)) {
      if (this.taskid && this.viewInjuryDetails.modifyInjuryIndicator) {
        this.showInjury = true;
      }
      if ((this.taskid && this.viewInjuryDetails.reopenReason) || (this.viewInjuryDetails && this.isEdit)) {
        this.selectedReason = this.viewInjuryDetails.reopenReason;
      }
    }
  }
  //set Occupation
  setOccupation(currentValue, previousValue) {
    if (this.reportInjuryForm) {
      if (
        currentValue &&
        previousValue &&
        this.reportInjuryForm &&
        this.processType === ProcessType.ADD &&
        !this.isEdit
      ) {
        this.isWorkflowStatus = false;
        if (this.occupation) {
          this.bindOccupation();
        }
      }
      this.viewInjuryDetail = this.viewInjuryDetails;
    }
  }
  //Set Reopen Variables
  checkReopenConditions() {
    if (this.processType === ProcessType.REOPEN) {
      if (this.taskid === null || this.taskid === undefined) {
        this.showInjury = false;
      }
      if (this.isEdit && this.viewInjuryDetails?.modifyInjuryIndicator) {
        this.showInjury = true;
      }
      this.IsReopen = true;
    }
  }
  //show fields for Reopen and modify cases
  showData() {
    if (this.processType !== ProcessType.REOPEN && this.reportInjuryForm) {
      this.disableField(this.reportInjuryForm.get('emergencyContactNo'));
    }
    if (
      ((this.isAppPrivate && this.processType !== ProcessType.MODIFY) ||
        (this.isAppPrivate && this.processType !== ProcessType.REOPEN)) &&
      this.reportInjuryForm
    ) {
      this.enableField(this.reportInjuryForm.get('employerInformedDate').get('gregorian'));
    } else {
      if (this.reportInjuryForm) {
        this.disableField(this.reportInjuryForm.get('employerInformedDate').get('gregorian'));
      }
    }
  }
  //Bind injury values to form
  bindValues() {
    if (
      this.isWorkflow ||
      this.processType === ProcessType.MODIFY ||
      this.processType === ProcessType.REOPEN ||
      this.processType === ProcessType.EDIT ||
      this.isEdit
    ) {
      setTimeout(() => {
        this.bindObjectToForm(this.reportInjuryForm, this.viewInjuryDetails);
        this.cdr.detectChanges();
        if (
          this.appTypeToken === ApplicationTypeEnum.PUBLIC &&
          (this.processType === ProcessType.REOPEN || this.processType === ProcessType.EDIT) &&
          this.routerData.taskId !== null &&
          this.routerData.taskId !== undefined
        ) {
          this.disabled = (this.allowanceFlagReturn || !this.allowanceFlag) ? true : false;
          this.injuryDetails.modifyInjuryIndicator = this.viewInjuryDetails.modifyInjuryIndicator;
          this.showInjury = this.showInjury;
          if (!this.allowanceFlag || this.allowanceFlagReturn) {
            this.makeFormControlsReadOnly(this.reportInjuryForm);
          }
          this.mapViewMode = true;
          if (this.processType === ProcessType.REOPEN && this.reportInjuryForm) {
            this.enableField(this.reportInjuryForm.get('emergencyContactNo'));
          }
        }
        if (this.processType === ProcessType.MODIFY || this.processType === ProcessType.REOPEN) {
          this.disabled = true;
        }
      }, 6000);
      if (this.viewInjuryDetails) {
        if (this.viewInjuryDetails.allowancePayee === 2) {
          this.reportInjuryForm.get('payeeType.english').setValue('Contributor');
          this.reportInjuryForm.get('payeeType.arabic').setValue(' مشترك');
        } else if (this.viewInjuryDetails.allowancePayee === 1) {
          this.reportInjuryForm.get('payeeType.english').setValue('Establishment');
          this.reportInjuryForm.get('payeeType.arabic').setValue('منشأة');
        }
        if (this.viewInjuryDetails.latitude && this.viewInjuryDetails.longitude) {
          this.latitude = Number(this.viewInjuryDetails.latitude);
          this.longitude = Number(this.viewInjuryDetails.longitude);
          this.isShowMarker = true;
        }
        if (this.viewInjuryDetails.emergencyContactNo && this.processType === ProcessType.REOPEN) {
          this.reportInjuryForm.get('emergencyContactNo').setValue(this.viewInjuryDetails.emergencyContactNo);
        }
        if (this.taskid && this.viewInjuryDetails.modifyInjuryIndicator) {
          this.showInjury = true;
        }
      }
      if (this.viewInjuryDetails && this.viewInjuryDetails.country) {
        this.isCountrySaudi =
          this.viewInjuryDetails.country.english === NationalityTypeEnum.SAUDI_NATIONAL ? true : false;
        if (!this.isCountrySaudi) {
          this.showCityDistrict = false;
          this.showCity = false;
        } else {
          this.showCity = true;
        }
      }
    }
  }
  //checking the validation for the form
  validationCheck() {
    if (this.reportInjuryForm) {
      if (this.reportInjuryForm.get('injuryToDeathIndicator').valueChanges) {
        this.isPersonDead = this.reportInjuryForm.get('injuryToDeathIndicator').value;
        const deathDate = this.reportInjuryForm.get('deathDate').get('gregorian');
        if (this.isPersonDead) {
          if (this.routerData.taskId && !this.isAppPrivate) {
            deathDate.setValidators([Validators.required]);
            this.disableDeath = true;
          } else {
            this.addressValidation = true;
            this.enableField(deathDate);
          }
        } else {
          this.addressValidation = false;
          this.deathDate = new Date();
          deathDate.reset();
          this.disableField(deathDate);
        }
        deathDate.updateValueAndValidity();
      }
      if (
        this.reportInjuryForm.get('injuryDate').get('gregorian').valueChanges ||
        this.reportInjuryForm.get('employeeInformedDate').get('gregorian').valueChanges ||
        this.reportInjuryForm.get('employerInformedDate').get('gregorian').valueChanges ||
        this.reportInjuryForm.get('workDisabilityDate').get('gregorian').valueChanges
      ) {
        const reasonForDelay = this.reportInjuryForm.get('reasonForDelay');
        this.reportInjuryForm
          .get('injuryDate')
          .get('gregorian')
          .valueChanges.subscribe(injuryDate => {
            if (injuryDate.gregorian !== null) {
              setTimeout(() => {
                this.contributorInjuryDate = injuryDate;
                this.checkValidation(reasonForDelay);
                if (
                  this.processType !== ProcessType.MODIFY &&
                  this.processType !== ProcessType.EDIT &&
                  this.processType !== ProcessType.REOPEN
                ) {
                  this.reportInjuryForm.get('workDisabilityDate').get('gregorian').setValue(injuryDate);
                }
              }, 500);
            }
          });
        this.reportInjuryForm
          .get('employeeInformedDate')
          .get('gregorian')
          .valueChanges.subscribe(employeeInformedDate => {
            if (employeeInformedDate.gregorian !== null) {
              this.contributorInformedDate = employeeInformedDate;
            }
          });
        this.reportInjuryForm
          .get('employerInformedDate')
          .get('gregorian')
          .valueChanges.subscribe(employerInformedDate => {
            this.employerInformedDate = employerInformedDate;
          });
        this.checkValidation(reasonForDelay);
      }
    }
  }
  /* Method to call after selected injury type from dropdown*/
  selectInjuryTypefn(value: string) {
    this.selectInjuryType.emit(value);
    this.reportInjuryForm.get('injuryReason').get('english').patchValue(null);
  }

  selectgovernmentSectorfn(value: string){
    this.selectgovernmentSector.emit(value);
  }

  filterInactiveType() {
    if (this.processType === ProcessType.MODIFY || this.processType === ProcessType.REOPEN) {
      if (this.viewInjuryDetails && this.viewInjuryDetails.accidentType && !this.viewInjuryDetails?.reasonActive) {
        this.injuryList = new LovList([]);
        this.injuryList.items = this.injuryTypeList?.items.filter(
          item => item.value.english !== this.viewInjuryDetails.accidentType.english
        );
        this.injuryTypeList = this.injuryList;
      }
    }
  }
  // finding the delayed number of days, leads to show delay details field
  getDateDifference(dateFrom: Date, dateto: Date) {
    const delayedDays = dayDiff(dateFrom, dateto);
    return delayedDays;
  }
  checkValidation(reasonForDelay) {
    if (this.contributorInformedDate !== undefined || (null && this.contributorInjuryDate !== undefined) || null) {
      this.delayedDays = this.getDateDifference(this.contributorInjuryDate, this.contributorInformedDate);
      this.showResonforDelay = this.delayedDays >= 7 ? true : false;
    }
    if (this.contributorInformedDate !== undefined || (null && this.contributorInjuryDate === undefined) || null) {
      if (!this.isAppPrivate && this.processType === ProcessType.REOPEN) {
        this.employerInformedDate = this.viewInjuryDetails?.employerInformedDate?.gregorian;
      }
      this.delayedDaysWithCurrentDay = this.getDateDifference(this.contributorInformedDate, this.employerInformedDate);
      this.showResonforDelayCurrentDate = this.delayedDaysWithCurrentDay >= 3 ? true : false;
    }
    if (this.showResonforDelay === true || this.showResonforDelayCurrentDate === true) {
      reasonForDelay.setValidators([Validators.required]);
    } else {
      reasonForDelay.clearValidators();
    }
    if(this.allowanceFlag) {
      if (reasonForDelay.value !== null) {
        this.reasonForDelayIndividual = true;
        reasonForDelay.setValidators([Validators.required]);
      } else {
        reasonForDelay.clearValidators();
      }
      this.reportInjuryForm.get('delayByEmployer').setValidators([Validators.required]);
      this.reportInjuryForm.get('delayByEmployer').updateValueAndValidity();
      if (this.allowanceFlagReopen) {
        if ((this.viewInjuryDetails.reasonForDelay === null) && this.showResonforDelay) {
          reasonForDelay.setValidators([Validators.required]);
        }
        if ((this.viewInjuryDetails.delayByEmployer === null)) {
          this.reportInjuryForm.get('delayByEmployer').clearValidators();
          this.reportInjuryForm.get('delayByEmployer').updateValueAndValidity();
        }
      }
    }
    reasonForDelay.updateValueAndValidity();
  }
  selectedReopenReason(selectedReopenReason) {
    this.selectedReason = selectedReopenReason;
    this.reopenReason.emit(selectedReopenReason);
  }
  filterReason() {
    if (this.processType === ProcessType.MODIFY || this.processType === ProcessType.REOPEN) {
      if (this.viewInjuryDetails && this.viewInjuryDetails.injuryReason && !this.viewInjuryDetails?.reasonActive) {
        this.reasonList = new LovList([]);
        this.reasonList.items = this.injuryreasonList?.items.filter(
          item => item.value.english !== this.viewInjuryDetails.injuryReason.english
        );
        this.injuryreasonList = this.reasonList;
      }
    }
  }
}

