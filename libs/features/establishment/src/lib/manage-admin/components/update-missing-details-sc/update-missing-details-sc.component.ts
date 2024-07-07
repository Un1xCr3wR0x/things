/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  AuthTokenService,
  checkBilingualTextNull,
  EstablishmentRouterData,
  EstablishmentToken,
  GccCountryCode,
  IdentityTypeEnum,
  LoginService,
  LookupService,
  markFormGroupTouched,
  NationalId,
  TransactionFeedback,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { noop, Observable, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  Admin,
  EstablishmentAdminService,
  EstablishmentService,
  filterIdentities,
  getAdminRole
} from '../../../shared';
import { ManageAdminScBaseComponent } from '../../../shared/base/manage-admin-sc.base-component';
import { EstablishmentConstants } from '../../../shared/constants/establishment-constants';
import { incorrectRoute } from '../admin-sc/admin-sc.component';

@Component({
  selector: 'est-update-missing-details-sc',
  templateUrl: './update-missing-details-sc.component.html',
  styleUrls: ['./update-missing-details-sc.component.scss']
})
export class UpdateMissingDetailsScComponent extends ManageAdminScBaseComponent implements OnInit {
  updateDetailsForm: FormGroup;
  defaultToSaudi = true;
  mainRegNo: number;
  adminMissingDetails: boolean = true;
  adminId: number;
  isGcc: boolean;
  admins: Admin[] = [];
  @ViewChild('confirmTemplate', { static: true })
  confirmTemplate: TemplateRef<HTMLElement>;
  transactionFeedback: TransactionFeedback;
  //Constants
  minLengthName = EstablishmentConstants.PERSON_NAME_MIN_LENGTH;
  maxLengthArabicName = EstablishmentConstants.PERSON_NAME_ARABIC_MAX_LENGTH;
  maxLengthEnglishName = EstablishmentConstants.PERSON_NAME_ENGLISH_MAX_LENGTH;

  constructor(
    readonly lookUpService: LookupService,
    readonly bsModalService: BsModalService,
    readonly alertService: AlertService,
    readonly establishmentService: EstablishmentService,
    readonly workflowService: WorkflowService,
    readonly adminService: EstablishmentAdminService,
    readonly loginService: LoginService,
    private authTokenService: AuthTokenService,
    @Inject(ApplicationTypeToken) readonly appToken: string, //TODO remove apptoken
    @Inject(EstablishmentToken) readonly estRouterData: EstablishmentRouterData,
    @Inject(ApplicationTypeToken) readonly appType: string,
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly location: Location
  ) {
    super(bsModalService, lookUpService, alertService, establishmentService, appType, location, workflowService);
    this.updateDetailsForm = this.createEstAdminForm();
  }

  ngOnInit() {
    this.initialiseView();
  }

  initialiseView() {
    this.initialiseParams(this.route.paramMap);
  }
  /**
   * @param paramMap
   * map adminid and registrationno from route
   */
  initialiseParams(paramMap: Observable<ParamMap>) {
    paramMap
      .pipe(
        tap(params => {
          if (params && params.get('registrationNo')) {
            this.mainRegNo = +params.get('registrationNo');
          } else {
            throwError(incorrectRoute);
          }
        }),
        tap(() => {
          this.establishmentService
            .getAdminsOfEstablishment(this.mainRegNo, undefined, undefined, this.adminMissingDetails)
            .pipe(
              map(res => {
                this.admins = res.admins;
                if (this.admins[0].person.nationality) {
                  const country = EstablishmentConstants.GCC_NATIONAL.find(
                    item => item === this.admins[0].person.nationality.english
                  );
                  if (country !== null && country !== undefined) {
                    this.isGcc = true;
                  } else {
                    this.isGcc = false;
                  }
                }
                if (this.admins[0].person) {
                  if (this.admins[0].person.name.arabic.firstName === 'NIL') {
                    this.admins[0].person.name.arabic.firstName = null;
                  }
                  if (this.admins[0].person.name.arabic.familyName === 'NIL') {
                    this.admins[0].person.name.arabic.familyName = null;
                  }
                  this.updateDetailsForm.get('personExists').setValue(true);
                  this.estAdmin = new Admin();
                  this.estAdmin?.person.fromJsonToObject(this.admins[0].person);
                  return this.estAdmin;
                }
              }),
              tap((res: Admin) => {
                this.estAdmin = res;
                this.bindPersonFormModel(this.estAdmin);
                this.updateDetailsForm.get('isVerified').setValue(true);
              })
            )
            .subscribe(noop, err => {
              return this.alertService.showError(err?.error?.message);
            });
        })
      )
      .subscribe(noop, err => this.alertService.showError(err?.error?.message));
  }
  /**
   * This method is to check if the data is null or not
   * @param control
   */
  checkNull(control) {
    return checkBilingualTextNull(control);
  }
  confirmTemplates() {
    this.alertService.clearAlerts();
    this.updateDetailsForm.get('person').updateValueAndValidity();
    markFormGroupTouched(this.updateDetailsForm);
    const superAdmin = new Admin();
    superAdmin.person = this.estAdmin.person;
    const roles = 'Branches Account Manager';
    superAdmin.roles = getAdminRole([roles]);
    superAdmin.person?.fromJsonToObject((this.updateDetailsForm.get('person') as FormGroup)?.getRawValue());
    superAdmin.person.contactDetail = (this.updateDetailsForm.get('contactDetail') as FormGroup).getRawValue();
    if (superAdmin.person.contactDetail.mobileNo && !superAdmin.person?.contactDetail?.mobileNo?.isdCodePrimary) {
      superAdmin.person.contactDetail.mobileNo.isdCodePrimary = GccCountryCode.SAUDI_ARABIA;
    }
    this.estAdmin = superAdmin;
    this.estAdmin.person.identity = filterIdentities(this.estAdmin.person.identity);
    if (this.isGcc) {
      if (!this.updateDetailsForm?.get('person')?.get('id')?.valid) {
        this.alertService.showMandatoryErrorMessage();
        return;
      }
      const nationalId = new NationalId();
      nationalId.id = this.updateDetailsForm?.get('person')?.get('id')?.value;
      nationalId.idType = IdentityTypeEnum.NATIONALID;
      this.estAdmin.person.identity.push(nationalId);
    }
    if (this.updateDetailsForm.get('person').get('name').valid && this.updateDetailsForm.get('contactDetail').valid) {
      this.adminService.saveAdminDetails(this.estAdmin, this.mainRegNo, true).subscribe(
        res => {
          if (res) {
            this.showModal(this.confirmTemplate, 'lg', true);
          }
        },
        err => this.alertService.showError(err?.error?.message)
      );
    } else {
      this.alertService.showMandatoryErrorMessage();
    }
  }
  updateTransaction() {
    this.authTokenService.doLogout();
    this.hideModal();
  }
  cancelTransaction() {
    this.authTokenService.doLogout();
    this.hideModal();
  }
}
