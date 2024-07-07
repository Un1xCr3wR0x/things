/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, ViewChild, TemplateRef, HostListener, OnDestroy } from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import {
  BenefitConstants,
  BenefitType,
  UITransactionType,
  WorkFlowType,
  clearAlerts,
  showErrorMessage,
  markFormGroupTouched,
  showModal
} from '../../../shared';
import { AnnuityBaseComponent } from '../../base/annuity.base-component';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import { BsModalRef } from 'ngx-bootstrap/modal/ngx-bootstrap-modal';
import { FormGroup, Validators } from '@angular/forms';
import moment from 'moment';

@Component({
  selector: 'bnt-disability-assessment-sc',
  templateUrl: './disability-assessment-sc.component.html',
  styleUrls: ['./disability-assessment-sc.component.scss']
})
export class DisabilityAssessmentScComponent extends AnnuityBaseComponent implements OnInit, OnDestroy {
  // wizardItems: WizardItem[] = [];
  disabilityAssessmenttransctionID: string;
  commonModalRef: BsModalRef;
  requestDisabilityAssessmentForm = new FormGroup({});
  isSmallScreen: boolean;
  requestDetailsForm: FormGroup;
  /**
   * ViewChild components
   */

  @ViewChild('disabilityAssessmentDetailsTab', { static: false })
  disabilityAssessmentDetailsTab: TabsetComponent;

  @ViewChild('applyDisabilityBenefitWizard', { static: false })
  applyDisabilityBenefitWizard: ProgressWizardDcComponent;

  @ViewChild('confirmTemplate', { static: true })
  confirmTemplate: TemplateRef<HTMLElement>;

  @ViewChild('confirmTransactionTemplate', { static: true })
  confirmTransactionTemplate: TemplateRef<HTMLElement>;

  ngOnInit(): void {
    this.initVariables();
    this.initialiseTabWizards();
    this.getSystemRunDate();
    this.requestDetailsForm = this.createrequestDetailsForm();
    //setting the benefitType amd transaction id
    this.benefitType = BenefitType.NonOccDisabilityAssessment;
    this.disabilityAssessmenttransctionID = BenefitConstants.TRANSACTIONID_NON_OCCUPATIONAL_DISABILITY;
    this.benefitPropertyService.setBenType(BenefitType.NonOccDisabilityAssessment);
    this.transactionKey = UITransactionType.REQUEST_NON_OCC_DISABILITY_TRANSACTION;
    this.workflowType = WorkFlowType.REQUEST_NON_OCCUPATIONAL_BENEFIT;
    this.route.queryParams.subscribe(params => {
      this.isNonOcc = params.nonocc === 'true' ? true : false;
    });
    this.requestDisabilityAssessmentForm = this.createrequestDisabilityAssessmentForm();
    if (this.isNonOcc) {
      // pensionTransactionId is set in setBenefitRequestIdForNonOcc for non Occ
      this.setBenefitRequestIdForNonOcc();
    }
  }
  createrequestDetailsForm() {
    return this.fb.group({
      requestDate: this.fb.group({
        gregorian: [null, Validators.required],
        hijiri: [null]
      })
    });
  }
  /*
   * This initialise the wizard items
   */
  initialiseTabWizards() {
    this.wizardItems = this.wizardService.getDisabilityAssesmentWizardItems();
    this.wizardItems[this.currentTab].isActive = true;
    this.wizardItems[0].isDisabled = false;
    if (this.currentTab === 1) {
      this.wizardItems[0].isDone = true;
    }
  }

  /*
   * This method create Disability assessment form
   */
  createrequestDisabilityAssessmentForm() {
    return this.fb.group({
      disabilityDescription: [null, { validators: Validators.required }]
    });
  }
  getSystemRunDate() {
    this.manageBenefitService.getSystemRunDate().subscribe(res => {
      this.systemRunDate = res;
      this.maxDate = moment(this.systemRunDate.gregorian).toDate();
    });
  }

  /*
   * This method is to select wizard
   */
  selectedWizard(index: number) {
    this.selectWizard(index, this.disabilityAssessmentDetailsTab, this.wizardItems);
  }

  /*
   * This method is to submit benefit details
   */
  saveDisabilityDescription() {
    //check if the user entered disability description
    if (this.requestDisabilityAssessmentForm.get('disabilityDescription').value == null) {
      this.showOtpError = clearAlerts(this.alertService, this.showOtpError);
      this.alertService.showWarningByKey('BENEFITS.SELECT-DISABILITY-DESCRIPTION');
      window.scrollTo(0, document.body.scrollHeight);
      markFormGroupTouched(this.requestDisabilityAssessmentForm);
    } else {
      this.benefitsForm.addControl(
        'disabilityDescription',
        this.requestDisabilityAssessmentForm.get('disabilityDescription')
      );
      this.benefitsForm.addControl('requestDate', this.requestDetailsForm.get('requestDate'));
      // this.requestDetails.disabilityDescription = this.requestDisabilityAssessmentForm.get(
      //   'disabilityDescription'
      // ).value;
      // calling POST/PUT api
      this.applyBenefit(this.disabilityAssessmentDetailsTab, this.applyDisabilityBenefitWizard);
    }
  }

  ///-----------------------------functions from document upload page----------------------------

  /** Method to handle doc upload. */
  docUploadSuccess(event) {
    this.patchBenefitWithCommentsAndNavigate(
      event,
      this.disabilityAssessmentDetailsTab,
      this.applyDisabilityBenefitWizard
    );
  }

  /*
   * This method is to go to previous form
   */
  previousForm() {
    this.goToPreviousForm(this.disabilityAssessmentDetailsTab, this.applyDisabilityBenefitWizard);
  }

  /** Method to handle cancellation of transaction. */
  cancelTransaction() {
    clearAlerts(this.alertService, this.showOtpError);
    this.commonModalRef = showModal(
      this.modalService,
      (!this.benefitRequestId && !this.routerData?.draftRequest) || this.routerData?.assigneeId
        ? this.confirmTemplate
        : this.confirmTransactionTemplate
    );
  }
  //This method is to decline cancellation of transaction
  decline() {
    this.commonModalRef.hide();
  }

  /**
   * This method is to show the modal reference
   * @param modalRef
   */
  showModal(modalRef: TemplateRef<HTMLElement>, size?: string) {
    this.commonModalRef = this.modalService.show(
      modalRef,
      Object.assign(
        {},
        {
          class: `modal-${size ? size : 'lg'}`,
          backdrop: true,
          ignoreBackdropClick: true
        }
      )
    );
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    const scrWidth = window.innerWidth;
    this.isSmallScreen = scrWidth <= 992 ? true : false;
  }
  showErrorMessages($event) {
    showErrorMessage($event, this.alertService);
  }
  /** Method to handle clearing alerts before component destroyal . */
  ngOnDestroy() {
    this.alertService.clearAllErrorAlerts();
    this.alertService.clearAllWarningAlerts();
  }
}
