/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BehaviorSubject, Observable } from 'rxjs';
import {
  Component,
  OnInit,
  Inject,
  Input,
  SimpleChanges,
  Output,
  EventEmitter,
  OnChanges,
  HostListener
} from '@angular/core';
import { LanguageToken, LovList, LookupService, Lov, convertToStringDDMMYYYY } from '@gosi-ui/core';
import { ImprisonmentDetails } from '../../models';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import moment from 'moment';
import { ManageBenefitService } from '../../services/manage-benefit.service';
import { DependentService } from '../../services/dependent.service';

@Component({
  selector: 'bnt-imprisonment-benefits-dc',
  templateUrl: './imprisonment-benefits-dc.component.html',
  styleUrls: ['./imprisonment-benefits-dc.component.scss']
})
export class ImprisonmentBenefitsDcComponent implements OnInit, OnChanges {
  /*
   * Local variables
   */

  index = 0;
  lang = 'en';
  listYesNo$ = new Observable<LovList>();
  imprisonment: Lov[] = [];
  imprisonmentList: LovList;
  selectedImprisonmentPeriod: Lov;
  imprisonmentForm: FormGroup;
  isSmallScreen: boolean;
  /*
   * Input variables
   */
  @Input() jailedPeriods: ImprisonmentDetails[];
  @Input() parentForm: FormGroup;
  @Input() isValidator = false;
  @Input() disableSaveAndNext: boolean;
  /**
   * Output
   */
  @Output() clearAllAlerts: EventEmitter<null> = new EventEmitter();
  @Output() nextForm = new EventEmitter();
  @Output() cancel = new EventEmitter();
  /**
   *
   * @param language
   */

  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly lookupService: LookupService,
    readonly manageBenefitService: ManageBenefitService,
    readonly dependentService: DependentService,
    readonly fb: FormBuilder
  ) {}

  /*
   * This methid is for initialization tasks
   */
  ngOnInit(): void {
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    this.listYesNo$ = this.lookupService.getYesOrNoList();
    this.imprisonmentForm = this.createImprisonmentForm();
    if (this.parentForm) {
      this.parentForm.addControl('imprisonmentForm', this.imprisonmentForm);
    }
    this.setValuesForValidatorEditFlow();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.jailedPeriods && changes.jailedPeriods.currentValue.length) {
      this.jailedPeriods = changes.jailedPeriods.currentValue;
      this.jailedPeriods.forEach((periods, i) => {
        if (periods.releaseDate && periods.releaseDate.gregorian) {
          this.imprisonment.push({
            value: {
              english: `${convertToStringDDMMYYYY(moment(periods.enteringDate.gregorian).toString())}
              → ${convertToStringDDMMYYYY(moment(periods.releaseDate.gregorian).toString())} `,
              arabic: `${convertToStringDDMMYYYY(moment(periods.enteringDate.gregorian).toString())}
              ← ${convertToStringDDMMYYYY(moment(periods.releaseDate.gregorian).toString())} `
            },
            code: i,
            sequence: i
          });
        } else {
          if (periods.enteringDate) {
            this.imprisonment.push({
              value: {
                english: `${convertToStringDDMMYYYY(moment(periods.enteringDate.gregorian).toString())}
                → onwards `,
                arabic: `${convertToStringDDMMYYYY(moment(periods.enteringDate.gregorian).toString())}
                ← حتى الآن `
              },
              code: i,
              sequence: i
            });
          }
        }
      });
      this.imprisonmentList = new LovList(this.imprisonment);
      this.setValuesForValidatorEditFlow();
    }
  }

  setValuesForValidatorEditFlow() {
    if (this.isValidator) {
      this.imprisonmentForm = this.createImprisonmentForm();

      if (this.dependentService.imprisonmentDetails) {
        if (this.dependentService.imprisonmentDetails.hasCertificate) {
          this.imprisonmentForm.patchValue({
            hasCertificate: {
              english: `Yes`,
              arabic: `نعم`
            }
          });
        } else {
          this.imprisonmentForm.patchValue({
            hasCertificate: {
              english: `No`,
              arabic: `لا`
            }
          });
        }

        if (
          this.dependentService.imprisonmentDetails.releaseDate &&
          this.dependentService.imprisonmentDetails.releaseDate.gregorian
        ) {
          this.imprisonmentForm.patchValue({
            imprisonmentPeriod: {
              english: `${convertToStringDDMMYYYY(
                moment(this.dependentService.imprisonmentDetails.enteringDate.gregorian).toString()
              )}
              → ${convertToStringDDMMYYYY(
                moment(this.dependentService.imprisonmentDetails.releaseDate.gregorian).toString()
              )} `,
              arabic: `${convertToStringDDMMYYYY(
                moment(this.dependentService.imprisonmentDetails.enteringDate.gregorian).toString()
              )}
              ←  ${convertToStringDDMMYYYY(
                moment(this.dependentService.imprisonmentDetails.releaseDate.gregorian).toString()
              )} `
            }
          });
        } else {
          if (this.dependentService.imprisonmentDetails.enteringDate) {
            this.imprisonmentForm.patchValue({
              imprisonmentPeriod: {
                english: `${convertToStringDDMMYYYY(
                  moment(this.dependentService.imprisonmentDetails.enteringDate.gregorian).toString()
                )}
                → onwards `,
                arabic: `${convertToStringDDMMYYYY(
                  moment(this.dependentService.imprisonmentDetails.enteringDate.gregorian).toString()
                )}
                ← حتى الآن `
              }
            });
          }
        }
      }
      if (this.parentForm) {
        this.parentForm.addControl('imprisonmentForm', this.imprisonmentForm);
      }
    }
  }

  createImprisonmentForm() {
    return this.fb.group({
      hasCertificate: this.fb.group({
        english: ['Yes', { validators: Validators.required, updateOn: 'blur' }],
        arabic: null
      }),
      imprisonmentPeriod: this.fb.group({
        english: [null, Validators.required],
        arabic: [null]
      }),
      enteringDate: '',
      releaseDate: '',
      prisoner: ''
    });
  }

  selectImprisonmentPeriod(value: Lov) {
    // creating object with selected entering and relesedate
    this.imprisonmentForm.get('enteringDate').patchValue(this.jailedPeriods[value.code].enteringDate);
    this.imprisonmentForm.get('releaseDate').patchValue(this.jailedPeriods[value.code].releaseDate);
    this.imprisonmentForm.get('prisoner').patchValue('true');
    this.clearAllAlerts.emit();
  }

  selectedHasCert(selected: string) {
    if (selected === 'Yes') {
      this.parentForm.get('imprisonmentForm.hasCertificate.english').setValue('Yes');
    } else {
      this.parentForm.get('imprisonmentForm.hasCertificate.english').setValue('No');
    }
  }

  applyForBenefit() {
    this.nextForm.emit(this.imprisonmentForm);
  }
  cancelTransaction() {
    this.cancel.emit();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    const scrWidth = window.innerWidth;
    this.isSmallScreen = scrWidth <= 960 ? true : false;
  }
}
