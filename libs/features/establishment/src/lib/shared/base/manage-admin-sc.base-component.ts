/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Directive, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  AlertService,
  ApplicationTypeToken,
  getIdentityByType,
  LookupService,
  LovList,
  markFormGroupTouched,
  Person,
  WizardItem,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { noop, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { EstablishmentConstants } from '../constants';
import { Admin, PersonDetailsFormModel } from '../models';
import { AdminQueryParam } from '../models/admin-query-param';
import { EstablishmentService } from '../services';
import { EstablishmentScBaseComponent } from './establishment-sc.base-component';
@Directive()
export abstract class ManageAdminScBaseComponent extends EstablishmentScBaseComponent {
  constructor(
    readonly bsModalService: BsModalService,
    readonly lookUpService: LookupService,
    readonly alertService: AlertService,
    readonly establishmentService: EstablishmentService,
    @Inject(ApplicationTypeToken) readonly appType: string,
    readonly location: Location,
    readonly workflowService: WorkflowService
  ) {
    super(bsModalService, workflowService);
  }

  /**
   * Local Variables
   */

  personFormDetail = new PersonDetailsFormModel();
  estAdminForm: FormGroup;
  nationalityList$: Observable<LovList>;
  genderList$: Observable<LovList>;
  countryList$: Observable<LovList>;
  cityList$: Observable<LovList>;
  isGCC = false;
  defaultToSaudi = true;
  estAdmin: Admin;
  person: Person;
  adminWizards: WizardItem[];
  currentTab = 0;

  /**
   * create establishment admin form
   */
  createEstAdminForm() {
    return new FormBuilder().group({
      isVerified: false,
      isSaved: false,
      role: 'Admin',
      personExists: false,
      roleType: '',
      assignedRole: '',
      checkBoxFlag: false,
      comments: '',
      referenceNo: ''
    });
  }

  /**
   * Method to initialise lookups
   */
  intialiseLookUpValues() {
    this.nationalityList$ = this.lookUpService.getNationalityList();
    this.genderList$ = this.lookUpService.getGenderList();
    this.cityList$ = this.lookUpService.getCityList();
    this.countryList$ = this.lookUpService.getCountryList();
  }
  /**
   * Method to verify the establishment admin
   */
  verifyEstAdmin(mainRegNo: number, adminId: number, isAdminReplace = true) {
    this.alertService.clearAlerts();
    markFormGroupTouched(this.estAdminForm);
    const admin = new Admin();
    if (this.estAdminForm.valid) {
      admin.person.fromJsonToObject(this.estAdminForm.get('search').value);
      admin.person.role = EstablishmentConstants.EST_ADMIN;
      this.establishmentService
        .verifyPersonDetails(admin.person)
        .pipe(
          catchError(err => this.handleError(err)),
          switchMap(personRes => {
            if (personRes) {
              const newAdmin = new Admin();
              newAdmin.person.fromJsonToObject(personRes);
              const newAdminId = getIdentityByType(newAdmin.person.identity, newAdmin.person.nationality?.english)?.id;
              const admin$ = isAdminReplace
                ? of(newAdmin)
                : this.checkIfTheAdminIsAlreadyPresent(adminId, newAdminId, mainRegNo).pipe(
                    switchMap(res => {
                      if (res === true) {
                        this.alertService.showErrorByKey('ESTABLISHMENT.ERROR.ALREADY-AN-ADMIN');
                        return throwError(null);
                      } else {
                        return of(newAdmin);
                      }
                    })
                  );
              return admin$.pipe(
                tap(() => {
                  this.estAdminForm.get('personExists').setValue(true);
                })
              );
            } else {
              return of(admin).pipe(
                tap(() => {
                  this.estAdminForm.get('personExists').setValue(false);
                })
              );
            }
          }),
          tap((res: Admin) => {
            this.estAdmin = res;
            this.bindPersonFormModel(this.estAdmin);
            this.estAdminForm.get('isVerified').setValue(true);
            this.estAdminForm.get('person').updateValueAndValidity();
          })
        )
        .subscribe(noop, noop);
    } else {
      this.alertService.showMandatoryErrorMessage();
    }
  }

  /**
   * Method to check if the person to be added has already some roles under logged in admin
   * @param loggedInAdminId
   * @param verifiedAdminId
   */
  checkIfTheAdminIsAlreadyPresent(
    loggedInAdminId: number,
    verifiedAdminId: number,
    mainRegNo: number
  ): Observable<boolean> {
    const params = new AdminQueryParam();
    params.registrationNo = mainRegNo;
    return this.establishmentService.getAdminsUnderSupervisor(loggedInAdminId, params).pipe(
      catchError(err => this.handleError(err)),
      map(res => {
        return res.admins.find(admin => {
          const adminId = getIdentityByType(admin.person.identity, admin.person.nationality?.english)?.id;
          if (adminId === verifiedAdminId || verifiedAdminId === loggedInAdminId) {
            return true;
          }
        })
          ? true
          : false;
      })
    );
  }

  /**
   * Method to handle errors
   * @param err
   */
  handleError(err) {
    this.alertService.showError(err?.error?.message, err?.error?.details);
    return throwError(null);
  }

  /**
   * Bind the person object to the form
   * @param admin
   */
  bindPersonFormModel(admin: Admin) {
    this.person = admin.person;
    if (this.isGCC) {
      this.defaultToSaudi = false;
    } else {
      if (EstablishmentConstants.GCC_NATIONAL.indexOf(this.person.nationality?.english) !== -1) {
        this.defaultToSaudi = false;
      } else {
        this.defaultToSaudi = true;
      }
    }
    this.personFormDetail.fromJsonToObject(admin.person);
  }

  /**
   * Method to reset form
   */
  resetEventDetails(form: FormGroup) {
    if (form) {
      form.get('isSaved').setValue(false);
      form.get('personExists').setValue(false);
      form.get('isVerified').setValue(false);
    }
  }

  /**
   * Method to confirm cancel
   */
  cancelModal() {
    this.alertService.clearAlerts();
    this.hideModal();
    this.location.back();
  }
  verifySuperAdmin() {
    this.alertService.clearAlerts();
    markFormGroupTouched(this.estAdminForm);
    if (this.estAdminForm.valid) {
      const admin = new Admin();
      admin.person.fromJsonToObject(this.estAdminForm.get('search').value);
      admin.person.role = EstablishmentConstants.EST_ADMIN;
      this.establishmentService
        .verifyPersonDetails(admin.person)
        .pipe(
          catchError(err => this.handleError(err)),
          map(personRes => {
            if (personRes) {
              this.estAdminForm.get('personExists').setValue(true);
              const newAdmin = new Admin();
              newAdmin.person.fromJsonToObject(personRes);
              return newAdmin;
            } else {
              this.estAdminForm.get('personExists').setValue(false);
              return admin;
            }
          }),
          tap((res: Admin) => {
            this.estAdmin = res;
            this.bindPersonFormModel(this.estAdmin);
            this.estAdminForm.get('isVerified').setValue(true);
            this.estAdminForm.get('person')?.updateValueAndValidity();
          })
        )
        .subscribe();
    } else {
      this.alertService.showMandatoryErrorMessage();
      return;
    }
  }
}
