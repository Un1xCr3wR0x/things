import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, AuthTokenService, Establishment, Lov, LovList, scrollToTop } from '@gosi-ui/core';
import { EstablishmentRoutesEnum, EstablishmentService } from '@gosi-ui/features/establishment';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'est-medical-insurance-enroll-sc',
  templateUrl: './medical-insurance-enroll-sc.component.html',
  styleUrls: ['./medical-insurance-enroll-sc.component.scss']
})
export class MedicalInsuranceEnrollScComponent implements OnInit {
  enrollmentFormGroup = this.fb.group({
    checkBoxFlag: [null, { validators: Validators.required }]
  });
  formGroup: FormGroup;
  establishment: Establishment;
  mainBranchList: LovList;
  selectedRegNo: string;
  bsModalRef: BsModalRef;
  termsUrl: string;
  terms: string;

  constructor(
    private fb: FormBuilder,
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly establishmentService: EstablishmentService,
    readonly authService: AuthTokenService,
    readonly bsModalService: BsModalService,
    readonly alertService: AlertService,
    readonly translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      english: null,
      arabic: null
    });
    this.termsUrl = EstablishmentRoutesEnum.MEDICAL_INSURANCE_TERMS;
    this.translate.get('ESTABLISHMENT.MEDICAL-INSURANCE-ACKNOWLEDGEMENT', { url: this.termsUrl }).subscribe(value => {
      this.terms = value;
    });
    this.translate.onLangChange.subscribe(() => {
      this.translate.get('ESTABLISHMENT.MEDICAL-INSURANCE-ACKNOWLEDGEMENT', { url: this.termsUrl }).subscribe(value => {
        this.terms = value;
      });
    });
    this.formGroup.setValidators(Validators.required);
    this.formGroup.updateValueAndValidity();
    const token = this.authService.decodeToken(this.authService.getAuthToken());
    this.establishmentService
      .getMedicalInsuranceEstablishmentEnrollmentGroupsUnderAdmin(Number(token.uid))
      .subscribe(estGroups => {
        const list: Lov[] = [];
        estGroups.branchList.map(est => {
          if (!est.name.english) {
            est.name.english = est.name.arabic;
          }
          list.push({
            value: { arabic: String(est.name.arabic), english: String(est.name.english) },
            sequence: est.registrationNo
          });
        });
        this.mainBranchList = new LovList(list);
      });
  }

  selectEvent(event) {
    if (!event) {
      this.selectedRegNo = null;
      return;
    }
    this.selectedRegNo = event.sequence;
  }

  showModal(templateRef: TemplateRef<HTMLElement>) {
    this.bsModalRef = this.bsModalService.show(
      templateRef,
      Object.assign({}, { class: 'modal-lg modal-dialog-centered' })
    );
  }

  saveEnrollment() {
    if (!this.enrollmentFormGroup.get('checkBoxFlag').value) {
      this.alertService.showErrorByKey('ESTABLISHMENT.ERROR.MEDICAL-INSURANCE-ACKNOWLEDGEMENT');
      scrollToTop();
      return;
    }
    if (!this.selectedRegNo) {
      this.alertService.showErrorByKey('ESTABLISHMENT.ERROR.ERR-SELECT-MAIN');
      scrollToTop();
      return;
    }
    this.establishmentService.enrollEstablishmentMedicalInsuranceExtension(this.selectedRegNo).subscribe(
      res => {
        this.alertService.showSuccess(res.successMessage);
        this.router.navigate([EstablishmentRoutesEnum.MEDICAL_INSURANCE_EXTENSION]);
      },
      err => {
        this.alertService.showError(err.error.message);
      }
    );
  }

  /**
   * method to cancel the modal
   */
  cancelModal() {
    this.alertService.clearAlerts();
    this.hideModal();
    this.router.navigate([EstablishmentRoutesEnum.MEDICAL_INSURANCE_EXTENSION]);
  }

  hideModal() {
    this.bsModalRef.hide();
  }
}
