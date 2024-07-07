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
  AuthTokenService,
  BilingualText,
  DocumentService,
  LanguageToken,
  RouterData,
  RouterDataToken,
  Transaction,
  TransactionService,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import {
  ComplicationService,
  ContributorService,
  EstablishmentService,
  InjuryService,
  OhService,
  HoldResumeDetails,
  Route,
  DiseaseService
} from '../../../shared';
import { OhClaimsService } from '../../../shared/services/oh-claims.service';
import { AllowanceBaseScComponent } from '../../../validator/base/allowance-sc.base-component';

@Component({
  selector: 'oh-hold-resume-allowance-sc',
  templateUrl: './hold-resume-allowance-sc.component.html',
  styleUrls: ['./hold-resume-allowance-sc.component.scss']
})
export class HoldResumeAllowanceScComponent extends AllowanceBaseScComponent implements OnInit {
  transaction: Transaction;
  transactionRefId: number;
  @ViewChild('errorTemplate', { static: true })
  errorTemplate: TemplateRef<HTMLElement>;
  transactionId: number;
  bussinessId: number;
  refNo: number;
  isReopen = false;
  diseaseIdMessage = '';
  payeeId: number;
  infoMesssage = null;
  holdResumeData: HoldResumeDetails;
  subHeading: string;
  idLabel: string;
  dateLabel: string;
  tpaCode: string;
  header: BilingualText;
  modalRef: BsModalRef;
  isAppIndividual = false;
  backPath = '../../../../../transactions/list';
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly fb: FormBuilder,
    readonly contributorService: ContributorService,
    readonly claimService: OhClaimsService,
    readonly modalService: BsModalService,
    readonly route: ActivatedRoute,
    readonly alertService: AlertService,
    readonly establishmentService: EstablishmentService,
    readonly documentService: DocumentService,
    readonly injuryService: InjuryService,
    readonly workflowService: WorkflowService,
    readonly pLocation: PlatformLocation,
    readonly ohService: OhService,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly location: Location,
    @Inject(ApplicationTypeToken) readonly appToken: string,    
    readonly router: Router,
    readonly complicationService: ComplicationService,
    readonly authTokenService: AuthTokenService,
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
    pLocation.onPopState(() => {
      this.router.navigate([this.backPath], { relativeTo: this.route });
    });
  }

  ngOnInit(): void {
    this.transaction = this.transactionService.getTransactionDetails();
    if (this.transaction) {
      this.transactionId = this.transaction.transactionId;
      this.refNo = this.transaction.transactionRefNo;
      this.header = this.transaction.title;
      this.registrationNo = this.transaction.params.REGISTRATION_NO;
      if (this.isAppIndividual) {
        this.socialInsuranceNo = this.authTokenService.getIndividual();
      }
      else {
        this.socialInsuranceNo = this.transaction.params.SIN;
      }
      this.payeeId = this.transaction.params.BUSINESS_ID;
      this.injuryNumber = this.transaction.params.INJURY_ID;
      if (this.transactionId === 101535) {
        this.subHeading = 'OCCUPATIONAL-HAZARD.ALLOWANCE.HOLD-ALLOWANCE-SUBHEADING';
      } else {
        this.subHeading = 'OCCUPATIONAL-HAZARD.ALLOWANCE.RESUME-ALLOWANCE-SUBHEADING';
      }
    }
    this.getContributor();
    this.getEstablishment();
    this.fetchHoldAndAllowanceDetails();
  }
  /**
   * Method to cancel the transaction
   */
  clearModal() {
    this.modalRef.hide();
  }

  /**
   * Fetch Allowance Payee
   */
  fetchHoldAndAllowanceDetails() {
    this.ohService.fetchHoldAndAllowanceDetails(this.registrationNo, this.socialInsuranceNo, this.payeeId).subscribe(
      response => {
        this.holdResumeData = response;
        if (this.holdResumeData.type === 0) {
          this.idLabel = 'OCCUPATIONAL-HAZARD.INJURY.ID';
          this.dateLabel = 'OCCUPATIONAL-HAZARD.INJURY.DATE';
        } else if (this.holdResumeData.type === 1) {
          this.idLabel = 'OCCUPATIONAL-HAZARD.DISEASE.ID';
          this.dateLabel = 'OCCUPATIONAL-HAZARD.DISEASE.DATE';
        } else if (this.holdResumeData.type === 2) {
          this.idLabel = 'OCCUPATIONAL-HAZARD.COMPLICATION.ID';
          this.dateLabel = 'OCCUPATIONAL-HAZARD.COMPLICATION.DATE';
        }
      },
      err => {
        this.showError(err);
      }
    );
  }
  /**
   * Navigate to Details
   */
  viewDetails() {
    if (this.holdResumeData.type !== 1) {
      this.ohService.setRoute(Route.HOLD_RESUME_TRACE);
      this.ohService.setTransactionId(this.transaction.transactionId);
      this.ohService.setTransactionRefId(this.transaction.transactionRefNo);
    }
    if (this.holdResumeData.type === 0) {
      this.router.navigate([
        `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.payeeId}/injury/info`
      ]);
    } else if (this.holdResumeData.type === 1) {
      this.showModal(this.errorTemplate, 'modal-md');
      this.infoMesssage = 'OCCUPATIONAL-HAZARD.ALLOWANCE.DISEASE-ID-MESSAGE';
    } else if (this.holdResumeData.type === 2) {
      this.router.navigate([
        `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.holdResumeData.injuryNo}/${this.payeeId}/complication/info`
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
}

