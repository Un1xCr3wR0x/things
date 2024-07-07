/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Directive, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CalendarTypeEnum, convertToStringDDMMYYYY, LovList } from '@gosi-ui/core';

@Directive()
export class ContactFormDcHelper {
  @Output() IBAN: EventEmitter<string> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  contractDetailsForm: FormGroup;
  contractTypeList: LovList = new LovList([]);
  items = [
    { sequence: 1, code: 1001, value: { arabic: 'في اليوم ', english: 'Per Day' } },
    { sequence: 2, code: 1002, value: { arabic: 'في الاسبوع', english: 'Per Week' } }
  ];
  annualLeaveItems = [
    { sequence: 1, value: { arabic: 'أيام العمل', english: 'Work Days' } },
    { sequence: 2, value: { arabic: 'أيام التقويم', english: 'Calendar Days' } }
  ];
  tempList: LovList;
  annualLeaveList: LovList;
  monthItem = [];
  yearItem = [];
  minYear = 0;
  maxYear = 25;
  minMonth = 0;
  maxMonth = 11;
  monthList: LovList = new LovList([]);
  yearList: LovList = new LovList([]);

  typeGregorian = CalendarTypeEnum.GREGORIAN;
  typeHijira = CalendarTypeEnum.HIJRI;

  constructor(protected fb: FormBuilder) {
    this.contractDetailsForm = this.createContractDetailsForm();
    this.detectFormChange();
  }
  /**
   * This method is to create ContractDetailsForm and initialize
   *
   * @memberof ContributorPersonalDetailsDcComponent
   */
  createContractDetailsForm() {
    return this.fb.group({
      dateFormat: this.fb.group({
        english: [this.typeGregorian, { validators: Validators.required, updateOn: 'blur' }],
        arabic: [this.typeHijira]
      }),
      contractType: this.fb.group({
        english: [null, { validators: Validators.required, updateOn: 'blur' }],
        arabic: null
      }),
      startDate: this.fb.group({
        gregorian: [
          null,
          {
            validators: Validators.compose([Validators.required])
          }
        ],
        hijiri: [null, {}]
      }),
      workDetails: this.fb.group({
        annualLeaveInDays: [
          null,
          {
            validators: Validators.compose([Validators.required, Validators.min(21), Validators.max(366)]),
            updateOn: 'blur'
          }
        ],
        annualLeaveStandard: this.fb.group({
          english: [
            'Calendar Days',
            {
              validators: Validators.compose([Validators.required, Validators.min(21), Validators.max(366)]),
              updateOn: 'blur'
            }
          ],
          arabic: 'أيام التقويم'
        }),
        jobTitle: this.fb.group({
          english: [
            null,
            {
              validators: Validators.compose([Validators.required, Validators.pattern('[^0-9]+')]),
              updateOn: 'blur'
            }
          ],
          arabic: [
            '',
            {
              validators: Validators.compose([Validators.required, Validators.pattern('[^0-9]+')]),
              updateOn: 'blur'
            }
          ]
        }),
        location: this.fb.group({
          english: [null, { validators: Validators.required, updateOn: 'blur' }],
          arabic: null
        }),
        probationPeriodInDays: [
          null,
          {
            validators: Validators.compose([Validators.max(90)]),
            updateOn: 'blur'
          }
        ],
        restDaysPerWeek: [
          { value: null, disabled: true },
          { validators: Validators.required, updateOn: 'blur' }
        ],
        transportationAllowance: [
          null,
          {
            validators: Validators.compose([Validators.min(0)])
          }
        ],
        workingDays: [null, { validators: Validators.required, updateOn: 'blur' }],
        noticePeriod: [
          '90',
          {
            validators: Validators.compose([Validators.min(0), Validators.max(120)]),
            updateOn: 'blur'
          }
        ],
        workingHoursStandard: this.fb.group({
          english: [
            'Per Day',
            {
              validators: Validators.compose([Validators.required, Validators.pattern('[^0-9]+')]),
              updateOn: 'blur'
            }
          ],
          arabic: 'في اليوم'
        }),
        workingHrs: [
          null,
          {
            validators: Validators.compose([Validators.required, Validators.min(1), Validators.max(8)]),
            updateOn: 'blur'
          }
        ]
      }),
      authorisedSignatory: this.fb.group({
        name: this.fb.group({
          english: [
            null,
            {
              validators: Validators.compose([Validators.required, Validators.pattern('[^0-9]+')]),
              updateOn: 'blur'
            }
          ],
          arabic: [
            '',
            {
              validators: Validators.compose([Validators.required, Validators.pattern('[^0-9]+')]),
              updateOn: 'blur'
            }
          ]
        }),
        role: this.fb.group({
          english: [
            null,
            {
              validators: Validators.compose([Validators.required, Validators.pattern('[^0-9]+')]),
              updateOn: 'blur'
            }
          ],
          arabic: [
            '',
            {
              validators: Validators.compose([Validators.required, Validators.pattern('[^0-9]+')]),
              updateOn: 'blur'
            }
          ]
        })
      })
    });
  }
  /**Method to switch between calender */
  detectFormChange() {
    if (this.contractDetailsForm) {
      this.contractDetailsForm.get('dateFormat').valueChanges.subscribe(calender => {
        if (calender.english === this.typeGregorian) {
          this.contractDetailsForm.get('startDate.gregorian').setValidators([Validators.required]);
          this.contractDetailsForm.get('startDate.hijiri').reset();
          this.contractDetailsForm.get('startDate.hijiri').clearValidators();
        } else {
          this.contractDetailsForm.get('startDate.hijiri').setValidators([Validators.required]);
          this.contractDetailsForm.get('startDate.gregorian').reset();
          this.contractDetailsForm.get('startDate.gregorian').clearValidators();
        }
        this.contractDetailsForm.get('startDate.gregorian').updateValueAndValidity();
        this.contractDetailsForm.get('startDate.hijiri').updateValueAndValidity();
      });
    }
  }
  /** Method to update contract form */
  updateContractDetailsForm(pendingContract) {
    this.contractDetailsForm.get('dateFormat').setValue(
      {
        english: pendingContract?.dateFormat === 'G' ? this.typeGregorian : this.typeHijira,
        arabic: pendingContract?.dateFormat === 'H' ? this.typeHijira : this.typeGregorian
      },
      { emitEvent: false }
    );
    this.contractDetailsForm.patchValue({
      contractType: this.setContractType(pendingContract),
      startDate: {
        gregorian: new Date(pendingContract?.startDate?.gregorian),
        hijiri: convertToStringDDMMYYYY(pendingContract?.startDate?.hijiri)
      },
      workDetails: {
        annualLeaveInDays: pendingContract?.workDetails?.annualLeaveInDays,
        annualLeaveStandard: pendingContract?.workDetails?.annualLeaveStandard,
        noticePeriod: pendingContract?.workDetails?.noticePeriod,
        jobTitle: {
          english: pendingContract?.workDetails?.jobTitle?.english,
          arabic: pendingContract?.workDetails?.jobTitle?.arabic
        },
        probationPeriodInDays: pendingContract?.workDetails?.probationPeriodInDays,
        restDaysPerWeek: (7 - pendingContract?.workDetails?.workingDays).toString(),
        transportationAllowance: pendingContract?.workDetails?.transportationAllowance,
        workingDays: pendingContract?.workDetails?.workingDays.toString(),
        workingHoursStandard: pendingContract?.workDetails?.workingHoursStandard,
        workingHrs: pendingContract?.workDetails?.workingHrs
      },
      authorisedSignatory: {
        name: {
          english: pendingContract?.authorisedSignatory?.name?.english,
          arabic: pendingContract?.authorisedSignatory?.name?.arabic
        },
        role: {
          english: pendingContract?.authorisedSignatory?.role?.english,
          arabic: pendingContract?.authorisedSignatory?.role?.arabic
        }
      }
    });
    if (pendingContract?.contractType?.english === 'Limited Contract') {
      this.listenForContractType('Limited');
      this.contractDetailsForm.get('contractPeriod').patchValue({
        years: {
          english: `${pendingContract?.contractPeriod?.years.toString()} ${
            this.getYearsLabel(pendingContract?.contractPeriod?.years).english
          }`,
          arabic: `${pendingContract?.contractPeriod?.years.toString()} ${
            this.getYearsLabel(pendingContract?.contractPeriod?.years).english
          }`
        },
        months: {
          english: `${pendingContract?.contractPeriod?.months.toString()} ${
            this.getMonthsLabel(pendingContract?.contractPeriod?.months).english
          }`,
          arabic: `${pendingContract?.contractPeriod?.months.toString()} ${
            this.getMonthsLabel(pendingContract?.contractPeriod?.months).arabic
          }`
        }
      });
    }
    if (pendingContract?.workDetails?.location && this.contractDetailsForm) {
      this.contractDetailsForm.get('workDetails').patchValue({
        location: {
          english: pendingContract?.workDetails?.location?.english.toString(),
          arabic: pendingContract?.workDetails?.location?.arabic.toString()
        }
      });
    }
    if (pendingContract?.religion) {
      this.contractDetailsForm.patchValue({
        religion: {
          english: pendingContract?.religion?.english.toString(),
          arabic: pendingContract?.religion?.arabic.toString()
        }
      });
    }
    if (pendingContract?.workDetails?.workingHoursStandard?.english)
      this.changeWorkStanderd(pendingContract?.workDetails?.workingHoursStandard);
    if (pendingContract?.workDetails?.annualLeaveStandard?.english)
      this.changeAnnualLeaveStandard(pendingContract?.workDetails?.annualLeaveStandard);
  }
  setContractType(pendingContract) {
    let contractType = { english: '' };
    if (pendingContract?.contractType?.english === 'Limited Contract') {
      contractType = { english: 'Limited' };
    } else if (pendingContract?.contractType?.english === 'Unlimited Contract') {
      contractType = { english: 'Unlimited' };
    } else if (pendingContract?.contractType?.english === 'Contract related to the completion of work') {
      contractType = { english: 'Contract related to the completion of work' };
    }
    return contractType;
  }
  /** Method to listen contract period change */
  listenForContractType(type) {
    if (type === 'Limited') {
      this.addContractPeriodControls();
    } else {
      this.removeContractPeriodControls();
    }
  }
  /** Method to add contract period control */
  addContractPeriodControls() {
    this.contractDetailsForm.addControl(
      'contractPeriod',
      this.fb.group({
        years: '',
        months: ''
      })
    );
    (<FormGroup>this.contractDetailsForm.get('contractPeriod')).setControl(
      'years',
      this.fb.group({
        english: [null, { validators: Validators.required, updateOn: 'blur' }],
        arabic: null
      })
    );
    (<FormGroup>this.contractDetailsForm.get('contractPeriod')).setControl(
      'months',
      this.fb.group({
        english: [null, { validators: Validators.required, updateOn: 'blur' }],
        arabic: null
      })
    );
  }
  /** Method to remove contract period control */
  removeContractPeriodControls() {
    if (this.contractDetailsForm.get('contractPeriod.years') && this.contractDetailsForm.get('contractPeriod.months')) {
      (<FormGroup>this.contractDetailsForm.get('contractPeriod')).removeControl('years');
      (<FormGroup>this.contractDetailsForm.get('contractPeriod')).removeControl('months');
    }
  }
  /**Method to set limited as default for non saudi  */
  setDefaultContractType() {
    this.contractDetailsForm.get('contractType').setValue(this.contractTypeList.items[0]['value']);
    this.listenForContractType(this.contractTypeList.items[0]['value'].english);
    this.contractDetailsForm.get('contractType').disable();
  }
  /** Method to set validation according to selected working standerd */
  changeWorkStanderd(workStanderd) {
    if (workStanderd.english === 'Per Week') {
      this.contractDetailsForm
        .get('workDetails.workingHrs')
        .setValidators(Validators.compose([Validators.required, Validators.max(48), Validators.min(1)]));
      this.contractDetailsForm.get('workDetails.workingHoursStandard').patchValue({
        english: workStanderd.english,
        arabic: workStanderd.arabic
      });
    } else if (workStanderd.english === 'Per Day') {
      this.contractDetailsForm
        .get('workDetails.workingHrs')
        .setValidators(Validators.compose([Validators.required, Validators.max(8), Validators.min(1)]));
      this.contractDetailsForm.get('workDetails.workingHoursStandard').patchValue({
        english: workStanderd.english,
        arabic: workStanderd.arabic
      });
    }
    this.contractDetailsForm.get('workDetails.workingHrs').updateValueAndValidity();
    this.contractDetailsForm.get('workDetails.workingHoursStandard').updateValueAndValidity();
  }
  changeAnnualLeaveStandard(annualLeaveStandard) {
    if (annualLeaveStandard.english === 'Work Days') {
      this.contractDetailsForm.get('workDetails.annualLeaveStandard').patchValue({
        english: annualLeaveStandard.english,
        arabic: annualLeaveStandard.arabic
      });
    } else if (annualLeaveStandard.english === 'Calendar Days') {
      this.contractDetailsForm.get('workDetails.annualLeaveStandard').patchValue({
        english: annualLeaveStandard.english,
        arabic: annualLeaveStandard.arabic
      });
    }
    this.contractDetailsForm.get('workDetails.annualLeaveStandard').updateValueAndValidity();
  }
  /* This method is to cansel current transaction
   * @memberof contract-form-c
   */
  cancelForm() {
    this.cancel.emit();
  }
  /** Method to get Years label */
  getYearsLabel(years) {
    if (years < 2) {
      return { english: 'Year', arabic: 'سنة' };
    } else {
      return { english: 'Years', arabic: 'سنوات' };
    }
  }
  /** Method to get Months label */
  getMonthsLabel(months) {
    if (months < 2) {
      return { english: 'Month', arabic: 'شهر' };
    } else {
      return { english: 'Months', arabic: 'أشهر' };
    }
  }
  /* This method is to call lookup service for bank name. */
  getBankName(iban: string) {
    this.IBAN.emit(iban);
  }
  /** Method to load contract period list */
  loadContractPeriodList() {
    do {
      this.monthItem.push({
        value: {
          english: `${this.minMonth} ${this.getMonthsLabel(this.minMonth).english}`,
          arabic: `${this.minMonth} ${this.getMonthsLabel(this.minMonth).arabic}`
        },
        sequence: 1000 + this.minMonth
      });
      this.minMonth++;
    } while (this.minMonth < this.maxMonth + 1);
    this.monthList = new LovList(this.monthItem);
    do {
      this.yearItem.push({
        value: {
          english: `${this.minYear} ${this.getYearsLabel(this.minYear).english}`,
          arabic: `${this.minYear} ${this.getYearsLabel(this.minYear).arabic}`
        },
        sequence: 1000 + this.minYear
      });
      this.minYear++;
    } while (this.minYear < this.maxYear + 1);
    this.yearList = new LovList(this.yearItem);
  }
}
