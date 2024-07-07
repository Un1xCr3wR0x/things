import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  dayDiff,  
  LanguageToken,
  LovList,
  NationalityTypeEnum,
  RouterData,
  RouterDataToken,
  scrollToTop,
  StorageService
} from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { EstablishmentService, OhService, ValidatorConstants } from '../../shared';
import { ProcessType } from '../../shared/enums';
import { GroupInjuryService } from '../../shared/services/group-injury.service';
import { ReportGroupInjuryBase } from './report-group-injury-base-dc';

@Component({
  selector: 'oh-report-group-injury-details-dc',
  templateUrl: './report-group-injury-details-dc.component.html',
  styleUrls: ['./report-group-injury-details-dc.component.scss']
})
export class ReportGroupInjuryDetailsDcComponent extends ReportGroupInjuryBase implements OnInit {
  response: any;

  constructor(
    readonly fb: FormBuilder,
    readonly cdr: ChangeDetectorRef,
    readonly alertService: AlertService,
    readonly ohService: OhService,
    readonly groupInjuryService: GroupInjuryService,
    readonly establishmentService: EstablishmentService,
    readonly http: HttpClient,
    private storageService: StorageService,
    private router: Router,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(ApplicationTypeToken) readonly appTypeToken: string,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {
    super(fb);
  }
  /**
   * local variables
   */
  currentDate: Date;

  ngOnInit() {
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      this.isCsr = true;
    } else {
      this.isCsr = false;
    }
    this.reportGroupInjuryForm = this.createGroupInjuryForm();
    this.items.push({ value: { english: 'Contributor', arabic: ' مشترك' }, sequence: 1 });
    this.items.push({ value: { english: 'Establishment', arabic: 'منشأة' }, sequence: 2 });
    this.payeeList = new LovList(this.items);
    this.language.subscribe(language => {
      this.lang = language;
    });
    if (this.parentForm) {
      this.parentForm.addControl('reportGroupInjury', this.reportGroupInjuryForm);
    }
    if (
      this.processType === ProcessType.REOPEN ||
      this.processType === ProcessType.MODIFY ||
      this.processType === ProcessType.EDIT
    ) {
      this.disableEst = true;
    }   
    if (this.reportGroupInjuryForm) {
      this.reportGroupInjuryForm
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
      this.reportGroupInjuryForm
        .get('employerInformedDate')
        .get('gregorian')
        .valueChanges.subscribe(employerInformedDate => {
          this.employerInformedDate = employerInformedDate;
          this.validationCheck();
        });
      this.reportGroupInjuryForm
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
                this.reportGroupInjuryForm.get('workDisabilityDate').get('gregorian').setValue(injuryDate);
              }
              this.injuryDateChanged.emit(injuryDate);
            }, 500);
          }
        });
        
    }
    this.reportGroupInjuryForm.valueChanges.subscribe(() => {    
       this.valueChanged.emit(true);
     });
     if(!this.ohService.getRegistrationNumber()){
      this.ohService.setRegistrationNo(Number(this.storageService.getLocalValue('registerationNumber')));
     }
     this.searchEstablishment(this.ohService.getRegistrationNumber());
  }
 
  /**
   * Method to show error message in person identity is not available in contributor
   */
  establishmentSearchError() {
    scrollToTop();
    this.hasSearchResult = false;
    this.alertService.showErrorByKey('OCCUPATIONAL-HAZARD.REQUESTED-DETAILS-NOT-AVAILABLE');
  }

  searchEstablishment(searchValue) {
    this.establishmentService.getEstablishmentDetails(searchValue).subscribe(
      response => {
        if (this.appToken === ApplicationTypeEnum.PRIVATE) {
          this.establishment = response;
          if(this.establishment.registrationNo){
            this.ohService.setRegistrationNo(this.establishment.registrationNo);
          }
        }
        if (this.establishment.length <= 0) {
          this.establishmentSearchError();
          this.hasSearchResult = false;
          this.isEstablishmentFound = false;
        } else {
          this.alertService.clearAlerts();
          this.hasSearchResult = true;
          this.isEstablishmentFound = true;
        }
      },
      err => {
        this.hasSearchResult = false;
        this.alertService.showError(err.error.message);
      }
    );
  }
  checkRegisteration(searchValue){
    if(this.ohService.getRegistrationNumber() && searchValue !==  this.ohService.getRegistrationNumber().toString()){
      this.isEstablishmentFound = false;
      this.hasSearchResult = false;
      this.establishment = null;
    }
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
  /* Method to call after selected injury type from dropdown*/
  selectInjuryTypefn(value: string) {
    this.selectInjuryType.emit(value);
    if(this.reportGroupInjuryForm.get('accidentType') && this.reportGroupInjuryForm.get('accidentType').value){
      this.groupInjuryService.setAccidentType(this.reportGroupInjuryForm.get('accidentType').value);    
    }     
  }

  selectgovernmentSectorfn(value: string){
    this.selectgovernmentSector.emit(value);
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
    this.reportGroupInjuryForm.get('emergencyContactNo').get('isdCodePrimary').setValue(prefix);
    return this.reportGroupInjuryForm.get('emergencyContactNo').get('isdCodePrimary');
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
  //checking the validation for the form
  validationCheck() {
    if (this.reportGroupInjuryForm) {
      if (
        this.reportGroupInjuryForm.get('injuryDate').get('gregorian').valueChanges ||
        this.reportGroupInjuryForm.get('employeeInformedDate').get('gregorian').valueChanges ||
        this.reportGroupInjuryForm.get('employerInformedDate').get('gregorian').valueChanges ||
        this.reportGroupInjuryForm.get('workDisabilityDate').get('gregorian').valueChanges
      ) {
        const reasonForDelay = this.reportGroupInjuryForm.get('reasonForDelay');
        this.reportGroupInjuryForm
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
                  this.reportGroupInjuryForm.get('workDisabilityDate').get('gregorian').setValue(injuryDate);
                }
              }, 500);
            }
          });
        this.reportGroupInjuryForm
          .get('employeeInformedDate')
          .get('gregorian')
          .valueChanges.subscribe(employeeInformedDate => {
            if (employeeInformedDate.gregorian !== null) {
              this.contributorInformedDate = employeeInformedDate;
            }
          });
        this.reportGroupInjuryForm
          .get('employerInformedDate')
          .get('gregorian')
          .valueChanges.subscribe(employerInformedDate => {
            this.employerInformedDate = employerInformedDate;
          });
        this.checkValidation(reasonForDelay);
      }
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
      if (this.reportGroupInjuryForm && this.viewInjuryDetails && this.isValueBinded) {
        this.isValueBinded = false;
        this.bindValues();
      }
      if (
        this.reportGroupInjuryForm &&
        this.reportGroupInjuryForm.get('placeForm') &&
        this.viewInjuryDetails &&
        this.isWorkflowStatus
      ) {
        this.isWorkflowStatus = false;
        this.bindValues();
        if (this.viewInjuryDetails.country) {
          this.reportGroupInjuryForm.get('placeForm').get('country').setValue(this.viewInjuryDetails.country);
        }
        if (!this.showCity) {
          this.reportGroupInjuryForm.get('placeForm').get('latitude').clearValidators();
          this.reportGroupInjuryForm.get('placeForm').get('longitude').clearValidators();
          this.reportGroupInjuryForm.get('placeForm').get('city').get('english').clearValidators();
          this.reportGroupInjuryForm.get('placeForm').get('city').get('arabic').clearValidators();
          this.reportGroupInjuryForm.get('placeForm').get('latitude').setValue(null);
          this.reportGroupInjuryForm.get('placeForm').get('longitude').setValue(null);
        } else {
          setTimeout(() => {
            this.setValuesInMap();
          }, 500);
        }
        this.reportGroupInjuryForm.get('placeForm').get('latitude').updateValueAndValidity();
        this.reportGroupInjuryForm.get('placeForm').get('longitude').updateValueAndValidity();
        if(this.reportGroupInjuryForm.get('payeeType')){
          this.reportGroupInjuryForm.get('payeeType').updateValueAndValidity();
        }        
        this.reportGroupInjuryForm.get('placeForm').get('city').updateValueAndValidity();
        this.reportGroupInjuryForm.get('placeForm').get('cityDistrict').updateValueAndValidity();
        this.reportGroupInjuryForm.updateValueAndValidity();
      }
    }
    this.cdr.detectChanges();
  }

  //@param changes Capturing the input on changes
  ngOnChanges(changes: SimpleChanges) {
   
    if(changes.establishmentPresent && changes.establishmentPresent.currentValue){
      if(this.establishmentPresent && this.establishmentPresent.registrationNo){
        this.isEstablishmentFound = true;
        this.establishment = this.establishmentPresent;
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
      this.bindObjectToForm(this.reportGroupInjuryForm, this.viewInjuryDetails);
      this.reportGroupInjuryForm.updateValueAndValidity();
      if (!this.reportGroupInjuryForm.valid) {
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
    if (this.processType !== ProcessType.REOPEN && this.reportGroupInjuryForm) {
      this.disableField(this.reportGroupInjuryForm.get('emergencyContactNo'));
    }
    if (
      ((this.isAppPrivate && this.processType !== ProcessType.MODIFY) ||
        (this.isAppPrivate && this.processType !== ProcessType.REOPEN)) &&
      this.reportGroupInjuryForm
    ) {
      this.enableField(this.reportGroupInjuryForm.get('employerInformedDate').get('gregorian'));
    } else {
      if (this.reportGroupInjuryForm) {
        this.disableField(this.reportGroupInjuryForm.get('employerInformedDate').get('gregorian'));
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
        this.bindObjectToForm(this.reportGroupInjuryForm, this.viewInjuryDetails);
        this.cdr.detectChanges();
        if (
          this.appTypeToken === ApplicationTypeEnum.PUBLIC &&
          (this.processType === ProcessType.REOPEN || this.processType === ProcessType.EDIT) &&
          this.routerData.taskId !== null &&
          this.routerData.taskId !== undefined
        ) {
          this.disabled = true;
          this.injuryDetails.modifyInjuryIndicator = this.viewInjuryDetails.modifyInjuryIndicator;
          this.showInjury = this.showInjury;
          this.makeFormControlsReadOnly(this.reportGroupInjuryForm);
          this.mapViewMode = true;
          if (this.processType === ProcessType.REOPEN && this.reportGroupInjuryForm) {
            this.enableField(this.reportGroupInjuryForm.get('emergencyContactNo'));
          }
        }
        if (this.processType === ProcessType.MODIFY || this.processType === ProcessType.REOPEN) {
          this.disabled = true;
        }
      }, 6000);
      if (this.viewInjuryDetails) {
        if (this.viewInjuryDetails.allowancePayee === 2) {
          this.reportGroupInjuryForm.get('payeeType.english').setValue('Contributor');
          this.reportGroupInjuryForm.get('payeeType.arabic').setValue(' مشترك');
        } else if (this.viewInjuryDetails.allowancePayee === 1) {
          this.reportGroupInjuryForm.get('payeeType.english').setValue('Establishment');
          this.reportGroupInjuryForm.get('payeeType.arabic').setValue('منشأة');
        }
        if (this.viewInjuryDetails.latitude && this.viewInjuryDetails.longitude) {
          this.latitude = Number(this.viewInjuryDetails.latitude);
          this.longitude = Number(this.viewInjuryDetails.longitude);
          this.isShowMarker = true;
        }
        if (this.viewInjuryDetails.emergencyContactNo && this.processType === ProcessType.REOPEN) {
          this.reportGroupInjuryForm.get('emergencyContactNo').setValue(this.viewInjuryDetails.emergencyContactNo);
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
    reasonForDelay.updateValueAndValidity();
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
