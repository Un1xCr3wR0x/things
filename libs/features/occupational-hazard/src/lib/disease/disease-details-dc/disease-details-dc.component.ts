import { Component, OnChanges, SimpleChanges, Inject, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ApplicationTypeToken, LovList, ApplicationTypeEnum, addDays, RouterData, BilingualText, Lov, Role, startOfDay } from '@gosi-ui/core';
import { Disease, ProcessType, ValidatorConstants } from '../../shared';
import { FormGroup, Validators, AbstractControl } from '@angular/forms';
import { DiseaseConstants } from '../../shared/constants/disease-constants';
import moment from 'moment';

@Component({
  selector: 'oh-disease-details-dc',
  templateUrl: './disease-details-dc.component.html',
  styleUrls: ['./disease-details-dc.component.scss']
})
export class DiseaseDetailsDcComponent implements OnChanges, OnInit {
  constructor(@Inject(ApplicationTypeToken) readonly appToken: string) {}
  /**
   * Local variables
   */
  currentDate: Date;
  minContributorDate: Date;
  isIndividualApp: boolean = false;
  minEmployerDate: Date;
  contributorInformedDate: Date = new Date();
  employerInformedDate: Date;
  contributorDiseaseDate: Date;
  deathDate: Date = new Date();
  diseaseDescriptionMaxLength = DiseaseConstants.DESC_MAX_LENGTH;
  contributorDateDisable = true;
  employerDateDisable = true;
  isCsr = false;
  selectedDiseaseCause: BilingualText[] = [];
  items: Lov[] = [];
  payeeList: LovList = null;
  isBindValue: boolean = false;

  workDisabilityDate: Date;
  isPersonDead = false;
  disableDeath = false;
  addressValidation = false;
  //Input variables
  @Input() diseaseDetails: Disease = new Disease();
  @Input() diseaseDetailsForm: FormGroup;
  @Input() diseaseDiagnosisList: LovList;
  @Input() diseaseCauseList: LovList = new LovList([]);
  @Input() processType = '';
  @Input() routerData: RouterData;
  @Input() isAppPrivate: boolean;
  @Input() disableEst: boolean;
  //output variables
  @Output() submit: EventEmitter<Disease> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  @Output() template: EventEmitter<null> = new EventEmitter();
  @Output() showToggle: EventEmitter<boolean> = new EventEmitter();

  ngOnInit(): void {
    this.currentDate = new Date();
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      this.isCsr = true;
    } else {
      this.isCsr = false;
    }
    this.items.push({ value: { english: 'Contributor', arabic: ' مشترك' }, sequence: 1 });
    this.items.push({ value: { english: 'Establishment', arabic: 'منشأة' }, sequence: 2 });
    this.payeeList = new LovList(this.items); 
    this.deathDate = this.currentDate;
    this.diseaseDetailsForm
      ?.get('deathDate')
      .get('gregorian')
      .valueChanges.subscribe(deathDate => {
        if (deathDate) {
          this.deathDate = deathDate;
        } else if (deathDate === null) {
          this.deathDate = this.currentDate;
        }
      });
    this.diseaseDetailsForm
      ?.get('diseaseDiagnosisDate')
      .get('gregorian')
      .valueChanges.subscribe(diseaseDate => {
        if (diseaseDate !== null) {
          setTimeout(() => {
            this.contributorDiseaseDate = addDays(moment(diseaseDate).toDate(), 1);
            this.contributorDateDisable = false;
            if (
              this.processType !== ProcessType.MODIFY &&
              this.processType !== ProcessType.EDIT &&
              this.processType !== ProcessType.RE_OPEN
            ) {
              const diseaseDateValue = new Date(diseaseDate).setHours(0, 0, 0, 0);
              this.currentDate.setHours(0, 0, 0, 0);
              const dateOne = moment(diseaseDateValue);
              const dateTwo = moment(this.currentDate);
              const deathDate = moment(this.diseaseDetailsForm.get('deathDate').get('gregorian').value);
              const workDisabilityDate = moment(this.diseaseDetailsForm.get('workDisabilityDate').get('gregorian').value);
              if(deathDate && dateOne && dateOne.isAfter(deathDate)){
                this.diseaseDetailsForm.get('deathDate').get('gregorian').patchValue(null);
              }
              if (!dateOne.isAfter(dateTwo) && !dateOne.isBefore(dateTwo)) {
                this.diseaseDetailsForm.get('workDisabilityDate').get('gregorian').setValue(diseaseDate);
                this.diseaseDetailsForm.get('contributorInformedDate').get('gregorian').setValue(diseaseDate);
                this.diseaseDetailsForm.get('employerInformedDate').get('gregorian').setValue(diseaseDate);
                this.minContributorDate = diseaseDate;
                this.workDisabilityDate = diseaseDate;
                this.contributorDiseaseDate = diseaseDate;
              } /* else if(deathDate && workDisabilityDate){
                if (workDisabilityDate.isAfter(deathDate)){
                  this.workDisabilityDate = addDays(moment(diseaseDate).toDate(), 1);
                  this.diseaseDetailsForm.get('workDisabilityDate').get('gregorian').patchValue(this.workDisabilityDate);
                }
              } */
              else {
                this.workDisabilityDate = addDays(moment(diseaseDate).toDate(), 1);
                this.minContributorDate = addDays(moment(diseaseDate).toDate(), 1);
                this.diseaseDetailsForm.get('workDisabilityDate').get('gregorian').patchValue(this.workDisabilityDate);
              }
            }
          }, 500);
        } else if (diseaseDate === null) {
          this.workDisabilityDate = null;
          this.contributorDateDisable = true;
        }
      });
    if (this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP) {
      this.isIndividualApp = true;
      this.diseaseDetailsForm.get('contributorInformedDate').get('gregorian').patchValue(this.currentDate);
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.diseaseDetails && changes.diseaseDetails.currentValue) {
      this.diseaseDetails = changes.diseaseDetails.currentValue;
      if (this.diseaseDetailsForm?.get('diseaseLeadToDeathOfContributor').valueChanges) {
        this.isPersonDead = this.diseaseDetailsForm.get('diseaseLeadToDeathOfContributor').value;
      }
    }
    if (changes && changes.diseaseDiagnosisList && changes.diseaseDiagnosisList.currentValue) {
      this.diseaseDiagnosisList = changes.diseaseDiagnosisList.currentValue;
    }
    if (changes && changes.diseaseCauseList && changes.diseaseCauseList.currentValue) {
      this.diseaseCauseList = changes.diseaseCauseList.currentValue;
      if (this.diseaseCauseList && !this.diseaseCauseList.items) {
        this.diseaseCauseList.items = [];
      }
    }
    if (changes.disableEst && changes.disableEst.currentValue) {
      this.disableEst = changes.disableEst.currentValue;
      if(this.disableEst){
        this.disableDeath = true;
      }
    }

  }
  submitDiseaseDetails() {
    this.submit.emit(this.diseaseDetails);
  }
  showCancelTemplate() {
    this.template.emit();
  }
  deathDateChanged() {
    this.diseaseDetailsForm.get('deathDate.gregorian').valueChanges.subscribe(deathDate => {
      if (deathDate !== null) {
        this.deathDate = deathDate;
        this.workDisabilityDate = this.diseaseDetailsForm.get('workDisabilityDate.gregorian').value;
        if (this.workDisabilityDate !== null) {
          if (this.workDisabilityDate > this.deathDate) {
            this.diseaseDetailsForm.get('workDisabilityDate.gregorian').setValue(null);
          }
        }
      }
    });
  }

  selectDiseaseCause(value: BilingualText[]) {
    if (this.diseaseDetailsForm?.get('diseaseCause')?.get('english')?.valid) {
      this.diseaseDetailsForm?.get('diseaseDiagnosis.english').setErrors(null);
      this.diseaseDetailsForm.get('diseaseDiagnosis.english').clearValidators();
    }
    this.selectedDiseaseCause = value;
  }
  clearMandatory() {
    this.diseaseDetailsForm?.get('diseaseCause.english').setErrors(null);
    this.diseaseDetailsForm.get('diseaseCause.english').clearValidators();
  }
  diagnosisDateChange() {
    if (
      this.diseaseDetailsForm.get('diseaseDiagnosisDate').get('gregorian').valueChanges ||
      this.diseaseDetailsForm.get('employerInformedDate').get('gregorian').valueChanges ||
      this.diseaseDetailsForm.get('workDisabilityDate').get('gregorian').valueChanges ||
      this.diseaseDetailsForm.get('contributorInformedDate').get('gregorian').valueChanges
    ) {
      this.diseaseDetailsForm
        .get('diseaseDiagnosisDate')
        .get('gregorian')
        .valueChanges.subscribe(diseaseDate => {
          if (diseaseDate !== null) {
            setTimeout(() => {
              this.contributorDiseaseDate = addDays(moment(diseaseDate).toDate(), 1);
              this.contributorDateDisable = false;
              if (
                this.processType !== ProcessType.MODIFY &&
                this.processType !== ProcessType.EDIT &&
                this.processType !== ProcessType.REOPEN
              ) {
                const diseaseDateValue = new Date(diseaseDate).setHours(0, 0, 0, 0);
                this.currentDate.setHours(0, 0, 0, 0);
                const dateOne = moment(diseaseDateValue);
                const dateTwo = moment(this.currentDate);

                if (!dateOne.isAfter(dateTwo) && !dateOne.isBefore(dateTwo)) {
                  this.diseaseDetailsForm.get('workDisabilityDate').get('gregorian').setValue(diseaseDate);
                  this.diseaseDetailsForm.get('contributorInformedDate').get('gregorian').setValue(diseaseDate);
                  this.diseaseDetailsForm.get('employerInformedDate').get('gregorian').setValue(diseaseDate);
                  this.minContributorDate = diseaseDate;
                  this.workDisabilityDate = diseaseDate;
                  this.contributorDiseaseDate = diseaseDate;
                } else {
                  this.workDisabilityDate = addDays(moment(diseaseDate).toDate(), 1);
                  this.minContributorDate = addDays(moment(diseaseDate).toDate(), 1);
                  this.diseaseDetailsForm
                    .get('workDisabilityDate')
                    .get('gregorian')
                    .patchValue(this.workDisabilityDate);
                  this.diseaseDetailsForm.get('workDisabilityDate').get('gregorian').setValue(startOfDay(this.workDisabilityDate ));
                }
                this.diseaseDetailsForm.updateValueAndValidity();
                this.diseaseDetailsForm.markAsPristine();
              }
            }, 500);
          } else if (diseaseDate === null) {
            this.workDisabilityDate = null;
            this.contributorDateDisable = true;
          }
        });
      this.workDisabilityDateChange();
      this.contributorDateChange();
      this.diseaseDetailsForm
        .get('employerInformedDate')
        .get('gregorian')
        .valueChanges.subscribe(employerInformedDate => {
          this.employerInformedDate = employerInformedDate;
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
    this.diseaseDetailsForm?.get('emergencyContactNo')?.get('isdCodePrimary')?.setValue(prefix);
    return this.diseaseDetailsForm?.get('emergencyContactNo')?.get('isdCodePrimary');
  }
  contributorDateChange() {
    this.diseaseDetailsForm.get('contributorInformedDate.gregorian').valueChanges.subscribe(value => {
      if (value !== null) {
        this.contributorInformedDate = value;
        this.employerDateDisable = false;
        const contribuotrDateValue = new Date(value).setHours(0, 0, 0, 0);
        this.currentDate.setHours(0, 0, 0, 0);
        const dateOne = moment(contribuotrDateValue);
        const dateTwo = moment(this.currentDate);
        if (!dateOne.isAfter(dateTwo) && !dateOne.isBefore(dateTwo)) {
          this.minEmployerDate = addDays(moment(this.contributorInformedDate).toDate(), 0);
        } else {
          this.minEmployerDate = addDays(moment(value).toDate(), 0);
          this.diseaseDetailsForm.get('employerInformedDate').get('gregorian').patchValue(this.employerInformedDate);
        }
      } else {
        this.contributorDateChange();
        this.diseaseDetailsForm.get('employerInformedDate').get('gregorian').patchValue(this.employerInformedDate);
        this.employerDateDisable = true;
      }
    });
  }
  workDisabilityDateChange() {
    this.diseaseDetailsForm.get('workDisabilityDate.gregorian').valueChanges.subscribe(value => {
      if (value !== null) {
        this.contributorDateDisable = false;
        this.workDisabilityDate = value;
        const workDisabilityDateValue = new Date(value).setHours(0, 0, 0, 0);
        this.currentDate.setHours(0, 0, 0, 0);
        const dateOne = moment(workDisabilityDateValue);
        const dateTwo = moment(this.currentDate);
        if (!dateOne.isAfter(dateTwo) && !dateOne.isBefore(dateTwo)) {
          this.minContributorDate = addDays(moment(this.contributorDiseaseDate).toDate(), -1);
        } else {
          this.minContributorDate = addDays(moment(this.contributorDiseaseDate).toDate(), -1);
        }
      } else {
        this.employerDateDisable = true;
      }
    });
  }
  validationCheck() {
    if (this.diseaseDetailsForm) {
      if (this.diseaseDetailsForm.get('diseaseLeadToDeathOfContributor').valueChanges) {
        this.isPersonDead = this.diseaseDetailsForm.get('diseaseLeadToDeathOfContributor').value;
        this.diseaseDetailsForm.get('diseaseLeadToDeathOfContributor').markAsPristine();
        const deathDate = this.diseaseDetailsForm.get('deathDate').get('gregorian');
        if (this.isPersonDead) {
          if (this.routerData.taskId && this.isIndividualApp ) {
            deathDate.setValidators([Validators.required]);
            this.disableDeath = true;
          } else {
            this.addressValidation = true;
            this.enableField(deathDate);
            if (this.workDisabilityDate) {
              this.contributorDiseaseDate = this.workDisabilityDate;
            }
          }
        } else {
          this.addressValidation = false;
          this.deathDate = new Date();
          deathDate.reset();
          this.disableField(deathDate);
        }
        deathDate.updateValueAndValidity();
      }
    }
  }
  // Method to disable form control.
  disableField(formControl: AbstractControl) {
    formControl.setValue(null);
    formControl.disable();
    formControl.clearValidators();
    formControl.markAsPristine();
    formControl.markAsUntouched();
    formControl.updateValueAndValidity();
  }
  // method to enable form control.
  enableField(formControl: AbstractControl) {
    formControl.setValidators([Validators.required]);
    formControl.enable();
    formControl.markAsUntouched();
    formControl.updateValueAndValidity();
  }
}
