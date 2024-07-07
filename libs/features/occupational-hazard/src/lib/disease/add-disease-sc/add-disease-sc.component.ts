import { Component, OnInit, Inject, ViewChild, TemplateRef } from '@angular/core';
import { DiseaseBaseComponent } from '../base/disease-base.sc.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  AlertService,
  CoreContributorService,
  DocumentService,
  WorkflowService,
  LookupService,
  StorageService,
  TransactionService,
  LanguageToken,
  ApplicationTypeToken,
  RouterDataToken,
  RouterData,
  ApplicationTypeEnum,
  RouterConstants,
  Role,
  BilingualText,
  scrollToTop,
  markFormGroupTouched,
  DocumentItem,
  startOfDay,  
  bindToForm,
  GosiCalendar
} from '@gosi-ui/core';
import {
  OhService,
  ContributorService,
  EstablishmentService,
  DiseaseService,
  ComplicationService,
  InjuryService,
  ProcessType,
  NavigationIndicator,
  DocumentDcComponent,
  EngagementDetailsDTO,
  OccupationDetail,
  TransferInjuryConstants,
  OHTransactionType,
  deepCopy
} from '../../shared';

import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Location, PlatformLocation } from '@angular/common';
import { map } from 'rxjs/internal/operators/map';
import { DiseaseConstants } from '../../shared/constants/disease-constants';
import moment from 'moment';
// import * as pako from 'pako';
// declare const Buffer;

@Component({
  selector: 'oh-add-disease-sc',
  templateUrl: './add-disease-sc.component.html',
  styleUrls: ['./add-disease-sc.component.scss']
})
export class AddDiseaseScComponent extends DiseaseBaseComponent implements OnInit {
  reference: number;
  showAddDoc: boolean = false;
  isReturned: boolean = false;
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly modalService: BsModalService,
    readonly alertService: AlertService,
    readonly ohService: OhService,
    readonly contributorService: ContributorService,
    readonly coreContributorService: CoreContributorService,
    readonly documentService: DocumentService,
    readonly workflowService: WorkflowService,
    readonly establishmentService: EstablishmentService,
    readonly injuryService: InjuryService,
    readonly lookupService: LookupService,
    readonly diseaseService: DiseaseService,
    readonly complicationService: ComplicationService,
    readonly router: Router,
    readonly storageService: StorageService,
    readonly fb: FormBuilder,
    readonly route: ActivatedRoute,
    readonly transactionService: TransactionService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly activatedRoute: ActivatedRoute,
    readonly location: Location,
    readonly pLocation: PlatformLocation   
  ) {
    super(
      language,
      alertService,
      complicationService,
      contributorService,
      documentService,
      workflowService,
      establishmentService,
      injuryService,
      diseaseService,
      lookupService,
      ohService,
      router,
      appToken,
      routerData,
      fb,
      location,
      pLocation,
      modalService,
      transactionService
    );
    pLocation.onPopState(() => {
      if (this.routerData.taskId && this.appToken === ApplicationTypeEnum.PUBLIC) {
        this.router.navigate([RouterConstants.ROUTE_TODOLIST]);
        this.alertService.clearAlerts();
      }
    });
  }
  /* Local Variables */
  workFlowType = 'disease';
  compressedString: string;
  resourceType: string;
  decompressedString: string;
  @ViewChild('cancelDisease', { static: false })
  private cancelDiseaseModal: TemplateRef<Object>;
  @ViewChild('documentDetailsForm', { static: false })
  documentDetailsForm: DocumentDcComponent;
  
  ngOnInit(): void {
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP ? true : false;
    this.isAppPublic = this.appToken === ApplicationTypeEnum.PUBLIC ? true : false;
    const url = this.router.url;
    if (url.indexOf('/edit') >= 0) {
      this.isEdit = true;
    }
    this.language.subscribe(lang => {
      this.selectedLang = lang;
    });
    this.processType = url.substr(url.lastIndexOf('/') + 1);
    // this.referenceNo = this.ohService.getTransactionRefId();
    this.alertService.clearAlerts();
    this.initializeWizardItems();
    this.taskid = this.routerData.taskId;
    this.getRouteParam(this.route.paramMap);
    this.diseaseDetailsForm = this.createDiseaseDetailsForm();
    if (this.routerData) {
      if (this.routerData.taskId !== null && this.routerData.taskId !== undefined) {
        this.comment = this.routerData.comments;
        if (this.routerData.assignedRole === Role.VALIDATOR_1) {
          this.isValidator1 = true;
        }
        if (this.routerData.assignedRole === Role.EST_ADMIN_OH) {
          this.isValidator2 = true;
        }
        this.isWorkflow = true;
        this.setValues();
      }
    }
    if (
      this.appToken === ApplicationTypeEnum.PUBLIC &&
      (this.processType === ProcessType.RE_OPEN || this.processType === ProcessType.EDIT) &&
      this.routerData.taskId !== null &&
      this.routerData.taskId !== undefined
    ) {
      this.disableEst = true;
    }

    if (
      (this.processType === ProcessType.MODIFY || this.processType === ProcessType.RE_OPEN) &&
      !this.routerData.taskId
    ) {
      this.isWorkflow = true;
      this.isValidator1 = true;
      if (this.processType === ProcessType.MODIFY) {
        this.diseaseService.setNavigationIndicator(NavigationIndicator.CSR_EDITS);
      }
    }
    if (this.processType === ProcessType.RE_OPEN) {
      if (this.isAppPrivate) {
        this.diseaseService.setNavigationIndicator(NavigationIndicator.CSR_REOPEN_INJURY);
      } else {
        this.diseaseService.setNavigationIndicator(NavigationIndicator.EST_ADMIN_REOPEN_INJURY);
      }
    }
    if (this.routerData.resourceType === DiseaseConstants.DISEASE && this.processType === ProcessType.EDIT) {
      this.diseaseService.setNavigationIndicator(NavigationIndicator.VALIDATOR_EDIT_DISEASE_DETAILS);
    }
    if (this.routerData.resourceType === TransferInjuryConstants.TRANSFER_INJURY) {
      this.diseaseService.setNavigationIndicator(NavigationIndicator.TRANSFER_INJURY_POST_DISEASE_DETAILS);
      this.isTransferredInjury = true;
    } else {
      this.isTransferredInjury = false;
    }
    this.getData();
    if (!this.socialInsuranceNo) {
      this.location.back();
    }
  }
  //Getting data from services
  getData() {
    // this.referenceNo = this.ohService.getTransactionRefId();
    this.socialInsuranceNo = this.ohService.getSocialInsuranceNo();
    this.registrationNo = this.ohService.getRegistrationNumber();
    if (this.ohservice.getIsNewTransaction() && this.processType !== ProcessType.MODIFY) {
      this.ohService.setDiseaseId(null);
    }
    if (this.previousOutcome === 'RETURN') {
        this.isReturned = true;
    }
    this.diseaseId = this.ohService.getDiseaseId();
    if (this.socialInsuranceNo) {
      this.getManageDiseaseDocumentList();
      if (this.diseaseId) {
        this.getDiseaseDetails();
      }
      if (!this.diseaseId && this.isTransferredInjury && this.isAppPublic) {
        this.getTransferDiseaseId();
        this.showAddDoc = true;
        if (this.previousOutcome === 'RETURN') {
          this.showAddDoc = false;
        }
      }
      if (
        this.routerData.taskId ||
        !this.isAppPrivate ||
        this.processType === ProcessType.RE_OPEN ||
        this.processType === ProcessType.MODIFY ||
        this.isEdit
      ) {
        this.getContributor();
      }
      this.getContributor();
      if (this.isAppPrivate) {
        this.person = this.ohService.getPersonDetails();
      }
      this.getOccupationEngagementDetail(this.socialInsuranceNo, null, this.registrationNo);
      this.initializeLookups();
      this.isAddressPresent = this.getAddressAvailability(this.person);
    }
  }
  //Set values from Router Data
  setValues() {
    this.diseaseId = Number(this.routerData.resourceId);
    this.diseaseNumber = Number(this.routerData.resourceId);
    const payload = JSON.parse(this.routerData.payload);
    this.channel = payload.channel;
    this.registrationNo = payload.registrationNo;
    this.socialInsuranceNo = payload.socialInsuranceNo;
    this.referenceNo = payload.referenceNo;
    this.resourceType = String(this.routerData.resourceType);
    // this.diseaseId = payload.id;
    if (this.processType !== ProcessType.ADD) {
      this.diseaseId = payload.diseaseId;
    }
    this.transferInjuryId = payload.transferInjuryId;
    this.previousOutcome = payload.previousOutcome;
    this.ohService.setDiseaseId(this.diseaseId);
    this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
    this.ohService.setRegistrationNo(this.registrationNo);
    this.ohService.setDiseaseNumber(this.diseaseNumber);
    this.ohService.setTransferInjuryId(this.transferInjuryId);
    this.ohService.setReferenceNo(this.referenceNo);
  }
  
  
  getContributor() {
    this.registrationNo = this.ohService.getRegistrationNumber();
    this.diseaseService
      .getContributor(this.socialInsuranceNo)
      .pipe(map(res => res.person))
      .subscribe(
        res => {
          this.personId = res.personId;
          this.person = res;
          this.ohService.setPersonDetails(this.person);
          this.isAddressPresent = this.getAddressAvailability(res);
        },
        err => {
          this.showError(err);
        }
      );
  }
  setOccupationDetails(occupationDetails: EngagementDetailsDTO[]) {
    this.occupationDetailsToSave = occupationDetails;
    if (this.processType != ProcessType.MODIFY && this.processType != ProcessType.EDIT) {
      this.getOccupationEngagementDetail(this.socialInsuranceNo, null, this.registrationNo);
    }
  }

  bindDiseaseDetailForm() {
    bindToForm(this.diseaseDetailsForm, this.diseaseDetails);
    this.diseaseDetailsForm
      ?.get('diseaseDiagnosisDate')
      ?.get('gregorian')
      ?.setValue(moment(this.diseaseDetails?.diseaseDiagnosisDate?.gregorian).toDate());
    this.diseaseDetailsForm
      ?.get('workDisabilityDate')
      ?.get('gregorian')
      ?.setValue(moment(this.diseaseDetails?.workDisabilityDate?.gregorian).toDate());
    this.diseaseDetailsForm
      ?.get('employerInformedDate')
      ?.get('gregorian')
      ?.setValue(moment(this.diseaseDetails?.employerInformedOn?.gregorian).toDate());
    this.diseaseDetailsForm
      ?.get('contributorInformedDate')
      ?.get('gregorian')
      ?.setValue(moment(this.diseaseDetails?.contributorInformedDate?.gregorian).toDate());
    this.diseaseDetailsForm?.get('diseaseLeadToDeathOfContributor')?.setValue(this.diseaseDetails?.diseaseLeadToDeathOfContributor);
    if (this.diseaseDetails?.diseaseLeadToDeathOfContributor === true) {
      this.diseaseDetailsForm
        ?.get('deathDate')
        ?.get('gregorian')
        ?.setValue(moment(this.diseaseDetails?.deathDate?.gregorian).toDate());
    }
    if (this.diseaseDetailsForm?.get('diseaseCause')?.get('english')?.valid) {
      this.diseaseDetailsForm?.get('diseaseDiagnosis.english').setErrors(null);
      this.diseaseDetailsForm.get('diseaseDiagnosis.english').clearValidators();
    } else if (
      this.diseaseDetailsForm?.get('diseaseDiagnosis.english').valid &&
      this.diseaseDetailsForm?.get('diseaseCause')
    ) {
      this.diseaseDetailsForm?.get('diseaseCause.english').setErrors(null);
      this.diseaseDetailsForm.get('diseaseCause.english').clearValidators();
    }
  }  

  splitDescription(diseaseDescription: string) {
    this.diseaseDescriptionArray = diseaseDescription.split(' ');
    this.diseaseDescriptionArray = this.diseaseDescriptionArray
      .reduce((res, item) => res.concat(item, ' '), [])
      .slice(0, -1);
    this.diseaseDescription = this.diseaseDescriptionArray.join(',');
    console.log(this.diseaseDescription);
    return this.diseaseDescriptionArray;
  }

  showCancelTemplate() {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(this.cancelDiseaseModal, config);
  }
  setModifyIndicator(modifyIndicator: boolean) {
    this.modifyIndicator = modifyIndicator;
  }

  showFormValidation() {
    if (this.appToken === ApplicationTypeEnum.PUBLIC) {
      this.alertService.clearAlerts();
    }
    this.alertService.showMandatoryErrorMessage();
  }
  showMandatoryDocErrorMessage($event) {
    this.showErrorMessage($event);
  }
  
  modifyPayload(originalPayload, additionalData) {
    return { originalPayload, ...additionalData };
  }

  saveDisease(personalDetails) {
    if (personalDetails) {
      this.diseaseService
        .saveEmergencyContactDisease(personalDetails.contactDetail.mobileNo, this.registrationNo, this.isAppPublic)
        .subscribe(
          response => {
            this.diseaseNumber = response;
            if (personalDetails.personDetails !== null && personalDetails.personDetails !== undefined) {
              personalDetails.personDetails.contactDetail.emergencyContactNo =
                personalDetails.contactDetail.mobileNo.primary.toString();
            }
            if (this.processType !== ProcessType.MODIFY && this.processType !== ProcessType.RE_OPEN) {
              this.saveAllowancePayee(personalDetails.allowancePayee);
            }
            if (
              personalDetails.personDetails &&
              personalDetails.personDetails.contactDetail &&
              personalDetails.personDetails.contactDetail.addresses &&
              personalDetails.personDetails.contactDetail.addresses.length > 0
            ) {
              this.saveAddress(personalDetails.personDetails);
            } else {
              this.nextForm();
            }
          },
          err => {
            this.showError(err);
          }
        );
    }
  }
  setReopenReason(reopenReason: BilingualText) {
    if (reopenReason.english !== 'Others') {
      this.isSelectedReasonOthers = false;
    } else {
      this.isSelectedReasonOthers = true;
    }
  }
  editedOcc(val) {
    this.editedOccupation = val;
  }
  getEngagementDetailsOfDisease(socialInsuranceNo, diseaseId) {
    this.diseaseService
      .getPayeeDetails(socialInsuranceNo, diseaseId, this.registrationNo, this.isAppPublic, false)
      .subscribe(
        response => {
          if (response?.applicablePayee?.length !== 2) {
            this.disabled = true;
          }
        },
        err => {
          this.showError(err);
        }
      );
    return this.disabled;
  }
  nextForm() {
    scrollToTop();
    this.currentTab++;
    this.alertService.clearAlerts();
    if (this.currentTab < this.totalTabs) {
      this.reportDiseaseTabs.tabs[this.currentTab].active = true;
    }
    if (this.reportDiseaseWizard) {
      this.reportDiseaseWizard.setNextItem(this.currentTab);
    }
  }
  getEngagementDetails(occupation: OccupationDetail) {
    if (occupation) {
      this.getOccupationEngagementDetail(
        this.socialInsuranceNo,
        occupation.occupationName.english,
        this.registrationNo
      );
    } else {
      this.getOccupationEngagementDetail(this.socialInsuranceNo, null, this.registrationNo);
    }
  }
  deleteDocument(document: DocumentItem) {}
  onDeleteOccupationDetails(occupationDetails: EngagementDetailsDTO[]) {
    this.occupationDetailsToSave = occupationDetails;
    if (occupationDetails && occupationDetails.length === 0) {
      this.occupationDetailsToSave = [];
    }
  }
}
