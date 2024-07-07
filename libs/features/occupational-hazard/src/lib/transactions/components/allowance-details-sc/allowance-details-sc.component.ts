/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */ import { Location, PlatformLocation } from '@angular/common';
 import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
 import { BsModalService } from 'ngx-bootstrap/modal';
 import {
   ComplicationService,
   ContributorService,
   EstablishmentService,
   InjuryService,
   OhService,
   DiseaseService
 } from '../../../shared/services';
 import { OhClaimsService } from '../../../shared/services/oh-claims.service';
 import { AllowanceBaseScComponent } from '../../../validator/base/allowance-sc.base-component';
 import { Route } from '../../../shared';
 import { BehaviorSubject } from 'rxjs';
 
 @Component({
   selector: 'oh-allowance-details-sc',
   templateUrl: './allowance-details-sc.component.html',
   styleUrls: ['./allowance-details-sc.component.scss']
 })
 export class AllowanceDetailsScComponent extends AllowanceBaseScComponent implements OnInit {
   /**
    * Local variables
    */
   message: string;
   color: string;
   lang = 'en';
   transaction: Transaction;
   transactionId: number;
   bussinessId: number;
   refNo: number;
   header: BilingualText;
   @ViewChild('errorTemplate', { static: true })
   errorTemplate: TemplateRef<HTMLElement>;
   isAppIndividual = false;
   heading: string = 'OCCUPATIONAL-HAZARD.ALLOWANCE-DETAILS';
   repatriationTitle: string;
 
   constructor(
     @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
     readonly ohService: OhService,
     readonly claimsService: OhClaimsService,
     @Inject(ApplicationTypeToken) readonly appToken: string,
     readonly complicationService: ComplicationService,
     readonly diseaseService: DiseaseService,
     readonly contributorService: ContributorService,
     readonly injuryService: InjuryService,
     readonly pLocation: PlatformLocation,
     readonly establishmentService: EstablishmentService,
     readonly alertService: AlertService,
     readonly modalService: BsModalService,
     readonly documentService: DocumentService,
     readonly transactionService: TransactionService,
     readonly router: Router,
     @Inject(RouterDataToken) readonly routerData: RouterData,
     readonly authTokenService: AuthTokenService,
     readonly fb: FormBuilder,
     readonly location: Location,
     readonly workflowService: WorkflowService
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
 
   ngOnInit(): void {
     this.transaction = this.transactionService.getTransactionDetails();
     if (this.transaction) {
       this.referenceNo = this.transaction.transactionRefNo;
       this.transactionId = this.transaction.transactionId;
       this.header = this.transaction.title;
       this.registrationNo = this.transaction.params.REGISTRATION_NO;
       if (this.isAppIndividual) {
        this.socialInsuranceNo = this.authTokenService.getIndividual();
      }
      else {
        this.socialInsuranceNo = this.transaction.params.SIN;
      }
      this.repatriationTitle = this.transaction?.title.english.split(' ').join('');
      if ((this.transaction?.channel.english === 'field-office' || this.transaction?.channel.english === 'Field Office' || this.transaction?.channel.english === 'gosi-online') && this.repatriationTitle === 'Adddeadbodyrepatriation') {
        this.repatriation = true;
        this.heading = this.repatriation ? 'OCCUPATIONAL-HAZARD.REPATRIATION-EXPENSE-DETAILS' : 'OCCUPATIONAL-HAZARD.ALLOWANCE-DETAILS'
      }
       this.injuryId = this.transaction.params.BUSINESS_ID;
       this.injuryNumber = this.transaction.params.INJURY_ID;
       this.ohService.setRegistrationNo(this.registrationNo);
       this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
       if (this.transaction.params.INJURY_ID) {
         this.ohService.setComplicationId(this.complicationId);
       } else {
         this.ohService.setInjuryId(this.injuryId);
       }
       this.getContributor();
       this.getEstablishment();
       this.getAllowance();
     }
   }
   /**
    * Method to navigate to view injury page
    */
   viewInjury() {
     if (this.allowanceDetailsWrapper.ohType === 1) {
       this.showModal(this.errorTemplate, 'modal-md');
       this.message = 'OCCUPATIONAL-HAZARD.ALLOWANCE.DISEASE-ID-MESSAGE';
     } else if (this.allowanceDetailsWrapper.ohType === 0) {
       this.ohService.setRoute(Route.ALLOWANCE_TRANSACTION);
       this.ohService.setTransactionId(this.transaction.transactionId);
       this.ohService.setTransactionRefId(this.transaction.transactionRefNo);
       this.router.navigate([
         `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryId}/injury/info`
       ]);
     } else {
       this.ohService.setTransactionId(this.transaction.transactionId);
       this.ohService.setTransactionRefId(this.transaction.transactionRefNo);
       this.ohService.setRoute(Route.ALLOWANCE_TRANSACTION);
       this.router.navigate([
         `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.allowanceDetailsWrapper.injuryNo}/${this.injuryId}/complication/info`
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
 
 
