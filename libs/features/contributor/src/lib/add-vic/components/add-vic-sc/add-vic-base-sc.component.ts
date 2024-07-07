/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Directive, Inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  CalendarService,
  DocumentService,
  LookupService,
  LovList,
  OccupationList,
  RouterData,
  RouterDataToken,
  WizardItem,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { VicBaseScComponent } from '../../../shared/components';
import { VicConstants } from '../../../shared/constants';
import { DocumentTransactionType, FormWizardTypes, PurposeOfRegsitrationEnum } from '../../../shared/enums';
import {
  ContributorService,
  EngagementService,
  EstablishmentService,
  ManageWageService,
  VicService
} from '../../../shared/services';

@Directive()
export abstract class AddVicBaseScComponent extends VicBaseScComponent {
  /** Local variables */
  isDoctorEdit: boolean;
  hasDoctorVerified = false;
  addVicBanner = VicConstants.REGISTER_VIC_BANNER_FIELDS;

  /** Observables. */
  specializationList$: Observable<LovList>;
  educationList$: Observable<LovList>;
  cityList$: Observable<LovList>;
  occupationList$: Observable<OccupationList>;
  nationalityList$: Observable<LovList>;

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
    readonly vicService: VicService,
    readonly router: Router,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
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
      vicService,
      modalService,
      routerDataToken,
      appToken,
      router,
      calendarService
    );
  }

  /** Method to initialize wizard. */
  initializeWizard(): void {
    this.wizardItems = this.getWizardItems();
    this.initializeFirstWizardItem();
  }

  /** Method to fetch wizard items. */
  getWizardItems(): WizardItem[] {
    return [
      new WizardItem(FormWizardTypes.PERSON_DETAILS, 'user'),
      new WizardItem(FormWizardTypes.ENGAGEMENT_DETAILS, 'briefcase'),
      new WizardItem(FormWizardTypes.HEALTH_RECORD_DETAILS, 'hand-holding-heart'),
      new WizardItem(FormWizardTypes.DOCUMENT_DETAILS, 'file-alt')
    ];
  }

  /** Method to fetch lookup details. */
  fetchLookUpDetails(): void {
    this.specializationList$ = this.lookupService.getSpecializationList();
    this.educationList$ = this.lookupService.getEducationList();
    this.cityList$ = this.lookupService.getCityList();
    this.occupationList$ = this.lookupService.getOccupationList();
    this.nationalityList$ = this.lookupService.getNationalityList();
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

  /** Method to navigate to next tab. */
  setNextTab(): void {
    this.progressWizard.setNextItem(this.activeTab);
    this.handleNext();
  }

  /** Method to navigate to previous tab. */
  setPreviousTab(): void {
    this.handlePrevious();
    this.progressWizard.setPreviousItem(this.activeTab - 1);
  }
}
