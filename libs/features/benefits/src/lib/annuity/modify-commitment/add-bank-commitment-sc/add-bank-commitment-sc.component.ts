/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ApplicationTypeToken,
  BilingualText,
  DocumentItem,
  downloadFile,
  LanguageToken,
  RouterData,
  RouterDataToken,
  AlertService,
  DocumentService,
  LookupService,
  UuidGeneratorService,
  CoreBenefitService,
  AuthTokenService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { BenefitConstants } from '../../../shared/constants';
import { EventsConstants } from '../../../shared/constants/events-constants';
import { SubmitRequest } from '../../../shared/models';
import {
  BankService,
  BenefitActionsService,
  BenefitDocumentService,
  ManageBenefitService,
  ModifyBenefitService,
  ReturnLumpsumService,
  WizardService,
  UiBenefitsService
} from '../../../shared/services';

import { CommitmentBaseComponent } from '../../base/commitment-base-component';

@Component({
  selector: 'bnt-add-bank-commitment-sc',
  templateUrl: './add-bank-commitment-sc.component.html',
  styleUrls: ['./add-bank-commitment-sc.component.scss']
})
export class AddBankCommitmentScComponent extends CommitmentBaseComponent implements OnInit, OnDestroy {
  personId: number;
  documentList: DocumentItem[] = [];
  messageToDisplay: BilingualText;
  addTransactionConstant: string;
  nin: number;
  addCommitmentDocs: DocumentItem;
  @ViewChild('confirmTemplate', { static: false })
  readonly confirmTemplate: TemplateRef<HTMLElement>;
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
   * @param uuidGeneratorService
   * @param appToken
   * @param language
   * @param routerData
   * @param returnLumpsumService
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
    readonly returnLumpsumService: ReturnLumpsumService,
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
   * Method to initialsie tasks
   */
  ngOnInit(): void {
    this.initialiseView();
    this.getNin();
    this.transactionId = BenefitConstants.ADD_BANK_COMMITMENT;
    this.addTransactionConstant = BenefitConstants.ADD_TRANSACTION_CONSTANT;
    if (!this.isEditMode) {
      this.getModifyRequiredDocs(this.transactionId, this.doctransactionType);
    } else {
      this.getUploadedDocuments(this.benefitRequestId, this.transactionId, this.doctransactionType);
    }
  }
  /** Method to fetch account number when benefit request id is available */
  getNin() {
    this.returnLumpsumService
      .getActiveBenefitDetails(this.isIndividualApp ? this.authTokenService.getIndividual() : this.sin, this.benefitRequestId, this.referenceNo)
      ?.subscribe(res => {
        if (res) {
          this.nin = res.nin;
        }
      });
  }

  /**
   * Method to show template
   * @param templateRef
   */
  confirmAddedDetails(comments) {
    if (this.checkDocumentValidity(this.documentForm)) {
      const submitValues: SubmitRequest = {
        commitmentFlow: true,
        comments: comments.comments,
        uuid: this.documentComponent.uuid
      };
      this.benefitActionsService.addBankCommitment(this.sin, this.benefitRequestId, submitValues).subscribe(
        res => {
          this.benefitActionsService
            .activateBankCommitment(this.sin, this.benefitRequestId, this.personId, res.referenceNo)
            .subscribe(data => {
              this.benefitResponse = data;
            });
          this.modalRef = this.modalService.show(this.confirmTemplate, Object.assign({}, { class: 'modal-md' }));
        },
        err => this.showErrorMessages(err)
      );
    } else {
      this.alertService.showMandatoryErrorMessage();
    }
  }
  openImage() {
    if (this.benefitResponse) {
      this.benefitDocumentService.downloadAddCommitment(this.sin).subscribe(document => {
        downloadFile(EventsConstants.DOWNLOAD_FILE_NAME, 'application/pdf', document);
      });
    }
  }

  confirm() {
    this.modalRef.hide();
    this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
    this.alertService.clearAlerts();
  }
  /**
   * Method to add bank commitment for individual app (no doc section)
   */
  confirmAddCommitment() {
    const submitValues: SubmitRequest = {
      commitmentFlow: false,
      comments: 'null',
      uuid: 'null'
    };
    this.benefitActionsService.addBankCommitment(this.sin, this.benefitRequestId, submitValues).subscribe(
      res => {
        this.benefitActionsService
          .activateBankCommitment(this.sin, this.benefitRequestId, this.personId, res.referenceNo)
          .subscribe(data => {
            this.benefitResponse = data;
            // this.alertService.clearAlerts();
            // this.alertService.showSuccess(this.benefitResponse.message);
            this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
          });
        this.modalRef = this.modalService.show(this.confirmTemplate, Object.assign({}, { class: 'modal-md' }));
      },
      err => this.showErrorMessages(err)
    );
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
