/**
 * ~ Copyright GOSI. All Rights Reserved.
  ~  This software is the proprietary information of GOSI.
  ~  Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  BilingualText,
  LookupService,
  TransactionFeedback,
  TransactionInterface,
  TransactionMixin,
  WorkflowService,
  getIdentityByType
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable, noop, throwError } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import {
  Admin,
  EstablishmentAdminService,
  EstablishmentErrorKeyEnum,
  EstablishmentService,
  filterIdentities
} from '../../../shared';
import { ManageAdminScBaseComponent } from '../../../shared/base/manage-admin-sc.base-component';
import { getAdminRole, mapAdminRolesToId } from '../../../shared/utils';
import { incorrectRoute } from '../admin-sc/admin-sc.component';

@Component({
  selector: 'est-replace-admin-sc',
  templateUrl: './replace-admin-sc.component.html',
  styleUrls: ['./replace-admin-sc.component.scss']
})
export class ReplaceAdminScComponent
  extends TransactionMixin(ManageAdminScBaseComponent)
  implements TransactionInterface, OnInit
{
  /**
   * Local variables
   */
  selectedAdmin: Admin;
  selectedAdminId: number;
  selectedAdminRoleId: number;
  loggedInAdminId: number;
  mainRegNo: number;
  loggedInAdminRole: string;
  transactionFeedback: TransactionFeedback;
  adminRoleId: number;
  isSuccess: boolean;
  loggedInAdminRoleId: number;
  @ViewChild('cancelTemplate', { static: false }) cancelTemplate: TemplateRef<HTMLElement>;

  /**
   * Initialising the component
   * @param bsModalService
   */
  constructor(
    readonly lookUpService: LookupService,
    readonly bsModalService: BsModalService,
    readonly alertService: AlertService,
    readonly establishmentService: EstablishmentService,
    readonly adminService: EstablishmentAdminService,
    @Inject(ApplicationTypeToken) readonly appType: string,
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly location: Location,
    readonly workflowService: WorkflowService
  ) {
    super(bsModalService, lookUpService, alertService, establishmentService, appType, location, workflowService);
    this.estAdminForm = this.createEstAdminForm();
  }

  ngOnInit(): void {
    this.initialiseFromRoutes(this.route.paramMap);
  }

  initialiseFromRoutes(paramMap: Observable<ParamMap>) {
    paramMap.subscribe(
      params => {
        if (params && params.get('adminId') && params.get('registrationNo')) {
          this.loggedInAdminId = +params.get('adminId');
          this.mainRegNo = +params.get('registrationNo');
          this.selectedAdmin = this.establishmentService.selectedAdmin;
          this.selectedAdminId = getIdentityByType(
            this.selectedAdmin.person.identity,
            this.selectedAdmin.person.nationality?.english
          )?.id;
          this.selectedAdmin.person.identity = filterIdentities(this.selectedAdmin.person.identity);
          const roles = this.selectedAdmin.roles as BilingualText[];
          this.selectedAdminRoleId = mapAdminRolesToId(roles)[0];
          this.loggedInAdminRole = this.establishmentService.loggedInAdminRole;
          const loggedInAdminRoles = getAdminRole([this.establishmentService.loggedInAdminRole]);
          this.loggedInAdminRoleId = mapAdminRolesToId(loggedInAdminRoles)
            ? mapAdminRolesToId(loggedInAdminRoles)[0]
            : undefined;
          if (!this.loggedInAdminRole) {
            this.router.navigate(['/home']); //TODO redirect to manage admin page
          }
          this.intialiseLookUpValues();
        } else {
          throwError(incorrectRoute);
        }
      },
      err => this.alertService.showError(err?.error?.message)
    );
  }

  /**
   * Method to save the new admin
   */
  saveAdmin() {
    this.alertService.clearAlerts();
    if (this.estAdminForm.get('isVerified').value === true) {
      const newAdmin = new Admin();
      newAdmin.person = this.estAdmin.person;
      this.selectedAdmin.roles = [];
      newAdmin.roles = [];
      this.loggedInAdminRole = this.establishmentService.loggedInAdminRole;
      const role = getAdminRole([this.loggedInAdminRole]);
      const roleId = mapAdminRolesToId(role) ? mapAdminRolesToId(role)[0] : undefined;
      if (this.estAdminForm.get('contactDetail').valid && this.estAdminForm.get('person').valid) {
        newAdmin.person?.fromJsonToObject((this.estAdminForm.get('person') as FormGroup)?.getRawValue());
        newAdmin.person.contactDetail = (this.estAdminForm.get('contactDetail') as FormGroup).getRawValue();
        newAdmin.person.identity = filterIdentities(newAdmin.person.identity);
        this.adminService
          .saveAsNewAdmin(newAdmin)
          .pipe(
            tap(personRes => {
              newAdmin.person.personId = personRes;
            }),
            switchMap(() =>
              this.adminService.replaceAdminDetails(this.loggedInAdminId, this.mainRegNo, {
                currentAdmin: this.selectedAdmin,
                newAdmin: newAdmin,
                comments: '',
                contentIds: undefined,
                referenceNo: undefined,
                navigationIndicator: undefined
              })
            ),
            tap(res => {
              this.setTransactionComplete();
              this.transactionFeedback = res;
              this.alertService.showSuccess(res?.successMessage);
              this.location.back();
            })
          )
          .subscribe(noop, err => {
            this.alertService.showError(err?.error?.message, err?.error?.details);
          });
      } else {
        this.alertService.showMandatoryErrorMessage();
      }
    } else {
      this.alertService.showErrorByKey(EstablishmentErrorKeyEnum.VERIFY_ADMIN);
    }
  }
  /**
   * Method to confirm cancel
   */
  cancelModal() {
    this.alertService.clearAlerts();
    this.hideModal();
    this.setTransactionComplete();
    this.reRoute ? this.router.navigate([this.reRoute]) : this.location.back();
  }
  askForCancel() {
    this.showModal(this.cancelTemplate);
  }
}
