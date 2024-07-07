/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  AppConstants,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BilingualText,
  DocumentItem,
  DocumentService,
  EstablishmentRouterData,
  EstablishmentToken,
  LanguageToken,
  LookupService,
  LovList,
  markFormGroupTouched,
  Person,
  RouterConstants,
  StorageService,
  WorkflowService,
  scrollToTop,
  CoreBenefitService,
  RouterDataToken,
  RouterData,
  TransactionService
} from '@gosi-ui/core';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable, noop } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import {
  AddEstablishmentService,
  DocumentTransactionIdEnum,
  EstablishmentAdminService,
  EstablishmentConstants,
  EstablishmentDetailsFormDCComponent,
  EstablishmentOwnersDcComponent,
  EstablishmentService,
  LegalEntityEnum,
  MciResponse,
  PaymentDetailsDcComponent,
  ScanDocumentsDcComponent,
  isEstablishmentTokenValid,
  isTransactionDraft
} from '../../../shared';
import { AddEstablishmentSCBaseComponent } from '../../../shared/base';
import { ProactiveDetailsDcComponent } from '../proactive-details-dc/proactive-details-dc.component';
import { resetCRNDetails, saveAllOwners, searchEstablishment, setOwnerState } from './register-proactive-helper';
import { EstablishmentIbanValidationResponse } from '@gosi-ui/features/establishment/lib/shared/models/establishment-iban-validation';
import {
  AccountStatusEnum,
  MatchStatusEnum
} from '@gosi-ui/features/establishment/lib/shared/enums/sama-response-enum';
const OWNER_ERROR_KEY = 'ESTABLISHMENT.ERROR.SAVE-OWNER';
const OWNER_MISMATCH_ERROR_KEY = 'ESTABLISHMENT.ERROR.OWNER-MISMATCH';
@Component({
  selector: 'est-register-proactive-sc',
  templateUrl: './register-proactive-sc.component.html',
  styleUrls: ['./register-proactive-sc.component.scss']
})
export class RegisterProactiveScComponent extends AddEstablishmentSCBaseComponent implements OnInit {
  isUploadValid = true;
  currentTab = 0;
  totalTabs = 6;
  isOwnerRequired = false;
  registrationNumber = new FormControl();
  isLegalEntityPresent = false;
  showReset = false;
  disableActivityType = false;
  disableLicense = false;
  isLicenseMandatory = true;
  disableLegalEntity = false;
  disableEstEngName = false;
  disableLicenseExpiryDate = false;
  registrationNo: number | undefined = undefined;

  legalEntityFromFeed: BilingualText;
  showSaveButton:boolean=true;
  payload;
  taskId:string;
  isGOL: boolean = false;
  @ViewChild('establishmentDetailsComp', { static: false })
  establishmentDetailsComp: EstablishmentDetailsFormDCComponent;
  @ViewChild('proactiveEstForm', { static: false })
  proactiveEstComp: ProactiveDetailsDcComponent;
  @ViewChild('ownerComponent', { static: false })
  ownerComponent: EstablishmentOwnersDcComponent;
  @ViewChild('addProEstWizard', { static: false })
  addProEstWizard: ProgressWizardDcComponent;
  @ViewChild('scanDocsComp', { static: false })
  scanDocsComp: ScanDocumentsDcComponent;
  @ViewChild('paymentDetailsComp', { static: false })
  paymentComp: PaymentDetailsDcComponent;
  @ViewChild('cancelTemplate', { static: false })
  cancelTemp: TemplateRef<HTMLElement>;
  ownerMolVerified: boolean;
  transactionId = DocumentTransactionIdEnum.MOL_REGISTRATION;
  mciResponse: MciResponse;
  isAccountActive = false;

  /**
   * Creates an instance of Register Proactive Sc compoent.
   *
   * @param establishmentService
   * @param documentService
   * @param establishmentAdminService
   * @param verifyEstablishmentService
   * @param lookupService
   * @param storageService
   * @param language
   * @param environment
   */
  constructor(
    readonly establishmentService: EstablishmentService,
    addEstablishmentService: AddEstablishmentService,
    documentService: DocumentService,
    establishmentAdminService: EstablishmentAdminService,
    lookupService: LookupService,
    storageService: StorageService,
    alertService: AlertService,
    readonly location: Location,
    readonly router: Router,
    readonly route: ActivatedRoute,
    @Inject(EstablishmentToken) readonly estRouterData: EstablishmentRouterData,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly workflowService: WorkflowService,
    readonly modalService: BsModalService,
    readonly coreBenefitService: CoreBenefitService,
    readonly transactionService:TransactionService
  ) {
    super(
      establishmentService,
      addEstablishmentService,
      establishmentAdminService,
      lookupService,
      storageService,
      documentService,
      alertService,
      language,
      estRouterData,
      workflowService,
      modalService,
      location,
      router,
      coreBenefitService
    );
  }

  //Initialise
  ngOnInit() {
    this.alertService.clearAlerts();
    super.ngOnInit();
    if (isTransactionDraft(this.estRouterData, DocumentTransactionIdEnum.MOL_REGISTRATION)) {
      this.isResumeFromDraft = true;
      this.referenceNo = this.estRouterData.referenceNo;
    }
    if (isEstablishmentTokenValid(this.estRouterData, RouterConstants.TRANSACTION_PROACTIVE_FEED)) {
      this.isValidator=true;
      this.referenceNo = this.estRouterData.referenceNo;
      this.setComments(this.estRouterData);
      this.editEstablishment = true;
    }
    this.currentTab = 0;
    this.route.paramMap
      .pipe(
        take(1),
        switchMap(params => {
          const regNo =
            +params.get('registrationNo') ||
            this.estRouterData.registrationNo ||
            Number(this.storageService.getSessionValue(AppConstants.ESTABLISHMENT_REG_KEY));
          return searchEstablishment(this, regNo);
        })
      )
      .subscribe(noop);
      if (this.appToken === ApplicationTypeEnum.PUBLIC) {
        this.isGOL = true;
      }
      this.setRouterData();  
  }
        // Method to get router data for claim pool
        setRouterData(){
          if (this.routerDataToken.payload) {
            this.payload = JSON.parse(this.routerDataToken.payload);
            this.taskId = this.routerDataToken.taskId;
            this.isUnclaimed = this.payload?.isPool;
            this.showSaveButton=this.isValidator 
                      ? this.isUnclaimed ? false : true
                      : true ;
          }
        }
        assignClicked(){
          this.showSaveButton=true;
        }
        releaseClicked(){
          this.showSaveButton=false;
        }  

  private isGovEntity(value: string): boolean {
    return value === LegalEntityEnum.GOVERNMENT || value === LegalEntityEnum.SEMI_GOV;
  }

  private getPossibleLegalEntities(): Observable<LovList> {
    let legalEntityList = this.lookUpService.getlegalEntityList();
    if (this.appToken === ApplicationTypeEnum.PUBLIC) {
      legalEntityList = legalEntityList.pipe(
        filter(lovlist => lovlist && lovlist !== null),
        map(lovList => {
          lovList.items = lovList.items.filter(lov => {
            if (this.isGovEntity(this.legalEntityFromFeed?.english)) {
              return this.isGovEntity(lov.value?.english);
            } else {
              return !this.isGovEntity(lov.value?.english);
            }
          });
          return lovList;
        })
      );
    }

    return legalEntityList;
  }

  //This method is fetch all the legal entity lov list
  fetchAllLegalEntity() {
    this.legalEntityLovList$ = this.getPossibleLegalEntities();
  }

  //This method is to filter individual from legal entity lov list
  filterIndividualLegalEntity() {
    this.legalEntityLovList$ =
      this.appToken === ApplicationTypeEnum.PUBLIC && this.isGovEntity(this.legalEntityFromFeed?.english)
        ? this.getPossibleLegalEntities()
        : this.getPossibleLegalEntities().pipe(
            filter(lovlist => lovlist && lovlist !== null),
            map(lovList => {
              lovList.items = lovList.items.filter(lov => lov.value.english !== LegalEntityEnum.INDIVIDUAL);
              return lovList;
            })
          );
  }

  getUnn() {
    if (
      this.proactiveEstComp.establishmentForm.get('unifiedNationalNumber').valid &&
      this.proactiveEstComp.establishmentForm.get('unifiedNationalNumber').value
    ) {
      return true;
    }
  }

  /**
   * This method is used to verify crn with mci
   */
  verifyCRNNumber(data: { crn: string; unn: string }) {
    this.alertService.clearAlerts();
    if (this.proactiveEstComp && this.proactiveEstComp.establishmentForm) {
      markFormGroupTouched(this.proactiveEstComp.establishmentForm.get('crn') as FormGroup);
      if (
        this.proactiveEstComp.establishmentForm.get('crn').get('number').valid &&
        this.proactiveEstComp.establishmentForm.get('crn').get('number').value &&
        this.getUnn()
      ) {
        this.establishmentService.verifyWithMciService(data.crn, this.establishment.registrationNo, data.unn).subscribe(
          res => {
            this.alertService.showSuccessByKey('ESTABLISHMENT.CRN-VERIFIED');
            if (this.establishment) {
              this.mciResponse = res;
              if (res?.legalEntity) {
                this.establishment.legalEntity = res.legalEntity;
                this.disableLegalEntity = true; //disabled legal entity if values comes from MCI.
              }
              this.establishment.crn = res.crn;
              if (this.establishment && this.establishment.legalEntity && this.establishment.legalEntity.english) {
                if (
                  this.establishment.crn &&
                  this.establishment.crn.issueDate &&
                  this.establishment.crn.issueDate.gregorian &&
                  this.establishment.legalEntity.english === LegalEntityEnum.INDIVIDUAL
                ) {
                  this.fetchAllLegalEntity();
                } else {
                  this.filterIndividualLegalEntity();
                }
                this.isLegalEntityPresent = true;
              } else {
                this.filterIndividualLegalEntity();
              }
            }
          },
          err => {
            resetCRNDetails(this);
            this.showErrorMessage(err);
            this.filterIndividualLegalEntity();
          }
        );
      } else {
        this.triggerFormValidation();
      }
    }
  }

  /**
   * This method is used to save the form details
   * @param formDetails
   */
  saveCRNDetails(formDetails: Object) {
    if (
      this.proactiveEstComp &&
      this.proactiveEstComp.establishmentForm &&
      this.proactiveEstComp.establishmentForm.valid
    ) {
      super.saveCRNDetails(formDetails);
    } else {
      this.triggerFormValidation();
    }
  }
  /**
   * This method is save payment details
   */
  savePaymentDetails(paymentDetails) {
    if (this.paymentComp && this.paymentComp.isFormsValid()) {
      super.savePaymentDetails(paymentDetails);
    } else {
      this.triggerFormValidation();
    }
  }

  /**
   * This method is used to save owner details
   * @param ownerDetails
   */
  saveOwner(ownerDetails) {
    super.saveOwner(ownerDetails);
  }

  /**
   * This method is used to fetch owner details into form
   * @param owners
   */
  setOwnerDetails(owners: Person[]) {
    // initialiseOwnerSections(owners, this);
    setOwnerState(owners, this);
  }
  // This method is handle cancel button.
  cancelForm() {
    this.alertService.clearAlerts();
    if (this.establishment?.transactionTracingId) {
      this.establishmentService
        .revertTransaction(this.establishment.registrationNo, this.establishment.transactionTracingId)
        .pipe(
          tap(() => {
            this.navigateBack();
          })
        )
        .subscribe(noop, err => this.alertService.showError(err?.error?.message));
    } else {
      this.navigateBack();
    }
  }
  navigateBack() {
    this.hideModal();
    this.setTransactionComplete();
    if (this.editEstablishment) {
      this.router.navigate([this.reRoute ? this.reRoute : RouterConstants.ROUTE_TODOLIST]);
    } else {
      if (this.reRoute) {
        this.router.navigate([this.reRoute]);
      } else {
        this.location.back();
      }
    }
  }
  //This method is used to reset owner details
  resetAllOwnerDetails() {
    for (let i = 0; i < this.establishmentOwner.persons.length; i++) {
      this.resetOwnerForm(i);
    }
    if (this.ownerComponent) {
      this.ownerComponent.createPersonForm();
    }
  }
  // This is used when the cancel button is clicked and to reset crn form details.
  resetCRNDetailsForm() {
    if (this.proactiveEstComp && this.proactiveEstComp.establishmentForm) {
      this.proactiveEstComp.resetCRNForm();
    }
  }
  //This method is to reset the Establihsment Details Form
  resetEstablishmentsForm() {
    if (this.establishmentDetailsComp && this.establishmentDetailsComp.establishmentDetailsForm) {
      this.establishmentDetailsComp.resetEstablishmentDetailsForm();
    }
  }
  // This method is to reset the payment Details Form
  resetPaymentForm() {
    if (this.paymentComp && this.paymentComp.paymentDetailsForm) {
      this.paymentComp.resetPaymentDetailsForm();
    }
  }
  // This method is to reset the owner Details Form
  resetOwnerForm(index: number) {
    if (this.ownerComponent && this.ownerComponent.employeeComponent) {
      this.ownerComponent.resetOwnerForm(index);
    }
  }

  /**
   * Clear any alert and save the owners
   * @param owner
   */
  verifyOwner(owner) {
    this.alertService.clearAlerts();
    super.verifyOwner(owner.ownerFormDetails, owner.index);
  }
  //Again verify the establishemnt owner
  verifyBirthDate(index) {
    this.ownerComponent.searchEmployeeComponent.some((searchPerson, personIndex) => {
      if (personIndex === index) {
        setTimeout(() => {
          searchPerson.isDateRequired = true;
          searchPerson.submitted = false;
        }, 500);
        return true;
      }
    });
  }
  submitDocument(comments: { comments: string }) {
    if (this.scanDocsComp) {
      this.isValidForm(this.scanDocsComp.documentList);
    }

    if (this.isUploadValid) {
      super.submitDocument(comments);
    } else {
      this.alertService.showMandatoryDocumentsError();
    }
  }
  isValidForm(documentList) {
    this.isUploadValid = true;
    if (documentList?.length > 0) {
      documentList.forEach((element: DocumentItem) => {
        if (element.required === true && element.documentContent === null) {
          element.uploadFailed = true;
          this.isUploadValid = false;
        }
      });
    }
  }
  //This method is to restrict progress bar while editing on previous section
  restrictProgressBar() {
    this.addEstablishmentService.restrictProgress(this.currentTab - 1, this.addProEstWizardItems);
  }
  /**
   * This method is used to check the validity and save the establishment details
   * @param establishmentDetails
   */
  saveEstablishment(establishmentDetails) {
    if (this.establishmentDetailsComp.isValidForm()) {
      super.saveEstablishment(establishmentDetails);
    } else {
      this.triggerFormValidation();
    }
  }
  /**
   * This method is to trigger the error if the owner form is invalid
   */
  checkOwnervalidation() {
    if (
      this.establishment &&
      EstablishmentConstants.LEGAL_ENTITY_WITHOUT_OWNER.indexOf(this.establishment.legalEntity.english) === -1
    ) {
      if (
        this.ownerIndex.indexOf(0) === -1 &&
        EstablishmentConstants.LEGAL_ENTITY_PARTNERSHIP.indexOf(this.establishment.legalEntity.english) === -1
      ) {
        this.triggerFormValidation();
      } else {
        if (
          this.proactiveEstowners.filter(owner => (owner.recordAction ? true : false)).length > 0 ||
          !this.editEstablishment
        ) {
          saveAllOwners(this)
            .pipe(
              tap(() => {
                if (this.showDocumentSection) {
                  this.getProActiveDocumentList();
                } else {
                  super.submitDocument({ comments: null });
                }
              })
            )
            .subscribe(
              () => {
                if (this.showDocumentSection) {
                  this.nextForm();
                }
              },
              err => {
                this.alertService.showError(err?.error?.message, err?.error?.details);
              }
            );
        } else {
          if (this.showDocumentSection) {
            this.nextForm();
          } else {
            super.submitDocument({ comments: null });
          }
        }
      }
    } else {
      this.nextForm();
    }
  }
  setSubmittedFalse(index) {
    this.ownerComponent.employeeComponent.some((person, indexPerson) => {
      if (index === indexPerson) {
        person.submitted = false;
        return true;
      }
      return false;
    });
  }
  //This method is to trigger the error if the form in invalid
  triggerFormValidation() {
    this.alertService.clearAlerts();
    this.alertService.showMandatoryErrorMessage();
  }
  //This method is to trigger the error if the owner is not saved
  triggerOwnerValidation() {
    this.alertService.clearAlerts();
    this.alertService.showErrorByKey(OWNER_ERROR_KEY);
  }

  //This method is to trigger the error if the owner is not matching with owner in mci
  triggerOwnerMismatch() {
    this.alertService.clearAlerts();
    this.alertService.showErrorByKey(OWNER_MISMATCH_ERROR_KEY);
  }

  //This method is to navigate to the next tab
  nextForm() {
    this.alertService.clearAlerts();
    if (this.currentTab <= this.totalTabs) {
      this.currentTab++;
    }
    if (this.addProEstWizard) {
      this.addProEstWizard.setNextItem(this.currentTab - 1);
    }
    scrollToTop();
  }
  // This method is to navigate to the previous tab
  previousForm() {
    this.alertService.clearAlerts();
    if (this.currentTab > 0) {
      this.currentTab--;
    }
    if (this.addProEstWizard) {
      this.addProEstWizard.setPreviousItem(this.currentTab - 1);
    }
    scrollToTop();
  }
  //Event emitted method from progress wizard to make form navigation
  selectWizard(index) {
    this.alertService.clearAlerts();
    this.currentTab = index + 1;
  }
  // This is to navigate  to first form
  resetToFirstForm() {
    this.currentTab = 0;
  }
  // This method is reset to final form
  finalForm() {
    this.currentTab = this.totalTabs - 1;
  }
  resetAdminForm() {}
  resetVerifyAdminForm() {}
  resetVerifyForm() {}

  toggleLegalEntity() {
    if (this.legalEntityFromFeed?.english === LegalEntityEnum.INDIVIDUAL) {
      this.disableLegalEntity = true;
    } else {
      this.disableLegalEntity = false;
    }
  }
  showCancel(template: TemplateRef<HTMLElement>) {
    this.showModal(template);
  }
  askForCancel() {
    this.showCancel(this.cancelTemp);
  }

  throwVerifyError() {
    this.alertService.showErrorByKey('ESTABLISHMENT.ERROR.VERIFY-CRN');
  }

  validateSamaResponse(samaResponse: EstablishmentIbanValidationResponse) {
    this.isAccountActive = false;
    if (!samaResponse) {
      return;
    }
    if (samaResponse.accountStatus === AccountStatusEnum.ACCOUNT_ACTIVE && samaResponse.matchStatus === MatchStatusEnum.MATCHED) {
      this.isAccountActive = true;
    } else if(samaResponse.matchStatus === MatchStatusEnum.UNMATCHED) {
      this.alertService.showErrorByKey('ESTABLISHMENT.ERROR.IBAN-NOT-MATCHED');
    }else if(samaResponse.accountStatus === AccountStatusEnum.ACCOUNT_INCORRECT) {
      this.alertService.showErrorByKey('ESTABLISHMENT.ERROR.INCORRECT-IBAN');
    } else {
      this.alertService.showErrorByKey('ESTABLISHMENT.ERROR.IBAN-NOT-ACTIVE');
    }
  }

  // function to keep transaction on draft status to resume later
  onKeepDraft() {
    this.alertService.clearAlerts();
    this.hideModal();
    this.setTransactionComplete();
    this.reRoute ? this.router.navigate([this.reRoute]) : this.location.back();
  }

  updateMciDetails({ mciError, mciOwners }) {
    this.mciError = mciError;
    this.currentOwners = mciOwners;
  }

  checkSamaFailure(samaFailure: boolean) {
    this.samaFailure = samaFailure;
  }
}
