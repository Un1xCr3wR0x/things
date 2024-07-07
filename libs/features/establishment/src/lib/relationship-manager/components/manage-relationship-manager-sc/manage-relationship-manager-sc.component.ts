import { Location } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, ApplicationTypeToken, Establishment, LookupService, WorkflowService } from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  ActionTypeEnum,
  EstablishmentAdminService,
  EstablishmentService,
  ManageAdminScBaseComponent
} from '../../../shared';
import { RelationshipManager } from '../../../shared/models/relationship-manager';
import { RelationshipManagerResponse } from '../../../shared/models/relationship-manager-response';

import { Manager } from '../../../shared/models/manager';
@Component({
  selector: 'est-manage-relationship-manager-sc',
  templateUrl: './manage-relationship-manager-sc.component.html',
  styleUrls: ['./manage-relationship-manager-sc.component.scss']
})
export class ManageRelationshipManagerScComponent extends ManageAdminScBaseComponent implements OnInit {
  @Output() verify: EventEmitter<number> = new EventEmitter();

  @ViewChild('cancelTemplate', { static: false }) cancelTemplate: TemplateRef<HTMLElement>;
  establishment: Establishment;
  registrationNo: number;
  validEmployeeId: boolean;
  routeToView: string;
  canAdd: boolean;
  canModify: boolean;
  isReset: boolean;
  isVerified = false;
  employeeId: string;
  isrelationshipManager: boolean;
  managerTpnNo: string;
  TpnNumber: string;
  relationshipManagerForm: FormGroup;
  manager: Manager;
  getManager: RelationshipManager;

  relationshipManager: RelationshipManagerResponse;
  relationshipManagerMobileForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    readonly lookUpService: LookupService,
    readonly alertService: AlertService,
    readonly bsModalService: BsModalService,
    readonly establishmentService: EstablishmentService,
    @Inject(ApplicationTypeToken) readonly appType: string,
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly adminService: EstablishmentAdminService,
    readonly location: Location,
    readonly workflowService: WorkflowService
  ) {
    super(bsModalService, lookUpService, alertService, establishmentService, appType, location, workflowService);
  }

  ngOnInit(): void {
    this.setRoutingParams();
    this.relationshipManagerMobileForm = this.createContactForm();
    this.relationshipManagerForm = this.fb.group({
      employeeId: [null, { validators: Validators.required }]
    });
    if (this.canModify) {
      this.establishmentService.getRelationshipManager(this.registrationNo).subscribe(res => {
        this.getManager = res;
        this.relationshipManagerForm.get('employeeId').setValue(this.getManager.employeeId);
        this.relationshipManagerMobileForm.get('mobileNo').setValue(this.getManager.mobileNo);
        this.isrelationshipManager = true;
        this.isVerified = true;
        if (this.getManager?.telephoneNumber !== 'null') this.TpnNumber = this.getManager?.telephoneNumber;
      });
    }
  }

  setRoutingParams() {
    this.route.paramMap.subscribe(
      param => (this.registrationNo = param.get('registrationNo') ? Number(param.get('registrationNo')) : null)
    );
    if (this.router.url.indexOf('/add') >= 0) {
      this.canAdd = true;
    } else if (this.router.url.indexOf('/modify') >= 0) {
      this.canModify = true;
    }
  }

  createContactForm() {
    return this.fb.group({
      mobileNo: [null],
      isdCodePrimary: ['sa', { updateOn: 'blur' }]
    });
  }

  verifyEmployeeId() {
    this.isVerified = false;
    const employeeId = this.relationshipManagerForm.get('employeeId').value;
    this.relationshipManagerForm.markAllAsTouched();
    if (this.relationshipManagerForm.valid) {
      this.establishmentService.getRelationshipManagerInfo(this.registrationNo, employeeId).subscribe(
        res => {
          this.manager = res;
          this.isVerified = true;
          if (this.manager?.telephoneNumber !== 'null') this.managerTpnNo = this.manager?.telephoneNumber;
        },
        err => this.alertService.showError(err.error.message)
      );
    }
  }
  resetEmployeeId() {
    this.isReset = true;
    this.relationshipManagerForm.reset();
    this.relationshipManagerMobileForm.reset();
    this.isVerified = false;
  }

  submitTransaction() {
    if (
      this.isVerified === true &&
      (this.relationshipManagerMobileForm.get('mobileNo').value === null ||
        this.relationshipManagerMobileForm.get('mobileNo').value === '' ||
        this.relationshipManagerMobileForm.get('mobileNo').valid)
    ) {
      this.establishmentService
        .saveRelationshipManager(this.registrationNo, this.canModify, {
          emailId: this.isrelationshipManager && !this.isReset ? this.getManager?.emailId : this.manager?.email,
          employeeId: this.relationshipManagerForm.get('employeeId').value,
          employeeName:
            this.isrelationshipManager && !this.isReset ? this.getManager?.employeeName : this.manager?.longNameArabic,
          mobileNo: this.relationshipManagerMobileForm.get('mobileNo').value
            ? this.relationshipManagerMobileForm.get('mobileNo').value
            : null,
          recordAction: this.canAdd
            ? ActionTypeEnum.ADD
            : this.canModify && this.isReset
            ? ActionTypeEnum.REPLACE
            : ActionTypeEnum.MODIFY,
          telephoneNumber:
            this.isrelationshipManager && !this.isReset
              ? this.getManager?.telephoneNumber
              : this.manager?.telephoneNumber
        })
        .subscribe(
          res => {
            this.relationshipManager = res;
            this.location.back();
            this.alertService.showSuccess(this.relationshipManager?.message);
          },
          err => this.alertService.showError(err.error.message)
        );
    } else {
      this.alertService.showMandatoryErrorMessage();
    }
  }
  /**
   * Method to cancel the transaction
   */
  cancelModal() {
    this.alertService.clearAlerts();
    this.hideModal();
    this.location.back();
  }
  askForCancel() {
    this.showModal(this.cancelTemplate);
  }
  removeTransaction(removeTemplate: TemplateRef<HTMLElement>) {
    this.alertService.clearAlerts();
    this.showModal(removeTemplate);
  }
  confirmDelete() {
    this.establishmentService
      .saveRelationshipManager(this.registrationNo, this.canModify, {
        emailId: this.isrelationshipManager && !this.isReset ? this.getManager?.emailId : this.manager?.email,
        employeeId: this.relationshipManagerForm.get('employeeId').value,
        employeeName:
          this.isrelationshipManager && !this.isReset ? this.getManager?.employeeName : this.manager?.longNameArabic,
        mobileNo: this.relationshipManagerMobileForm.get('mobileNo').value
          ? this.relationshipManagerMobileForm.get('mobileNo').value
          : null,
        recordAction: ActionTypeEnum.REMOVE,
        telephoneNumber:
          this.isrelationshipManager && !this.isReset ? this.getManager?.telephoneNumber : this.manager?.telephoneNumber
      })
      .subscribe(
        res => {
          this.relationshipManager = res;
          this.location.back();
          this.alertService.showSuccess(this.relationshipManager?.message);
        },
        err => this.alertService.showError(err.error.message)
      );
  }
}
