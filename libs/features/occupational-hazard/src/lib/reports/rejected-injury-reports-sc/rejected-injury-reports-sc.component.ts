/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
// import { ValueTransformer } from '@angular/compiler/src/util';
import { Component, Inject, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import {
  AlertService,
  BilingualText,
  convertToYYYYMMDD,
  downloadFile,
  LanguageToken,
  LovList,  
  subtractDays  
} from '@gosi-ui/core';
import { InputDaterangeDcComponent } from '@gosi-ui/foundation-theme/src/lib/components';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { OhConstants, RejectedCount } from '../../shared';
import { OhClaimsService } from '../../shared/services/oh-claims.service';

@Component({
  selector: 'oh-rejected-injury-reports-sc',
  templateUrl: './rejected-injury-reports-sc.component.html',
  styleUrls: ['./rejected-injury-reports-sc.component.scss']
})
export class RejectedInjuryReportsScComponent implements OnInit {
  maxlengthData = 250;
  isSinSelected = false;
  modalRef: BsModalRef;
  maxDate = new Date();
  minDate = null;
  disabled = false;
  uuId : string;
  isThirtyDays: boolean;
  lang: string;
  reportType: string;
  rejectedCount: RejectedCount;
  reportDateForm = new FormControl();
  injuryClosedDateForm = new FormControl();
  injuriesMoreDateForm = new FormControl();
  casesExceedsDateForm = new FormControl();
  injuryPassDateForm = new FormControl();
  injuriesPeriodForm = new FormControl();
  recoveryDateForm = new FormControl();

  checkForm: FormGroup;
  formControl = new FormControl();
  claimsForm: FormGroup;
  casesExceedsForm: FormGroup;
  dailyAllowancesForm: FormGroup;
  injuriesMoreForm: FormGroup;
  injuriesReportedForm: FormGroup;
  injuriesPassedForm: FormGroup;
  injuriesClosedForm: FormGroup;
  injuryPeriodForm: FormGroup;
  showErrorMessage = false;
  arabicEnglishList: LovList;
  pdfExcelList: LovList;
  idTypeList: LovList;
  statusEng: string[];
 
  statusForm: FormGroup;
  reportTypeValue: string;
  casesExceedsReportStartDate: Date;
  casesExceedsReportUuid: string;
  casesExceedsTimeTaken: number;
  injuryClosedCertainPeriodStartDate: Date;
  injuryClosedCertainPeriodUuid: string;
  injuryClosedTimeTaken: number;
  injuryPassedCertainPeriodStartDate: Date;
  injuryPassedCertainPeriodUuid: string;
  injuryPassedTimeTaken: number;
  injuryReportedCertainPeriodStartDate: Date;
  injuryReportedCertainPeriodUuid: string;
  injuryReportedTimeTaken: number;
  injuryTreatmentCertainPeriodStartDate: Date;
  injuryTreatmentCertainPeriodUuid: string;
  injuryTreatmentTimeTaken: number;

  casesExceedsReportSuccess = false;
  injuryClosedReportSuccess = false;
  injuryPassedReportSuccess = false;
  injuryReportedCertainPeriodReportSuccess = false;
  injuryTreatmentReportSuccess = false;

  claimsTPAReportSuccess = false;
  claimsTPAReportCancel = false;

  casesExceedsReportCancel = false;
  injuryClosedReportCancel = false;
  injuryPassedReportCancel = false;
  injuryReportedCertainPeriodReportCancel = false;
  injuryTreatmentReportCancel = false;


  batchDateRange: number;
  claimsDateForm = new FormControl();
  recoveryForm: FormGroup;
  recoveredList: LovList;
  languagePassed: string;
  contfileName: string;
  contType: string;  
  showMandatoryMessage = false;

  @ViewChild('dateRangePicker') dateRangePicker: InputDaterangeDcComponent;
  claimsTPAReportUuid: string;
  claimsTPATimeTaken: number;
  claimsTPAReportStartDate: Date;
  constructor(
    readonly modalService: BsModalService,
    readonly claimsService: OhClaimsService,
    readonly alertService: AlertService,
    readonly fb: FormBuilder,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {
    this.language.subscribe(res => (this.lang = res));
   }
  ngOnInit(): void {
    this.casesExceedsDateForm.setValidators(Validators.required);
    this.reportDateForm = new FormControl();
    this.claimsForm = this.createClaimsForm();
    this.casesExceedsForm = this.createCasesExceedsForm();
    this.dailyAllowancesForm = this.createDailyAllowancesForm();
    this.injuriesMoreForm = this.createInjuriesMoreForm();
    this.injuriesReportedForm = this.createInjuriesReportedForm();
    this.injuriesPassedForm = this.createInjuriesPassedForm();
    this.injuriesClosedForm = this.createInjuriesClosedForm();
    this.checkForm = this.createCheckForm();
    this.injuryPeriodForm = this.createInjuryPeriodForm();
    this.recoveryForm = this.createRecoveryForm();
    this.showErrorMessage = false;
    this.setFlagsToDefault();

    this.language.subscribe(language => {
      this.lang = language;
    });
    this.arabicEnglishList = {
      items: [
        {
          value: {
            english: 'English',
            arabic: 'انجليزي'
          },
          sequence: 0
        },
        {
          value: {
            english: 'Arabic',
            arabic: 'عربي'
          },
          sequence: 1
        }
      ]
    };
    this.pdfExcelList = {
      items: [
        {
          value: {
            english: 'Pdf',
            arabic: 'Pdf'
          },
          sequence: 0
        },
        {
          value: {
            english: 'Excel',
            arabic: 'Excel'
          },
          sequence: 1
        }
      ]
    };
    this.idTypeList = {
      items: [
        {
          value: {
            english: 'Social Insurance Number',
            arabic: 'رقم الإشتراك'
          },
          sequence: 0
        },
        {
          value: {
            english: 'Other',
            arabic: 'أخرى'
          },
          sequence: 1
        }
      ]
    };
    this.recoveredList = {
      items: [
        {
          value: {
            english: 'Establishment',
            arabic: 'المنشأة'
          },
          sequence: 0
        },
        {
          value: {
            english: 'Provider',
            arabic: 'مزود'
          },
          sequence: 1
        },
        {
          value: {
            english: 'Contributor',
            arabic: 'مشترك'
          },
          sequence: 2
        }
      ]
    };
    if (!this.isSinSelected) {
      this.dailyAllowancesForm.get('identity').setValidators(Validators.required);
    }
    this.selectRange();

    // this.getRejectedCount();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.idTypeList && changes.idTypeList.currentValue) {
      this.showErrorMessage = false;
    }
  }

  getRejectedCount() {
    this.claimsService.getRejectedCount().subscribe(
      response => {
        this.rejectedCount = response;
      },
      err => {
        this.showError(err);
      }
    );
  }
  setFlagsToDefault(){
    this.casesExceedsReportSuccess = false;
    this.claimsTPAReportSuccess = false;
    this.injuryClosedReportSuccess = false;
    this.injuryPassedReportSuccess = false;
    this.injuryReportedCertainPeriodReportSuccess = false;
    this.injuryTreatmentReportSuccess = false;
    this.casesExceedsReportCancel = false; 
    this.claimsTPAReportCancel = false;  
    this.injuryReportedCertainPeriodReportCancel = false;
    this.injuryTreatmentReportCancel = false;
    this.injuryClosedReportCancel = false;
    this.injuryPassedReportCancel = false;
  }
  createCheckForm(): FormGroup {
    return this.fb?.group({
      curedDisability: [null, { validators: Validators.required }],
      curedWithoutDisability: [null, { validators: Validators.required }],
      resultedInDeath: [null, { validators: Validators.required }],
      closedWithoutContinuingTreatment: [null, { validators: Validators.required }],
      approved: [null, { validators: Validators.required }],
      pending: [null, { validators: Validators.required }],
      rejected: [null, { validators: Validators.required }],
      inPatient: [null, { validators: Validators.required }],
      outPatient: [null, { validators: Validators.required }],
      sickLeave: [null, { validators: Validators.required }]
    });
  }
  createClaimsForm(): FormGroup {
    return this.fb?.group({
      invoiceNumber: [null],
      hospitalCode: [null],
      cchiNo: [null],
      reportLanguage: this.fb.group({
        english: ['English', { validators: Validators.required }],
        arabic: [null]
      }),
      fileType: this.fb.group({
        english: ['Excel', { validators: Validators.required }],
        arabic: [null]
      })
    });
  }
  createCasesExceedsForm(): FormGroup {
    return this.fb?.group({
      amount: [null, { validators: Validators.required }],
      sinNumber: [null],
      idenNumber: [null],
      injuryNumber: [null],
      injuryId: [null],
      reportLanguage: this.fb.group({
        english: ['English', { validators: Validators.required }],
        arabic: [null]
      }),
      fileType: this.fb.group({
        english: ['Excel', { validators: Validators.required }],
        arabic: [null]
      })
    });
  }
  createDailyAllowancesForm(): FormGroup {
    return this.fb?.group({
      sinNumber: [null],
      identity: [null],
      injuryNumber: [null],
      injuryId: [null],
      reportLanguage: this.fb.group({
        english: ['English', { validators: Validators.required }],
        arabic: [null]
      }),
      fileType: this.fb.group({
        english: ['Excel', { validators: Validators.required }],
        arabic: [null]
      }),
      idType: this.fb.group({
        english: ['Other', { validators: Validators.required }],
        arabic: [null]
      })
    });
  }
  createInjuriesMoreForm(): FormGroup {
    return this.fb?.group({
      treatmentDuration: [null, { validators: Validators.required }],
      sinNumber: [null],
      identificationNumber: [null],
      injuryNumber: [null],
      injuryId: [null],
      reportLanguage: this.fb.group({
        english: ['English', { validators: Validators.required }],
        arabic: [null]
      }),
      fileType: this.fb.group({
        english: ['Excel', { validators: Validators.required }],
        arabic: [null]
      })
    });
  }
  createInjuryPeriodForm(): FormGroup {
    return this.fb?.group({
      establishmentRegNo: [null],
      sinNumber: [null],
      idenNumber: [null],
      injuryNumber: [null],
      reportLanguage: this.fb.group({
        english: ['English', { validators: Validators.required }],
        arabic: [null]
      }),
      fileType: this.fb.group({
        english: ['Excel', { validators: Validators.required }],
        arabic: [null]
      })
    });
  }
  createInjuriesReportedForm(): FormGroup {
    return this.fb?.group({
      establishregNo: [null],
      injuryId: [null],
      reportLanguage: this.fb.group({
        english: ['English', { validators: Validators.required }],
        arabic: [null]
      }),
      fileType: this.fb.group({
        english: ['Excel', { validators: Validators.required }],
        arabic: [null]
      })
    });
  }
  createInjuriesPassedForm(): FormGroup {
    return this.fb?.group({
      reportLanguage: this.fb.group({
        english: ['English', { validators: Validators.required }],
        arabic: [null]
      }),
      fileType: this.fb.group({
        english: ['Excel', { validators: Validators.required }],
        arabic: [null]
      })
    });
  }
  createInjuriesClosedForm(): FormGroup {
    return this.fb?.group({
      reportLanguage: this.fb.group({
        english: ['English', { validators: Validators.required }],
        arabic: [null]
      }),
      fileType: this.fb.group({
        english: ['Excel', { validators: Validators.required }],
        arabic: [null]
      })
    });
  }
  createRecoveryForm(): FormGroup {
    return this.fb?.group({
      establishmentRegNo: [null],
      recoveryType: this.fb.group({
        english: ['Establishment', { validators: Validators.required }],
        arabic: [null]
      }),
      reportLanguage: this.fb.group({
        english: ['English', { validators: Validators.required }],
        arabic: [null]
      }),
      fileType: this.fb.group({
        english: ['Excel', { validators: Validators.required }],
        arabic: [null]
      })
    });
  }
  identitySelect(type: string) {
    if (type === 'Social Insurance Number') {
      this.isSinSelected = true;
      this.dailyAllowancesForm.get('sinNumber').setValidators(Validators.required);
      this.dailyAllowancesForm.get('identity').setValidators(null);
      this.showErrorMessage = false;
      this.resetClosed();
    } else {
      this.isSinSelected = false;
      this.dailyAllowancesForm.get('identity').setValidators(Validators.required);
      this.dailyAllowancesForm.get('sinNumber').setValidators(null);
      this.showErrorMessage = false;
      this.resetClosed();
    }
  }
  // @param err This method to show the page level error
  showError(err) {
    if (err && err.error && err.error.message) {
      this.alertService.showError(err.error.message, err.error.details);
    }
  }
  /** Method to show modal. */
  showModal(template: TemplateRef<HTMLElement>, size: string): void {
    this.reportDateForm.reset();
    this.selectRange();
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-${size}` };
    this.modalRef = this.modalService.show(template, config);
  }

  selectRange() {
    this.minDate = subtractDays(this.maxDate, 29);
    this.disabled = true;
    this.injuryClosedDateForm = new FormControl(['', Validators.required]);
    this.injuryClosedDateForm.value[0] = this.minDate;
    this.injuryClosedDateForm.value[1] = this.maxDate;

    this.injuryPassDateForm = new FormControl(['', Validators.required]);
    this.injuryPassDateForm.value[0] = this.minDate;
    this.injuryPassDateForm.value[1] = this.maxDate;

    this.injuriesMoreDateForm = new FormControl(['', Validators.required]);
    this.injuriesMoreDateForm.value[0] = this.minDate;
    this.injuriesMoreDateForm.value[1] = this.maxDate;

    this.casesExceedsDateForm = new FormControl(['', Validators.required]);
    this.casesExceedsDateForm.value[0] = this.minDate;
    this.casesExceedsDateForm.value[1] = this.maxDate;

    this.reportDateForm = new FormControl(['', Validators.required]);
    this.reportDateForm.value[0] = this.minDate;
    this.reportDateForm.value[1] = this.maxDate;

    this.injuriesPeriodForm = new FormControl(['', Validators.required]);
    this.injuriesPeriodForm.value[0] = this.minDate;
    this.injuriesPeriodForm.value[1] = this.maxDate;

    this.claimsDateForm = new FormControl(['', Validators.required]);
    // this.claimsDateForm.disable();
    this.claimsDateForm.value[0] = this.minDate;
    this.claimsDateForm.value[1] = this.maxDate;

    this.recoveryDateForm = new FormControl(['', Validators.required]);
    this.recoveryDateForm.value[0] = this.minDate;
    this.recoveryDateForm.value[1] = this.maxDate;

    this.isThirtyDays = true;
    this.showErrorMessage = false;
  }
  selectDateRange() {
    // this.minDate = null;
    this.disabled = false;
    this.reportDateForm.reset();
    this.injuryClosedDateForm.reset();
    this.injuryClosedDateForm.setValidators(Validators.required);
    this.injuryPassDateForm.reset();
    this.injuryPassDateForm.setValidators(Validators.required);
    // this.injuriesMoreDateForm.reset();
    // this.injuriesMoreDateForm.setValidators(Validators.required);
    // this.casesExceedsDateForm.reset();
    // if(!this.casesExceedsDateForm.valid || !this.casesExceedsDateForm.value){
    this.casesExceedsDateForm = new FormControl(['', Validators.required]);
    
    this.claimsDateForm.enable();
    this.claimsDateForm = new FormControl(['', Validators.required]);
    // this.claimsDateForm.clearValidators();    // Object.keys(this.claimsDateForm.controls).forEach(key => { this.claimsDateForm.get(key).setErrors(null) ; });
    this.claimsDateForm.setValidators(Validators.required);
    this.claimsDateForm.updateValueAndValidity();
    this.injuriesPeriodForm.reset();
    this.injuriesPeriodForm.setValidators(Validators.required);
    this.recoveryDateForm.reset();
    this.recoveryDateForm.setValidators(Validators.required);
    this.isThirtyDays = false;
    this.showErrorMessage = false;
  }
  generate() {
    if (
      this.reportDateForm &&
      this.reportDateForm?.value &&
      this.reportDateForm?.value[1] &&
      this.reportDateForm?.value[0]
    ) {
      this.language.subscribe(language => {
        this.lang = language;
      });
      if (this.lang === 'en') {
        this.lang = 'ENGLISH';
      } else {
        this.lang = 'ARABIC';
      }
      this.claimsService
        .generateReport(
          convertToYYYYMMDD(this.reportDateForm.value[1]),
          this.lang,
          convertToYYYYMMDD(this.reportDateForm.value[0])
        )
        .subscribe(data => {
          downloadFile('report', 'application/pdf', data);
        });
      this.modalRef.hide();
      this.reportDateForm.reset();
    } else {
      this.showErrorMessage = true;
    }
  }

  generateClaimsAmount() {
    if (
      this.claimsForm.get('reportLanguage').get('english').value === 'English' ||
      this.claimsForm.get('reportLanguage').get('arabic').value === 'انجليزي'
    ) {
      this.languagePassed = 'en';
    } else {
      this.languagePassed = 'ar';
    }
    if (this.isThirtyDays) {
      this.batchDateRange = 30;
    } else {
      this.batchDateRange = null;
    }
    if (this.claimsForm.valid && this.claimsDateForm.value && this.claimsDateForm.valid || this.claimsDateForm.disabled) {
      this.claimsService
        .getClaimsAmount(
          this.languagePassed,
          this.batchDateRange,
          this.claimsForm.get('cchiNo')?.value,
          convertToYYYYMMDD(this.claimsDateForm.value[1]),
          this.claimsForm.get('hospitalCode')?.value,
          this.claimsForm.get('invoiceNumber')?.value,
          convertToYYYYMMDD(this.claimsDateForm.value[0])
        )
        .subscribe(
          data => {
            downloadFile('report', 'application/vnd.ms-excel', data);
            this.modalRef.hide();
          },
          err => {
            this.alertService.showError(err.message);
            if (err.status === 'BAD_REQUEST') {
              this.showMandatoryMessage = true;
            }
          }
        );
      this.resetClosed();
    } else {
      this.showErrorMessage = true;
      this.claimsDateForm.markAllAsTouched();
      this.claimsDateForm.updateValueAndValidity();
      if (this.showErrorMessage) this.alertService.showMandatoryErrorMessage();
    }
    this.showMandatoryMessage = false;
  }
  generateClaimsAmountBI() {    
    this.claimsTPAReportStartDate = new Date();
    this.claimsTPAReportSuccess = false;
    this.claimsTPAReportCancel = false;
    this.contType = 'application/vnd.ms-excel';
    this.contfileName = 'report';
    this.reportTypeValue = OhConstants.CLAIMS_AMOUNT_TPA;
    if (
      this.claimsForm.get('reportLanguage').get('english').value === 'English' ||
      this.claimsForm.get('reportLanguage').get('arabic').value === 'انجليزي'
    ) {
      this.languagePassed = 'en';
    } else {
      this.languagePassed = 'ar';
    }
    if (this.isThirtyDays) {
      this.batchDateRange = 30;
    } else {
      this.batchDateRange = null;
    }
    // this.scrollToTop();
    if (this.claimsForm.valid && this.claimsDateForm.value && this.claimsDateForm.valid || this.claimsDateForm.disabled) {
      this.claimsService
        .getClaimsAmountReportBI(
          this.languagePassed,
          this.batchDateRange,
          this.claimsForm.get('cchiNo')?.value,
          convertToYYYYMMDD(this.claimsDateForm.value[1]),
          this.claimsForm.get('hospitalCode')?.value,
          this.claimsForm.get('invoiceNumber')?.value,
          convertToYYYYMMDD(this.claimsDateForm.value[0])
        )
        .subscribe(
          data => {
            this.claimsTPAReportUuid = data;
            if(this.claimsTPAReportUuid){          
              // this.scrollToTop();    
              this.getContentByUUID(this.claimsTPAReportUuid);
            }               
            
          },
          err => {
            this.alertService.showError(err.message);
            if (err.status === 'BAD_REQUEST') {
              this.showMandatoryMessage = true;
            }
          }
        );
      this.resetClosed();
    } else {
      this.showErrorMessage = true;
      this.claimsDateForm.markAllAsTouched();
      this.claimsDateForm.updateValueAndValidity();
      if (this.showErrorMessage) this.alertService.showMandatoryErrorMessage();
    }
    this.showMandatoryMessage = false;
  }
  generateCasesExceedsBI() {
    this.casesExceedsReportStartDate = new Date();
    this.casesExceedsReportCancel = false;
    this.reportTypeValue = OhConstants.CASES_EXCEEDS_CERTAIN_AMOUNT;
    this.casesExceedsReportSuccess = false;
    this.contType = 'application/vnd.ms-excel';
    this.contfileName = 'report';
    // this.casesExceedsDateForm.updateValueAndValidity();
    if (
      this.casesExceedsForm.get('reportLanguage').get('english').value === 'English' ||
      this.casesExceedsForm.get('reportLanguage').get('arabic').value === 'انجليزي'
    ) {
      this.languagePassed = 'en';
    } else {
      this.languagePassed = 'ar';
    }
    this.scrollToTop();     
    if (
      this.casesExceedsForm.valid &&
      this.casesExceedsForm.get('amount').value != null &&
      this.casesExceedsDateForm.value &&
      this.casesExceedsDateForm.valid  || this.casesExceedsDateForm.disabled

    ) {
      this.claimsService
        .generateCasesExceedsReportBI(
          this.languagePassed,
          this.casesExceedsForm.get('amount')?.value,
          convertToYYYYMMDD(this.casesExceedsDateForm.value[1]),
          this.casesExceedsForm.get('idenNumber')?.value,
          this.casesExceedsForm.get('injuryNumber')?.value,
          this.casesExceedsForm.get('injuryId')?.value,
          this.casesExceedsForm.get('sinNumber')?.value,
          convertToYYYYMMDD(this.casesExceedsDateForm.value[0])
        )
        .subscribe(
          data => {
            this.casesExceedsReportUuid = data;
            if(this.casesExceedsReportUuid){     
               
              this.getContentByUUID(this.casesExceedsReportUuid);
            }              
          },
          err => {
            this.alertService.showError(err.message);
            if (err.status === 'BAD_REQUEST') {
              this.showMandatoryMessage = true;
              this.showErrorMessage = false;
            }
          }
        );
      this.resetClosed();
    } else {
      this.casesExceedsForm.get('amount').markAsTouched();
      if(!this.casesExceedsDateForm.valid || !this.casesExceedsDateForm.value){
        this.casesExceedsDateForm = new FormControl(['', Validators.required]);
      }    
      // this.selectDateRange();
      this.casesExceedsDateForm.markAllAsTouched();
      this.casesExceedsDateForm.updateValueAndValidity();
      this.showErrorMessage = true;
      // if (this.showErrorMessage) this.alertService.showMandatoryErrorMessage();
      if (
        this.casesExceedsForm.get('sinNumber').value == null &&
        this.casesExceedsForm.get('idenNumber').value == null &&
        this.casesExceedsForm.get('injuryNumber').value == null &&
        this.casesExceedsForm.get('injuryId').value == null
      ) {
        this.showErrorMessage = true;
        // if (this.showErrorMessage) this.alertService.showMandatoryErrorMessage();
      }
    }
    this.showMandatoryMessage = false;
  }

  generateCasesExceeds() {
    // this.casesExceedsDateForm.updateValueAndValidity();
    if (
      this.casesExceedsForm.get('reportLanguage').get('english').value === 'English' ||
      this.casesExceedsForm.get('reportLanguage').get('arabic').value === 'انجليزي'
    ) {
      this.languagePassed = 'en';
    } else {
      this.languagePassed = 'ar';
    }
    if (
      this.casesExceedsForm.valid &&
      this.casesExceedsForm.get('amount').value != null &&
      this.casesExceedsDateForm.value &&
      this.casesExceedsDateForm.valid  || this.casesExceedsDateForm.disabled

    ) {
      this.claimsService
        .generateCasesExceedsReport(
          this.languagePassed,
          this.casesExceedsForm.get('amount')?.value,
          convertToYYYYMMDD(this.casesExceedsDateForm.value[1]),
          this.casesExceedsForm.get('idenNumber')?.value,
          this.casesExceedsForm.get('injuryNumber')?.value,
          this.casesExceedsForm.get('injuryId')?.value,
          this.casesExceedsForm.get('sinNumber')?.value,
          convertToYYYYMMDD(this.casesExceedsDateForm.value[0])
        )
        .subscribe(
          data => {
            downloadFile('report', 'application/vnd.ms-excel', data);
            this.modalRef.hide();
          },
          err => {
            this.alertService.showError(err.message);
            if (err.status === 'BAD_REQUEST') {
              this.showMandatoryMessage = true;
            }
          }
        );
      this.resetClosed();
    } else {
      this.casesExceedsForm.get('amount').markAsTouched();
      if(!this.casesExceedsDateForm.valid || !this.casesExceedsDateForm.value){
        this.casesExceedsDateForm = new FormControl(['', Validators.required]);
      }    
      // this.selectDateRange();
      this.casesExceedsDateForm.markAllAsTouched();
      this.casesExceedsDateForm.updateValueAndValidity();
      this.showErrorMessage = true;
      // if (this.showErrorMessage) this.alertService.showMandatoryErrorMessage();
      if (
        this.casesExceedsForm.get('sinNumber').value == null &&
        this.casesExceedsForm.get('idenNumber').value == null &&
        this.casesExceedsForm.get('injuryNumber').value == null &&
        this.casesExceedsForm.get('injuryId').value == null
      ) {
        this.showErrorMessage = true;
        // if (this.showErrorMessage) this.alertService.showMandatoryErrorMessage();
      }
    }
    this.showMandatoryMessage = false;
  }

  generateDailyAllowance() {
    if (
      this.dailyAllowancesForm.get('reportLanguage').get('english').value === 'English' ||
      this.dailyAllowancesForm.get('reportLanguage').get('arabic').value === 'انجليزي'
    ) {
      this.languagePassed = 'en';
    } else {
      this.languagePassed = 'ar';
    }
    if (this.dailyAllowancesForm.valid) {
      this.claimsService
        .generateDailyAllowanceReport(
          this.isSinSelected,
          this.languagePassed,
          this.dailyAllowancesForm.get('sinNumber').value,
          this.dailyAllowancesForm.get('identity').value,
          this.dailyAllowancesForm.get('injuryId').value,
          this.dailyAllowancesForm.get('injuryNumber').value
        )

        .subscribe(
          data => {
            downloadFile('report', 'application/vnd.ms-excel', data);
            this.modalRef.hide();
          },
          err => {
            this.alertService.showError(err.message);
            if (err.status === 'BAD_REQUEST') {
              this.showMandatoryMessage = true;
            }
          }
        );
      if (
        this.dailyAllowancesForm.get('sinNumber').value == null &&
        this.dailyAllowancesForm.get('identity').value == null
      ) {
        this.showErrorMessage = true;
        if (this.showErrorMessage) this.alertService.showMandatoryErrorMessage();
      } else {
        this.resetClosed();
      }
    } else {
      this.isSinSelected
        ? this.dailyAllowancesForm.get('sinNumber').markAsTouched()
        : this.dailyAllowancesForm.get('identity').markAsTouched();

      this.showErrorMessage = true;
      if (this.showErrorMessage) this.alertService.showMandatoryErrorMessage();
    }
    this.showMandatoryMessage = false;
  }
  generateInjuriesMore(statusValue: string[]) {
    if (
      this.injuriesMoreForm.get('reportLanguage').get('english').value === 'English' ||
      this.injuriesMoreForm.get('reportLanguage').get('arabic').value === 'انجليزي'
    ) {
      this.languagePassed = 'en';
    } else {
      this.languagePassed = 'ar';
    }
    if (this.isThirtyDays) {
      this.batchDateRange = 30;
    } else {
      this.batchDateRange = null;
    }
    // this.statusEng = this.checkForm.get('statusForm').get('status').value;
    if (this.injuriesMoreForm.valid && this.claimsDateForm.value && statusValue && this.claimsDateForm.valid  || this.claimsDateForm.disabled) {
      this.claimsService
        .generateInjuriesMoreReport(
          this.languagePassed,
          this.batchDateRange,
          convertToYYYYMMDD(this.claimsDateForm.value[0]),
          convertToYYYYMMDD(this.claimsDateForm.value[1]),
          statusValue,
          this.injuriesMoreForm.get('treatmentDuration').value,
          this.injuriesMoreForm.get('sinNumber').value,
          this.injuriesMoreForm.get('identificationNumber').value,
          this.injuriesMoreForm.get('injuryNumber').value,
          this.injuriesMoreForm.get('injuryId').value
        )
        .subscribe(
          data => {
            downloadFile('report', 'application/vnd.ms-excel', data);
            this.modalRef.hide();
          },
          err => {
            this.alertService.showError(err.message);
            if (err.status === 'BAD_REQUEST') {
              this.showMandatoryMessage = true;
              this.showErrorMessage = false;
            }
          }
        );
      // this.resetClosed();
    } else {
      // this.checkForm.get('statusForm').get('status').reset();
      this.injuriesMoreForm.get('treatmentDuration').markAsTouched();
      this.claimsDateForm.markAllAsTouched();
      this.claimsDateForm.updateValueAndValidity();
      this.checkForm.markAllAsTouched();
      this.checkForm.updateValueAndValidity();
      this.showErrorMessage = true;
      this.alertService.showMandatoryErrorMessage();
    }
    this.showMandatoryMessage = false;
  }
  generateInjuriesMoreBI(statusValue: string[]) {
    this.contType = 'application/vnd.ms-excel';
    this.contfileName = 'report';
    this.injuryTreatmentCertainPeriodStartDate = new Date();
    this.injuryTreatmentReportSuccess = false;
    this.injuryTreatmentReportCancel = false;
    this.reportTypeValue= OhConstants.INJURIES_TREATMENT_CERTAIN_PERIOD;
    if (
      this.injuriesMoreForm.get('reportLanguage').get('english').value === 'English' ||
      this.injuriesMoreForm.get('reportLanguage').get('arabic').value === 'انجليزي'
    ) {
      this.languagePassed = 'en';
    } else {
      this.languagePassed = 'ar';
    }
    if (this.isThirtyDays) {
      this.batchDateRange = 30;
    } else {
      this.batchDateRange = null;
    }
    this.scrollToTop();     
    // this.statusEng = this.checkForm.get('statusForm').get('status').value;
    if (this.injuriesMoreForm.valid && this.claimsDateForm.value && statusValue && (this.claimsDateForm.valid  || this.claimsDateForm.disabled)) {
      this.claimsService
        .generateInjuriesMoreReportBI(
          this.languagePassed,
          this.batchDateRange,
          convertToYYYYMMDD(this.claimsDateForm.value[0]),
          convertToYYYYMMDD(this.claimsDateForm.value[1]),
          statusValue,
          this.injuriesMoreForm.get('treatmentDuration').value,
          this.injuriesMoreForm.get('sinNumber').value,
          this.injuriesMoreForm.get('identificationNumber').value,
          this.injuriesMoreForm.get('injuryNumber').value,
          this.injuriesMoreForm.get('injuryId').value
        )
        .subscribe(
          data => {              
            this.injuryTreatmentCertainPeriodUuid = data;
            if(this.injuryTreatmentCertainPeriodUuid){       
            
              this.getContentByUUID(this.injuryTreatmentCertainPeriodUuid);
            }         
          },
          err => {
            this.alertService.showError(err.message);
            if (err.status === 'BAD_REQUEST') {
              this.showMandatoryMessage = true;
              this.showErrorMessage = false;
            }
          }
        );
      // this.resetClosed();
    } else {
      // this.checkForm.get('statusForm').get('status').reset();
      this.injuriesMoreForm.get('treatmentDuration').markAsTouched();
      this.claimsDateForm.markAllAsTouched();
      this.claimsDateForm.updateValueAndValidity();
      this.checkForm.markAllAsTouched();
      this.checkForm.updateValueAndValidity();
      this.showErrorMessage = true;
      this.alertService.showMandatoryErrorMessage();
    }
    this.showMandatoryMessage = false;
  }
  generateInjuryStatus() {
    if (
      this.injuryPeriodForm.get('reportLanguage').get('english').value === 'English' ||
      this.injuryPeriodForm.get('reportLanguage').get('arabic').value === 'انجليزي'
    ) {
      this.languagePassed = 'en';
    } else {
      this.languagePassed = 'ar';
    }
    if (this.isThirtyDays) {
      this.batchDateRange = 30;
    } else {
      this.batchDateRange = null;
    }
    if (this.injuryPeriodForm.valid && this.claimsDateForm.value && this.claimsDateForm.valid  || this.claimsDateForm.disabled) {
      this.claimsService
        .getInjuryPeriodReport(
          this.languagePassed,
          this.batchDateRange,
          convertToYYYYMMDD(this.claimsDateForm.value[1]),
          this.injuryPeriodForm.get('establishmentRegNo')?.value,
          this.injuryPeriodForm.get('injuryNumber')?.value,
          this.injuryPeriodForm.get('sinNumber')?.value,
          this.injuryPeriodForm.get('idenNumber')?.value,
          convertToYYYYMMDD(this.claimsDateForm.value[0])
        )
        .subscribe(
          data => {
            downloadFile('report', 'application/vnd.ms-excel', data);
            this.modalRef.hide();
          },
          err => {
            this.alertService.showError(err.message);
            if (err.status === 'BAD_REQUEST') {
              this.showMandatoryMessage = true;
            }
          }
        );

      this.resetClosed();
    } else {
      this.showErrorMessage = true;
      this.claimsDateForm.markAllAsTouched();
      this.claimsDateForm.updateValueAndValidity();

      if (this.showErrorMessage) this.alertService.showMandatoryErrorMessage();
    }
    this.showMandatoryMessage = false;
  }
  generateInjuryStatusBI() {
    this.contType = 'application/vnd.ms-excel';
    this.contfileName = 'report';
    this.reportTypeValue = OhConstants.INJURIES_REPORTED_CERTAIN_PERIOD;
    this.injuryReportedCertainPeriodReportSuccess = false;
    this.injuryReportedCertainPeriodReportCancel = false;
    this.injuryReportedCertainPeriodStartDate = new Date();
    if (
      this.injuryPeriodForm.get('reportLanguage').get('english').value === 'English' ||
      this.injuryPeriodForm.get('reportLanguage').get('arabic').value === 'انجليزي'
    ) {
      this.languagePassed = 'en';
    } else {
      this.languagePassed = 'ar';
    }
    if (this.isThirtyDays) {
      this.batchDateRange = 30;
    } else {
      this.batchDateRange = null;
    }
    this.scrollToTop();
    if (this.injuryPeriodForm.valid && this.claimsDateForm.value && this.claimsDateForm.valid  || this.claimsDateForm.disabled) {
      this.claimsService
        .getInjuryPeriodReportBI(
          this.languagePassed,
          this.batchDateRange,
          convertToYYYYMMDD(this.claimsDateForm.value[1]),
          this.injuryPeriodForm.get('establishmentRegNo')?.value,
          this.injuryPeriodForm.get('injuryNumber')?.value,
          this.injuryPeriodForm.get('sinNumber')?.value,
          this.injuryPeriodForm.get('idenNumber')?.value,
          convertToYYYYMMDD(this.claimsDateForm.value[0])
        )
        
        .subscribe(
          data => {
            this.injuryReportedCertainPeriodUuid = data;
            if(this.injuryReportedCertainPeriodUuid){             
              this.getContentByUUID(this.injuryReportedCertainPeriodUuid);             
            }   
          },
          err => {
            this.alertService.showError(err.message);
            if (err.status === 'BAD_REQUEST') {
              this.showMandatoryMessage = true;
            }
          }
        );

      this.resetClosed();
    } else {
      this.showErrorMessage = true;
      this.claimsDateForm.markAllAsTouched();
      this.claimsDateForm.updateValueAndValidity();

      if (this.showErrorMessage) this.alertService.showMandatoryErrorMessage();
    }
    this.showMandatoryMessage = false;
  }
  generateNumberOfInjuryStatusBI(isFromPassed: boolean, statusValue: string[]) {
    this.contfileName ='report';
    this.contType ='application/vnd.ms-excel';
    
    if (this.injuriesPassedForm.get('reportLanguage').get('english').value === 'English' ||
          this.injuriesPassedForm.get('reportLanguage').get('arabic').value === 'انجليزي')
     {
      this.languagePassed = 'en';
    } else {
      this.languagePassed = 'ar';
    }   
    this.reportType = 'Passed';
    this.reportTypeValue = OhConstants.INJURIES_PASSED_CERTAIN_PERIOD_SINCE_REPORTED;
    this.injuryPassedCertainPeriodStartDate = new Date();
    this.injuryPassedReportSuccess = false;
    this.injuryPassedReportCancel = false;    
    if (
      (this.claimsDateForm.value && (this.claimsDateForm.valid || this.claimsDateForm.disabled)) &&
      (this.injuriesClosedForm.valid || this.injuriesPassedForm.valid)
    ) {
      if (this.isThirtyDays) {
        this.batchDateRange = 30;
      } else {
        this.batchDateRange = null;
      }
      this.scrollToTop();
      this.claimsService
        .generateInjuryStatusReportBI(
          this.languagePassed,
          this.reportType,
          this.batchDateRange,
          isFromPassed
            ? convertToYYYYMMDD(this.claimsDateForm.value[0])
            : convertToYYYYMMDD(this.claimsDateForm.value[0]),
          isFromPassed
            ? convertToYYYYMMDD(this.claimsDateForm.value[1])
            : convertToYYYYMMDD(this.claimsDateForm.value[1]),                    
          statusValue,
             'Passed'
        )
        .subscribe(response => {
          this.uuId = response;
          if(this.uuId){           
              this.injuryPassedCertainPeriodUuid =  this.uuId;        
            this.getContentByUUID(this.uuId);           
          }          
        });
      this.showMandatoryMessage = false;
      this.resetClosed();
    } else {
      this.showErrorMessage = true;
      this.checkForm.markAllAsTouched();
      this.claimsDateForm.markAllAsTouched();
      this.claimsDateForm.updateValueAndValidity();
      // this.injuryPassDateForm.markAllAsTouched();
      // this.injuryPassDateForm.updateValueAndValidity();
      this.alertService.showMandatoryErrorMessage();
    }
    this.showMandatoryMessage = false;
  }

  generateClosedPassed(isFromPassed: boolean, statusValue: string[]) {
    // let values: BilingualText[] = [];
    if (
      (!isFromPassed &&
        (this.injuriesClosedForm.get('reportLanguage').get('english').value === 'English' ||
          this.injuriesClosedForm.get('reportLanguage').get('arabic').value === 'انجليزي')) ||
      (isFromPassed &&
        (this.injuriesPassedForm.get('reportLanguage').get('english').value === 'English' ||
          this.injuriesPassedForm.get('reportLanguage').get('arabic').value === 'انجليزي'))
    ) {
      this.languagePassed = 'en';
    } else {
      this.languagePassed = 'ar';
    }
    if (isFromPassed) {
      this.reportType = 'Passed';
    } else {
      this.reportType = 'Closed';
    }
    if (
      (this.claimsDateForm.value && (this.claimsDateForm.valid || this.claimsDateForm.disabled)) &&
      (this.injuriesClosedForm.valid || this.injuriesPassedForm.valid)
    ) {
      if (this.isThirtyDays) {
        this.batchDateRange = 30;
      } else {
        this.batchDateRange = null;
      }

      this.claimsService
        .generateClosedReport(
          this.languagePassed,
          this.reportType,
          this.batchDateRange,
          isFromPassed
            ? convertToYYYYMMDD(this.claimsDateForm.value[0])
            : convertToYYYYMMDD(this.claimsDateForm.value[0]),
          isFromPassed
            ? convertToYYYYMMDD(this.claimsDateForm.value[1])
            : convertToYYYYMMDD(this.claimsDateForm.value[1]),
          null,
          statusValue
        )
        .subscribe(
          data => {
            downloadFile('report', 'application/vnd.ms-excel', data);
            this.modalRef.hide();
          },
          err => {
            this.alertService.showError(err.message);
            if (err.status === 'BAD_REQUEST') {
              this.showMandatoryMessage = true;
              this.showErrorMessage = false;
            }
          }
        );
      this.showMandatoryMessage = false;
      this.resetClosed();
    } else {
      this.showErrorMessage = true;
      this.checkForm.markAllAsTouched();
      this.claimsDateForm.markAllAsTouched();
      this.claimsDateForm.updateValueAndValidity();
      // this.injuryPassDateForm.markAllAsTouched();
      // this.injuryPassDateForm.updateValueAndValidity();
      this.alertService.showMandatoryErrorMessage();
    }
    this.showMandatoryMessage = false;
  }
  generateClosedPassedBI(isFromPassed: boolean, statusValue: string[]) {   
    this.contfileName ='report';
    this.contType ='application/vnd.ms-excel';
    
    if (
      (!isFromPassed &&
        (this.injuriesClosedForm.get('reportLanguage').get('english').value === 'English' ||
          this.injuriesClosedForm.get('reportLanguage').get('arabic').value === 'انجليزي')) ||
      (isFromPassed &&
        (this.injuriesPassedForm.get('reportLanguage').get('english').value === 'English' ||
          this.injuriesPassedForm.get('reportLanguage').get('arabic').value === 'انجليزي'))
    ) {
      this.languagePassed = 'en';
    } else {
      this.languagePassed = 'ar';
    }
    if (isFromPassed) {
      this.reportType = 'Passed';
      this.reportTypeValue = OhConstants.INJURIES_PASSED_CERTAIN_PERIOD_SINCE_REPORTED;
      this.injuryPassedCertainPeriodStartDate = new Date();
      this.injuryPassedReportSuccess = false;
      this.injuryPassedReportCancel = false;
    } else {
      this.reportType = 'Closed';
      this.reportTypeValue = OhConstants.INJURIES_CLOSED_CERTAIN_PERIOD;
      this.injuryClosedCertainPeriodStartDate = new Date();
      this.injuryClosedReportSuccess = false;
      this.injuryClosedReportCancel = false;
    }
    if (
      (this.claimsDateForm.value && (this.claimsDateForm.valid || this.claimsDateForm.disabled)) &&
      (this.injuriesClosedForm.valid || this.injuriesPassedForm.valid)
    ) {
      if (this.isThirtyDays) {
        this.batchDateRange = 30;
      } else {
        this.batchDateRange = null;
      }
      this.scrollToTop();
      this.claimsService
        .generateClosedReportBI(
          this.languagePassed,
          this.reportType,
          this.batchDateRange,
          isFromPassed
            ? convertToYYYYMMDD(this.claimsDateForm.value[0])
            : convertToYYYYMMDD(this.claimsDateForm.value[0]),
          isFromPassed
            ? convertToYYYYMMDD(this.claimsDateForm.value[1])
            : convertToYYYYMMDD(this.claimsDateForm.value[1]),
          null,
          null,
          statusValue,
          null, null, null, 'Closed'
        )
        .subscribe(response => {
          this.uuId = response;
          if(this.uuId){
            if (isFromPassed) {
              this.injuryPassedCertainPeriodUuid =  this.uuId;
            }else{
              this.injuryClosedCertainPeriodUuid =  this.uuId;
            }
            this.getContentByUUID(this.uuId);           
          }          
        });
      this.showMandatoryMessage = false;
      this.resetClosed();
    } else {
      this.showErrorMessage = true;
      this.checkForm.markAllAsTouched();
      this.claimsDateForm.markAllAsTouched();
      this.claimsDateForm.updateValueAndValidity();
      // this.injuryPassDateForm.markAllAsTouched();
      // this.injuryPassDateForm.updateValueAndValidity();
      this.alertService.showMandatoryErrorMessage();
    }
    this.showMandatoryMessage = false;
  }
  getContentByUUID(uuid: string){   
    if(uuid){      
        this.claimsService.generatedReport(uuid).subscribe(      
          response => {
            if(response){          
              this.claimsService.getDocumentContent(response.toString()).subscribe(res => {
                if (res) {
                  const blobData = this.createExcelFile(res?.content);
                  downloadFile(this.contfileName, this.contType, blobData);                 
                  setTimeout(() => {
                    this.modalRef.hide();
                  }, 100);                  
                  switch (this.reportTypeValue) {
                    case OhConstants.CLAIMS_AMOUNT_TPA:
                      {
                        this.claimsTPAReportSuccess = true;
                      }
                      break;
                    case OhConstants.CASES_EXCEEDS_CERTAIN_AMOUNT:
                      {
                        this.casesExceedsReportSuccess = true;
                      }
                      break;
                    case OhConstants.INJURIES_CLOSED_CERTAIN_PERIOD:
                      {
                        this.injuryClosedReportSuccess = true;
                      }
                      break;
                    case OhConstants.INJURIES_PASSED_CERTAIN_PERIOD_SINCE_REPORTED:
                      {
                        this.injuryPassedReportSuccess = true;
                      }
                      break;
                      case OhConstants.INJURIES_REPORTED_CERTAIN_PERIOD:
                        {
                          this.injuryReportedCertainPeriodReportSuccess = true;
                        }
                        break;
                    case OhConstants.INJURIES_TREATMENT_CERTAIN_PERIOD:
                      {
                        this.injuryTreatmentReportSuccess = true;
                      }
                      break;
                  }
                }
              },
              err => {
                this.alertService.showError(err.message);
                if (err.status === 'BAD_REQUEST') {
                  this.showMandatoryMessage = true;
                  this.showErrorMessage = false;
                }
              });   
            } else {    
              const endDate = new Date();  
              if(this.reportTypeValue === OhConstants.CLAIMS_AMOUNT_TPA){
                this.claimsTPAReportUuid = uuid;
                this.claimsTPATimeTaken = this.calculateTimeDiffInMin(this.claimsTPAReportStartDate, endDate);
                let claimsTPATimeoutId;  
                
                if(this.claimsTPATimeTaken && this.claimsTPATimeTaken<590 &&  !this.claimsTPAReportSuccess && !this.claimsTPAReportCancel){
                  claimsTPATimeoutId =  setTimeout(() => {
                    this.getContentByUUID(this.claimsTPAReportUuid);
                  }, 10000);
                }else if((claimsTPATimeoutId && this.claimsTPATimeTaken >= 590) || this.claimsTPAReportCancel){
                  clearTimeout(claimsTPATimeoutId);
                }
              }else if(this.reportTypeValue === OhConstants.CASES_EXCEEDS_CERTAIN_AMOUNT){
                this.casesExceedsReportUuid = uuid;
                this.casesExceedsTimeTaken = this.calculateTimeDiffInMin(this.casesExceedsReportStartDate, endDate);
                let casesExceedsTimeoutId;  
                
                if(this.casesExceedsTimeTaken && this.casesExceedsTimeTaken<590 &&  !this.casesExceedsReportSuccess && !this.casesExceedsReportCancel){
                  casesExceedsTimeoutId =  setTimeout(() => {
                    this.getContentByUUID(this.casesExceedsReportUuid);
                  }, 10000);
                }else if((casesExceedsTimeoutId && this.casesExceedsTimeTaken >= 590) || this.casesExceedsReportCancel){
                  clearTimeout(casesExceedsTimeoutId);
                }
              }else if(this.reportTypeValue === OhConstants.INJURIES_CLOSED_CERTAIN_PERIOD){
                this.injuryClosedCertainPeriodUuid = uuid;
                this.injuryClosedTimeTaken = this.calculateTimeDiffInMin(this.injuryClosedCertainPeriodStartDate, endDate);
                let injuryClosedTimeoutId;                 
                if(this.injuryClosedTimeTaken && this.injuryClosedTimeTaken<590 &&  !this.injuryClosedReportSuccess && !this.injuryClosedReportCancel){
                  injuryClosedTimeoutId =  setTimeout(() => {
                    this.getContentByUUID(this.injuryClosedCertainPeriodUuid);
                  }, 10000);
                }else if((injuryClosedTimeoutId && this.injuryClosedTimeTaken >= 590) || this.injuryClosedReportCancel){
                  clearTimeout(injuryClosedTimeoutId);
                }
              } else if(this.reportTypeValue === OhConstants.INJURIES_PASSED_CERTAIN_PERIOD_SINCE_REPORTED){
                this.injuryPassedCertainPeriodUuid = uuid;
                this.injuryPassedTimeTaken = this.calculateTimeDiffInMin(this.injuryPassedCertainPeriodStartDate, endDate);
                let injuryPassedTimeoutId;                
                if(this.injuryPassedTimeTaken && this.injuryPassedTimeTaken<590 && !this.injuryPassedReportSuccess && !this.injuryPassedReportCancel){
                  injuryPassedTimeoutId =  setTimeout(() => {
                    this.getContentByUUID(this.injuryPassedCertainPeriodUuid);
                  }, 10000);
                }else if((injuryPassedTimeoutId && this.injuryPassedTimeTaken >= 590) || this.injuryPassedReportCancel){
                  clearTimeout(injuryPassedTimeoutId);
                }
              } else if(this.reportTypeValue === OhConstants.INJURIES_REPORTED_CERTAIN_PERIOD){
                this.injuryReportedCertainPeriodUuid = uuid;
                this.injuryReportedTimeTaken = this.calculateTimeDiffInMin(this.injuryReportedCertainPeriodStartDate, endDate);
                let injuryReportedTimeoutId;                
                  if(this.injuryReportedTimeTaken && this.injuryReportedTimeTaken<590 && !this.injuryReportedCertainPeriodReportSuccess && !this.injuryReportedCertainPeriodReportCancel){
                    injuryReportedTimeoutId =  setTimeout(() => {
                      this.getContentByUUID(this.injuryReportedCertainPeriodUuid);
                    }, 10000);
                  }else if((injuryReportedTimeoutId && this.injuryReportedTimeTaken >= 590) || this.injuryReportedCertainPeriodReportCancel){
                    clearTimeout(injuryReportedTimeoutId);
                  }
              } else if(this.reportTypeValue === OhConstants.INJURIES_TREATMENT_CERTAIN_PERIOD){
                this.injuryTreatmentCertainPeriodUuid = uuid;
                this.injuryTreatmentTimeTaken = this.calculateTimeDiffInMin(this.injuryTreatmentCertainPeriodStartDate, endDate);
                let injuryTreatmentTimeoutId;
                if(this.injuryTreatmentTimeTaken && this.injuryTreatmentTimeTaken<590 && !this.injuryTreatmentReportSuccess && !this.injuryTreatmentReportCancel){
                  injuryTreatmentTimeoutId =  setTimeout(() => {
                    this.getContentByUUID(this.injuryTreatmentCertainPeriodUuid);
                  }, 10000);
                }else if((injuryTreatmentTimeoutId && this.injuryTreatmentTimeTaken >= 590) || this.injuryTreatmentReportCancel){
                  clearTimeout(injuryTreatmentTimeoutId);
                }  
              }      
                  
            }
          },
          err => {            
            if (err.status === 'BAD_REQUEST' || err.status === 400) {
              this.alertService.showErrorByKey('OCCUPATIONAL-HAZARD.DISEASE.NO-RECORDS');
              this.showMandatoryMessage = true;
              this.showErrorMessage = false;
            }else{
              this.alertService.showError(err.message);
            }
          });    
        }   
     
  }
  calculateTimeDiffInMin(startDate: Date, endDate: Date) {  
    var diff = endDate.getTime() - startDate.getTime();
    var days = Math.floor(diff / (60 * 60 * 24 * 1000));
    var hours = Math.floor(diff / (60 * 60 * 1000)) - (days * 24);
    var minutes = Math.floor(diff / (60 * 1000)) - ((days * 24 * 60) + (hours * 60));  
    var seconds = Math.floor(diff / 1000) - ((days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60));
    return seconds+10;
  }
  createExcelFile(content) {
    const byteCharacters = atob(content);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512),
        byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, {
      type: `application/vnd.ms-excel`
    });
    return blob;
  }
  generateRecoveryForm() {
    if (
      this.recoveryForm.get('reportLanguage').get('english').value === 'English' ||
      this.recoveryForm.get('reportLanguage').get('arabic').value === 'انجليزي'
    ) {
      this.languagePassed = 'en';
    } else {
      this.languagePassed = 'ar';
    }
    if (this.isThirtyDays) {
      this.batchDateRange = 30;
    } else {
      this.batchDateRange = null;
    }
    if (this.recoveryForm.valid && this.claimsDateForm.value && this.claimsDateForm.valid  || this.claimsDateForm.disabled) {
      this.claimsService
        .getRecoveryReport(
          this.languagePassed,
          this.batchDateRange,
          convertToYYYYMMDD(this.claimsDateForm.value[1]),
          convertToYYYYMMDD(this.claimsDateForm.value[0]),
          this.recoveryForm.get('establishmentRegNo')?.value,
          this.recoveryForm.get('recoveryType').get('english')?.value
        )
        .subscribe(
          data => {
            downloadFile('report', 'application/vnd.ms-excel', data);
            this.modalRef.hide();
          },
          err => {
            this.alertService.showError(err.message);
            if (err.status === 'BAD_REQUEST') {
              this.showMandatoryMessage = true;
            }
          }
        );

      this.resetClosed();
    } else {
      this.showErrorMessage = true;
      this.claimsDateForm.markAsTouched();
      this.claimsDateForm.updateValueAndValidity();
      if (this.showErrorMessage) this.alertService.showMandatoryErrorMessage();
    }
    this.showMandatoryMessage = false;
  }
  scrollToTop(){
    const element = document.getElementById('modalDiv');        
    element .focus();
  }
  setStatus(statusFilter: BilingualText[]) {
    if (statusFilter) {
      this.statusEng = statusFilter.map(items => items.english);
    } else {
      this.statusEng = null;
    }
  }
  hideModal() {
    this.showErrorMessage = false;
    this.showMandatoryMessage = false;
    this.resetClosed();
    this.setReportCancelValues();
    this.modalRef.hide();

  }
  resetClosed() {
    this.checkForm.reset();
    this.claimsForm.get('invoiceNumber').reset();
    this.claimsForm.get('hospitalCode').reset();
    this.claimsForm.get('cchiNo').reset();
    this.casesExceedsForm.get('amount').reset();
    this.casesExceedsForm.get('sinNumber').reset();
    this.casesExceedsForm.get('idenNumber').reset();
    this.casesExceedsForm.get('injuryNumber').reset();
    this.casesExceedsForm.get('injuryId').reset();
    this.dailyAllowancesForm.get('sinNumber').reset();
    this.dailyAllowancesForm.get('identity').reset();
    this.dailyAllowancesForm.get('injuryNumber').reset();
    this.dailyAllowancesForm.get('injuryId').reset();
    this.injuriesMoreForm.get('treatmentDuration').reset();
    this.injuriesMoreForm.get('sinNumber').reset();
    this.injuriesMoreForm.get('identificationNumber').reset();
    this.injuriesMoreForm.get('injuryNumber').reset();
    this.injuriesMoreForm.get('injuryId').reset();
    this.injuryPeriodForm.get('establishmentRegNo').reset();
    this.injuryPeriodForm.get('injuryNumber').reset();
    this.injuryPeriodForm.get('sinNumber').reset();
    this.injuryPeriodForm.get('idenNumber').reset();
    this.recoveryForm.get('establishmentRegNo').reset();   
  }
  setReportCancelValues(){
    if(this.reportTypeValue === OhConstants.CLAIMS_AMOUNT_TPA){
      this.claimsTPAReportCancel = true;
    }else if(this.reportTypeValue === OhConstants.CASES_EXCEEDS_CERTAIN_AMOUNT){
      this.casesExceedsReportCancel = true;
    }else if(this.reportTypeValue === OhConstants.INJURIES_CLOSED_CERTAIN_PERIOD){
      this.injuryClosedReportCancel = true;
    } else if(this.reportTypeValue === OhConstants.INJURIES_PASSED_CERTAIN_PERIOD_SINCE_REPORTED){
      this.injuryPassedReportCancel = true;
    } else if(this.reportTypeValue === OhConstants.INJURIES_REPORTED_CERTAIN_PERIOD){
      this.injuryReportedCertainPeriodReportCancel = true;
    } else if(this.reportTypeValue === OhConstants.INJURIES_TREATMENT_CERTAIN_PERIOD){
      this.injuryTreatmentReportCancel = true;
    }
  }
}
