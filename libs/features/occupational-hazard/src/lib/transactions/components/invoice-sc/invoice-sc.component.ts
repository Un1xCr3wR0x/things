/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location, PlatformLocation } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  BilingualText,
  DocumentService,
  LanguageToken,
  RouterData,
  RouterDataToken,
  Transaction,
  TransactionReferenceData,
  TransactionService,
  TransactionTrace,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import {
  ComplicationService,
  ContributorService,
  EstablishmentService,
  InjuryService,
  OhService,
  ReimbursementRequestDetails,
  Route,
  DiseaseService
} from '../../../shared';
import { InvoiceDetails } from '../../../shared/models/invoice-details';
import { OhClaimsService } from '../../../shared/services/oh-claims.service';
import { AllowanceBaseScComponent } from '../../../validator/base/allowance-sc.base-component';

@Component({
  selector: 'oh-invoice-sc',
  templateUrl: './invoice-sc.component.html',
  styleUrls: ['./invoice-sc.component.scss']
})
export class InvoiceScComponent extends AllowanceBaseScComponent implements OnInit {
  injuryClosingStatus: BilingualText;
  comment: TransactionReferenceData[] = [];
  workflow: TransactionTrace;
  reimbDetails: ReimbursementRequestDetails;
  transaction: Transaction;
  transactionRefId: number;
  @ViewChild('errorTemplate', { static: true })
  errorTemplate: TemplateRef<HTMLElement>;
  transactionId: number;
  bussinessId: number;
  refNo: number;
  isReopen = false;
  diseaseIdMessage = '';
  tpaCode: string;
  header: BilingualText;
  resourceType: string;
  goBackUrl = '../../../../../transactions/list';
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly pLocation: PlatformLocation,
    readonly ohService: OhService,
    readonly claimService: OhClaimsService,
    readonly modalService: BsModalService,
    readonly route: ActivatedRoute,
    readonly alertService: AlertService,
    readonly establishmentService: EstablishmentService,
    readonly fb: FormBuilder,
    readonly contributorService: ContributorService,
    readonly documentService: DocumentService,
    readonly injuryService: InjuryService,
    readonly workflowService: WorkflowService,
    @Inject(RouterDataToken) readonly routerData: RouterData,   
    readonly location: Location,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly router: Router,
    readonly complicationService: ComplicationService,
    readonly diseaseService: DiseaseService,
    readonly transactionService: TransactionService
  ) {
    super(
      language,
      ohService,
      claimService,
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

  ngOnInit(): void {
    this.transaction = this.transactionService.getTransactionDetails();
    if (this.transaction) {
      this.refNo = this.transaction.transactionRefNo;
      this.header = this.transaction.title;
      this.invoiceId = this.transaction.params.BUSINESS_ID;
      this.injuryNumber = this.transaction.params.INJURY_ID;
      this.tpaCode = this.transaction.params.TPA_CODE;
    }
    this.setServiceVariables();
    this.getClaimsInvoice();
  }
  /**
   * Method to Set RegistrationNo,InjuryId ans SIN to Ohservice
   */
  setServiceVariables() {
    this.ohService.setRegistrationNo(this.registrationNo);
    this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
  }
  /**
   * navigate by clicking Id
   */
  navigateTo(details) {
    if (details.type === 0) {
      this.ohService.setTransactionId(this.transaction.transactionId);
      this.ohService.setTransactionRefId(this.transaction.transactionRefNo);
      this.ohService.setRoute(Route.INVOICE);
      this.router.navigate([`home/oh/view/${details.regNo}/${details.sin}/${details.id}/injury/info`]);
    } else if (details.type === 1) {
      this.showModal(this.errorTemplate, 'modal-md');
      this.diseaseIdMessage = 'OCCUPATIONAL-HAZARD.ALLOWANCE.DISEASE-ID-MESSAGE';
    } else if (details.type === 2) {
      this.ohService.setTransactionId(this.transaction.transactionId);
      this.ohService.setTransactionRefId(this.transaction.transactionRefNo);
      this.ohService.setRoute(Route.INVOICE);
      this.router.navigate([
        `home/oh/view/${details.regNo}/${details.sin}/${details.injuryNo}/${details.id}/complication/info`
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
   * clear the modal
   */
  clear() {
    this.modalRef.hide();
  }
}

