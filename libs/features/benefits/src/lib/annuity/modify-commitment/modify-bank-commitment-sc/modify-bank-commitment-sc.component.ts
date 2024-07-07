/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  DocumentService,
  LanguageToken,
  LookupService,
  scrollToTop,
  RouterData,
  RouterDataToken,
  UuidGeneratorService,
  BilingualText,
  Name,
  CoreBenefitService,
  CommonIdentity,
  checkIqamaOrBorderOrPassport,
  AuthTokenService
} from '@gosi-ui/core';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme/src';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { BehaviorSubject } from 'rxjs';
import {
  AttorneyDetailsWrapper,
  BankService,
  BenefitActionsService,
  BenefitConstants,
  BenefitDocumentService,
  BenefitValues,
  HeirsDetails,
  PaymentMethodDetailsDcComponent,
  ManageBenefitService,
  ModifyBenefitService,
  WizardService,
  StopSubmitRequest,
  UiBenefitsService,
  BenefitType,
  SubmitRequest,
  getServiceType
} from '../../../shared';
import { AttorneyDetails } from '../../../shared/models/attorney-details';
import { AuthorizationDetailsDto } from '../../../shared/models/authorization-details';
import { CommitmentBaseComponent } from '../../base/commitment-base-component';

@Component({
  selector: 'bnt-modify-bank-commitment-sc',
  templateUrl: './modify-bank-commitment-sc.component.html',
  styleUrls: ['./modify-bank-commitment-sc.component.scss']
})
export class ModifyBankCommitmentScComponent extends CommitmentBaseComponent implements OnInit, OnDestroy {
  modifyTransactionConstant: string;

  //View child Components
  @ViewChild('modifyBenefitWizard', { static: false })
  modifyBenefitWizard: ProgressWizardDcComponent;
  @ViewChild('modifyDetailsTab', { static: false })
  modifyDetailsTab: TabsetComponent;
  @ViewChild('paymentDetailsComponent', { static: false })
  paymentDetailsComponent: PaymentMethodDetailsDcComponent;
  /**
   *
   * @param alertService
   * @param modalService
   * @param documentService
   * @param benefitDocumentService
   * @param location
   * @param route
   * @param router
   * @param bankService
   * @param lookUpService
   * @param wizardService
   * @param manageBenefitService
   * @param modifyPensionService
   * @param benefitActionsService
   * @param appToken
   * @param language
   */
  constructor(
    readonly alertService: AlertService,
    readonly modalService: BsModalService,
    readonly documentService: DocumentService,
    readonly benefitDocumentService: BenefitDocumentService,
    readonly location: Location,
    public route: ActivatedRoute,
    readonly router: Router,
    readonly bankService: BankService,
    readonly lookUpService: LookupService,
    readonly wizardService: WizardService,
    public manageBenefitService: ManageBenefitService,
    public modifyPensionService: ModifyBenefitService,
    public benefitActionsService: BenefitActionsService,
    readonly uuidGeneratorService: UuidGeneratorService,
    readonly authTokenService: AuthTokenService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly coreBenefitService: CoreBenefitService,
    readonly uiBenefitsService: UiBenefitsService
  ) {
    super(
      alertService,
      modalService,
      documentService,
      benefitDocumentService,
      location,
      route,
      router,
      bankService,
      lookUpService,
      wizardService,
      manageBenefitService,
      modifyPensionService,
      benefitActionsService,
      uuidGeneratorService,
      authTokenService,
      appToken,
      language,
      routerData,
      coreBenefitService,
      uiBenefitsService
    );
  }
  /**
   * Method to initialise tasks
   */
  ngOnInit(): void {
    this.initialiseView();
    this.transactionId = BenefitConstants.MODIFY_ACCOUNT;
    this.modifyTransactionConstant = BenefitConstants.MODIFY_TRANSACTION_CONSTANT;
    this.initializeWizardDetails();
    this.getLookUpValues();
  }
  /**
   * Method to set payment details
   * @param paymentDetails
   */

  setPaymentDetails(paymentDetails: HeirsDetails) {
    this.paymentDetails.payeeType = paymentDetails?.payeeType;
    this.paymentDetails.paymentMode = paymentDetails?.paymentMode;
    this.paymentDetails.bankAccount = paymentDetails?.bankAccount;
    this.paymentDetails.authorizedPersonId = paymentDetails?.authorizedPersonId;
    this.paymentDetails.authorizationDetailsId = paymentDetails?.authorizationDetailsId;
    this.paymentDetails.guardianPersonId = paymentDetails?.guardianPersonId;
    this.paymentDetails.guardianPersonIdentity = paymentDetails?.guardianPersonIdentity;
    this.paymentDetails.guardianPersonName = paymentDetails?.guardianPersonName;
    this.paymentDetails.contactDetail = paymentDetails?.contactDetail;
    this.paymentDetails.personId = this.commitmentPaymentDetails?.personId;
    this.paymentDetails.authorizationId = this.authorizationId;
  }
  /**
   * Method to get attorney details
   * @param id
   */
  getAttorneyListById(id: number) {
    // this.manageBenefitService.getPersonDetailsWithPersonId(id.toString()).subscribe(
    //   personDetails => {
    //     const idObj: CommonIdentity | null = checkIqamaOrBorderOrPassport(personDetails.identity);
    this.manageBenefitService.getAttorneyDetails(id).subscribe(res => {
      this.commitmentPaymentDetails.authorizedPersonDetails = <AttorneyDetailsWrapper[]>[];
      this.commitmentPaymentDetails.guardianPersonDetails = <AttorneyDetailsWrapper[]>[];
      this.setAuthorizedPersonDetails(
        this.commitmentPaymentDetails.authorizedPersonDetails,
        this.commitmentPaymentDetails.guardianPersonDetails,
        res
      );
    });
    // });
  }

  //as part of defect 526799
  setAuthorizedPersonDetails(
    authorizedPersonDetails: AttorneyDetailsWrapper[],
    guardianPersonDetails: AttorneyDetailsWrapper[],
    authorizationDetails: AuthorizationDetailsDto
  ) {
    authorizationDetails.authorizationList.forEach(val => {
      this.authorizationId = val?.authorizationId;
      if (val.authorizationType?.english === 'Attorney' && val?.isActive && val?.isBeneficiarysAuthorisedPerson) {
        const authorizedPersonDetail = new AttorneyDetailsWrapper();
        //setting attorney details
        // authorizedPersonDetail.attorneyDetails.authorizationDetailsId = val.authorizationNumber;
        authorizedPersonDetail.personId = val?.agent?.id ? Number(val?.agent?.id) : null;
        authorizedPersonDetail.name = val?.agent?.name;
        authorizedPersonDetail.identity = val?.agent?.identity;
        if (!authorizedPersonDetail.attorneyDetails) authorizedPersonDetail.attorneyDetails = new AttorneyDetails();
        authorizedPersonDetail.attorneyDetails.certificateNumber = val?.authorizationNumber;
        authorizedPersonDetail.attorneyDetails.certificateExpiryDate = val?.endDate;
        authorizedPersonDetails.push(authorizedPersonDetail);
      } else if (val.authorizationType?.english === 'Custody' && val?.isActive) {
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
  /**
   * Method to get bank list details
   * @param identity
   */

  getBankList(identity) {
    if (identity) {
      // if (this.benefitType === BenefitType.ui) {
      //   this.modifyPensionService.getUiBankDetails(this.sin, this.benefitRequestId).subscribe(bankRes => {
      //     if (bankRes) this.commitmentPaymentDetails.bankList = bankRes;
      //   });
      // } else {
      // const serviceType = this.benefitType ? getServiceType(this.benefitType) : null;
      this.bankService.getBankList(+identity.personId).subscribe(bankRes => {
        if (bankRes) this.commitmentPaymentDetails.bankList = bankRes;
      });
      // }
    } else {
      this.commitmentPaymentDetails.bankList = [];
    }
  }
  /**
   * Method to save bank details
   * @param requestData
   */
  saveBankDetails(requestData) {
    this.lookUpService.getBankForIban(requestData?.newBankAccount?.bankCode).subscribe(
      res => {
        this.alertService.clearAlerts();
        if (requestData?.newBankAccount?.isNonSaudiIBAN) {
          this.paymentDetailsComponent.newNonSaudiBankName = res.items[0]?.value;
          this.paymentDetailsComponent.setNonSaudibankName();
        } else {
          this.commitmentPaymentDetails.bankName = res.items[0]?.value;
        }
        this.isInvalidIban = false;
      },
      err => {
        this.isInvalidIban = true;
        if (this.isInvalidIban) {
          this.showErrorMessages(err);
          this.goToTop();
        }
      }
    );
  }
  /**
   * Method to get lookup values
   */
  getLookUpValues(): void {
    this.paymentModeList$ = this.lookUpService.getTransferModeDetails();
    this.listYesNo$ = this.lookUpService.getYesOrNoList();
    this.nationalityList$ = this.lookUpService.getNationalityList();
    this.initialisePayeeType();
    this.initialiseCityLookup();
    this.initialiseCountryLookup();
  }

  checkAddessDetails(address) {
    return address ? true : false;
  }
  /**
   * Method to save modify bank details
   */
  saveModifyDetails() {
    if (this.isIndividualApp) {
      this.invokePaymentDetailsEvent();
      if (this.checkPaymentFormValidity()) {
        if (this.isEditMode) this.transactionTraceId = this.referenceNo;
        this.benefitActionsService
          .saveModifyCommitmentDetails(
            this.sin,
            this.benefitRequestId,
            this.paymentDetails,
            this.transactionTraceId,
            this.benefitText
          )
          .subscribe(
            res => {
              if (res) {
                this.referenceNumber = res?.referenceNo;
                if (res?.message !== null) this.alertService.showSuccess(res.message);
                this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
                // const submitValues: SubmitRequest = {
                //   commitmentFlow: false,
                //   comments: 'null',
                //   referenceNo: this.referenceNumber,
                //   uuid: 'null'
                // };
                // this.benefitActionsService
                //   .submitModifybankDetails(
                //     this.sin,
                //     this.benefitRequestId,
                //     this.referenceNumber,
                //     submitValues,
                //     this.benefitText
                //   )
                //   .subscribe(
                //     res => {
                //       this.submitResponse = res;
                //       // this.submitResponse = res;
                //       if (!this.isEditMode && this.isIndividualApp) {
                //         this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
                //         if (res?.message !== null) {
                //           this.alertService.showSuccess(res.message);
                //         }
                //       }
                //       // if (!this.isEditMode) {
                //       //   this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
                //       // }
                //       if (
                //         this.isEditMode &&
                //         this.role &&
                //         (this.role === this.rolesEnum.VALIDATOR_1 ||
                //           this.role === this.rolesEnum.CUSTOMER_SERVICE_REPRESENTATIVE ||
                //           this.role === 'Contributor')
                //       ) {
                //         this.saveWorkflowInEdit('null');
                //       }
                //     },
                //     err => {
                //       if (err.status === 500 || err.status === 422 || err.status === 400) {
                //         this.showErrorMessages(err);
                //         this.goToTop();
                //       }
                //     }
                //   );
              }
            },
            err => {
              if (err.status === 500 || err.status === 422 || err.status === 400) {
                this.showErrorMessages(err);
                this.goToTop();
              }
            }
          );
      }
    } else {
      this.invokePaymentDetailsEvent();
      if (this.checkPaymentFormValidity()) {
        if (this.isEditMode) this.transactionTraceId = this.referenceNo;
        // (this.paymentDetails?.bankAccount?.isNonSaudiIBAN ? this.overseasAddressCheck() : true)if (this.isEditMode) this.transactionTraceId = this.referenceNo;
        this.benefitActionsService
          .saveModifyCommitmentDetails(
            this.sin,
            this.benefitRequestId,
            this.paymentDetails,
            this.transactionTraceId,
            this.benefitText
          )
          .subscribe(
            res => {
              this.referenceNumber = res?.referenceNo;
              this.navigateDocWizard();
            },
            err => {
              if (err.status === 500 || err.status === 422 || err.status === 400) {
                this.showErrorMessages(err);
                this.goToTop();
              }
            }
          );
      }
    }
  }
  overseasAddressCheck() {
    if (this.paymentDetails.contactDetail?.addresses?.length > 0) {
      let countYes = 0;
      let countNo = 0;
      this.paymentDetails.contactDetail?.addresses?.forEach(each => {
        if (each?.type === 'OVERSEAS') {
          countYes = countYes + 1;
        } else {
          countNo = countNo + 1;
        }
      });
      if (countYes === 0) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
    //this.paymentDetails.contactDetail?.currentMailingAddress === 'OVERSEAS' && this.paymentDetails.contactDetail?.addresses.length > 0
  }
  invokePaymentDetailsEvent() {
    this.paymentDetailsComponent.markFormsAsTouched();
    this.paymentDetailsComponent.setPayeeDetails();
  }
  checkPaymentFormValidity() {
    if (
      !this.isEditMode &&
      this.paymentDetailsComponent?.checkFormValidity().formValid &&
      this.paymentDetailsComponent?.checkFormValidity().formModified
    )
      return true;
    else if (this.isEditMode && this.paymentDetailsComponent?.checkFormValidity().formValid) return true;
    else return false;
  }

  /**method to tab change */
  navigateDocWizard() {
    scrollToTop();
    this.currentTab++;
    this.alertService.clearAlerts();
    if (this.modifyBenefitWizard) {
      this.modifyBenefitWizard.setNextItem(this.currentTab);
    }
    if (!this.isEditMode) {
      this.getModifyBankRequiredDocs();
    } else {
      this.getModifyBankUploadedDocuments();
    }
  }
  getModifyBankRequiredDocs() {
    this.modifyPensionService
      .getReqDocsForModifyBank(this.sin, this.benefitRequestId, this.referenceNumber)
      .subscribe(documents => {
        this.requiredDocs = documents;
        this.requiredDocs.forEach(doc => {
          doc.canDelete = true;
        });
      });
  }
  getModifyBankUploadedDocuments() {
    this.benefitDocumentService
      .getModifyBankDocuments(
        this.sin,
        this.benefitRequestId,
        this.referenceNo,
        this.transactionId,
        this.doctransactionType
      )
      .subscribe(
        res => {
          this.requiredDocs = res;
          this.requiredDocs.forEach(doc => {
            doc.canDelete = true;
          });
        },
        err => this.alertService.showErrorByKey(err.error.message)
      );
  }

  /**
   * Method to go to previous page
   */
  submitCommitmentDetails(comments) {
    const submitValues: StopSubmitRequest = {
      comments: comments.comments,
      referenceNo: this.referenceNumber,
      uuid: this.documentComponent.uuid
    };
    this.benefitActionsService
      .submitModifybankDetails(this.sin, this.benefitRequestId, this.referenceNumber, submitValues, this.benefitText)
      .subscribe(
        res => {
          this.submitResponse = res;
          if (!this.isEditMode) {
            if (this.submitResponse?.message !== null) this.alertService.showSuccess(this.submitResponse.message);
            this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
          } else {
            if (this.role && this.role === this.rolesEnum.VALIDATOR_1) this.saveWorkflowInEdit(comments);
          }
        },
        err => {
          if (err.status === 500 || err.status === 422 || err.status === 400) {
            this.showErrorMessages(err);
            this.goToTop();
          }
        }
      );
  }

  previousForm() {
    this.alertService.clearAlerts();
    this.currentTab--;
    this.modifyBenefitWizard[1].isImage = true;

    if (this.modifyBenefitWizard) this.modifyBenefitWizard.setPreviousItem(this.currentTab);
    scrollToTop();
  }
  /*
   * This initialise the wizard items
   */
  initializeWizardDetails() {
    this.wizardItems = !this.isIndividualApp
      ? this.wizardService.getModifyCommitmentWizardItems()
      : this.wizardService.getModifyCommitmentWizardsIndiApp();
    this.wizardItems[0].isActive = true;
    this.wizardItems[0].isDisabled = false;
  }

  selectWizard(index) {
    this.alertService.clearAlerts();
    this.currentTab = index;
  }
  /** Method to confirm cancellation of the form. */
  confirm() {
    if (this.sin && this.benefitRequestId && this.referenceNumber) {
      this.benefitActionsService.revertModifyBank(this.sin, this.benefitRequestId, this.referenceNumber).subscribe(
        () => {
          this.modalRef.hide();
          if (!this.isEditMode) this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
          else this.routeBack();
          this.alertService.clearAlerts();
        },
        err => this.showErrorMessages(err)
      );
    } else {
      this.modalRef.hide();
      if (!this.isEditMode) this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
      else this.routeBack();
      this.alertService.clearAlerts();
    }
  }
  existingIban(isExistingIban: boolean) {
    if (isExistingIban) {
      this.isExistingIban = true;
    } else {
      this.isExistingIban = false;
    }
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
