import {
    Component,
    OnInit,
    Input,
    Inject,
    Output,
    EventEmitter,
    OnChanges,
    SimpleChanges,
    ChangeDetectorRef,
    AfterViewInit
  } from '@angular/core';
  import { LanguageToken, LovList, AppConstants, startOfDay } from '@gosi-ui/core';
  import { BehaviorSubject, Observable } from 'rxjs';
  import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
  import moment from 'moment';
  import { DatePipe } from '@angular/common';
  import { RejectAllowanceService } from '../../../shared/models/reject-allowance';
  import { RejectAllowanceDetails } from '../../../shared/models/reject-allowance-details';
  import { DateModel } from '../../../shared/models/date-model';
  import { AuditAllowanceDetails } from '../../../shared/models/audit-details';
  
  @Component({
    selector: 'oh-audit-allowance-reject-oh-dc',
    templateUrl: './audit-allowance-reject-oh-dc.component.html',
    styleUrls: ['./audit-allowance-reject-oh-dc.component.scss']
  })
  export class AuditAllowanceRejectOhDcComponent implements OnInit, OnChanges, AfterViewInit {
    @Input() selectedAllowancelist = [];
    @Input() allAllowanceDetails = [];
    @Input() count: number;
    @Output() cancelEvent: EventEmitter<null> = new EventEmitter();
    @Input() rejectReasonList$: Observable<LovList> = null;
    @Output() fetchAllAllowance: EventEmitter<AuditAllowanceDetails> = new EventEmitter();
    @Output() rejectEvent: EventEmitter<string> = new EventEmitter();
    @Input() visitList: LovList;
  
    /*Local Variables */
    commentsMaxlength = AppConstants.MAXLENGTH_COMMENTS;
    allowanceRejectForm: FormGroup;
    lang = 'en';
    // rejectModal: RejectAllowanceService = new RejectAllowanceService();
    rejectModal: string;
    rejectedAllowanceDetails: RejectAllowanceDetails = new RejectAllowanceDetails();
    showmandatory = false;
    arrayControlStart: FormArray;
    arrayControlEnd: FormArray;
    arrayControlVisits: FormArray;
    visits: string;
    allowanceListValue: FormArray = new FormArray([]);
    isBlmandatory: boolean;
    isBLsettlementMandatory: boolean;
    checkForm: FormGroup;
    hideChanges: boolean;
    showHeadings = false;
    constructor(
      @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
      private cd: ChangeDetectorRef,
      readonly datePipe: DatePipe,
      readonly fb: FormBuilder
    ) {}
  
    ngOnInit(): void {
      this.language.subscribe(language => {
        this.lang = language;
      });
      this.checkForm = this.createCheckForm();
      this.allowanceRejectForm = this.createAllowanceRejectForm();
  
      // if (this.selectedAllowancelist) {
      //   this.selectedAllowancelist.forEach(res => {
      //     const visits = this.fb.group({
      //       visits: [res.visits]
      //     });
      //     (this.allowanceRejectForm.controls.visit as FormArray).push(visits);
      //     this.arrayControlVisits = this.allowanceRejectForm.get('visit') as FormArray;
      //     if (res.allowanceSubType.english === 'Conveyance Allowance') {
      //     }
      //     if (res?.allowanceDates?.startDate?.gregorian && res?.allowanceDates?.endDate?.gregorian) {
      //       res.minDate = new Date(res.allowanceDates.startDate.gregorian);
      //       res.maxDate = new Date(res.allowanceDates.endDate.gregorian);
      //       res.rejectionDates = new DateModel();
      //       res.rejectionDates.endDate.gregorian = moment(res.allowanceDates?.startDate?.gregorian)
      //         .format('YYYY-MM-DDT00:00:00.000')
      //         .concat('Z');
      //       res.rejectionDates.startDate.gregorian = moment(res.allowanceDates?.endDate?.gregorian)
      //         .format('YYYY-MM-DDT00:00:00.000')
      //         .concat('Z');
      //       res.minEndDate = res.minDate;
      //       const selectedStartDate = moment(res.allowanceDates.startDate.gregorian).format('DD-MM-YYYY');
      //       const selectedEndDate = moment(res.allowanceDates.endDate.gregorian).format('DD-MM-YYYY');
      //       const startDate = this.fb.group({
      //         gregorian: [selectedStartDate],
      //         hijiri: null
      //       });
      //       const endDate = this.fb.group({
      //         gregorian: [selectedEndDate],
      //         hijiri: null
      //       });
      //       (this.allowanceRejectForm.controls.allowanceStartDate as FormArray).push(startDate);
      //       (this.allowanceRejectForm.controls.allowanceEndDate as FormArray).push(endDate);
      //     }
      //   });
      //   this.arrayControlStart = this.allowanceRejectForm.get('allowanceStartDate') as FormArray;
      //   this.arrayControlEnd = this.allowanceRejectForm.get('allowanceEndDate') as FormArray;
      // }
    }
    ngOnChanges(changes: SimpleChanges) {
      if (changes && changes.selectedAllowancelist) {
        this.selectedAllowancelist = changes.selectedAllowancelist.currentValue;
      }
      if (
        changes &&
        changes.allAllowanceDetails?.currentValue?.length > 0 &&
        changes.allAllowanceDetails?.currentValue !== undefined
      ) {
        this.allAllowanceDetails = changes.allAllowanceDetails.currentValue;
        if (this.allAllowanceDetails.length > 0) {
          for (let i = this.allAllowanceDetails.length - 1; i >= 0; i--) {
            for (let j = 0; j < this.selectedAllowancelist.length; j++) {
              if (
                this.allAllowanceDetails[i] &&
                this.allAllowanceDetails[i].transactionId === this.selectedAllowancelist[j].transactionId
              ) {
                this.allAllowanceDetails.splice(i, 1);
              }
            }
          }
          this.allAllowanceDetails = this.allAllowanceDetails.reduce((acc, val) => {
            if (!acc.find(el => el.transactionId === val.transactionId)) {
              acc.push(val);
            }
            return acc;
          }, []);
          this.createFormData();
          this.allAllowanceDetails?.forEach(rejectItem => {
            rejectItem.rejectionDates = new DateModel();
            if (rejectItem.allowanceSubType.english === 'Conveyance Allowance') {
              rejectItem.rejectedVisits = rejectItem.visits;
              if (rejectItem.visits) {
                if (this.lang === 'en') {
                  this.visits = rejectItem.visits === 1 ? ' ' + 'Visit' : ' ' + 'Visits';
                } else {
                  this.visits = ' ' + 'الزيارات';
                }
                const visits = this.fb.group({
                  visits: [rejectItem.visits]
                });
                (this.allowanceRejectForm.controls.visit as FormArray).push(visits);
              }
            }
          });
          this.rejectionPeriodChanges();
        }
        this.cd.detectChanges();
      }
    }
  
    cancelRejection() {
      this.showmandatory = false;
      this.allAllowanceDetails.forEach(child => {
        child.disabled = false;
        for (let i = 0; i < this.allAllowanceDetails.length; i++) {
          this.allowanceListValue.controls[i].get('checkBoxFlag').patchValue(false);
        }
      });
      this.cancelEvent.emit();
    }
  
    getDistance(distance: number) {
      if (this.lang === 'en') {
        return distance + ' ' + 'KM';
      } else {
        return distance + ' ' + 'كم';
      }
    }
  
    getAmount(amount: number) {
      if (this.lang === 'en') {
        return amount + ' ' + 'SAR';
      } else {
        return amount + ' ' + 'ر.س';
      }
    }
  
    /* Method to submit rejection details */
    confirmRejectionDetails() {
      this.showmandatory = false;
      if (this.allowanceRejectForm.valid) {
        this.allowanceRejectForm.markAsUntouched();
        // this.selectedAllowancelist.forEach(res => {
        //   res.rejectedAllowanceDetails = new RejectAllowanceDetails();
        //   res.rejectedAllowanceDetails.claimId = res.transactionId;
        //   res.rejectedAllowanceDetails.rejectedPeriod = [];
        //   if (
        //     res.allowanceType.english === 'Total Disability Repatriation Expenses' ||
        //     res.allowanceSubType.english === 'Conveyance Allowance' ||
        //     res.allowanceSubType.english === 'Shipping (body transportation) Expense'
        //   ) {
        //     res.rejectedAllowanceDetails.rejectedPeriod = res.allowanceDates;
        //   } else {
        //     res.rejectedAllowanceDetails.rejectedPeriod = res.rejectionDates;
        //   }
        //   const events = res.visits.toString().split(' ');
        //   res.rejectedAllowanceDetails.visits = parseInt(events[0], 0);
        //   this.rejectModal.caseId = res.caseId;
        //   this.rejectModal.allowanceRejection.push(res.rejectedAllowanceDetails);
        // });
        // if (this.hideChanges) {
        //   /* Do Nothing */
        // } else {
        //   for (let i = 0; i < this.allAllowanceDetails.length; i++) {
        //     if (this.allowanceListValue.controls[i].get('checkBoxFlag').value === true) {
        //       this.allAllowanceDetails[i].rejectedAllowanceDetails = new RejectAllowanceDetails();
        //       this.allAllowanceDetails[i].rejectedAllowanceDetails.claimId = this.allAllowanceDetails[i].transactionId;
        //       this.allAllowanceDetails[i].rejectedAllowanceDetails.rejectedPeriod =
        //         this.allAllowanceDetails[i].rejectionDates;
        //       if (this.allAllowanceDetails[i].rejectedVisits !== null) {
        //         const events = this.allAllowanceDetails[i].rejectedVisits.toString().split(' ');
        //         this.allAllowanceDetails[i].rejectedAllowanceDetails.visits = parseInt(events[0], 0);
        //       }
        //       this.rejectModal.allowanceRejection.push(this.allAllowanceDetails[i].rejectedAllowanceDetails);
        //     }
        //   }
        // }
        this.rejectModal = this.allowanceRejectForm.get('comments').value;
        // this.rejectModal.rejectionReason = this.allowanceRejectForm.get('rejectionReason').value;
        this.rejectEvent.emit(this.rejectModal);
      } else {
        this.showmandatory = true;
        this.allowanceRejectForm.markAllAsTouched();
        this.allowanceRejectForm.markAsPristine();
        this.allowanceRejectForm.updateValueAndValidity();
      }
    }
  
    createFormData() {
      this.allAllowanceDetails.forEach(() => {
        this.allowanceListValue.push(this.createCheckForm());
      });
    }
    ngAfterViewInit() {
      this.cd.detectChanges();
    }
    commentsSelection() {
      if (this.allowanceRejectForm) {
        if (this.allowanceRejectForm.get('rejectionReason.english').value === 'Others') {
          this.allowanceRejectForm.get('comments').setValidators(Validators.required);
        } else {
          this.allowanceRejectForm.get('comments').clearValidators();
          this.showmandatory = false;
          this.allowanceRejectForm.get('comments').markAsUntouched();
        }
        this.allowanceRejectForm.get('comments').markAsPristine();
        this.allowanceRejectForm.get('comments').updateValueAndValidity();
      }
    }
    createAllowanceRejectForm(): FormGroup {
      return this.fb.group({
        comments: [''],
        // claimid: [],
        // visit: this.fb.array([]),
        // rejectionReason: this.fb.group({
        //   english: [null, { validators: Validators.required }],
        //   arabic: [null, { validators: Validators.required }]
        // }),
        // allowanceStartDate: this.fb.array([]),
        // allowanceEndDate: this.fb.array([])
      });
    }
    rejectionPeriodChanges() {
      this.showHeadings = false;
      this.selectedAllowancelist.forEach(item => {
        item.checked = true;
        this.dateChange(this.selectedAllowancelist.indexOf(item), item);
      });
      this.allAllowanceDetails.forEach(item => {
        if (item.checked === true) {
          this.showHeadings = true;
        }
      });
    }
    /** Method to check validation when rejection dates are changed. */
    dateChange(index, allowance) {
      this.hideChanges = false;
      let startDate = this.arrayControlStart?.value[index].gregorian;
      let endDate = this.arrayControlEnd?.value[index].gregorian;
  
      /* Converting Object values in date Format*/
      if (startDate === undefined) {
        startDate = allowance.allowanceDates.startDate.gregorian;
      } else {
        if (typeof startDate !== 'object') {
          startDate = startDate.split('-');
          startDate = new Date(+startDate[2], startDate[1] - 1, +startDate[0]);
        }
      }
      if (endDate === undefined) {
        endDate = allowance.allowanceDates.endDate.gregorian;
      } else {
        if (typeof endDate !== 'object') {
          endDate = endDate.split('-');
          endDate = new Date(+endDate[2], endDate[1] - 1, +endDate[0]);
        }
      }
      this.selectedAllowancelist.forEach(items => {
        if (items.transactionId === allowance.transactionId) {
          items.rejectionDates = new DateModel();
          items.rejectionDates.endDate.gregorian = moment(endDate).format('YYYY-MM-DDT00:00:00.000').concat('Z');
          items.rejectionDates.startDate.gregorian = moment(startDate).format('YYYY-MM-DDT00:00:00.000').concat('Z');
        }
      });
      this.allAllowanceDetails.forEach(item => {
        if (
          item.allowanceSubType.english === 'Balance Settlement Allowance' ||
          item.allowanceSubType.english === 'Balance Settlement Adjustment Allowance' ||
          item.allowanceSubType.english === 'Balance Settlement Reversal Adjustment'
        ) {
          if (
            item.allowanceDates?.startDate.gregorian <= allowance.allowanceDates.endDate.gregorian &&
            allowance.allowanceDates.startDate.gregorian <= item.allowanceDates?.endDate.gregorian
          ) {
            item.rejectionDates.endDate.gregorian = moment(endDate).format('YYYY-MM-DDT00:00:00.000').concat('Z');
            item.rejectionDates.startDate.gregorian = moment(endDate).format('YYYY-MM-DDT00:00:00.000').concat('Z');
          }
        } else if (allowance.allowanceType.english === 'Total Disability Repatriation Expenses') {
          item.rejectionDates.endDate.gregorian = moment(item.allowanceDates.endDate.gregorian)
            .format('YYYY-MM-DDT00:00:00.000')
            .concat('Z');
          item.rejectionDates.startDate.gregorian = moment(item.allowanceDates.startDate.gregorian)
            .format('YYYY-MM-DDT00:00:00.000')
            .concat('Z');
        } else if (
          item.allowanceDates?.startDate.gregorian <= allowance.allowanceDates.endDate.gregorian &&
          allowance.allowanceDates.startDate.gregorian <= item.allowanceDates?.endDate.gregorian
        ) {
          item.rejectionDates.endDate.gregorian = moment(endDate).format('YYYY-MM-DDT00:00:00.000').concat('Z');
          if (
            item.allowanceDates.startDate.gregorian >= moment(startDate).format('YYYY-MM-DDT00:00:00.000').concat('Z')
          ) {
            item.rejectionDates.startDate.gregorian = item.allowanceDates.startDate.gregorian;
          } else {
            item.rejectionDates.startDate.gregorian = moment(startDate).format('YYYY-MM-DDT00:00:00.000').concat('Z');
          }
          if (item.allowanceDates.endDate.gregorian >= moment(endDate).format('YYYY-MM-DDT00:00:00.000').concat('Z')) {
            item.rejectionDates.endDate.gregorian = moment(endDate).format('YYYY-MM-DDT00:00:00.000').concat('Z');
          } else {
            item.rejectionDates.endDate.gregorian = item.allowanceDates.endDate.gregorian;
          }
        }
        allowance.minEndDate = new Date(startDate);
      });
      const dateFormat = moment(allowance.allowanceDates.endDate.gregorian).format('DD-MM-YYYY');
      const ipEndDate = dateFormat.split('-');
      const ipEndDateCheck = new Date(+ipEndDate[2], parseInt(ipEndDate[1], 0) - 1, +ipEndDate[0]);
      this.isBlmandatory = ipEndDateCheck >= startDate && ipEndDateCheck <= endDate;
      if (
        moment(startOfDay(startDate)).isSame(moment(startOfDay(allowance.allowanceDates?.startDate.gregorian))) &&
        moment(startOfDay(endDate)).isSame(moment(startOfDay(allowance.allowanceDates?.endDate.gregorian)))
      ) {
        this.completeRejections(allowance);
      } else {
        if (
          allowance.allowanceSubType.english === 'Companion Daily Allowance' &&
          this.selectedAllowancelist.length === 1
        ) {
          this.hideChanges = true;
        }
        this.optionalRejections(allowance);
      }
    }
    claimsValidation(allowance, child) {
      if (allowance.allowanceType.english === 'Total Disability Repatriation Expenses') {
        if (
          child.allowanceSubType.english === 'Companion Daily Allowance' ||
          child.allowanceSubType.english === 'Companion Conveyance Allowance'
        ) {
          this.setAllowanceSelection(child, allowance.checked);
        }
      }
    }
    /* Complete Rejecton Validations Scenarios */
    completeRejections(allowance) {
      this.allAllowanceDetails.forEach(child => {
        this.claimsValidation(allowance, child);
        if (
          (child.allowanceDates?.startDate.gregorian <= allowance.allowanceDates.endDate.gregorian &&
            allowance.allowanceDates.startDate.gregorian <= child.allowanceDates?.endDate.gregorian) ||
          child.allowanceSubType.english === 'Balance Settlement Adjustment Allowance' ||
          child.allowanceSubType.english === 'Balance Settlement Allowance'
        ) {
          if (allowance.allowanceSubType.english === 'InPatient Daily Allowance') {
            if (
              child.allowanceSubType.english === 'Conveyance Allowance' ||
              child.allowanceSubType.english === 'Balance Settlement Adjustment Allowance' ||
              child.allowanceSubType.english === 'Balance Settlement Allowance' ||
              child.allowanceSubType.english === 'InPatient Daily Allowance Adjustment' ||
              child.allowanceSubType.english === 'Companion Daily Allowance' ||
              child.allowanceSubType.english === 'Companion Conveyance Allowance'
            ) {
              this.setAllowanceSelection(child, allowance.checked);
            }
          }
          if (
            allowance.allowanceSubType.english === 'OutPatient Daily Allowance' ||
            allowance.allowanceSubType.english === 'OutPatient Allowance'
          ) {
            if (
              child.allowanceSubType.english === 'Conveyance Allowance' ||
              child.allowanceSubType.english === 'Companion Daily Allowance' ||
              child.allowanceSubType.english === 'OutPatient Daily Allowance Adjustment' ||
              child.allowanceSubType.english === 'Companion Conveyance Allowance'
            ) {
              this.setAllowanceSelection(child, allowance.checked);
            }
          }
          if (allowance.allowanceSubType.english === 'Companion Daily Allowance') {
            if (child.allowanceSubType.english === 'Companion Conveyance Allowance') {
              this.setAllowanceSelection(child, allowance.checked);
            }
          }
        }
      });
      this.resetCheckBox();
      this.cd.detectChanges();
    }
    /* Method to Reset Checkbox Values */
    resetCheckBox() {
      for (let i = 0; i < this.allAllowanceDetails.length; i++) {
        if (this.allAllowanceDetails[i].disabled || this.allAllowanceDetails[i].checked) {
          this.allowanceListValue.controls[i].get('checkBoxFlag').patchValue(true);
        } else if (this.allAllowanceDetails[i].checked === false) {
          this.allAllowanceDetails[i].disabled = false;
          this.allowanceListValue.controls[i].get('checkBoxFlag').patchValue(false);
        }
      }
    }
    setAllowanceSelection(child, checked) {
      child.checked = checked;
      child.disabled = checked ? true : false;
    }
    /* Method to validate optional Rejection of Sick Leave */
    sickLeaveValidation(allowance) {
      this.allAllowanceDetails.forEach(child => {
        if (
          child.allowanceDates?.startDate.gregorian <= allowance.allowanceDates.endDate.gregorian &&
          allowance.allowanceDates.startDate.gregorian <= child.allowanceDates?.endDate.gregorian
        ) {
          if (
            allowance.allowanceSubType.english === 'OutPatient Daily Allowance' ||
            allowance.allowanceSubType.english === 'OutPatient Allowance'
          ) {
            if (
              child.allowanceDates?.startDate.gregorian <= allowance.rejectionDates.endDate.gregorian &&
              allowance.rejectionDates.startDate.gregorian <= child.allowanceDates?.endDate.gregorian &&
              (child.allowanceSubType.english === 'OutPatient Daily Allowance Adjustment' ||
                child.allowanceSubType.english === 'Companion Daily Allowance')
            ) {
              this.setAllowanceSelection(child, allowance.checked);
            } else {
              this.setAllowanceSelection(child, false);
            }
          }
        }
      });
    }
    /* Optional Rejecton Validations Scenarios */
    optionalRejections(allowance) {
      this.allAllowanceDetails.forEach(child => {
        if (
          child.allowanceDates?.startDate.gregorian <= allowance.allowanceDates.endDate.gregorian &&
          allowance.allowanceDates.startDate.gregorian <= child.allowanceDates?.endDate.gregorian
        ) {
          if (allowance.allowanceSubType.english === 'InPatient Daily Allowance') {
            if (
              child.allowanceSubType.english === 'InPatient Daily Allowance Adjustment' ||
              child.allowanceSubType.english === 'Companion Daily Allowance'
            ) {
              if (
                child.allowanceDates?.startDate.gregorian <= allowance.rejectionDates.endDate.gregorian &&
                allowance.rejectionDates.startDate.gregorian <= child.allowanceDates?.endDate.gregorian
              ) {
                this.setAllowanceSelection(child, allowance.checked);
              }
            } else {
              this.setAllowanceSelection(child, false);
            }
          }
          this.sickLeaveValidation(allowance);
        }
      });
  
      this.resetCheckBox();
      this.cd.detectChanges();
    }
    /* Method to set Visits */
    setVisits(event, allowance) {
      this.visits = null;
      this.allAllowanceDetails.forEach(element => {
        if (element.transactionId === allowance.transactionId) {
          element.rejectedVisits = event;
          allowance.visits = event;
        }
      });
    }
    /* Method to create checkbox form */
    createCheckForm(): FormGroup {
      return this.fb.group({
        checkBoxFlag: [false]
      });
    }
  }
  