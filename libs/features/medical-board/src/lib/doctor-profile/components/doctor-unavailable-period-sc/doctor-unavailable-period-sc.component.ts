import { Component, OnInit, TemplateRef, EventEmitter, Output, Inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {
  AlertService,
  startOfDay,
  scrollToTop,
  BilingualText,
  minDateValidator,
  LookupService,
  LovList,
  ApplicationTypeToken,
  ApplicationTypeEnum,
  markFormGroupTouched
} from '@gosi-ui/core';
import { MbProfile, MbRouteConstants, UnAvailabilityPeriod, MBConstants, ContractData } from '../../../shared';
import { DoctorService } from '../../../shared/services';
import { Router, ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { noop, Observable } from 'rxjs';
import moment from 'moment';

const MIN_LENGTH = 1;

@Component({
  selector: 'mb-unavailable-period-sc',
  templateUrl: './doctor-unavailable-period-sc.component.html',
  styleUrls: ['./doctor-unavailable-period-sc.component.scss']
})
export class DoctorUnavailablePeriodScComponent implements OnInit {
  modalRef: BsModalRef;
  unavailableForm: FormGroup;
  identificationNo: number;
  memberperson: ContractData;
  person: MbProfile;
  modifyData: UnAvailabilityPeriod = new UnAvailabilityPeriod();
  unavailableData: UnAvailabilityPeriod = new UnAvailabilityPeriod();
  currentDate: Date = new Date();
  isMBApp = false;
  reasonMaxLength = MBConstants.REASON_MAX_LENGTH;
  dateError = MBConstants.DATE_ERROR_MESSAGE();

  @Output() cancel: EventEmitter<null> = new EventEmitter();
  calenderId: number;
  modifyFlag: boolean;
  startDate;
  unAvailableReasonList: LovList;
  unAvailableReasonList$: Observable<LovList>;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    readonly alertService: AlertService,
    readonly doctorService: DoctorService,
    readonly router: Router,
    private route: ActivatedRoute,
    readonly lookupService: LookupService,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) { }

  ngOnInit() {
    this.alertService.clearAlerts();
    this.isMBApp = this.appToken === ApplicationTypeEnum.MEDICAL_BOARD ? true : false;
    this.getreasonList();
    this.unAvailableReasonList$ = this.lookupService.getUnavailablePeriodReasons();
    this.route.paramMap
      .pipe(
        tap(params => {
          if (params && params.get('identificationNo')) this.identificationNo = +params.get('identificationNo');
          if (params && params.get('calenderId')) {
            this.calenderId = +params.get('calenderId');
            this.modifyFlag = true;
            this.getMemberDetails(this.identificationNo, this.calenderId);
          }
        })
      )
      .subscribe(noop, err => this.alertService.showError(err?.error?.message));
    if (this.appToken === ApplicationTypeEnum.MEDICAL_BOARD) {
      this.getPersonContractInAPP(this.identificationNo);
    } else {
      this.getPersonDetails(this.identificationNo);
    }
    this.unavailableForm = this.createUnavailableForm();
  }
  getreasonList() {
    this.lookupService.getUnavailablePeriodReasons().subscribe(res => {
      this.unAvailableReasonList = res;
    });
  }

  getPersonDetails(identificationNo) {
    this.doctorService.getPersonDetails(identificationNo).subscribe(
      res => {
        this.person = res;
      },
      err => this.showError(err)
    );
  }
  getPersonContractInAPP(identificationNo) {
    this.doctorService.getContractDataDetail(identificationNo).subscribe(
      res => {
        this.memberperson = res;
      },
      err => this.showError(err)
    );
  }
  getStart() {
    const startDate = this.unavailableForm?.get('startDate.gregorian')?.value;
    this.unavailableForm?.get('endDate.gregorian')?.setValue(startDate);
    this.checkValidity();
  }
  checkValidity() {
    if (this.unavailableForm?.get('endDate.gregorian').value === null) {
      this.unavailableForm?.get('endDate.gregorian').markAsTouched();
      this.unavailableForm?.get('endDate.gregorian').markAsPristine();
      this.unavailableForm?.get('endDate.gregorian').updateValueAndValidity();
    }
  }
  checkDateValidation() {
    const startDate = startOfDay(this.unavailableForm?.get('startDate')?.get('gregorian').value);
    const endDate = this.unavailableForm?.get('endDate')?.get('gregorian').invalid
      ? null
      : startOfDay(this.unavailableForm?.get('endDate')?.get('gregorian').value);
    if (startDate !== null && endDate !== null) {
      if (moment(startDate).isAfter(endDate)) {
        this.getStart();
      }
    }
  }
  //Modify
  getMemberDetails(identificationNo, calenderId) {
    if (this.isMBApp) {
      this.doctorService.getMemberDetailsInApp(identificationNo, calenderId).subscribe(
        res => {
          if (res) {
            this.modifyData = res;
            if (this.modifyData) {
              if (this.modifyData.reason.english === 'Other') {
                this.unavailableForm?.get('comment').setValidators(Validators.required);
              }
            }
            this.unavailableForm
              ?.get('startDate')
              ?.get('gregorian')
              ?.setValue(moment(res?.startDate?.gregorian).toDate());
            this.unavailableForm?.get('endDate')?.get('gregorian')?.setValue(moment(res?.endDate?.gregorian).toDate());
            this.unavailableForm?.get('reason')?.setValue(res?.reason);
            this.unavailableForm?.get('comment')?.setValue(res?.comments);
          }
        },
        err => this.showError(err)
      );
    } else {
      this.doctorService.getMemberDetails(identificationNo, calenderId).subscribe(
        res => {
          if (res) {
            this.modifyData = res;
            if (this.modifyData) {
              if (this.modifyData.reason.english === 'Other') {
                this.unavailableForm?.get('comment').setValidators(Validators.required);
              }
            }
            this.unavailableForm
              ?.get('startDate')
              ?.get('gregorian')
              ?.setValue(moment(res?.startDate?.gregorian).toDate());
            this.unavailableForm?.get('endDate')?.get('gregorian')?.setValue(moment(res?.endDate?.gregorian).toDate());
            this.unavailableForm?.get('reason')?.setValue(res?.reason);
            this.unavailableForm?.get('comment')?.setValue(res?.comments);
          }
        },
        err => this.showError(err)
      );
    }
  }

  saveDetails() {
    if (!this.unavailableForm.invalid) {
      this.unavailableData = new UnAvailabilityPeriod();
      this.getFormDetails();
      if (this.unavailableData?.startDate.gregorian > this.unavailableData?.endDate.gregorian) {
        this.alertService.showError(this.dateError);
      } else {
        if (!this.isMBApp) {
          if (this.memberperson?.contracts[0]?.mbProfessionalId) {
            const personalId = this.memberperson?.contracts[0]?.mbProfessionalId;
            this.modifyFlag ? this.modifyDetails(personalId) : this.addDetails(personalId);
          } else {
            const personalId = this.doctorService.getmbProfessionalId();
            this.modifyFlag ? this.modifyDetails(personalId) : this.addDetails(personalId);
          }
        } else {
          this.modifyFlag ? this.modifyDetailsInApp() : this.addDetailsInApp();
        }
      }
    } else {
      markFormGroupTouched(this.unavailableForm);
      scrollToTop();
      this.alertService.showMandatoryErrorMessage();
    }
  }
  addDetails(personalId) {
    this.doctorService
      .addUnavailablePeriod(personalId, this.unavailableData)
      .pipe(
        tap(res => {
          scrollToTop();
          this.doctorService.responseMessage = new BilingualText();
          this.doctorService.responseMessage = res.confirmMessage;
          this.router.navigate([MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(this.identificationNo)]);
        })
      )
      .subscribe(noop, err => {
        this.showError(err);
      });
  }
  addDetailsInApp() {
    this.doctorService
      .addUnavailablePeriodInApp(this.identificationNo, this.unavailableData)
      .pipe(
        tap(res => {
          scrollToTop();
          this.doctorService.responseMessage = new BilingualText();
          this.doctorService.responseMessage = res.confirmMessage;
          this.router.navigate([MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(this.identificationNo)]);
        })
      )
      .subscribe(noop, err => {
        this.showError(err);
      });
  }

  modifyDetails(personalId) {
    this.doctorService
      .modifyUnavailablePeriod(personalId, this.unavailableData, this.calenderId)
      .pipe(
        tap(res => {
          scrollToTop();
          this.doctorService.responseMessage = res.confirmMessage;
          this.router.navigate([MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(this.identificationNo)]);
        })
      )
      .subscribe(noop, err => {
        this.showError(err);
      });
  }

  getFormDetails() {
    this.unavailableData.startDate.gregorian = startOfDay(
      this.unavailableForm?.get('startDate')?.get('gregorian').value
    );
    this.unavailableData.endDate.gregorian = startOfDay(this.unavailableForm?.get('endDate')?.get('gregorian').value);
    this.unavailableData.reason = this.unavailableForm?.get('reason').value;
    if (this.unavailableForm?.get('comment').value) {
      this.unavailableData.comments = this.unavailableForm.get('comment').value;
    }
  }
  modifyDetailsInApp() {
    this.doctorService
      .modifyUnavailablePeriodInApp(this.identificationNo, this.unavailableData, this.calenderId)
      .pipe(
        tap(res => {
          scrollToTop();
          this.doctorService.responseMessage = res.confirmMessage;
          this.router.navigate([MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(this.identificationNo)]);
        })
      )
      .subscribe(noop, err => {
        this.showError(err);
      });
  }
  createUnavailableForm() {
    return this.fb.group({
      startDate: this.fb.group({
        gregorian: [null, { validators: Validators.required, updateOn: 'blur' }],
        hijiri: ['']
      }),
      endDate: this.fb.group({
        gregorian: [null, { validators: Validators.required, updateOn: 'blur' }],
        hijiri: ['']
      }),
      reason: this.fb.group({
        arabic: [null],
        english: [null, { validators: Validators.required, updateOn: 'blur' }]
      }),
      comment: ''
    });
  }
  popUpCancel(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template);
  }

  confirmCancel() {
    this.alertService.clearAlerts();
    this.modalRef.hide();
    this.router.navigate([MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(this.identificationNo)]);
  }

  decline() {
    this.modalRef.hide();
  }
  /**
   *
   * @param err This method to show the page level error
   */
  showError(err) {
    if (err && err.error && err.error.message) {
      this.alertService.showError(err.error.message, err.error.details);
    }
  }
  selectType(reason) {
    if (reason === 'Other') {
      this.unavailableForm?.get('comment').setValidators(Validators.required);
      this.unavailableForm?.get('comment').updateValueAndValidity();
    } else {
      this.unavailableForm?.get('comment').clearValidators();
      this.unavailableForm?.get('comment').updateValueAndValidity();
    }
  }

  getMinEndDate(minDate) {
    return new Date(minDate);
  }
}
