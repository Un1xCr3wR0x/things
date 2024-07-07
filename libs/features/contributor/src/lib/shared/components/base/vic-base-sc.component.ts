/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Directive, Inject, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BilingualText,
  BorderNumber,
  CalendarService,
  DocumentService,
  IdentityTypeEnum,
  Iqama,
  Lov,
  NIN,
  Passport,
  RouterData,
  RouterDataToken,
  WageCard,
  WizardItem,
  WorkflowService,
  getFormErrorCount,
  scrollToTop
} from '@gosi-ui/core';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { pluck, tap } from 'rxjs/operators';
import {
  HealthRecordItem,
  RegistrationPurpose,
  SystemParameter,
  VICWageCategory,
  VICWageCategoryWrapper
} from '../../../shared/models';
import {
  ContributorService,
  EngagementService,
  EstablishmentService,
  ManageWageService,
  VicService
} from '../../services';
import { ContributorBaseScComponent } from './contributor-base-sc.component';

@Directive()
export class VicBaseScComponent extends ContributorBaseScComponent {
  /** Local variables. */
  isAppPrivate: boolean;
  activeTab = 0;
  totalTab: number;
  transactionId: number;
  wizardItems: WizardItem[];
  vicWageCategories: WageCard[];
  healthRecordList: HealthRecordItem[];
  vicWageList: VICWageCategoryWrapper;
  purposeOfRegistrationList: Lov[];
  hasSaved = false;
  successMessage: BilingualText;
  nin: number;
  purposeOfEngagement: RegistrationPurpose;
  systemParams: SystemParameter;

  /** Child components. */
  @ViewChild('progressWizardItems') progressWizard: ProgressWizardDcComponent;

  /** Creates an instance of VicBaseScComponent. */
  constructor(
    readonly alertService: AlertService,
    readonly establishmentService: EstablishmentService,
    readonly contributorService: ContributorService,
    readonly engagementService: EngagementService,
    readonly documentService: DocumentService,
    readonly workflowService: WorkflowService,
    readonly manageWageService: ManageWageService,
    readonly vicService: VicService,
    readonly modalService: BsModalService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly router: Router,
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

  /** Method to get VIC wage categories. */
  getVICWageCategories(purposeOfRegistration?: string, transactionType?: string): Observable<VICWageCategory[]> {
    return this.vicService.getVICWageCategories(this.nin, purposeOfRegistration, transactionType).pipe(
      tap(res => (this.vicWageList = res)),
      pluck('wageCategories'),
      tap(res => (this.vicWageCategories = this.assembleWageCategories(res)))
    );
  }

  /** Method to assemble wage categories. */
  assembleWageCategories(wageCategories: VICWageCategory[]) {
    const categoryList: WageCard[] = [];
    wageCategories.forEach(wage => {
      const wageCard = new WageCard();
      wageCard.category = wage.incomeCategory;
      wageCard.wage = wage.wage;
      wageCard.disabled = !wage.applicable;
      categoryList.push(wageCard);
    });
    return categoryList;
  }

  /** Method to get purpose of registration. */
  getPurposeOfRegistration() {
    return this.vicService.getPurposeOfRegistration(this.nin).pipe(tap(res => (this.purposeOfRegistrationList = res)));
  }

  /** Method to fetch health record list.  */
  fetchHealthRecords(): Observable<HealthRecordItem[]> {
    return this.vicService.fetchHealthRecords().pipe(
      pluck('healthRecordsResponse'),
      tap(res => (this.healthRecordList = res))
    );
  }

  /** Method to get contributor details with sin.*/
  getContributor(options?: Map<string, boolean>) {
    return this.contributorService.getContributorBySin(this.socialInsuranceNo, options).pipe(
      tap(res => {
        this.contributor = res;
        this.nin = this.getNin(this.contributor.person.identity);
      })
    );
  }

  /** Method to get NIN. */
  getNin(identities: Array<NIN | Iqama | BorderNumber | Passport>) {
    const index = identities.findIndex(item => item.idType === IdentityTypeEnum.NIN);
    return identities[index] ? (<NIN>identities[index]).newNin : null;
  }

  /** Method to initialize first wizard item. */
  initializeFirstWizardItem(isFirstItemImage?: boolean) {
    this.wizardItems[0].isDisabled = false;
    this.wizardItems[0].isActive = true;
    if (isFirstItemImage) this.wizardItems[0].isImage = true;
  }

  /** Method to navigate between form wizard steps while clicking on individual wizard icon. */
  selectFormWizard(selectedWizardIndex: number) {
    this.alertService.clearAlerts();
    this.activeTab = selectedWizardIndex;
  }

  /** Method to set wizard items on edit mode. */
  setWizardOnEdit(index?: number): void {
    const tab = index ? index : this.activeTab;
    if (this.wizardItems.length > 0) {
      for (let i = 0; i < tab; i++) {
        this.wizardItems[i].isDone = true;
        this.wizardItems[i].isActive = false;
        this.wizardItems[i].isDisabled = false;
      }
      this.wizardItems[tab].isActive = true;
      this.wizardItems[tab].isDisabled = false;
    }
  }

  /** Method to navigate to next tab. */
  setNextSection(): void {
    if (this.appToken !== ApplicationTypeEnum.INDIVIDUAL_APP) {
      this.handleNext();
      this.progressWizard.setNextItem(this.activeTab);
    } else {
      this.alertService.clearAllErrorAlerts();
      scrollToTop();
      this.router.navigate([`/home/contributor/individual/contributions`]);
      // this.router.navigate([`/home/contributor/individual/contributions`],
      // {
      //   queryParams: {
      //     wageUpdateSuccess: true
      //   }
      // });
    }
  }

  /** Handle navigating to next section. */
  handleNext() {
    this.alertService.clearAllErrorAlerts();
    scrollToTop();
    this.activeTab++;
  }

  /** Method to navigate to previous tab. */
  setPreviousSection(): void {
    this.handlePrevious();
    this.progressWizard.setPreviousItem(this.activeTab);
  }

  /** Handle navigating to previous section. */
  handlePrevious() {
    this.alertService.clearAllErrorAlerts();
    scrollToTop();
    this.activeTab--;
  }

  /** Method to show modal. */
  showModal(template: TemplateRef<HTMLElement>): void {
    this.modalRef = this.modalService.show(template, {
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-dialog-centered'
    });
  }

  /** Method to check documents. */
  checkDocuments(): boolean {
    return this.documentService.checkMandatoryDocuments(this.documents);
  }

  /** Method to check for any changes in transaction. */
  checkConfirmationRequired(formGroup: FormGroup): boolean {
    return (
      getFormErrorCount(formGroup) > 0 ||
      formGroup.dirty ||
      this.checkChangesInDocument(formGroup.get('docStatus.changed'))
    );
  }

  /** Method to check for changes in documents. */
  checkChangesInDocument(control: AbstractControl): boolean {
    return control ? control.value : false;
  }

  /** Method to check whether revert is required. */
  checkRevertRequired(control: AbstractControl): boolean {
    return this.isEditMode && (this.hasSaved || this.checkChangesInDocument(control));
  }

  /** Method to show error by key. */
  showErrorByKey(key: string) {
    this.alertService.showErrorByKey(key);
  }

  /** Method to show warning by key. */
  showWarningMessage(key: string) {
    this.alertService.showWarningByKey(key);
  }
  /** Method to get purpose of registration. */
  getPurposeOfEngagement() {
    return this.vicService.getPurposeOfEngagement(this.nin).pipe(
      tap(res => {
        this.purposeOfEngagement = res;
      })
    );
  }
  /** Method to get system parameters. */
  getSystemParameters() {
    this.contributorService.getSystemParams().subscribe(res => {
      this.systemParams = new SystemParameter().fromJsonToObject(res);
    });
  }
}
