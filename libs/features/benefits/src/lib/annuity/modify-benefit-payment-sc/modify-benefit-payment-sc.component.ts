/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, ViewChild, HostListener, TemplateRef, ViewChildren, QueryList } from '@angular/core';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme/src';
import {
  WizardItem,
  scrollToTop,
  ContactDetails,
  DocumentItem,
  LovList,
  BilingualText,
  ApplicationTypeEnum,
  AddressDetails,
  BPMUpdateRequest,
  WorkFlowActions,
  RoleIdEnum,
  CoreActiveBenefits,
  AddressTypeEnum,
  formatDate,
  BenefitsGosiShowRolesConstants,
  CommonIdentity,
  checkIqamaOrBorderOrPassport
} from '@gosi-ui/core';
import {
  AuthorizationDetailsDto,
  DependentDetails,
  clearAlerts,
  showErrorMessage,
  BenefitConstants,
  HeirStatusType,
  AttorneyDetails,
  AttorneyDetailsWrapper,
  HeirModifyPayeeDetails,
  HeirsDetails,
  PersonalInformation,
  BenefitResponse,
  ModifyPayeeDetails,
  PaymentMethodDetailsDcComponent,
  StopSubmitRequest,
  getServiceType,
  getAuthorizedGuardianDetails,
  Status,
  isHeirLumpsum
} from '../../shared';
import { FormGroup, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { HeirBaseComponent } from '../base/heir.base-component';
import { SystemParameter } from '@gosi-ui/features/contributor';
import moment from 'moment';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'bnt-modify-benefit-payment-sc',
  templateUrl: './modify-benefit-payment-sc.component.html',
  styleUrls: ['./modify-benefit-payment-sc.component.scss']
})
export class ModifyBenefitPaymentScComponent extends HeirBaseComponent implements OnInit {
  checkListValue: FormArray = new FormArray([]);
  currentTab = 0;
  heirDetails: DependentDetails[] = [];
  contactDetail: ContactDetails;
  highlightInvalid = false;
  isEditMode = false;
  isSmallScreen: boolean;
  lang = 'en';
  listYesNo$ = new Observable<LovList>();
  modifyWizards: WizardItem[] = [];
  requestDetailsForm: FormGroup;
  sin: number;
  activeBenefit: CoreActiveBenefits;
  enableRepaymentId: number;
  referenceNumber: number;
  documentuuid: string;
  modifyTransactionConstant = BenefitConstants.MODIFY_PAYEE_TRANSACTION_CONSTANT;
  modifyPayeeId = 'MODIFY_PAYEE';
  modifyPayeeType: string;
  modifyPayeeRsp: BenefitResponse;
  momentObj = moment;
  paymentModeList$: Observable<LovList>;
  personDetails: PersonalInformation;
  bankName: BilingualText;
  isSaveDisabled = true;
  isPrevClicked = false;
  payeeDetails: HeirModifyPayeeDetails = new HeirModifyPayeeDetails();
  modifiedPayeeDetails: ModifyPayeeDetails;
  payeeType = 1;
  addressDetails: AddressDetails[] = [];
  currentMailAddress: string;
  status = Status;
  accessForActionPrivate = BenefitsGosiShowRolesConstants.DIRECT_PAYMENT_ACCESS;
  accessForActionPublic = [RoleIdEnum.SUBSCRIBER, RoleIdEnum.AUTH_PERSON, RoleIdEnum.VIC, RoleIdEnum.BENEFICIARY];
  tableHeading = [
    'BENEFITS.HEIR_NAME',
    'BENEFITS.RELATIONSHIP-WITH-CONTRI',
    'BENEFITS.DATE-OF-BIRTH-AGE-CAP',
    'BENEFITS.HEIR-STATUS-CAP',
    'BENEFITS.STATUS-DATE',
    'BENEFITS.ANNUAL-NOTIFICATION-DATE',
    'BENEFITS.BENEFIT-STATUS'
  ];
  @ViewChild('confirmTemplate', { static: true })
  confirmTemplate: TemplateRef<HTMLElement>;
  @ViewChild('modifyBenefitWizard', { static: false })
  modifyBenefitWizard: ProgressWizardDcComponent;
  @ViewChildren('paymentDetailsComponent')
  paymentDetailsComponent: QueryList<PaymentMethodDetailsDcComponent>;

  ngOnInit(): void {
    // fetching selected language
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP ? true : false;
    this.route.queryParams.subscribe(params => {
      if (params) this.isEditMode = params.edit === 'true';
    });
    this.modifyPayeeType = this.isAppPrivate ? 'REQUEST_BENEFIT_FO' : 'REQUEST_BENEFIT_GOL';
    this.requestDetailsForm = this.createrequestDetailsForm();
    if (!this.isEditMode) {
      this.activeBenefit = this.coreBenefitService.getSavedActiveBenefit();
      this.setActiveBenefitValues();
      this.getHeirDetails();
      this.getLookUpValues();
      this.initializeWizardDetails();
      this.initialisePayeeType();
      this.getSystemParam();
      this.getSystemRunDate();
    } else {
      if (this.routerData.payload) {
        const payload = JSON.parse(this.routerData.payload);
        this.initialiseViewForEdit(payload);
        this.getHeirDetails();
        this.getLookUpValues();
        this.initializeWizardDetails();
        this.initialisePayeeType();
        this.getSystemParam();
        this.getSystemRunDate();
      }
    }
  }

  /* Method to intialise the view in edit mode */
  initialiseViewForEdit(payload) {
    // collecting required data from payload
    this.sin = this.isIndividualApp ? this.authTokenService.getIndividual() : payload.socialInsuranceNo;
    this.benefitRequestId = payload.id;
    this.referenceNo = payload.referenceNo;
    this.channel = payload.channel;
    this.role = payload.assignedRole;
  }

  getSystemParam() {
    this.manageBenefitService.getSystemParams().subscribe(res => {
      this.systemParameter = new SystemParameter().fromJsonToObject(res);
    });
  }

  getSystemRunDate() {
    this.manageBenefitService.getSystemRunDate().subscribe(res => {
      this.systemRunDate = res;
      this.maxDate = moment(this.systemRunDate.gregorian).toDate();
    });
  }

  setActiveBenefitValues() {
    if (this.activeBenefit) {
      this.sin = this.isIndividualApp ? this.authTokenService.getIndividual() : this.activeBenefit.sin;
      this.benefitRequestId = this.activeBenefit.benefitRequestId;
      this.benefitType = this.activeBenefit.benefitType?.english;
    }
  }

  checkStatusEditable(index: number) {
    const heir = this.heirDetails[index];
    heir.editable = this.checkListValue.controls[index].get('checkBoxFlag').value;
    if (!heir.editable) {
      heir.bankList = null;
      heir.authorizedPersonDetails = null;
    }
  }

  createCheckForm(): FormGroup {
    return this.fb.group({
      checkBoxFlag: [
        {
          value: false,
          disabled: false
        }
      ],
      eachPerson: this.fb.group({})
    });
  }

  createrequestDetailsForm() {
    return this.fb.group({
      requestDate: this.fb.group({
        gregorian: [null, Validators.required],
        hijiri: [null]
      })
    });
  }

  getAttorneyListById(id: number) {
    // this.manageBenefitService.getPersonDetailsWithPersonId(id.toString()).subscribe(
    //   personDetails => {
    //     const idObj: CommonIdentity | null = checkIqamaOrBorderOrPassport(personDetails.identity);
    this.manageBenefitService.getAttorneyDetails(id).subscribe(res => {
      this.heirDetails.forEach(heir => {
        if (id === heir.id) {
          heir.authorizedPersonDetails = <AttorneyDetailsWrapper[]>[];
          heir.guardianPersonDetails = <AttorneyDetailsWrapper[]>[];
          heir.authorizedPersonDetails = getAuthorizedGuardianDetails(res, this.systemRunDate).authorizedPersonDetails;
          heir.guardianPersonDetails = getAuthorizedGuardianDetails(res, this.systemRunDate).guardianPersonDetails;
          // this.setAuthorizedPersonDetails(heir.authorizedPersonDetails, heir.guardianPersonDetails, res);
        }
      });
    });
    // });
  }

  setAuthorizedPersonDetails(
    authorizedPersonDetails: AttorneyDetailsWrapper[],
    guardianPersonDetails: AttorneyDetailsWrapper[],
    authorizationDetails: AuthorizationDetailsDto
  ) {
    authorizationDetails.authorizationList.forEach(val => {
      // this.authorizationId = val?.authorizationId;
      if (
        val.authorizationType?.english === 'Attorney' &&
        (!val?.endDate || this.momentObj().diff(this.momentObj(val?.endDate?.gregorian), 'days') < 0) &&
        val?.isBeneficiarysAuthorisedPerson
      ) {
        const authorizedPersonDetail = new AttorneyDetailsWrapper();
        //setting attorney details
        // authorizedPersonDetail.attorneyDetails.authorizationDetailsId = val.authorizationNumber;
        authorizedPersonDetail.personId = val?.agent?.id ? Number(val?.agent?.id) : null;
        authorizedPersonDetail.name = val?.agent?.name;
        authorizedPersonDetail.identity = val?.agent?.identity;
        if (!authorizedPersonDetail.attorneyDetails) authorizedPersonDetail.attorneyDetails = new AttorneyDetails();
        authorizedPersonDetail.attorneyDetails.certificateNumber = val?.authorizationNumber;
        authorizedPersonDetail.attorneyDetails.certificateExpiryDate = val?.endDate;
        authorizedPersonDetail.attorneyDetails.authorizationId = val?.authorizationId;
        authorizedPersonDetails.push(authorizedPersonDetail);
      } else if (
        val.authorizationType?.english === 'Custody' &&
        (!val?.endDate || this.momentObj().diff(this.momentObj(val?.endDate?.gregorian), 'days') < 0) &&
        val.isActive
      ) {
        const authorizedPersonDetail = new AttorneyDetailsWrapper();
        authorizedPersonDetail.personId = val?.custodian?.id ? Number(val?.custodian?.id) : null;
        authorizedPersonDetail.name = val.custodian?.name;
        authorizedPersonDetail.identity = val.custodian?.identity;
        if (!authorizedPersonDetail.attorneyDetails) authorizedPersonDetail.attorneyDetails = new AttorneyDetails();
        authorizedPersonDetail.attorneyDetails.certificateNumber = val?.authorizationNumber;
        authorizedPersonDetail.attorneyDetails.certificateExpiryDate = val?.endDate;
        guardianPersonDetails.push(authorizedPersonDetail);
      }
    });
  }
  checkAddessDetails(address) {
    return address ? true : false;
  }

  getHeirDetails() {
    const status = isHeirLumpsum(this.benefitType)
      ? [
        HeirStatusType.ACTIVE,
        HeirStatusType.STOPPED,
        HeirStatusType.ON_HOLD,
        HeirStatusType.WAIVED_TOWARDS_GOSI,
        HeirStatusType.WAIVED_TOWARDS_HEIR,
        HeirStatusType.PAID_UP
      ]
      : [
        HeirStatusType.ACTIVE,
        HeirStatusType.STOPPED,
        HeirStatusType.ON_HOLD,
        HeirStatusType.WAIVED_TOWARDS_GOSI,
        HeirStatusType.WAIVED_TOWARDS_HEIR
      ];
    this.heirBenefitService
      .getHeirBenefit(
        this.sin,
        this.benefitRequestId?.toString(),
        this.referenceNumber,
        status,
        false,
        true
      )
      .subscribe(
        res => {
          this.setHeirRelatedValues(res);
          this.checkAddessDetails(res);
          if (this.isEditMode) {
            this.getModifyPayeeDetails(this.sin, this.benefitRequestId, this.referenceNo);
          }
        },
        err => {
          showErrorMessage(err, this.alertService);
        }
      );
  }

  setHeirRelatedValues(res) {
    this.heirDetails = res.filter(heir => heir.modifyPayeeEligible);
    this.heirDetails?.forEach(() => {
      this.checkListValue.push(this.createCheckForm());
    });
  }

  // fetch modify payee details
  getModifyPayeeDetails(sin: number, benefitRequestId: number, referenceNo: number) {
    this.modifyBenefitService.getModifyPaymentDetails(sin, benefitRequestId, referenceNo).subscribe(res => {
      this.modifiedPayeeDetails = res;
      this.setPreselectedFormValues();
    });
  }

  setPreselectedFormValues() {
    if (this.modifiedPayeeDetails.requestDate) {
      this.requestDetailsForm
        .get('requestDate')
        .get('gregorian')
        .setValue(new Date(this.modifiedPayeeDetails.requestDate.gregorian));
    }
    this.heirDetails.forEach((heir, index) => {
      this.modifiedPayeeDetails.heirs.forEach(modifiedHeir => {
        if (heir.personId === modifiedHeir.personId) {
          heir.payeeType = modifiedHeir.payeeType;
          heir.paymentMode = modifiedHeir.paymentMode;
          heir.guardianPersonId = modifiedHeir.guardianPersonId;
          heir.guardianPersonIdentity = modifiedHeir.guardianPersonIdentity;
          heir.bankAccount = modifiedHeir.bankAccount;
          heir.authorizedPersonId = modifiedHeir.authorizedPersonId;
          heir.attorneyDetails = modifiedHeir.attorneyDetails;
          heir.contactDetail = modifiedHeir.contactDetail;
          this.checkListValue.controls[index].get('checkBoxFlag').setValue(true);
          heir.editable = true;
        }
      });
    });
  }

  getBankList(identity) {
    // const serviceType = this.benefitType ? getServiceType(this.benefitType) : null;
    this.bankService.getBankList(+identity.personId).subscribe(bankRes => {
      if (bankRes) {
        this.heirDetails.forEach(heir => {
          if (heir.personId === identity.heirIdentifier) {
            heir.bankList = bankRes;
          }
        });
      }
    });
  }

  ibanTypeChange(isdisable) {
    this.isSaveDisabled = isdisable;
  }

  saveBankDetails(requestData) {
    this.lookUpService.getBankForIban(requestData?.newBankAccount?.bankCode).subscribe(res => {
      this.paymentDetailsComponent.forEach(component => {
        if (component.personId === requestData.personId) {
          if (requestData?.newBankAccount?.isNonSaudiIBAN) {
            component.newNonSaudiBankName = res.items[0]?.value;
            this.paymentDetailsComponent?.forEach(paymentDetail => {
              paymentDetail.setNonSaudibankName();
            });
          } else {
            component.newBankName = res.items[0]?.value;
          }
        }
      });
    });
  }

  getLookUpValues(): void {
    this.paymentModeList$ = this.lookUpService.getTransferModeDetails();
    this.listYesNo$ = this.lookUpService.getYesOrNoList();
    this.nationalityList$ = this.lookUpService.getNationalityList();
    this.initialiseCityLookup();
    this.initialiseCountryLookup();
  }

  initialisePayeeType() {
    this.lookUpService.initialisePayeeType().subscribe(payee => {
      this.payeeList = payee;
    });
  }
  //Defect 499227
  initialiseCountryLookup() {
    const countylistRaw = this.lookUpService.getCountryList();
    this.countryList$ = countylistRaw.pipe(
      map(countryList => {
        return new LovList(countryList.items.filter(country => country.value.english !== 'Saudi Arabia'));
      })
    );
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    const scrWidth = window.innerWidth;
    this.isSmallScreen = scrWidth <= 992 ? true : false;
  }

  /** Method to initialize the navigation wizards. */
  initializeWizardDetails() {
    this.modifyWizards = this.wizardService.getModifyHeirItems();
    this.modifyWizards[0].isActive = true;
    this.modifyWizards[0].isDisabled = false;
  }

  /** Method to handle cancellation of transaction. */
  cancelTransactions(canceltemplate: TemplateRef<HTMLElement>) {
    this.commonModalRef = this.modalService.show(canceltemplate);
    this.showOtpError = clearAlerts(this.alertService, this.showOtpError);
  }

  /** Method to confirm cancellation of the form. */
  confirm() {
    if (this.sin && this.benefitRequestId && this.referenceNumber) {
      this.modifyBenefitService
        .revertModifyPaymentDetails(this.sin, this.benefitRequestId, this.referenceNumber)
        .subscribe(res => {
          this.commonModalRef.hide();
          if (!this.isEditMode) this.router.navigate([BenefitConstants.ROUTE_ACTIVE_HEIR_BENEFIT]);
          else this.routeBack();
          this.alertService.clearAlerts();
        });
    } else {
      this.commonModalRef.hide();
      this.routeBack();
      this.alertService.clearAlerts();
    }
  }

  /**
   * Method to show a confirmation popup for reseting the form.
   * @param template template
   */
  popUp(template: TemplateRef<HTMLElement>) {
    this.commonModalRef = this.modalService.show(template);
  }

  //This method is to decline cancellation of transaction
  decline() {
    this.commonModalRef.hide();
  }

  /** Method to handle doc upload. */
  docUploadSuccess(event) {
    this.submitPayeeDetails();
  }

  // BACK BUTTON Route while displaying an injury
  routeBack() {
    if (this.currentTab === 1)
      this.modifyBenefitService
        .revertModifyPaymentDetails(this.sin, this.benefitRequestId, this.referenceNumber)
        .subscribe();
    this.location.back();
  }

  /*
   * This method is to select wizard
   */
  selectWizard(index) {
    this.alertService.clearAlerts();
    this.currentTab = index;
  }

  /** Method to navigate back to previous section. */
  previousFormDetails() {
    scrollToTop();
    this.alertService.clearAlerts();
    this.currentTab--;
    this.modifyBenefitWizard.setPreviousItem(this.currentTab);
    this.isPrevClicked = true;
  }

  /**
   * Method to perform feedback call after scanning.
   * @param document
   */
  refreshDocument(document: DocumentItem) {
    if (document && document.name) {
      this.documentService
        .refreshDocument(
          document,
          this.benefitRequestId,
          this.modifyPayeeId,
          this.modifyPayeeType,
          this.referenceNumber,
          undefined,
          this.documentuuid
        )
        .subscribe(res => {
          if (res) {
            document = res;
          }
        });
    }
  }

  /**
   * This method is to show the modal reference
   * @param commonModalRef
   */
  showModal(commonModalRef: TemplateRef<HTMLElement>, size?: string) {
    this.commonModalRef = this.modalService.show(
      commonModalRef,
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

  /** Method to show error alert. */
  showError(error): void {
    this.alertService.showError(error.error.message, error.error.details);
  }

  /** Method to navigate to next form */
  saveAndNext() {
    this.setPaymentDetailValues();
    this.requestDetailsForm.markAllAsTouched();
    this.payeeDetails.requestDate = this.requestDetailsForm?.value.requestDate;
    const filteredModifiedHeirDetails = new HeirModifyPayeeDetails();
    this.filterModifiedHeirDetails(filteredModifiedHeirDetails);
    filteredModifiedHeirDetails.requestDate = this.requestDetailsForm?.value.requestDate;
    const referenceNumber = this.isEditMode ? this.referenceNo : this.referenceNumber;
    if (this.checkFormValidity() && this.requestDetailsForm.valid && filteredModifiedHeirDetails.heirs.length > 0) {
      this.modifyBenefitService
        .modifyPayeeDetails(this.sin, this.benefitRequestId, filteredModifiedHeirDetails, referenceNumber)
        .subscribe(
          res => {
            this.referenceNumber = res?.referenceNo;
            this.nextForm();
          },
          err => {
            showErrorMessage(err, this.alertService);
          }
        );
    }
  }

  filterModifiedHeirDetails(filteredModifiedHeirDetails: HeirModifyPayeeDetails) {
    this.payeeDetails.heirs.forEach(heir => {
      if (!(heir.payeeType.english === undefined || null) && !(heir.paymentMode.english === undefined || null)) {
        filteredModifiedHeirDetails.heirs.push(heir);
      }
    });
  }

  checkFormValidity() {
    const formsValidity = [];
    const formsModified = [];
    this.paymentDetailsComponent.forEach(component => {
      const valid = component.checkFormValidity().formValid;
      const modified = component.checkFormValidity().formModified;
      formsValidity.push(valid);
      formsModified.push(modified);
    });
    // no restriction to modify in validator edit
    if (!this.isEditMode) {
      if (!formsValidity.includes(false) && formsModified.includes(true)) {
        return true;
      }
      this.alertService.showErrorByKey('BENEFITS.MANDATORY-FIELDS');
      return false;
    } else {
      return true;
    }
  }

  setPaymentDetailValues() {
    this.payeeDetails.heirs = [];
    this.heirDetails?.forEach(val => {
      const heirDetail = new HeirsDetails();
      heirDetail.personId = val.personId;
      // heirDetail.authorizationId = val.authorizationId;
      this.payeeDetails.heirs.push(heirDetail);
    });
    this.paymentDetailsComponent?.forEach(component => {
      component.setPayeeDetails();
      component.markFormsAsTouched();
    });
  }

  nextForm() {
    this.alertService.clearAlerts();
    this.currentTab = 1;
    if (this.modifyBenefitWizard) this.modifyBenefitWizard.setNextItem(this.currentTab);
    scrollToTop();
    this.navigateDocWizard();
  }

  navigateDocWizard() {
    if (!this.isEditMode && !this.isPrevClicked) {
      this.modifyBenefitService
        .getReqDocsForModifyPayee(this.sin, this.benefitRequestId, this.referenceNumber)
        .subscribe(res => {
          this.requiredDocs = res;
          this.requiredDocs?.forEach(doc => {
            doc.canDelete = true;
          });
        });
    }
    if (this.isEditMode) {
      this.getUploadedDocuments();
    }
  }

  getUploadedDocuments() {
    const transactionKey = 'MODIFY_PAYEE';
    const transactionType = this.isAppPrivate ? 'REQUEST_BENEFIT_FO' : 'REQUEST_BENEFIT_GOL';
    this.benefitDocumentService
      .getModifyPayeeDocuments(this.sin, this.benefitRequestId, this.referenceNo, transactionKey, transactionType)
      .subscribe(res => {
        this.requiredDocs = res;
        this.requiredDocs?.forEach(doc => {
          doc.canDelete = true;
        });
      });
  }

  submitPayeeDetails() {
    const submitValues: StopSubmitRequest = {
      comments: this.documentForm.get('uploadDocument').get('comments').value,
      referenceNo: this.referenceNumber
    };
    if (!this.isEditMode) {
      this.modifyBenefitService.submitModifyDetails(this.sin, this.benefitRequestId, submitValues).subscribe(res => {
        this.modifyPayeeRsp = res;
        if (this.modifyPayeeRsp?.message !== null) {
          this.alertService.showSuccess(this.modifyPayeeRsp.message);
        }
        this.router.navigate([BenefitConstants.ROUTE_ACTIVE_HEIR_BENEFIT]);
      });
    } else {
      this.modifyBenefitService.submitModifyDetails(this.sin, this.benefitRequestId, submitValues).subscribe(
        res => {
          this.modifyPayeeRsp = res;
          if (
            this.role &&
            (this.role === this.rolesEnum.VALIDATOR_1 ||
              this.role === this.rolesEnum.CUSTOMER_SERVICE_REPRESENTATIVE ||
              this.role === 'Contributor')
          ) {
            this.saveWorkflowInEdit();
          }
        },
        err => {
          if (err.status === 500 || err.status === 422 || err.status === 400) {
            showErrorMessage(err, this.alertService);
            this.goToTop();
          }
        }
      );
    }
  }

  /** Method to save workflow details in edit mode. */
  saveWorkflowInEdit() {
    const workflowData = new BPMUpdateRequest();
    workflowData.assignedRole = this.role;
    workflowData.taskId = this.routerData.taskId;
    workflowData.user = this.routerData.assigneeId;
    workflowData.outcome = WorkFlowActions.SUBMIT;
    this.manageBenefitService.updateAnnuityWorkflow(workflowData).subscribe(
      () => {
        this.alertService.showSuccessByKey('BENEFITS.VAL-SANED-SUCCESS-MSG');
        this.manageBenefitService.navigateToInbox();
      },
      err => {
        showErrorMessage(err, this.alertService);
      }
    );
  }

  setPayeeDetails(payeeDetail: HeirsDetails) {
    this.payeeDetails?.heirs?.forEach(val => {
      if (val.personId === payeeDetail?.personId) {
        val.authorizedPersonId = payeeDetail?.authorizedPersonId;
        val.authorizationId = payeeDetail?.authorizationId;
        val.authorizationDetailsId = payeeDetail?.authorizationDetailsId;
        val.bankAccount = payeeDetail?.bankAccount;
        val.payeeType = payeeDetail?.payeeType;
        val.paymentMode = payeeDetail?.paymentMode;
        val.guardianPersonId = payeeDetail?.guardianPersonId;
        val.guardianPersonIdentity = payeeDetail?.guardianPersonIdentity;
        val.guardianPersonName = payeeDetail?.guardianPersonName;
        val.contactDetail = payeeDetail?.contactDetail;
      }
    });
  }
  showErrorMessages(error) {
    showErrorMessage(error, this.alertService);
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }

  clearAllAlerts() {
    this.alertService.clearAllErrorAlerts();
    this.alertService.clearAllWarningAlerts();
  }

  /** Method to handle c;aring alerts before component destroyal . */
  ngOnDestroy() {
    this.clearAllAlerts();
  }
}
