/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { TeamManagementService } from '../../shared/services';
import {
  ContactDetails,
  WorkflowService,
  AlertService,
  IdentityManagementService,
  startOfDay,
  BilingualText,
  Channel,
  ValidatorStatus,
  endOfDay
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
  BlockPeriodModalTypeEnum,
  BlockPeriod,
  ValidatorProfile,
  VacationPeriod,
  VacationResponse,
  RouterConstants,
  StatusLabelEnum,
  ReporteeObject
} from '../../shared';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';

@Component({
  selector: 'tm-validator-profile-sc',
  templateUrl: './validator-profile-sc.component.html',
  styleUrls: ['./validator-profile-sc.component.scss']
})
export class ValidatorProfileScComponent implements OnInit, OnDestroy {
  /**
   * local variables
   */
  contact = new ContactDetails();
  modalRef: BsModalRef;
  blockPeriod: BlockPeriod;
  blockPeriods: BlockPeriod[] = [];
  userId: string;
  validatorProfileDetails = new ValidatorProfile();
  type = BlockPeriodModalTypeEnum;
  startDate: string;
  endDate: string;
  form: FormGroup = new FormGroup({});
  routeSubscription: Subscription;
  @ViewChild('addBlock') addBlock: TemplateRef<HTMLElement>;
  @ViewChild('modifyBlock') modifyBlock: TemplateRef<HTMLElement>;
  @ViewChild('removeBlock') removeBlock: TemplateRef<HTMLElement>;
  /**
   *
   * @param tmService
   * @param alertService
   * @param workflowService
   * @param modalService
   * @param datePipe
   * @param fb
   * @param route
   * @param idmService
   */
  constructor(
    readonly tmService: TeamManagementService,
    readonly alertService: AlertService,
    readonly workflowService: WorkflowService,
    readonly modalService: BsModalService,
    readonly datePipe: DatePipe,
    readonly fb: FormBuilder,
    readonly route: ActivatedRoute,
    readonly idmService: IdentityManagementService,
    readonly router: Router
  ) {}
  /**
   * method to initialise tasks
   */
  ngOnInit(): void {
    if (this.tmService.validatorProfile !== null) {
      this.userId = this.tmService.validatorProfile.id;
      this.getProfileData();
      this.getVacationPeriods();
      this.getActiveVactionPeriod();

      this.form = this.fb.group({
        startDate: [null, Validators.required],
        endDate: [null, Validators.required],
        reason: [null, Validators.compose([Validators.required, Validators.maxLength(100)])]
      });
    } else this.router.navigate([RouterConstants.ROUTE_MY_TEAM]);
  }
  getActiveVactionPeriod() {
    this.tmService.getVacationPeriods(this.userId, true).subscribe(res => {
      this.getCurrentStatus(res);
      this.getCurrentStatus(res);
    });
  }

  /**
   * method to get profile data
   */
  getProfileData() {
    const profile: ReporteeObject = this.tmService.validatorProfile;
    this.contact = new ContactDetails();
    this.contact.emailId.primary = profile.mail === 'null' ? null : profile.mail;
    this.contact.mobileNo.primary = profile.mobile === 'null' ? null : profile.mobile;
    this.validatorProfileDetails.arabicName = profile.name;
    this.validatorProfileDetails.employeeId = profile.id;
    this.validatorProfileDetails.role = profile.role ? profile.role : null;
  }
  getCurrentStatus(response) {
    if (response?.length === 1) {
      if (response[0]?.channel === Channel.TAMAM) {
        this.validatorProfileDetails.statusLabel = StatusLabelEnum.BLOCKED;
        this.validatorProfileDetails.status = ValidatorStatus.BLOCKED;
      } else {
        this.validatorProfileDetails.statusLabel = StatusLabelEnum.BLOCKED;
        this.validatorProfileDetails.status = ValidatorStatus.BLOCKED;
      }
    } else if (response?.length === 0) {
      this.validatorProfileDetails.statusLabel = StatusLabelEnum.ACTIVE;
      this.validatorProfileDetails.status = ValidatorStatus.ACTIVE;
    }
  }

  /** Method to show modal. */
  showModal(template: TemplateRef<HTMLElement>, size: string): void {
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-${size} modal-dialog-centered` };
    this.modalRef = this.modalService.show(template, config);
  }

  /** Method to hide modal. */
  hideModal(): void {
    if (this.modalRef) this.modalRef.hide();
    this.form?.reset();
  }
  /**
   *
   * @param action method to open modal
   * @param blockPeriod
   */
  openModal(action: string, blockPeriod?: BlockPeriod) {
    if (action === this.type.ADD_BLOCK) {
      this.showModal(this.addBlock, 'lg');
    } else if (action === this.type.MODIFY_BLOCK) {
      this.blockPeriod = blockPeriod;
      this.showModal(this.modifyBlock, 'lg');
    } else {
      this.blockPeriod = blockPeriod;
      this.startDate = this.datePipe.transform(blockPeriod?.startDate, 'dd/MM/yyyy');
      this.endDate = this.datePipe.transform(blockPeriod?.endDate, 'dd/MM/yyyy');
      this.showModal(this.removeBlock, 'lg');
    }
  }
  /**
   * method to delete vacation period
   */
  onConfirm() {
    this.alertService.clearAlerts();
    this.deleteVacationPeriod(this.blockPeriod);
  }
  /**
   * method to get vacation period
   */
  getVacationPeriods() {
    this.tmService.getVacationPeriods(this.userId).subscribe((res: BlockPeriod[]) => {
      this.blockPeriods = res;
    });
  }
  /**
   * method to set vacation period
   */
  setVacationPeriod() {
    this.alertService.clearAlerts();
    const vacationObject: VacationPeriod = {
      endDate: endOfDay(new Date(this.form.get('endDate').value))
        .toISOString()
        .slice(0, -1),
      reason: this.form.get('reason').value,
      startDate: startOfDay(new Date(this.form.get('startDate').value))
        .toISOString()
        .slice(0, -1),
      userId: this.userId
    };
    this.tmService.setVacationPeriods(vacationObject).subscribe((response: VacationResponse) => {
      this.alertService.showSuccess(response.message);
      this.getVacationPeriods();
      this.getActiveVactionPeriod();
    });
    this.hideModal();
  }
  /**
   * method to update vacation period
   */
  updateVacationPeriod() {
    this.alertService.clearAlerts();
    const vacationObject: VacationPeriod = {
      endDate: this.form.get('endDate').dirty
        ? endOfDay(this.form.get('endDate').value).toISOString().slice(0, -1)
        : endOfDay(this.blockPeriod.endDate).toISOString().slice(0, -1),
      reason: this.form.get('reason').value,
      startDate: this.form.get('startDate').dirty
        ? startOfDay(this.form.get('startDate').value).toISOString().slice(0, -1)
        : startOfDay(this.blockPeriod.startDate).toISOString().slice(0, -1),
      userId: this.userId
    };
    this.tmService
      .updateVacationPeriods(vacationObject, this.blockPeriod.employeeVacationId)
      .subscribe((response: VacationResponse) => {
        this.alertService.showSuccess(response.message);
        this.getVacationPeriods();
        this.getActiveVactionPeriod();
      });
    this.hideModal();
  }
  /**
   *
   * @param blockPeriod method to delete vacation period
   */
  deleteVacationPeriod(blockPeriod: BlockPeriod) {
    this.alertService.clearAlerts();
    this.tmService.deleteVacationPeriods(blockPeriod).subscribe((response: BilingualText) => {
      this.alertService.showSuccess(response);
      this.getVacationPeriods();
      this.getActiveVactionPeriod();
    });
    this.hideModal();
  }
  ngOnDestroy() {
    this.tmService.validatorProfile = null;
  }
}
