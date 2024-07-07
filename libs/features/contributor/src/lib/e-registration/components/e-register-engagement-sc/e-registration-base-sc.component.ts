/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Directive, Inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertService,
  BilingualText,
  bindToObject,
  CalendarService,
  DocumentClassificationEnum,
  DocumentItem,
  DocumentService,
  LookupService,
  LovList,
  OccupationList,
  RouterData,
  RouterDataToken,
  scrollToTop,
  startOfDay,
  WizardItem,
  WorkflowService
} from '@gosi-ui/core';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import { BsModalService } from 'ngx-bootstrap/modal';
import { iif, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Contributor, EngagementPeriod, PersonalInformation, setWageDetails, SystemParameter } from '../../../shared';
import { ContributorBaseScComponent, VicBaseScComponent } from '../../../shared/components';
import { VicConstants } from '../../../shared/constants';
import {
  DocumentTransactionId,
  DocumentTransactionType,
  FormWizardTypes,
  PersonTypesEnum,
  PurposeOfRegsitrationEnum,
  YesOrNo
} from '../../../shared/enums';
import { EEngagement } from '../../../shared/models/e-engagement';
import { EEngagementDetails } from '../../../shared/models/e-engagement-details';
import {
  ContributorService,
  EngagementService,
  EstablishmentService,
  ManageWageService,
  VicService
} from '../../../shared/services';
import * as WizardUtil from '../../../shared/utils/wizard-util';

@Directive()
export abstract class ERegisterEngagementBaseScComponent extends ContributorBaseScComponent {
  /** Local variables */
  flag: number;
  isDoctorEdit: boolean;
  hasDoctorVerified = false;
  addVicBanner = VicConstants.REGISTER_VIC_BANNER_FIELDS;
  contributor: Contributor;
  totalTabs = 4;
  activeTab = 0;
  documents: DocumentItem[] = [];
  wizardItems: WizardItem[] = [];
  systemParams: SystemParameter;
  engDetailsCsr: EEngagement = new EEngagement();
  joiningDate: any;
  leavingDate: any;
  personDetails: PersonalInformation = new PersonalInformation();
  valIdentifier: number;
  valRequestId: number;
  requestId: number;

  /** Observables. */
  specializationList$: Observable<LovList>;
  educationList$: Observable<LovList>;
  cityList$: Observable<LovList>;
  occupationList$: Observable<OccupationList>;
  nationalityList$: Observable<LovList>;
  leavingReasonList$: Observable<LovList>;
  /**Progress wizard */
  @ViewChild('progressWizardItems', { static: false })
  progressWizardItems: ProgressWizardDcComponent;
  isAppPrivate: any;

  constructor(
    readonly alertService: AlertService,
    readonly establishmentService: EstablishmentService,
    readonly contributorService: ContributorService,
    readonly engagementService: EngagementService,
    readonly documentService: DocumentService,
    readonly lookupService: LookupService,
    readonly workflowService: WorkflowService,
    readonly modalService: BsModalService,
    readonly manageWageService: ManageWageService,
    readonly router: Router,
    readonly vicService: VicService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly calendarService: CalendarService
  ) {
    super(
      alertService,
      establishmentService,
      contributorService,
      engagementService,
      documentService,
      workflowService,
      manageWageService,
      routerDataToken,
      calendarService
    );
  }
  /** Method to get system parameters. */
  getSystemParameters() {
    this.contributorService
      .getSystemParams()
      .subscribe(res => (this.systemParams = new SystemParameter().fromJsonToObject(res)));
  }

  /** Method to initialize wizard. */
  initializeWizard(): void {
    this.wizardItems = this.getWizardItems();
    WizardUtil.initializeWizard(this.wizardItems, this.activeTab);
  }

  /** Method to initialize first wizard item. */
  initializeFirstWizardItem(isFirstItemImage?: boolean) {
    this.wizardItems[0].isDisabled = false;
    this.wizardItems[0].isActive = true;
    if (isFirstItemImage) this.wizardItems[0].isImage = true;
  }

  /** Method to fetch wizard items. */
  getWizardItems(): WizardItem[] {
    if (!this.isEditMode) {
      if (this.activeTab == 1)
        return [
          new WizardItem(FormWizardTypes.REQUEST_DETAILS, 'briefcase'),
          new WizardItem(FormWizardTypes.DOCUMENT_DETAILS, 'file-alt'),
          new WizardItem(FormWizardTypes.VERIFY, 'clipboard-check')
        ];
      else
        return [
          new WizardItem(FormWizardTypes.PERSON_DETAILS, 'user'),
          new WizardItem(FormWizardTypes.REQUEST_DETAILS, 'briefcase'),
          new WizardItem(FormWizardTypes.DOCUMENT_DETAILS, 'file-alt'),
          new WizardItem(FormWizardTypes.VERIFY, 'clipboard-check')
        ];
    } else {
      return [
        new WizardItem(FormWizardTypes.PERSON_DETAILS, 'user'),
        new WizardItem(FormWizardTypes.REQUEST_DETAILS, 'briefcase'),
        new WizardItem(FormWizardTypes.DOCUMENT_DETAILS, 'file-alt')
      ];
    }
  }

  /** Method to fetch lookup details. */
  fetchLookUpDetails(): void {
    this.specializationList$ = this.lookupService.getSpecializationList();
    this.educationList$ = this.lookupService.getEducationList();
    this.cityList$ = this.lookupService.getCityList();
    this.occupationList$ = this.lookupService.getOccupationList();
    this.nationalityList$ = this.lookupService.getNationalityList();
    this.leavingReasonList$ = this.lookupService.getReasonForLeavingList();
  }

  /** Method to set wizard items on edit mode. */
  //  setWizardOnEdit(index?: number): void {
  //   const tab = index ? index : this.activeTab;
  //   if (this.wizardItems.length > 0) {
  //     for (let i = 0; i < tab; i++) {
  //       this.wizardItems[i].isDone = true;
  //       this.wizardItems[i].isActive = false;
  //       this.wizardItems[i].isDisabled = false;
  //     }
  //     this.wizardItems[tab].isActive = true;
  //     this.wizardItems[tab].isDisabled = false;
  //   }
  // }

  /** Method to fetch required documents for the transaction. */
  getRequiredDocuments(
    businessKey: number,
    docTransactionId: string,
    docTransactionType: string | string[],
    isRefreshRequired = false,
    referenceNo?: number
  ) {
    this.documentService.getRequiredDocumentsEinspection(docTransactionId, docTransactionType).subscribe(res => {
      if (this.isEditMode) {
        this.documents = res.filter(item => item.documentClassification === DocumentClassificationEnum.EXTERNAL);
      }
      if (this.isAppPrivate) {
        this.documents = this.documentService.removeDuplicateDocs(
          res.filter(docs => docs.documentClassification === 'Internal')
        );
      } else if (!this.isAppPrivate) {
        this.documents = this.documentService.removeDuplicateDocs(
          res.filter(docs => docs.documentClassification === 'External')
        );
      } else {
        this.documents = this.documentService.removeDuplicateDocs(res);
      }
      if (isRefreshRequired) {
        this.documents.forEach(doc =>
          this.refreshDocument(
            doc,
            businessKey,
            docTransactionId,
            typeof docTransactionType === 'string' ? docTransactionType : null,
            referenceNo
          )
        );
      }
    });
  }

  /** Method to get document transaction type  based on purpose of registration. */
  getDocumentTransactionType(purposeOfReg: string, isPrivate: boolean): string[] {
    const docType: string[] = [];
    switch (purposeOfReg) {
      case PurposeOfRegsitrationEnum.EMP_INT_POL_MIL:
        docType.push(DocumentTransactionType.REGISTER_VIC_CONTRIBUTOR_IN_MILITORY_OR_POLITICAL_MISSIONS);
        break;
      case PurposeOfRegsitrationEnum.FREELANCER:
      case PurposeOfRegsitrationEnum.PROFESSIONAL:
        docType.push(DocumentTransactionType.REGISTER_VIC_CONTRIBUTOR_FREELANCER_OR_PROFESSIONAL);
        break;
      case PurposeOfRegsitrationEnum.GOV_EMP_NOT_UNDER_PPA:
        docType.push(DocumentTransactionType.REGISTER_GOV_VIC_CONTRIBUTOR_NOT_IN_PPA);
        break;
      case PurposeOfRegsitrationEnum.WORKING_OUTSIDE_SAUDI:
        docType.push(DocumentTransactionType.REGISTER_VIC_CONTRIBUTOR_IN_OUTSIDE_SAUDI);
        break;
    }
    if (this.isEditMode && (this.isDoctorEdit || this.hasDoctorVerified))
      docType.push(DocumentTransactionType.REGISTER_VIC_DOCTOR_MODIFY);
    docType.push(
      isPrivate
        ? DocumentTransactionType.REGISTER_VIC_CONTRIBUTOR_FO
        : DocumentTransactionType.REGISTER_VIC_CONTRIBUTOR_GOL
    );
    return docType;
  }

  /** Method to navigate to next tab on successful save */
  navigateToNextTab() {
    this.isApiTriggered = false;
    this.alertService.clearAlerts();
    this.activeTab++;
    if (this.routerDataToken.tabIndicator == 1 && !this.isEditMode) {
      this.flag++;
      this.progressWizardItems.setNextItem(this.flag);
    } else this.progressWizardItems.setNextItem(this.activeTab);
    scrollToTop();
  }

  navigateToHome(msg) {
    this.isApiTriggered = false;
    this.alertService.clearAlerts();
    this.router.navigate(['home/transactions/list/history']);
    scrollToTop();
    this.alertService.showSuccess(msg);
  }
  /** Method to navigate to the previous tab */
  navigateToPreviousTab() {
    this.isApiTriggered = false;
    this.alertService.clearAlerts();
    this.activeTab--;
    if (this.routerDataToken.tabIndicator == 1 && !this.isEditMode) {
      this.flag--;
      this.progressWizardItems.setPreviousItem(this.flag);
    } else this.progressWizardItems.setPreviousItem(this.activeTab);
    scrollToTop();
  }
  /** Method to navigate by index. */
  navigateToTabByIndex(activeTab: number) {
    this.isApiTriggered = false;
    this.activeTab = activeTab;
    if (this.routerDataToken.tabIndicator == 1) {
      this.progressWizardItems.setActive(this.flag);
    } else this.progressWizardItems.setActive(this.activeTab);
    scrollToTop();
  }

  // /** Method to navigate to next tab. */
  // setNextTab(): void {
  //   this.progressWizard.setNextItem(this.activeTab);
  //   this.handleNext();
  // }

  // /** Method to navigate to previous tab. */
  // setPreviousTab(): void {
  //   this.handlePrevious();
  //   this.progressWizard.setPreviousItem(this.activeTab - 1);
  // }

  setWageDetails(engagementWageDetails, coverage?: BilingualText): EEngagementDetails {
    const eng = new EEngagementDetails();
    //setting contributor abroad
    if (engagementWageDetails.engagementDetails.contributorAbroad) {
      if (engagementWageDetails.engagementDetails.contributorAbroad.english === YesOrNo.NO) {
        engagementWageDetails.engagementDetails.contributorAbroad = false;
      } else {
        engagementWageDetails.engagementDetails.contributorAbroad = true;
      }
      if (engagementWageDetails.wageDetails && engagementWageDetails.wageDetails.length > 0) {
        engagementWageDetails.wageDetails.forEach(period => {
          period.contributorAbroad = engagementWageDetails.engagementDetails.contributorAbroad;
        });
      }
    }
    //Setting penalty indicator
    engagementWageDetails.engagementDetails.penaltyIndicator = engagementWageDetails.engagementDetails.penaltyIndicator
      ? 1
      : 0;
    //Due date issue(3 hr) setting to start of day
    engagementWageDetails.engagementDetails.joiningDate.gregorian = startOfDay(
      engagementWageDetails.engagementDetails.joiningDate.gregorian
    );
    if (engagementWageDetails.engagementDetails.leavingDate?.gregorian) {
      engagementWageDetails.engagementDetails.leavingDate.gregorian = startOfDay(
        engagementWageDetails.engagementDetails.leavingDate.gregorian
      );
    }
    engagementWageDetails.wageDetails.forEach(engPeriod => {
      engPeriod.startDate.gregorian = startOfDay(engPeriod.startDate.gregorian);
      if (engPeriod.endDate?.gregorian) {
        engPeriod.endDate.gregorian = startOfDay(engPeriod.endDate.gregorian);
      }
    });
    bindToObject(eng, engagementWageDetails.engagementDetails);
    engagementWageDetails.wageDetails.forEach(engPeriod => {
      engPeriod.coverage = coverage ? coverage : null;
      eng.engagementPeriod.push(bindToObject(new EngagementPeriod(), engPeriod));
    });
    return eng;
  }

  getValidatorDetails() {
    //console.log('engg ', this.uuid);
    this.contributorService.getEinspectionEngagementDetails(this.valIdentifier, this.valRequestId).subscribe(
      res => {
        this.engDetailsCsr = res;
      }
      // err => this.showAlertDetails(err)
    );
  }

  /** Method to get documents. */
  getDocument() {
    this.documentService
      .getDocuments(
        DocumentTransactionId.ADD_ENGAGEMENT_E_INSPECTION,
        DocumentTransactionType.ADD_ENGAGEMENT_E_INSPECTION,
        this.valRequestId
      )
      .subscribe(res => (this.documents = res));
  }

  getPersonDetails(identifier) {
    const queryParams: string = `NIN=${identifier}`;
    this.contributorService
      .getPersonDetails(queryParams, new Map().set('fetchAddressFromWasel', true))
      .pipe(
        tap(res => {
          this.personDetails = res;
        })
      )
      .subscribe({
        error: err => this.showError(err)
      });
  }
}
