/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location, PlatformLocation } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  DocumentService,
  RouterData,
  RouterDataToken,
  WorkflowService,
  Transaction,
  BilingualText,
  TransactionService,
  LanguageToken,
  AuthTokenService
} from '@gosi-ui/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import {
  ComplicationService,
  ContributorService,
  EstablishmentService,
  InjuryService,
  OhService,
  OHTransactionType,
  AllowancePayee,
  Route,
  Disease,
  DiseaseService
} from '../../../shared';
import { OhClaimsService } from '../../../shared/services/oh-claims.service';
import { AllowanceBaseScComponent } from '../../../validator/base/allowance-sc.base-component';

@Component({
  selector: 'oh-allowance-payee-sc',
  templateUrl: './allowance-payee-sc.component.html',
  styleUrls: ['./allowance-payee-sc.component.scss']
})
export class AllowancePayeeScComponent extends AllowanceBaseScComponent implements OnInit {
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly ohService: OhService,
    readonly modalService: BsModalService,
    readonly documentService: DocumentService,
    readonly contributorService: ContributorService,
    readonly claimsService: OhClaimsService,
    readonly injuryService: InjuryService,
    readonly establishmentService: EstablishmentService,
    readonly complicationService: ComplicationService,
    readonly diseaseService: DiseaseService,
    readonly alertService: AlertService,
    readonly router: Router,
    readonly fb: FormBuilder,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly authTokenService: AuthTokenService,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly workflowService: WorkflowService,
    readonly location: Location,
    readonly pLocation: PlatformLocation,
    readonly transactionService: TransactionService
  ) {
    super(
      language,
      ohService,
      claimsService,
      injuryService,
      establishmentService,
      alertService,
      router,
      documentService,
      contributorService,
      fb,
      complicationService,
      diseaseService,
      routerData,
      location,
      pLocation,
      appToken,
      workflowService
    );
  }
  /**
   * Local Variables
   */
  payeeId: number;
  allowancePayee: AllowancePayee;
  bsModalRef: BsModalRef;
  diseaseIdMessage = '';
  @ViewChild('errorTemplate', { static: true })
  errorTemplate: TemplateRef<HTMLElement>;
  transaction: Transaction;
  transactionId: number;
  bussinessId: number;
  isChangeRequired = false;
  refNo: number;
  header: BilingualText;
  dismissible = false;
  isAppIndividual = false;
  ngOnInit(): void {
    this.transaction = this.transactionService.getTransactionDetails();
    if (this.transaction) {
      if (this.isAppIndividual) {
        this.socialInsuranceNo = this.authTokenService.getIndividual();
      }
      else {
        this.socialInsuranceNo = this.transaction.params.SIN;
      }
      this.refNo = this.transaction.transactionRefNo;
      this.transactionId = this.transaction.transactionId;
      this.header = this.transaction.title;
      this.registrationNo = this.transaction.params.REGISTRATION_NO;
      this.payeeId = this.transaction.params.BUSINESS_ID;
      this.injuryNumber = this.transaction.params.INJURY_ID;
      if (this.transaction?.status?.english !== 'In Progress') {
        this.isChangeRequired = false;
      }
    }
    this.getContributor();
    this.getEstablishment();
    this.getDocuments();
    this.getAllowancePayee();
  }
  /**
   * Fetching documents
   */
  getDocuments() {
    this.transactionKey = OHTransactionType.UPDATE_ALLOWANCE_PAYEE;
    this.transactionType = OHTransactionType.UPDATE_PAYEE;
    this.documentService
      .getDocuments(this.transactionKey, this.transactionType, this.payeeId)
      .subscribe(documentsResponse => {
        this.documents = documentsResponse.filter(item => item.documentContent !== null);
      });
  }
  /**
   * Fetch Allowance Payee
   */
  getAllowancePayee() {
    this.ohService
      .getPayeeDetails(this.registrationNo, this.socialInsuranceNo, this.payeeId, this.isChangeRequired)
      .subscribe(
        response => {
          this.allowancePayee = response;
        },
        err => {
          this.showError(err);
        }
      );
  }
  /**
   * Navigate to Details
   */
  navigate() {
    if (this.allowancePayee.ohType === 0) {
      this.ohService.setTransactionId(this.transaction.transactionId);
      this.ohService.setTransactionRefId(this.transaction.transactionRefNo);
      this.ohService.setRoute(Route.ALLOWANCE_PAYEE_HISTORY);
      this.router.navigate([
        `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.payeeId}/injury/info`
      ]);
    } else if (this.allowancePayee.ohType === 1) {
      this.showModal(this.errorTemplate, 'modal-md');
      this.diseaseIdMessage = 'OCCUPATIONAL-HAZARD.ALLOWANCE.DISEASE-ID-MESSAGE';
    } else if (this.allowancePayee.ohType === 2) {
      this.ohService.setTransactionId(this.transaction.transactionId);
      this.ohService.setTransactionRefId(this.transaction.transactionRefNo);
      this.ohService.setRoute(Route.ALLOWANCE_PAYEE_HISTORY);
      this.router.navigate([
        `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.allowancePayee.injuryNo}/${this.payeeId}/complication/info`
      ]);
    }
  }
  /**
   * This method is to show the modal reference
   * @param modalRef
   */
  showModal(templateRef: TemplateRef<HTMLElement>, size) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: size }));
  }
  /**
   * Method to cancel the transaction
   */
  clearModal() {
    this.bsModalRef.hide();
  }
}

