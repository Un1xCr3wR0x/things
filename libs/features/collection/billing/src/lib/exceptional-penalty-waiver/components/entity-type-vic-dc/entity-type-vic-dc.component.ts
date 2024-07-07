/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges, OnChanges, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LovList, markFormGroupTouched, BilingualText, CsvFile, AlertService, Lov, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BillingConstants } from '../../../shared/constants/billing-constants';
import { VicSegmentsFilter } from '../../../shared/enums';

@Component({
  selector: 'blg-entity-type-vic-dc',
  templateUrl: './entity-type-vic-dc.component.html',
  styleUrls: ['./entity-type-vic-dc.component.scss']
})
export class EntityTypeVicDcComponent implements OnInit, OnChanges {
  // Local Variable
  exceptionalPenalityWaiverForm: FormGroup;
  optionList: LovList;
  otherReasonFlag: boolean;
  heading: BilingualText;
  segmentsList$: Observable<LovList>;
  isSelected = false;
  segment;
  noSelectionFlag = false;
  bulkFile: CsvFile;
  regex = new RegExp('/^d+$/');
  uploadFailed = false;
  lang = '';
  showProceed = false;
  filteredSin = [];
  exceptionalCsv: File;

  // Input Variable

  @Input() vicSegmentList: Observable<LovList>;
  @Input() penalityWaiverReason: Observable<LovList>;
  @Input() villageList: Observable<LovList>;
  @Input() fieldOfficeList: Observable<LovList>;
  @Input() regionList: Observable<LovList>;
  @Input() regConList: Observable<LovList>;
  @Input() segmentsList: Observable<LovList>;

  // Output Variable
  @Output() verify: EventEmitter<Object> = new EventEmitter();
  @Output() reset: EventEmitter<null> = new EventEmitter();
  @Output() error: EventEmitter<null> = new EventEmitter();
  @Output() segmentListValue: EventEmitter<string> = new EventEmitter();
  @Output() processFileEst: EventEmitter<Object> = new EventEmitter<Object>();
  @Output() processFileVic: EventEmitter<Object> = new EventEmitter<Object>();

  constructor(
    private fb: FormBuilder,
    readonly alertService: AlertService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {}

  ngOnInit(): void {
    const item = [
      {
        value: { english: 'National Identification Number', arabic: 'رقم الهوية الوطنية' },
        sequence: 1
      },
      {
        value: { english: 'Upload file of a customized segment', arabic: 'رفع ملف لفئة مخصصة' },
        sequence: 3
      }
    ];
    this.optionList = new LovList(item);
    this.exceptionalPenalityWaiverForm = this.createVicForm();
    this.language.subscribe(language => {
      this.lang = language;
      this.vicSegmentList = this.sortLovListForVic(this.vicSegmentList, false);
      this.penalityWaiverReason = this.sortLovListForVic(this.penalityWaiverReason, true);
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.penalityWaiverReason?.currentValue) {
      this.penalityWaiverReason = changes?.penalityWaiverReason?.currentValue;
    }
    if (changes?.segmentsList?.currentValue) {
      this.segmentsList = changes?.segmentsList?.currentValue;
    }
    if (changes?.uploadFailed?.currentValue) {
      this.uploadFailed = changes?.uploadFailed?.currentValue;
    }
  }
  verifyDetails() {
    markFormGroupTouched(this.exceptionalPenalityWaiverForm);
    if (this.exceptionalPenalityWaiverForm.get('vicSegment.english').value === 'All') {
      this.exceptionalPenalityWaiverForm.get('selectedSegment.english').clearValidators();
      this.exceptionalPenalityWaiverForm.get('selectedSegment').get('english').reset();
    }
    if (this.exceptionalPenalityWaiverForm.valid) {
      this.verify.emit({
        searchOption:
          this.exceptionalPenalityWaiverForm.get('option.english').value === 'National Identification Number'
            ? 'SIN'
            : 'vicSegmentation',
        sinNo: this.exceptionalPenalityWaiverForm.get('sinNumber').value,
        reason: this.exceptionalPenalityWaiverForm.get('reason').value,
        otherReason: this.exceptionalPenalityWaiverForm.get('ReasonOthers').value,
        vicSegments: this.exceptionalPenalityWaiverForm.get('vicSegment').value,
        segments: this.segment
      });
    } else {
      this.error.emit();
    }
  }
  resetForm() {
    this.reset.emit();
  }
  /**
   * Method to create  form
   */
  createVicForm() {
    return this.fb.group({
      sinNumber: [null, Validators.required],
      vicSegment: this.fb.group({
        english: [null],
        arabic: []
      }),
      selectedSegment: this.fb.group({
        english: [null],
        arabic: []
      }),
      reason: this.fb.group({
        english: [null, Validators.required],
        arabic: []
      }),
      ReasonOthers: [null],
      option: this.fb.group({
        english: ['National Identification Number', { validators: Validators.required }],
        arabic: [null],
        updateOn: 'blur'
      })
    });
  }

  /** Method to get other reason   */

  otherValueSelect() {
    const otherField = this.exceptionalPenalityWaiverForm.get('reason').get('english');
    if (otherField.value === 'Other') {
      this.otherReasonFlag = true;
      this.exceptionalPenalityWaiverForm
        .get('ReasonOthers')
        .setValidators([Validators.required, Validators.maxLength(200)]);
    } else if (otherField.value !== 'Other') {
      this.otherReasonFlag = false;
      this.exceptionalPenalityWaiverForm.get('ReasonOthers').reset();
      this.exceptionalPenalityWaiverForm.get('ReasonOthers').setValidators(null);
      this.exceptionalPenalityWaiverForm.get('ReasonOthers').updateValueAndValidity();
    }
  }
  /** Method to select list based on vic search condition  */
  selectedVicSegmentOptions() {
    const value = this.exceptionalPenalityWaiverForm.get('vicSegment').value;
    this.exceptionalPenalityWaiverForm.get('selectedSegment').reset();
    this.heading = value;
    switch (value.english) {
      case VicSegmentsFilter.CITY:
        {
          this.segmentListValue.emit('village-district');
        }
        break;
      case VicSegmentsFilter.FIELD_OFFICE:
        {
          this.segmentListValue.emit('fieldOffice');
        }
        break;
      case VicSegmentsFilter.REGION:
        {
          this.segmentListValue.emit('region');
        }
        break;
      case VicSegmentsFilter.REG_CONTR_PURPOSE:
        {
          this.segmentListValue.emit('Purpose of Registration');
        }
        break;
    }
  }
  selectedValue(value) {
    this.segment = value;
  }
  selectValue(value) {
    if (value === 'National Identification Number') this.isSelected = true;
  }
  optionSelected(val) {
    if (val === 'National Identification Number') {
      this.exceptionalPenalityWaiverForm.get('ReasonOthers').reset();
      this.otherReasonFlag = false;
      this.exceptionalPenalityWaiverForm.get('sinNumber').reset();
      this.exceptionalPenalityWaiverForm.get('sinNumber').setValidators(Validators.required);
      this.exceptionalPenalityWaiverForm.get('vicSegment').get('english').clearValidators();
      this.exceptionalPenalityWaiverForm.get('selectedSegment').get('english').clearValidators();
      this.exceptionalPenalityWaiverForm.get('vicSegment').get('english').reset();
      this.exceptionalPenalityWaiverForm.get('selectedSegment').get('english').reset();
    }
    if (val === 'Segmentation Criterion') {
      this.exceptionalPenalityWaiverForm.get('ReasonOthers').reset();
      this.otherReasonFlag = false;
      this.exceptionalPenalityWaiverForm.get('sinNumber').reset();
      this.exceptionalPenalityWaiverForm.get('sinNumber').clearValidators();
      this.exceptionalPenalityWaiverForm.get('vicSegment').get('english').reset();
      if (this.exceptionalPenalityWaiverForm.get('vicSegment').get('english').value !== 'All') {
        this.exceptionalPenalityWaiverForm.get('vicSegment').get('english').setValidators(Validators.required);
      }
      this.exceptionalPenalityWaiverForm.get('selectedSegment').reset();
      this.exceptionalPenalityWaiverForm.get('selectedSegment').get('english').setValidators(Validators.required);
    }
    this.exceptionalPenalityWaiverForm.get('vicSegment').get('english').updateValueAndValidity();
    this.exceptionalPenalityWaiverForm.get('sinNumber').updateValueAndValidity();
    this.exceptionalPenalityWaiverForm.get('selectedSegment').updateValueAndValidity();
    this.exceptionalPenalityWaiverForm.get('reason').reset();
  }
  /** Method to process csv file. */
  processCSV(file: File) {
    if (file) {
      this.showProceed = true;
      this.exceptionalCsv = file;
      this.alertService.clearAllErrorAlerts();
      this.exceptionalCsv = file;
      this.uploadFailed = false;
      this.filteredSin = [];
      this.showProceed = true;
      const reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        const csv = reader.result;
        const csvData = (<string>csv).split(/\r\n|\n/);
        for (const val of csvData) {
          val.trim();
          if (val != null && val !== '' && val !== undefined && val.length > 0) {
            if (!isNaN(Number(val))) {
              this.filteredSin.push(val);
            } else {
              this.alertService.showErrorByKey(BillingConstants.INVALID_FILE_CONTENT);
              this.uploadFailed = true;
              break;
            }
          }
        }
      };
    }
  }
  verifyVicCsvDetails() {
    if (this.exceptionalPenalityWaiverForm.get('reason').valid) {
      if (this.filteredSin.length > 0) {
        if (!this.uploadFailed) {
          this.exceptionalPenalityWaiverForm.get('reason').markAllAsTouched();
          if (this.otherReasonFlag) {
            this.exceptionalPenalityWaiverForm.get('ReasonOthers').markAllAsTouched();
            if (this.exceptionalPenalityWaiverForm.get('ReasonOthers').valid) {
              this.processFileVic.emit({
                reason: this.exceptionalPenalityWaiverForm.get('reason').value,
                otherReason: this.exceptionalPenalityWaiverForm.get('ReasonOthers').value,
                fileContent: this.filteredSin
              });
            } else {
              this.alertService.showMandatoryErrorMessage();
            }
          } else {
            if (this.exceptionalPenalityWaiverForm.get('reason').valid) {
              this.processFileVic.emit({
                reason: this.exceptionalPenalityWaiverForm.get('reason').value,
                fileContent: this.filteredSin
              });
            } else {
              this.alertService.showMandatoryErrorMessage();
            }
          }
        }
      } else {
        this.alertService.showErrorByKey(BillingConstants.EMPTY_CSV_ERROR);
        this.uploadFailed = true;
      }
    } else {
      this.exceptionalPenalityWaiverForm.get('reason').markAllAsTouched();
      this.uploadFailed = true;
      this.error.emit();
    }
  }
  deleteCsv(isDeleted) {
    if (isDeleted) this.filteredSin = [];
  }
  /** Method to handle Csv upload. */
  handleCsvUpload() {}

  // Method used to sort the lov list values for Vic Entity
  sortLovListForVic(list: Observable<LovList>, isOtherFlag: boolean) {
    if (list) {
      return list.pipe(
        map(res => {
          if (res) {
            return this.sortLovListsForVicEntity(res, isOtherFlag, this.lang);
          }
        })
      );
    }
  }
  // Method used to sort the lov list values
  sortLovListsForVicEntity(lovList: LovList, isOtherFlag: boolean, lang: string) {
    let otherValue: Lov;
    let otherExcludedList: Lov[];
    if (isOtherFlag) {
      otherValue = lovList.items.filter(item => BillingConstants.OTHER_LIST.indexOf(item.value.english) !== -1)[0];
      otherExcludedList = lovList.items.filter(item => BillingConstants.OTHER_LIST.indexOf(item.value.english) === -1);
      lovList.items = this.sortItemsForVicEntity(otherExcludedList, lang);
      lovList.items.push(otherValue);
    } else {
      lovList.items = this.sortItemsForVicEntity(lovList.items, lang);
    }
    return { ...lovList };
  }
  // Method used to sort the lov list values based on language selected
  sortItemsForVicEntity(list: Lov[], lang: string) {
    if (lang === 'en') {
      list.sort((a, b) =>
        a.value.english.toLowerCase().replace(/\s/g, '').localeCompare(b.value.english.toLowerCase().replace(/\s/g, ''))
      );
    } else {
      list.sort((a, b) => a.value.arabic.localeCompare(b.value.arabic));
    }

    return list;
  }
}
