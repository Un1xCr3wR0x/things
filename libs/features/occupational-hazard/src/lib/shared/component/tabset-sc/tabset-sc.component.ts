/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
// import { TabSetVariables } from '../../enums';
import { Location } from '@angular/common';
import { Component, HostListener, Inject, OnInit, TemplateRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BilingualText,
  LanguageToken,
  LookupService,
  LovList,
  RoleIdEnum,
  MenuService
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable } from 'rxjs';
import { routeTo } from '../../enums';
import { TabSetVariables } from '../../enums/tabset-variables';
import { Complication, Injury, Establishment, Disease, DiseaseWrapper } from '../../models';
import { ComplicationService, InjuryService, OhService, EstablishmentService, DiseaseService } from '../../services';
import { OhClaimsService } from '../../services/oh-claims.service';
import { ClaimsTabConstants } from '../../constants';
import { ClaimsTabIndAppConstants } from '../../constants/claimstab-indapp-constants';
import { ChangePersonService } from '@gosi-ui/features/customer-information/lib/shared';

@Component({
  selector: 'oh-tabset-sc',
  templateUrl: './tabset-sc.component.html',
  styleUrls: ['./tabset-sc.component.scss']
})
export class TabsetScComponent implements OnInit {
  registrationNo: number;
  socialInsuranceNo: number;
  injuryId: number;
  diseaseId: number;
  injuryNo: number;
  complicationId: number;
  lang = 'en';
  id: number;
  showComplication = false;
  showDisease = false;
  decompressedString : string;
  showInjury: boolean = false;
  hideIcon = false;
  routePath = '';
  userRoles: RoleIdEnum[] = [];
  injury: Injury = new Injury();
  complicationDetails: Complication = new Complication();
  modalRef: BsModalRef;
  auditReasonList$: Observable<LovList>;
  auditForm: FormGroup = new FormGroup({});
  auditResponse: BilingualText;
  isAppPrivate = false;
  isAppPublic = false;
  isIndividualApp = false;
  establishment: Establishment;
  disease: Disease = new Disease();
  transferInjury: DiseaseWrapper = new DiseaseWrapper();
  /**
   * Local Variables
   */
  tabs = [];

  selectedId = null;
  requestDetails = {
    id: TabSetVariables.Injury,
    value: 'OCCUPATIONAL-HAZARD.REQUEST-DETAILS'
  };
  allowanceDetails = {
    id: TabSetVariables.Allowance,
    value: 'OCCUPATIONAL-HAZARD.ALLOWANCE-DETAILS'
  };
  claimsDetails = {
    id: TabSetVariables.Claims,
    value: 'OCCUPATIONAL-HAZARD.CLAIMS-DETAILS'
  };
  compId: number;
  isTransferInjury: boolean = false;
  transferDetails: DiseaseWrapper;
  showTransferInjury: boolean = false;
  transferInjuryid: number;
  injuryTransfer: boolean = false;
  constructor(
    readonly router: Router,
    readonly alertService: AlertService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    private ohservice: OhService,
    readonly establishmentService: EstablishmentService,
    readonly location: Location,
    readonly activatedRoute: ActivatedRoute,
    readonly claimService: OhClaimsService,
    readonly injuryService: InjuryService,
    readonly menuService: MenuService,
    readonly complicationService: ComplicationService,
    readonly diseaseService: DiseaseService,
    readonly modalService: BsModalService,
    private lookupService: LookupService,
    private claimsService: OhClaimsService,
    private changePersonService: ChangePersonService    
  ) {}
  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    this.isAppPublic = this.appToken === ApplicationTypeEnum.PUBLIC ? true : false;
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP ? true : false;
    if (this.isAppPrivate) {
      this.userRoles.push(RoleIdEnum.OH_OFFICER, RoleIdEnum.CLM_MGR);
    }
    if(this.router.url.indexOf('/complication') !== -1 || this.router.url.indexOf('/disease') !== -1 ){
      this.tabs = ClaimsTabIndAppConstants.getTransactionTabs(
        this.appToken === ApplicationTypeEnum.PRIVATE ? true : false
      ).filter(item => this.menuService.isUserEntitled(item.allowedRoles));

    }else{
      this.tabs = ClaimsTabConstants.getTransactionTabs(
        this.appToken === ApplicationTypeEnum.PRIVATE ? true : false
      ).filter(item => this.menuService.isUserEntitled(item.allowedRoles));

    }
    
    this.auditReasonList$ = this.lookupService.getAuditReasonList();
    this.ohservice.setHasRoutedBack(false);
    this.ohservice.setComplicationId(null);
    this.ohservice.setInjuryId(null);
    this.ohservice.setDiseaseId(null);
    if (this.router.url.indexOf('/detail') !== -1) {
      this.routePath = 'detail';
      this.hideIcon = true;
    } else {
      this.routePath = 'info';
    }
    if (this.router.url.indexOf('/allowance') !== -1) {
      this.selectedId = TabSetVariables.Allowance;
      this.clearAlertAllowance();
    } else if (this.router.url.indexOf('/claims') !== -1) {
      this.selectedId = TabSetVariables.Claims;
      this.clearAlertClaims();
    } else if (this.router.url.indexOf('/injury') !== -1 || this.router.url.indexOf('/complication') !== -1
              || this.router.url.indexOf('/disease') !== -1) {
      this.selectedId = TabSetVariables.Injury;
    }
    this.activatedRoute.paramMap.subscribe(res => {
      this.registrationNo = parseInt(res.get('registrationNo'), 10);
      this.socialInsuranceNo = parseInt(res.get('socialInsuranceNo'), 10);   
      if(res.get('complicationId')){
        this.complicationId = parseInt(res.get('complicationId'), 10);
      }      
      if(this.router.url.indexOf('/disease') !== -1){
        this.diseaseId = parseInt(res.get('injuryId'), 10);
      }else if(this.router.url.indexOf('/injury') !== -1){
        this.injuryId = parseInt(res.get('injuryId'), 10);
      }
      if (this.injuryId && this.diseaseId && this.isTransferInjury ) {
        this.showInjury = true;
        this.showDisease = false;
        this.injuryTransfer = true;
      }   //transferinjury injuryId navigation
    });
    if(this.injuryId && !this.complicationId){
      this.showInjury = true;
    }else if(this.diseaseId){
      this.showDisease = true;
    }else if (this.complicationId) {
      this.showComplication = true;
    }
    if (!this.complicationId || this.complicationId.toString() === 'NaN') {
      this.complicationId=this.compId;
    } 
    this.ohservice.setRegistrationNo(this.registrationNo);
    this.ohservice.setSocialInsuranceNo(this.socialInsuranceNo);
    this.ohservice.setInjuryId(this.injuryId);
    if((this.injuryId !== null) && (this.injuryId !== undefined)) this.ohservice.setInjuryNumber(this.injuryId);
    this.ohservice.setComplicationId(this.complicationId);
    this.ohservice.setDiseaseId(this.diseaseId);
    this.complicationId = this.ohservice.getComplicationId();
    this.getDetails();
  }

  //Method to fetch the establishment details
  getEstablishment() {
    this.establishmentService.getEstablishmentDetails(this.registrationNo).subscribe(
      response => {
        this.establishment = response;
      },
      err => {
        this.showError(err);
      }
    );
  }

  /**
   * Fetch Injury
   */
  getDetails() {
    if (this.complicationId) {
      /**Fetching complicatiopn details */
      this.id = this.complicationId;
      this.injuryNo = this.ohservice.getInjuryNumber();
      this.complicationService
        .getComplication(this.registrationNo, this.socialInsuranceNo, this.injuryNo, this.complicationId, false)
        .subscribe(res => {
          this.complicationDetails = res.complicationDetailsDto;
        });
    } else if(this.diseaseId){
      this.id = this.diseaseId;      
      this.diseaseService
        .getDiseaseDetails(this.registrationNo, this.socialInsuranceNo, this.diseaseId,  this.isAppPublic, false)
        .subscribe(res => {
          this.disease = res.diseaseDetailsDto;
          this.transferDetails = res;
          this.isTransferInjury = this.transferDetails.isTransferredInjury;
          this.transferInjuryid = this.transferDetails.transferredInjuryid;
          if (this.isTransferInjury) {
            this.showTransferInjury = true;
            this.injuryId = this.transferInjuryid;
          }
        });
    } else if(this.injuryId){
      this.id = this.injuryId;
      const isChangeRequired = false;
      this.injuryService
        .getInjuryDetails(this.registrationNo, this.socialInsuranceNo, this.injuryId, this.isIndividualApp, isChangeRequired)
        .subscribe(response => {
          this.injury = response.injuryDetailsDto;
        });
    }
  }

  /**
   * Method to select the tab
   * @param id
   */
  selectTab(id: TabSetVariables) {    
    this.claimsService.setAlert(null);
    if (id === TabSetVariables.Injury) {
      if (this.complicationId && this.showComplication) {
        this.injuryNo = this.ohservice.getInjuryNumber();
        this.router.navigate([
          `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryNo}/${this.complicationId}/complication/info`
        ]);
      } if (this.diseaseId && this.showDisease) {       
         this.router.navigate([
          `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.diseaseId}/disease/info`
        ]); 
      }       
      else if(this.injuryId && (this.showInjury || this.injuryTransfer)) {
        this.router.navigate([
          `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryId}/injury/${this.routePath}`
        ]);
      }
    } else if (id === TabSetVariables.Allowance) {
      if (this.complicationId && this.showComplication) {
        this.injuryNo = this.ohservice.getInjuryNumber();
        this.router.navigate([
          `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryNo}/${this.complicationId}/allowance/info`
        ]);
      } else if(this.injuryId && (this.showInjury || this.injuryTransfer)) {
        this.router.navigate([
          `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryId}/allowance/${this.routePath}`
        ]);
      } else if (this.diseaseId && this.showDisease) {       
         this.router.navigate([
          `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.diseaseId}/allowance/info`
        ]); 
      } 
      this.alertService.clearAlerts();
    } else if (id === TabSetVariables.Claims) {
      if (this.complicationId && this.showComplication) {
        this.injuryNo = this.ohservice.getInjuryNumber();
        this.router.navigate([
          `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryNo}/${this.complicationId}/claims/info`
        ]);
      } else if(this.injuryId && (this.showInjury || this.injuryTransfer)) {
        this.router.navigate([
          `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryId}/claims/${this.routePath}`
        ]);
      } else if (this.diseaseId && this.showDisease) {       
         this.router.navigate([
          `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.diseaseId}/claims/info`
        ]); 
      } 
      this.alertService.clearAlerts();
    }
    this.selectedId = id;
  }
  /**
   * This method is to show the modal reference
   * @param modalRef
   */
  showModal(templateRef: TemplateRef<HTMLElement>, size) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: size }));
  }
  /**
   * Method to show approve modal
   * @param templateRef
   */
  approveModal(templateRef: TemplateRef<HTMLElement>) {
    this.showModal(templateRef, 'modal-lg');
  }
  /**
   *
   * BACK BUTTON Route while displaying an injury
   */
  routeBack() {
    let isDashboard: boolean = false;
    let value: any = 'Overview';
    this.activatedRoute.queryParams.subscribe(res => {
      isDashboard = res.fromDashboard;
    });
    const route = this.ohservice.getRoute();
    const id = this.ohservice.getTransactionId();
    const refId = this.ohservice.getTransactionRefId();
    const invoiceId = this.claimService.getInvoiceId();
    const tpaCode = this.claimService.getTPACode();
    const claimNo = this.claimService.getClaimNo();
    const personId = this.changePersonService.getURLId();
    let path: string;
    if (isDashboard) {
      path = routeTo(
        'Overview',
        this.registrationNo,
        this.socialInsuranceNo,
        id,
        refId,
        invoiceId,
        tpaCode,
        claimNo,
        personId
      );
    } else {
      path = routeTo(
        route,
        this.registrationNo,
        this.socialInsuranceNo,
        id,
        refId,
        invoiceId,
        tpaCode,
        claimNo,
        personId
      );
    }
    if(this.ohservice.getIsFromGroupInjuryPage()){
      this.router.navigate([`home/transactions/view/${this.ohservice.getTransactionId()}/${this.ohservice.getTransactionRefId()}/oh/transactions/injury`]);     
    }else if(!this.ohservice.getIsFromPreviousOHHistoryPage() && !this.ohservice.getIsFromValidatorPage()){      
      this.ohservice.setRoute(null);
      this.router.navigate([path]);
    }else if(this.ohservice.getIsFromValidatorPage() && this.ohservice.getIsTransferInjuryIdClicked()){
      this.ohservice.setRoute(null);
      this.router.navigate([path]);
    }


    setTimeout(() => {
      console.log(this.ohservice.getSelectedTabid());
      this.selectedId = this.ohservice.getSelectedTabid();
    }, 2000);
  
    this.alertService.clearAlerts();
  }

  /**
   * Catching the browser back button
   */
  @HostListener('window:popstate', ['$event'])
  onPopState() {
    this.routeBack();
  }
  /**
   * Clear the modal
   */
  clear() {
    this.modalRef.hide();
  }
  /**
   * Asssign for audit
   */
  assignForAudit() {
    if (this.auditForm.valid) {
      this.claimsService
        .assignForAuditing(this.registrationNo, this.socialInsuranceNo, this.id, this.auditForm.getRawValue())
        .subscribe(
          response => {
            this.auditResponse = response;
            this.getDetails();
            this.modalRef.hide();
          },
          error => {
            this.showError(error);
          }
        );
    }
  }
  /**
   *
   * @param err This method to show the page level error
   */
  showError(err) {
    if (err && err.error && err.error.message) {
      this.alertService.showError(err.error.message, err.error.details);
    }
  }
  clearAlertAllowance() {
    if (
      this.claimService
        .getAlert()
        ?.english.includes(
          'modify the occupational hazards allowance payee has been successfully submitted and under process'
        )
    ) {
      this.alertService.showSuccess(this.claimService.getAlert());
    } else {
      this.alertService.clearAlerts();
    }
  }
  
  clearAlertClaims() {
    if (
      this.claimService
        .getAlert()
        ?.english.includes('The reimbursement request for Occupational Hazard case has been successfully submitted')
    ) {
      this.alertService.showSuccess(this.claimService.getAlert());
    } else {
      this.alertService.clearAlerts();
    }
  }
}

