/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter, OnChanges, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LovList, markFormGroupTouched, BilingualText, CsvFile, AlertService, Lov, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BillingConstants } from '../../../shared/constants/billing-constants';
import { EstablishemntSegmentsFilter } from '../../../shared/enums';

@Component({
  selector: 'blg-entity-type-establishment-dc',
  templateUrl: './entity-type-establishment-dc.component.html',
  styleUrls: ['./entity-type-establishment-dc.component.scss']
})
export class EntityTypeEstablishmentDcComponent implements OnInit, OnChanges {
  exceptionalPenaltyWaiverForm: FormGroup;
  MAX_LENGTH = 15;
  lang = '';
  optionList: LovList;
  heading: BilingualText;
  // selectedSegmentOptions: string[] = [];
  bulkFile: CsvFile;
  otherReasonsFlag = false;
  isselected = false;
  segmentsSelected;
  uploadFailed = false;
  regex = new RegExp('^[0-9]+$');
  showProceed = false;
  exceptionalCsv: File;
  filteredRegNumber = [];
  /** Observables */

  @Input() penalityWaiverReason: Observable<LovList>;
  @Input() establishmentSegmentList: Observable<LovList>;
  @Input() segmentsList: Observable<LovList>;

  /** Output event emitters. */
  @Output() verify: EventEmitter<Object> = new EventEmitter();
  @Output() reset: EventEmitter<null> = new EventEmitter();
  @Output() error: EventEmitter<null> = new EventEmitter();
  @Output() segmentListValue: EventEmitter<string> = new EventEmitter();
  @Output() processFileEst: EventEmitter<Object> = new EventEmitter<File>();
  @Output() processFileVic: EventEmitter<Object> = new EventEmitter<File>();

  constructor(
    private fb: FormBuilder,
    readonly alertService: AlertService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.penalityWaiverReason?.currentValue) {
      this.penalityWaiverReason = changes?.penalityWaiverReason?.currentValue;
    }
    if (changes?.segmentsList?.currentValue) {
      this.segmentsList = changes?.segmentsList?.currentValue;
      this.segmentsList = this.sortLovList(this.segmentsList, false);
    }
  }

  ngOnInit(): void {
    const item = [
      {
        value: { english: 'Registration Number', arabic: 'رقم اشتراك المنشأة' },
        sequence: 1
      },
      {
        value: { english: 'Upload file of a customized segment', arabic: 'رفع ملف لفئة مخصصة' },
        sequence: 3
      }
    ];
    this.optionList = new LovList(item);
    this.exceptionalPenaltyWaiverForm = this.createSearchSaudiForm();
    this.language.subscribe(language => {
      this.lang = language;
      this.establishmentSegmentList = this.sortLovList(this.establishmentSegmentList, false);
      this.penalityWaiverReason = this.sortLovList(this.penalityWaiverReason, true);
      this.segmentsList = this.sortLovList(this.segmentsList, false);
    });
  }
  verifyDetails() {
    markFormGroupTouched(this.exceptionalPenaltyWaiverForm);
    if (this.exceptionalPenaltyWaiverForm.get('estSegment.english').value === 'All') {
      this.exceptionalPenaltyWaiverForm.get('selectedtSegment.english').clearValidators();
      this.exceptionalPenaltyWaiverForm.get('selectedtSegment').get('english').reset();
    }
    if (this.exceptionalPenaltyWaiverForm.valid) {
      this.verify.emit({
        searchOption:
          this.exceptionalPenaltyWaiverForm.get('option.english').value === 'Registration Number'
            ? 'registration'
            : 'segmentation',
        regNo: this.exceptionalPenaltyWaiverForm.get('regNumber').value,
        reason: this.exceptionalPenaltyWaiverForm.get('reason').value,
        otherReason: this.exceptionalPenaltyWaiverForm.get('ReasonOthers').value,
        establishmentSegments: this.exceptionalPenaltyWaiverForm.get('estSegment').value,
        segments: this.segmentsSelected
      });
    } else {
      this.error.emit();
    }
  }
  resetForm() {
    this.reset.emit();
  }
  deleteCsv(isDeleted) {
    if (isDeleted) this.filteredRegNumber = [];
  }
  /**
   * Method to create form
   */
  createSearchSaudiForm() {
    return this.fb.group({
      regNumber: [null, Validators.required],
      estSegment: this.fb.group({
        english: [null],
        arabic: []
      }),
      selectedtSegment: this.fb.group({
        english: [null],
        arabic: [null]
      }),
      option: this.fb.group({
        english: ['Registration Number', { validators: Validators.required }],
        arabic: [null],
        updateOn: 'blur'
      }),
      reason: this.fb.group({
        english: [null, Validators.required],
        arabic: []
      }),
      ReasonOthers: [null]
    });
  }

  selectedSegmentOptions() {
    const value = this.exceptionalPenaltyWaiverForm.get('estSegment').value;
    this.exceptionalPenaltyWaiverForm.get('selectedtSegment').reset();
    this.heading = value;

    switch (value.english) {
      case EstablishemntSegmentsFilter.CITY:
        {
          this.segmentListValue.emit('village-district');
        }
        break;
      case EstablishemntSegmentsFilter.NATIONALITY:
        {
          this.segmentListValue.emit('nationality');
        }
        break;
      case EstablishemntSegmentsFilter.FILED_OFFICE:
        {
          this.segmentListValue.emit('fieldOffice');
        }
        break;
      case EstablishemntSegmentsFilter.FLAG_TYPE:
        {
          this.segmentListValue.emit('flag-type');
        }
        break;
      case EstablishemntSegmentsFilter.SECTOR:
        {
          this.segmentListValue.emit('activity-type');
        }
        break;
      case EstablishemntSegmentsFilter.REGION:
        {
          this.segmentListValue.emit('region');
        }
        break;

      case EstablishemntSegmentsFilter.SAUDI_LEGAL_ENTITY:
        {
          this.segmentListValue.emit('saudi');
        }
        break;
      case EstablishemntSegmentsFilter.GCC_LEGAL_ENTITY:
        {
          this.segmentListValue.emit('saudi');
        }
        break;
      case EstablishemntSegmentsFilter.PAYMENT_TYPE:
        {
          this.segmentListValue.emit('paymentType');
        }
        break;
      case EstablishemntSegmentsFilter.INSTALLMENT_STATUS:
        {
          this.segmentListValue.emit('installment');
        }
        break;
      case EstablishemntSegmentsFilter.VIOLATION:
        {
          this.segmentListValue.emit('violationRecord');
        }
        break;
      case EstablishemntSegmentsFilter.ALL:
        {
          this.segmentListValue.emit('all');
        }
        break;
    }
  }
  selectedValue(evt) {
    this.segmentsSelected = evt;
  }
  selectValues(value) {
    if (value === 'Registration Number') {
      this.exceptionalPenaltyWaiverForm.get('ReasonOthers').reset();
      this.otherReasonsFlag = false;
      this.exceptionalPenaltyWaiverForm.get('regNumber').reset();
      this.exceptionalPenaltyWaiverForm.get('regNumber').setValidators(Validators.required);
      this.exceptionalPenaltyWaiverForm.get('estSegment').get('english').clearValidators();
      this.exceptionalPenaltyWaiverForm.get('selectedtSegment').get('english').clearValidators();
      this.exceptionalPenaltyWaiverForm.get('estSegment').get('english').reset();
      this.exceptionalPenaltyWaiverForm.get('selectedtSegment').get('english').reset();
    }
    if (value === 'Segmentation Criterion') {
      this.exceptionalPenaltyWaiverForm.get('ReasonOthers').reset();
      this.otherReasonsFlag = false;
      this.exceptionalPenaltyWaiverForm.get('regNumber').reset();
      this.exceptionalPenaltyWaiverForm.get('regNumber').clearValidators();
      this.exceptionalPenaltyWaiverForm.get('estSegment').get('english').reset();
      this.exceptionalPenaltyWaiverForm.get('estSegment').get('english').setValidators(Validators.required);
      this.exceptionalPenaltyWaiverForm.get('selectedtSegment').reset();
      this.exceptionalPenaltyWaiverForm.get('selectedtSegment').get('english').setValidators(Validators.required);
    }
    this.exceptionalPenaltyWaiverForm.get('estSegment').get('english').updateValueAndValidity();
    this.exceptionalPenaltyWaiverForm.get('regNumber').updateValueAndValidity();
    this.exceptionalPenaltyWaiverForm.get('selectedtSegment').updateValueAndValidity();
    this.exceptionalPenaltyWaiverForm.get('reason').reset();
  }
  verifyCsvDetails() {
    if (this.exceptionalPenaltyWaiverForm.get('reason').valid) {
      if (this.filteredRegNumber.length > 0) {
        if (!this.uploadFailed) {
          this.exceptionalPenaltyWaiverForm.get('reason').markAllAsTouched();
          if (this.otherReasonsFlag) {
            this.exceptionalPenaltyWaiverForm.get('ReasonOthers').markAllAsTouched();
            if (this.exceptionalPenaltyWaiverForm.get('ReasonOthers').valid) {
              this.processFileEst.emit({
                reason: this.exceptionalPenaltyWaiverForm.get('reason').value,
                otherReason: this.exceptionalPenaltyWaiverForm.get('ReasonOthers').value,
                fileContent: this.filteredRegNumber
              });
            } else {
              this.alertService.showMandatoryErrorMessage();
            }
          } else {
            if (this.exceptionalPenaltyWaiverForm.get('reason').valid) {
              this.processFileEst.emit({
                reason: this.exceptionalPenaltyWaiverForm.get('reason').value,
                fileContent: this.filteredRegNumber
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
      this.exceptionalPenaltyWaiverForm.get('reason').markAllAsTouched();
      this.uploadFailed = true;
      this.error.emit();
    }
  }
  /** Method to process csv file. */
  processCSVFile(file: File) {
    if (file) {
      this.showProceed = true;
      this.exceptionalCsv = file;
      this.alertService.clearAllErrorAlerts();
      this.uploadFailed = false;
      this.filteredRegNumber = [];
      const reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        const csvFile = reader.result;
        const csvRegNumber = (<string>csvFile).split(/\r\n|\n/);
        for (const el of csvRegNumber) {
          el.trim();
          if (el != null && el !== '' && el !== undefined && el.length > 0) {
            if (!isNaN(Number(el))) {
              this.filteredRegNumber.push(el);
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

  /** Method to get other reason   */

  otherValueSelected() {
    const otherFields = this.exceptionalPenaltyWaiverForm.get('reason').get('english');
    if (otherFields.value === 'Other') {
      this.otherReasonsFlag = true;
      this.exceptionalPenaltyWaiverForm
        .get('ReasonOthers')
        .setValidators([Validators.required, Validators.maxLength(200)]);
    } else if (otherFields.value !== 'Other') {
      this.otherReasonsFlag = false;
      this.exceptionalPenaltyWaiverForm.get('ReasonOthers').reset();
      this.exceptionalPenaltyWaiverForm.get('ReasonOthers').setValidators(null);
      this.exceptionalPenaltyWaiverForm.get('ReasonOthers').updateValueAndValidity();
    }
  }
  /** Method to handle Csv upload. */
  handleCsvUpload() {}
  // Method used to sort the lov list values based on language
  sortLovList(list: Observable<LovList>, otherFlag: boolean) {
    if (list) {
      return list.pipe(
        map(res => {
          if (res) {
            return this.sortLovListForEst(res, otherFlag, this.lang);
          }
        })
      );
    }
  }
  // Method used to sort the lov list values
  sortLovListForEst(lovList: LovList, otherFlag: boolean, lang: string) {
    let otherList: Lov;
    let newOtherExcludedList: Lov[];
    if (otherFlag) {
      otherList = lovList.items.filter(item => BillingConstants.OTHER_LIST.indexOf(item.value.english) !== -1)[0];
      newOtherExcludedList = lovList.items.filter(
        item => BillingConstants.OTHER_LIST.indexOf(item.value.english) === -1
      );
      lovList.items = this.sortItemsForEstablishment(newOtherExcludedList, lang);
      lovList.items.push(otherList);
    } else {
      lovList.items = this.sortItemsForEstablishment(lovList.items, lang);
    }
    return { ...lovList };
  }
  // Method used to sort the lov list values based on language
  sortItemsForEstablishment(list: Lov[], lang: string) {
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
