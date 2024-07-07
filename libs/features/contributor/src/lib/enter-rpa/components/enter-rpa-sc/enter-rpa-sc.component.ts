import { Location } from '@angular/common';
import { Component, Inject, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  DocumentItem,
  DocumentService,
  RouterData,
  RouterDataToken,
  WizardItem,
  scrollToTop
} from '@gosi-ui/core';
import { ContributorService, RpaServices, SearchEngagementResponse } from '@gosi-ui/features/contributor';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DocumentTransactionId, DocumentTransactionType, FormWizardTypes, TransactionId } from '../../../shared/enums';
import { RpaAppointmentDetails } from '../../../shared/models/enter-rpa-appointment-details';
import * as WizardUtil from '../../../shared/utils/wizard-util';

@Component({
  selector: 'cnt-enter-rpa-sc',
  templateUrl: './enter-rpa-sc.component.html',
  styleUrls: ['./enter-rpa-sc.component.scss']
})
export class EnterRpaScComponent {
  wizardItems: WizardItem[] = [];
  engagements: SearchEngagementResponse;
  activeTab: number = 0;
  personIdentifier: any; //social insurance number
  documents: DocumentItem[] = [];
  requestId: number;
  schema: any;
  activateTimer: boolean;
  appoinmentDetails: RpaAppointmentDetails;
  engDetailsSavedboolean: boolean = false;
  parentForm = new FormGroup({});
  referenceNo: number;
  documentUploadEngagementId: number;
  documentUploadTransScheme: any;
  documentUploadTransTypeScheme: any;
  returnToEngPage: boolean = false;
  bsModal: BsModalRef;
  isFirstSchema: boolean;
  @ViewChild('cancelEngagementTemplate', { static: true })
  cancelEngagementTemplate: TemplateRef<HTMLElement>;

  /**Progress wizard */
  @ViewChild('progressWizardItems', { static: false })
  progressWizardItems: ProgressWizardDcComponent;

  constructor(
    readonly contributorService: ContributorService,
    readonly documentService: DocumentService,
    readonly alertService: AlertService,
    readonly rpaServices: RpaServices,
    readonly router: Router,
    readonly location: Location,
    readonly modalService: BsModalService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData
  ) {}

  ngOnInit(): void {
    this.initializeWizard();
    this.personIdentifier = this.routerDataToken.priority;
    this.schema = this.routerDataToken.schema;
    this.isFirstSchema = this.schema == 1 ? true : false;
    this.documentUploadEngagementId = this.isFirstSchema
      ? TransactionId.ENTER_RPA_AGGREGATION_FIRST_SCHEMA
      : TransactionId.ENTER_RPA_AGGREGATION_LAST_SCHEMA;
    this.documentUploadTransScheme = this.isFirstSchema
      ? DocumentTransactionId.ENTER_RPA_AGGREGATION
      : DocumentTransactionId.ENTER_RPA_AGGREGATION_PPA;
    this.documentUploadTransTypeScheme = this.isFirstSchema
      ? DocumentTransactionType.ENTER_RPA_AGGREGATION
      : DocumentTransactionType.ENTER_RPA_AGGREGATION_PPA;
    this.getEngagementDetails();
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
    return [
      new WizardItem(FormWizardTypes.ENGAGEMENT_DETAILS, 'briefcase'),
      //new WizardItem(FormWizardTypes.DOCUMENT_DETAILS, 'file-alt')
    ];
  }

  selectFormWizard(selectedWizardIndex) {
    this.alertService.clearAlerts();
    this.activeTab = selectedWizardIndex;
  }

  saveEngagementDetails(data) {
    this.appoinmentDetails = new RpaAppointmentDetails();
    this.appoinmentDetails = data;
    this.rpaServices.rpaSaveEngDetails(this.personIdentifier,false,this.isFirstSchema?'First scheme':'Last Scheme',this.appoinmentDetails).subscribe(
      res=>{
        this.referenceNo = res.transactionId;
        this.engDetailsSavedboolean = true;
        this.location.back();
        this.alertService.showSuccess(res.message, null, 5);
        //this.activeTab++;
        //this.progressWizardItems.setNextItem(this.activeTab);
        //this.getDocument();
        scrollToTop();
      },err=> this.alertService.showError(err?.error?.message)
    )
  }

  navigateToPreviousTab() {
    this.alertService.clearAlerts();
    this.activeTab--;
    this.progressWizardItems.setPreviousItem(this.activeTab);
    scrollToTop();
    this.returnToEngPage = true;
  }

  /** Method to get documents. */
  getDocument() {
    this.documentService
      .getRequiredDocuments(this.documentUploadTransScheme, this.documentUploadTransTypeScheme)
      .subscribe(res => {
        this.documents = this.documentService.removeDuplicateDocs(
          res.filter(docs => docs.documentClassification === 'Internal')
        );
      });
  }

  getEngagementDetails() {
    this.rpaServices.getEngagementFullDetails(this.personIdentifier).subscribe(res => {
      this.engagements = res;
    });
  }

  submit(){
    let comments = this.parentForm.get('documentsForm.comments').value
    this.rpaServices.submitRpaAggregation(this.personIdentifier, this.isFirstSchema?'First scheme':'Last Scheme',comments).subscribe(
      res=>{
        this.location.back();
        this.rpaServices.flag = true;
        this.rpaServices.message = res.message; 
        this.alertService.showSuccess(res.message, null,5);
      },err=> this.alertService.showError(err?.error?.message)
    )
  }

  cancel() {
    if (this.engDetailsSavedboolean && this.returnToEngPage) this.showTemplate(this.cancelEngagementTemplate);
    else this.cancelRpa();
  }
  cancelRpa() {
    this.engDetailsSavedboolean
      ? this.rpaServices.cancelEnterRpaAggregation(this.personIdentifier, this.referenceNo).subscribe(
          res => {
            console.log(res);
            this.location.back();
          },
          err => this.alertService.showError(err?.error?.message)
        )
      : this.location.back();
  }

  /** Method is to refresh document */
  refreshDocumentItem(doc: DocumentItem): void {
    this.refreshDocument(doc, this.referenceNo, this.documentUploadTransScheme, null, this.referenceNo, null);
  }

  /** Method to refresh documents after scan. */
  refreshDocument(
    doc: DocumentItem,
    businessKey: number,
    docTransactionId: string,
    docTransactionType: string,
    referenceNo?: number,
    uuid?: string
  ) {
    if (doc && doc.name) {
      this.documentService
        .refreshDocument(
          doc,
          businessKey,
          docTransactionId,
          docTransactionType,
          referenceNo,
          null,
          uuid,
          doc.sequenceNumber
        )
        .subscribe(res => (doc = res));
    }
  }

  /** Method to show error alert by key */
  showAlertError(key: string): void {
    key ? this.alertService.showErrorByKey(key) : this.alertService.clearAllErrorAlerts();
  }

  decline(): void {
    this.bsModal.hide();
  }

  /**
   * This method is used to show given template
   * @param template
   * @memberof FileUploadDcComponent
   */
  showTemplate(template: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.bsModal = this.modalService.show(template, config);
  }
}
