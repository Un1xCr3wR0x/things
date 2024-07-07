/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BilingualText,
  bindToObject,
  CRNDetails,
  DocumentItem,
  DocumentService,
  Establishment,
  EstablishmentRouterData,
  EstablishmentToken,
  LookupService,
  LovList,
  markFormGroupTouched,
  RouterConstants,
  RouterData,
  RouterDataToken,
  TransactionFeedback,
  TransactionInterface,
  TransactionMixin,
  TransactionService,
  UuidGeneratorService,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import {
  ChangeEstablishmentScBaseComponent,
  ChangeEstablishmentService,
  DocumentNameEnum,
  DocumentTransactionIdEnum,
  DocumentTransactionTypeEnum,
  EstablishmentConstants,
  EstablishmentRoutesEnum,
  EstablishmentService,
  getDocumentContentIds,
  hasCrn,
  hasNumberFieldChange,
  hasUnn,
  isDocumentsValid,
  isEstablishmentTokenValid
} from '../../../shared';
import {
  bindCrnToForm,
  bindIdentifierForm,
  cancelIdentifierTransaction,
  changeIdentifierDocumentsValidations,
  changeIdentifierFieldsValidation,
  checkChangesForValidator as initialiseStateForValidator,
  getCrnControls,
  hasCrnChanged,
  hasLicenseChanged,
  isValidForSubmit
} from './change-identifier-helper';
import { createChangeIdentifierDetailsForm } from './identifier-form';
import { DashboardSearchService } from '@gosi-ui/foundation-dashboard/lib/search/services';

@Component({
  selector: 'est-change-identifier-details-sc',
  templateUrl: './change-identifier-details-sc.component.html',
  styleUrls: ['./change-identifier-details-sc.component.scss']
})
export class ChangeIdentifierDetailsScComponent
  extends TransactionMixin(ChangeEstablishmentScBaseComponent)
  implements TransactionInterface, OnInit
{
  licenceNumberMaxLength = EstablishmentConstants.LICENSE_MAX_LENGTH;
  readonly crnMax = EstablishmentConstants.CRN_MAX_LENGTH;
  readonly nationalNoLength = EstablishmentConstants.UNIFIED_NATIONAL_NO_LENGTH;
  registrationNo: number;
  referenceNo: number;
  licenseIssueAuthorityList$: Observable<LovList>;
  identifierDetailsDocuments: DocumentItem[];
  documentTransactionId = DocumentTransactionIdEnum.CHANGE_IDENTIFIER_DETAILS;
  documentTransactionType = DocumentTransactionTypeEnum.CHANGE_IDENTIFIER_DETAILS;
  changeIdentifierDetailsForm: FormGroup;
  routeToView: string;
  maxIssueDate = new Date();
  currentDate = new Date();
  nextDay = new Date();
  hasCrn: boolean;
  hasLicenseChanged: boolean;
  hasCrnChanged: boolean;
  hasRecruitmentNoChanged: boolean;
  isValidator = false;
  transactionFeedback: TransactionFeedback;
  establishmentName: BilingualText = new BilingualText();
  establishmentAfterChange: Establishment = new Establishment();
  recruitmentNoMaxLength: number = EstablishmentConstants.RECRUITMENT_MAX_LENGTH;
  uuid: string;
  showNationalNo: boolean;
  hasNationalNoChange: boolean;
  isGOL: boolean = false;
  isMci: boolean = false;
  isCrn: boolean = false;
  hasUnn: boolean = false;
  isPpa = false;
  isPpaGCC = false;
  mcVerified: boolean = false;
  showSaveButton: boolean = true;
  payload;
  taskId: string;

  @ViewChild('cancelTemplate', { static: false }) cancelTemplate: TemplateRef<HTMLElement>;
  constructor(
    readonly bsModalService: BsModalService,
    readonly changeEstablishmentService: ChangeEstablishmentService,
    readonly establishmentService: EstablishmentService,
    readonly dashboardSearchService: DashboardSearchService,
    readonly workflowService: WorkflowService,
    readonly alertService: AlertService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(EstablishmentToken) readonly estRouterData: EstablishmentRouterData,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly router: Router,
    readonly uuidService: UuidGeneratorService,
    readonly location: Location,
    readonly transactionService: TransactionService
  ) {
    super(
      establishmentService,
      changeEstablishmentService,
      alertService,
      bsModalService,
      documentService,
      workflowService
    );
    this.nextDay.setDate(this.nextDay.getDate() + 1);
  }

  ngOnInit() {
    if (this.appToken === ApplicationTypeEnum.PUBLIC) {
      this.isGOL = true;
    }
    if (isEstablishmentTokenValid(this.estRouterData, RouterConstants.TRANSACTION_CHANGE_EST_IDENTIFIER_DETAILS)) {
      this.referenceNo = this.estRouterData.referenceNo ? this.estRouterData.referenceNo : null;
      this.isValidator = true;
      this.routeToView = this.isGOL
        ? EstablishmentRoutesEnum.ADMIN_TRANSACTION_BACK_ROUTING
        : EstablishmentRoutesEnum.VALIDATOR_IDENTIFIERS;
      this.changeIdentifierDetailsForm = createChangeIdentifierDetailsForm();
      this.getWorkflowDetails(this.estRouterData);
    } else if (this.changeEstablishmentService.selectedEstablishment) {
      this.routeToView = EstablishmentConstants.EST_PROFILE_ROUTE(
        this.changeEstablishmentService.selectedEstablishment.registrationNo
      );
      this.ppaEstablishment = this.establishmentService.isPpaEstablishment;
      this.establishmentToChange = this.changeEstablishmentService.selectedEstablishment;
      if (this.ppaEstablishment) {
        this.isPpa = true;
        if (this.establishmentToChange.gccCountry) {
          this.isPpaGCC = true;
        }
      }

      this.registrationNo = this.establishmentToChange.registrationNo;
      this.changeIdentifierDetailsForm = createChangeIdentifierDetailsForm();
      this.hasCrn = this.isCrn = hasCrn(this.establishmentToChange);
      bindIdentifierForm(this, this.establishmentToChange);
      this.hasUnn = hasUnn(this.establishmentToChange);
      if (this.appToken === ApplicationTypeEnum.PUBLIC) {
        this.isGOL = true;
      }
      if (this.appToken === ApplicationTypeEnum.PUBLIC && this.hasCrn && this.hasUnn) {
        this.isMci = true;
      }

      if (!this.isValidator) {
        this.uuid = this.uuidService.getUuid();
      }
      this.intialiseView();
    } else {
      this.changeEstablishmentService.navigateToSearch();
    }
    const DepartmentNumberValidations = this.isPpa || this.isValidator;
    if (!DepartmentNumberValidations) {
      this.changeIdentifierDetailsForm.get('departmentNumber').clearValidators();
      this.changeIdentifierDetailsForm.get('departmentNumber').updateValueAndValidity();
    }
    this.setRouterData();
  }
  // Method to get router data for claim pool
  setRouterData() {
    if (this.routerDataToken.payload) {
      this.payload = JSON.parse(this.routerDataToken.payload);
      this.taskId = this.routerDataToken.taskId;
      this.isUnclaimed = this.payload?.isPool;
      this.showSaveButton = this.isValidator ? (this.isUnclaimed ? false : true) : true;
    }
  }
  assignClicked() {
    this.showSaveButton = true;
  }
  releaseClicked() {
    this.showSaveButton = false;
  }

  /**
   * Method to get establishment with reference number from workflow
   * @param referenceNo
   */
  getWorkflowDetails(routerData: EstablishmentRouterData) {
    this.fetchComments(routerData);
    this.fetchEstWithRefNo(routerData.registrationNo, routerData.referenceNo);
  }

  /**
   * Method to fetch establishment with reference number
   */
  fetchEstWithRefNo(regNo: number, referenceNo: number) {
    this.changeEstablishmentService
      .getEstablishmentFromTransient(regNo, referenceNo)
      .pipe(
        tap(res => {
          this.establishmentAfterChange = res;
          this.registrationNo = this.establishmentAfterChange.registrationNo;
          this.isPpaGCC = this.establishmentAfterChange.ppaEstablishment && this.establishmentAfterChange.gccCountry;
          bindIdentifierForm(this, res);
        })
      )
      .subscribe(
        () => {
          this.intialiseView();
        },
        () => {
          this.changeEstablishmentService.navigateToIdentifierValidator();
        }
      );
  }

  // to initialize the view
  intialiseView() {
    this.licenseIssueAuthorityList$ = this.lookupService.getLicenseIssueAuthorityList();
    this.getDocuments();
  }

  /**
   * Method to Verify Crn
   * @param value
   */
  verifyCRNNumber() {
    this.alertService.clearAlerts();
    markFormGroupTouched(this.changeIdentifierDetailsForm?.get('crn') as FormGroup);
    if (
      !this.changeIdentifierDetailsForm?.get('crn')?.get('number')?.valid ||
      !this.changeIdentifierDetailsForm?.get('unifiedNationalNumber')?.valid
    ) {
      this.alertService.showMandatoryErrorMessage();
      return;
    }
    const crNo = this.changeIdentifierDetailsForm?.get('crn')?.get('number')?.value;
    const unn = this.changeIdentifierDetailsForm.get('unifiedNationalNumber').value;
    if (unn) {
      this.establishmentService
        .getCrnDetailsFromMci(crNo, this.establishmentToChange?.registrationNo, unn)
        .pipe(
          tap(res => {
            const crn = res;
            crn.mciVerified = true;
            bindCrnToForm(this.changeIdentifierDetailsForm.get('crn') as FormGroup, crn);
            this.hasCrnChanged = hasCrnChanged(
              this.establishmentToChange.crn,
              (this.changeIdentifierDetailsForm.get('crn') as FormGroup).getRawValue()
            );
            changeIdentifierFieldsValidation(this);
            changeIdentifierDocumentsValidations(this);
          })
        )
        .subscribe(
          () => {
            this.alertService.showSuccessByKey('ESTABLISHMENT.CRN-VERIFIED');
            this.mcVerified = true;
          },
          err => {
            this.alertService.showError(err?.error?.message);
            this.mcVerified = false;
          }
        );
    }
  }

  /**
   * Check for Crn Changes
   */
  checkCrnChanges() {
    const crnForm = this.changeIdentifierDetailsForm.get('crn') as FormGroup;
    this.hasCrnChanged = hasCrnChanged(this.establishmentToChange.crn, crnForm.getRawValue());
    changeIdentifierFieldsValidation(this);
    changeIdentifierDocumentsValidations(this);
    const crnControls = getCrnControls(this.changeIdentifierDetailsForm);
    if (hasCrnChanged && crnControls[0].value !== this.establishmentToChange.crn?.number) {
      crnControls[1].setValue(null);
      crnControls[2].setValue(false);
      crnControls[3].setValue(null);
    }
    if (
      this.changeIdentifierDetailsForm.get('crn').get('number').value !== null &&
      this.changeIdentifierDetailsForm.get('crn').get('number').value !== ''
    ) {
      this.isCrn = true;
    } else {
      this.isCrn = false;
    }
  }

  /**
   * Method to clear CRN Details
   */
  resetCRNDetails() {
    this.alertService.clearAlerts();
    bindCrnToForm(this.changeIdentifierDetailsForm.get('crn') as FormGroup, new CRNDetails());
    this.checkCrnChanges();
  }

  /**
   * Method to get all documents
   */
  getDocuments() {
    this.documentService
      .getDocuments(
        this.documentTransactionType,
        this.documentTransactionType,
        this.registrationNo,
        this.referenceNo,
        null,
        this.referenceNo ? null : this.uuid
      )
      .subscribe(res => this.performDocumentValidations(res));
  }

  /**
   * Method to perform document validations during intialisation
   * @param docs
   */
  performDocumentValidations(docs: DocumentItem[]) {
    this.identifierDetailsDocuments = docs.map(doc => bindToObject(new DocumentItem(), doc));
    //Initialise with no Crn
    this.identifierDetailsDocuments.forEach(doc => {
      if (doc.name.english === DocumentNameEnum.COMMERCIAL_REG_DOCUMENT) {
        doc.required = false;
        doc.show = false;
      } else {
        doc.show = true;
      }
      if (this.isGOL && this.isMci) {
        doc.required = false;
        doc.show = false;
      } else if (doc.name.english === DocumentNameEnum.OTHERS_DOCUMENT) {
        doc.required = false;
        doc.show = true;
      } else {
        doc.required = true;
        doc.show = true;
      }
    });
    changeIdentifierDocumentsValidations(this);
    if (this.isValidator) {
      this.getEstablishment(this.establishmentAfterChange.registrationNo);
    }
  }

  /**
   * method to get the details of the establishment profile before editing
   * @param registrationNo
   */
  getEstablishment(registrationNo: number) {
    this.establishmentService
      .getEstablishment(registrationNo)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        res => {
          this.establishmentToChange = res;
          initialiseStateForValidator(this);
        },
        err => {
          this.alertService.showError(err.error.message);
        }
      );
  }

  /**
   * Method to filter and alter document mandatory
   */
  hasRecruitmentNumberChanged() {
    this.hasRecruitmentNoChanged = hasNumberFieldChange(
      this.establishmentToChange.recruitmentNo,
      this.getRecruitNoCtrlValue()
    );
    changeIdentifierDocumentsValidations(this);
  }

  hasNationalNoChanged() {
    this.hasNationalNoChange = hasNumberFieldChange(
      this.establishmentToChange.recruitmentNo,
      Number(this.changeIdentifierDetailsForm?.get('unifiedNationalNumber').value)
    );
    if (this.hasNationalNoChange) changeIdentifierDocumentsValidations(this);
    if (
      this.changeIdentifierDetailsForm.get('unifiedNationalNumber').value !== null &&
      this.changeIdentifierDetailsForm.get('unifiedNationalNumber').value !== ''
    ) {
      this.hasUnn = true;
    } else {
      this.hasUnn = false;
    }
  }

  /**
   * Method to make the value mandatory
   */
  makeLicenseMandatory() {
    const est = this.establishmentToChange;
    const estChanged = this.changeIdentifierDetailsForm.getRawValue();
    this.hasLicenseChanged = hasLicenseChanged(est, estChanged);
    changeIdentifierFieldsValidation(this);
    changeIdentifierDocumentsValidations(this);
  }

  /**
   * Method to cancel the transaction
   */
  cancelModal() {
    this.alertService.clearAlerts();
    this.hideModal();
    this.cancelIdentifier();
  }
  /**method to call cancel identifier transaction */

  cancelIdentifier() {
    cancelIdentifierTransaction(this);
  }
  /**
   * Method to update the identifier details
   */
  updateIdentifierDetails() {
    this.alertService.clearAlerts();
    this.changeIdentifierDetailsForm.updateValueAndValidity();
    markFormGroupTouched(this.changeIdentifierDetailsForm);
    if (this.hasCrn && this.hasUnn && !this.mcVerified) {
      this.alertService.showErrorByKey('ESTABLISHMENT.ERROR.VERIFY-CRN');
    } else if (isValidForSubmit(this)) {
      this.changeEstablishmentService
        .changeIdentifierDetails(this.registrationNo, {
          ...this.changeIdentifierDetailsForm.getRawValue(),
          ...{
            contentIds: getDocumentContentIds(this.identifierDetailsDocuments)
          },
          referenceNo: this.referenceNo,
          uuid: this.uuid
        })
        .subscribe(
          res => {
            this.transactionFeedback = new TransactionFeedback();
            this.transactionFeedback = res;
            if (this.isValidator) {
              this.updateBpm(
                this.estRouterData,
                this.changeIdentifierDetailsForm.get('comments').value,
                res.successMessage
              ).subscribe(
                () => {
                  this.setTransactionComplete();
                  this.router.navigate([EstablishmentConstants.ROUTE_TO_INBOX(this.appToken)]);
                },
                err => {
                  this.alertService.showError(err?.error?.message);
                }
              );
            } else {
              this.setTransactionComplete();
              this.location.back();
              this.alertService.showSuccess(this.transactionFeedback.successMessage);
            }
          },
          err => this.alertService.showError(err.error.message)
        );
    }
  }
  /**
   * Method to get the license controls
   */
  getLicenseControls(): Array<FormControl> {
    const licenseform: FormGroup = this.changeIdentifierDetailsForm.get('license') as FormGroup;
    if (licenseform) {
      const licenseNo: FormControl = licenseform.get('number') as FormControl;
      const issuingAuth: FormControl = licenseform.get('issuingAuthorityCode')?.get('english') as FormControl;
      const issueDate: FormControl = licenseform.get('issueDate')?.get('gregorian') as FormControl;
      const expiryDate: FormControl = licenseform.get('expiryDate')?.get('gregorian') as FormControl;
      this.changeIdentifierDetailsForm.get('expiryDate')?.get('gregorian').clearValidators();
      this.changeIdentifierDetailsForm.get('expiryDate')?.get('expiryDate').updateValueAndValidity();
      return [licenseNo, issuingAuth, issueDate, expiryDate];
    }
  }

  //Method to get recruitment no
  getRecruitNoCtrlValue(): number {
    return Number(this.changeIdentifierDetailsForm?.get('recruitmentNo').value);
  }
  askForCancel() {
    this.showModal(this.cancelTemplate);
  }

  navigateRoutelink() {
    this.router.navigate([this.routeToView]);
  }
}
