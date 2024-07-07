import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CalendarTypeEnum, LanguageToken, LovList, markFormGroupTouched } from '@gosi-ui/core';
import moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { ContributorConstants } from '../../../shared';
import { Coverage, ModifyCoverage, ModifyEngagementPeriod } from '../../../shared/models';
import { CoveragePeriodWrapper } from '../../../shared/models/coverage-period-wrapper';
import { EngagementPeriod } from '../../../shared/models/engagement-period';
import { ContributorService } from '../../../shared/services/contributor.service';

@Component({
  selector: 'cnt-modify-coverage-dc',
  templateUrl: './modify-coverage-dc.component.html',
  styleUrls: ['./modify-coverage-dc.component.scss']
})
export class ModifyCoverageDcComponent implements OnInit, OnChanges {
  lang: string;
  coverageDetails: Coverage[] = [];
  modifyCoverageForm: FormGroup;
  isCoverageChanged = false;
  edit = false;
  isModified = false;
  modifyCoveragePeriod: ModifyEngagementPeriod = new ModifyEngagementPeriod();
  isDisable = false;

  isTotalShare = true;
  startdate: any;
  enddate: any;
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    public fb: FormBuilder,
    private contributorService: ContributorService
  ) {
    this.language.subscribe((lan: string) => {
      this.lang = lan;
    });
  }

  @Input() selectedPeriod: EngagementPeriod;
  @Input() coveragePeriod: CoveragePeriodWrapper;
  @Input() newCoverages: LovList;
  @Input() reasonForChange: LovList;
  @Input() parentForm: FormGroup;
  @Input() periodIndex: number;
  @Input() tempCoverageModify: ModifyCoverage;
  @Input() coverageEdited = false;
  @Input() tempModifyCoveragePeriod: ModifyCoverage;
  @Input() isPrevious: boolean;
  @Input() isHijiri: boolean;
  @Input() validatorEdit: boolean;
  @Input() formSubmissionDate: Date;
  @Output() modifyCoverage: EventEmitter<boolean> = new EventEmitter();
  @Output() modifyCoverageDate: EventEmitter<object> = new EventEmitter();
  @Output() saveModifyCoverage: EventEmitter<boolean> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();

  ngOnInit(): void {
    this.modifyCoverageForm = this.createWageDetailsForm();
    if (this.tempCoverageModify?.engagementPeriods.length !== 0) this.setTempCoverageValues();
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedPeriod && changes.selectedPeriod.currentValue) {
      this.setCoverage(changes.selectedPeriod.currentValue);
      if (this.tempCoverageModify?.engagementPeriods?.length !== 0) this.setTempCoverageValues();
    }
    if (changes.coverageEdited && (changes.coverageEdited.previousValue || changes.coverageEdited.currentValue)) {
      this.setTempCoverageValues();
    }
    if (changes.tempCoverageModify && changes.tempCoverageModify.currentValue) {
      this.setTempCoverageValues();
    }
    if (changes.reasonForChange && changes.reasonForChange.currentValue) {
      if (moment(this.formSubmissionDate).isAfter('2022-02-21')) {
        if (this.selectedPeriod.startDate.entryFormat === CalendarTypeEnum.GREGORIAN) {
          this.reasonForChange.items = this.reasonForChange.items.filter(
            item => item.value.english === ContributorConstants.WITH_COLLECTION
          );
        }
      }
    }
    if (changes.tempCoverageModify && changes.tempCoverageModify.currentValue) {
      this.setTempCoverageValues();
    }
  }
  setTempCoverageValues() {
    this.tempCoverageModify.engagementPeriods.forEach(res => {
      if (this.selectedPeriod.id === res.engagementWageCoverageId) {
        this.modifyCoverageForm = this.createWageDetailsForm();
        this.setCoverageValidator();
        this.modifyCoverageForm.get('modifyCoverages').setValue(true);
        this.modifyCoverageForm.get('modifyCoverage').get('coverages').patchValue(res.coverages);
        this.modifyCoverageForm
          .get('modifyCoverage')
          .get('reasonForChange')
          .patchValue(res.reasonForCoverageModification);
        //  if (this.parentForm.get('modifiedCoverage')) {
        //   this.parentForm.removeControl('modifiedCoverage');
        // }
        this.parentForm.addControl('modifiedCoverage', this.modifyCoverageForm);
        this.modifyCoveragePeriod = res;
        this.isCoverageChanged = true;
        this.isModified = true;
      }
    });
  }
  setCoverage(engagement: EngagementPeriod): void {
    engagement.coverages = [];
    this.coveragePeriod?.periods.forEach(covType => {
      if (covType.startDate.gregorian === engagement.startDate.gregorian) {
        covType.coverages.forEach(perCov => {
          engagement.coverageType.forEach(res => {
            if (res.english === perCov.coverageType.english) {
              this.coverageDetails.push(perCov);
              this.contributorService.setCurrentEngagmentCoverage = this.coverageDetails;
              engagement.coverages.push(perCov);
              if (engagement.startDate.entryFormat === 'HIJIRA') this.isDisable = true;
              else this.isDisable = false;
            }
          });
        });
      }
    });
  }
  /**
   * This method is used to create wage details form
   */
  createWageDetailsForm(): FormGroup {
    return this.fb.group({
      modifyCoverages: [null],
      modifyCoverage: this.fb.group({
        coverages: this.fb.group({
          english: [null],
          arabic: [null]
        }),
        reasonForChange: this.fb.group({
          english: [null],
          arabic: [null]
        })
      })
    });
  }
  editIconClick() {
    this.edit = true;
    this.isModified = false;
    this.modifyCoveragePeriod.modified = false;
    this.isCoverageChanged = true;
    this.modifyCoverageForm.get('modifyCoverage').get('coverages').patchValue(this.modifyCoveragePeriod.coverages);
    this.modifyCoverageForm
      .get('modifyCoverage')
      .get('reasonForChange')
      .patchValue(this.modifyCoveragePeriod.reasonForCoverageModification);
    this.modifyCoverage.emit(this.isCoverageChanged);

    //to pass start date and end date in query param
    this.startdate = this.selectedPeriod.startDate;
    this.enddate = this.selectedPeriod.endDate;
    if (this.startdate !== '') {
      this.modifyCoverageDate.emit({
        startdate: this.startdate,
        enddate: this.enddate
      });
    }
  }
  coverageChange() {
    this.edit = true;
    if (this.modifyCoverageForm.get('modifyCoverages').value === false) {
      this.tempCoverageModify.engagementPeriods = this.tempCoverageModify.engagementPeriods.filter(
        item => item.engagementWageCoverageId !== this.selectedPeriod.id
      );
      this.modifyCoveragePeriod.modified = false;
      this.modifyCoveragePeriod = new ModifyEngagementPeriod();
      this.setTempCoverageValues();
      this.modifyCoverageForm.get('modifyCoverages').setValue(false);
      this.modifyCoverageForm.get('modifyCoverage').get('coverages').reset();
      this.modifyCoverageForm.get('modifyCoverage').get('reasonForChange').reset();
      this.modifyCoverageForm.get('modifyCoverage').get('coverages').get('english').setValidators(null);
      this.modifyCoverageForm.get('modifyCoverage').get('coverages').get('english').updateValueAndValidity();
      this.modifyCoverageForm.get('modifyCoverage').get('reasonForChange').get('english').setValidators(null);
      this.modifyCoverageForm.get('modifyCoverage').get('reasonForChange').get('english').updateValueAndValidity();
      this.isCoverageChanged = false;
      this.isModified = false;
    } else {
      this.isCoverageChanged = true;
      this.setCoverageValidator();
    }

    if (this.parentForm.get('modifiedCoverage')) {
      this.parentForm.removeControl('modifiedCoverage');
    }
    this.parentForm.addControl('modifiedCoverage', this.modifyCoverageForm);
    //to pass start date and end date in query param
    this.startdate = this.selectedPeriod.startDate;
    this.enddate = this.selectedPeriod.endDate;
    if (this.startdate !== '') {
      this.modifyCoverageDate.emit({
        startdate: this.startdate,
        enddate: this.enddate
      });
    }
    this.modifyCoverage.emit(this.isCoverageChanged);
  }
  setCoverageValidator() {
    this.modifyCoverageForm.get('modifyCoverage').get('coverages').get('english').setValidators(Validators.required);
    this.modifyCoverageForm.get('modifyCoverage').get('coverages').get('english').updateValueAndValidity();
    this.modifyCoverageForm
      .get('modifyCoverage')
      .get('reasonForChange')
      .get('english')
      .setValidators(Validators.required);
    this.modifyCoverageForm.get('modifyCoverage').get('reasonForChange').get('english').updateValueAndValidity();
  }
  cancelPeriodEdit() {
    this.edit = false;
    this.tempCoverageModify.engagementPeriods.forEach(res => {
      if (this.modifyCoveragePeriod.engagementWageCoverageId !== res.engagementWageCoverageId)
        this.modifyCoverageForm.reset();
    });
    if (!this.modifyCoveragePeriod.engagementWageCoverageId) {
      this.modifyCoverageForm.reset();
      this.modifyCoverageForm.get('modifyCoverage').get('coverages').get('english').setValidators(null);
      this.modifyCoverageForm.get('modifyCoverage').get('coverages').get('english').updateValueAndValidity();
      this.modifyCoverageForm.get('modifyCoverage').get('reasonForChange').get('english').setValidators(null);
      this.modifyCoverageForm.get('modifyCoverage').get('reasonForChange').get('english').updateValueAndValidity();
    } else {
      this.modifyCoveragePeriod.modified = true;
    }
    this.setTempCoverageValues();

    this.cancel.emit();
  }
  saveWageChanges() {
    if (this.coverageEdited) this.coverageEdited = false;
    else this.coverageEdited = true;
    if (this.modifyCoverageForm.valid) {
      this.edit = false;
      this.isModified = true;
    } else this.edit = true;
    markFormGroupTouched(this.modifyCoverageForm);
    if (this.parentForm.get('modifiedCoverage')) {
      this.parentForm.removeControl('modifiedCoverage');
    }
    this.parentForm.addControl('modifiedCoverage', this.modifyCoverageForm);
    if (this.modifyCoverageForm.valid) {
      this.modifyCoveragePeriod.coverages = this.modifyCoverageForm.get('modifyCoverage').get('coverages').value;
      this.modifyCoveragePeriod.reasonForCoverageModification = this.modifyCoverageForm
        .get('modifyCoverage')
        .get('reasonForChange').value;
    }
    this.saveModifyCoverage.emit(this.coverageEdited);
  }
}
