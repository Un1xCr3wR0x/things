/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
//Component to add complication details
import { Location, PlatformLocation } from '@angular/common';
import { Component, Inject, OnChanges, OnDestroy, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,  
  ApplicationTypeEnum,
  ApplicationTypeToken,
  CoreContributorService,
  DocumentService,
  LookupService,
  Role,
  RouterConstants,
  RouterData,
  RouterDataToken,
  scrollToTop,
  StorageService,
  TransactionReferenceData,
  WizardItem,
  WorkflowService,
  TransactionStatus,
  LanguageToken,  
  addDays
} from '@gosi-ui/core';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import moment from 'moment';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  ComplicationConstants,
  NavigationIndicator,
  OhConstants,
  OHReportTypes,
  ProcessType,
  Route,
  RouteConstants
} from '../../shared';
import { InjuryHistory, InjuryHistoryResponse, InjuryWrapper } from '../../shared/models';
import { Complication } from '../../shared/models/complication';
import { ContributorService, EstablishmentService, InjuryService, DiseaseService } from '../../shared/services';
import { ComplicationService } from '../../shared/services/complication.service';
import { OhService } from '../../shared/services/oh.service';
import { ComplicationBaseScComponent } from '../base/complication-base-sc.component';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { DiseaseHistory } from '../../shared/models/disease-history';

@Component({
  selector: 'oh-add-complication-sc',
  templateUrl: './add-complication-sc.component.html',
  styleUrls: ['./add-complication-sc.component.scss']
})
export class AddComplicationScComponent extends ComplicationBaseScComponent implements OnInit, OnChanges, OnDestroy {
  /*** viewchild components */
  @ViewChild('reportComplicationWizard', { static: false })
  reportComplicationWizard: ProgressWizardDcComponent;
  @ViewChild('cancelEngagementTemplate', { static: false })
  private cancelEngagement: TemplateRef<Object>;
  assignedRole: string;
  comment: TransactionReferenceData[];
  closingDate: Date;
  viewdiseaseDetail: any;
  addComplication: boolean = false;
  isDiseaseedit: boolean = false;

  /**
   * Creating an instance
   */
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly ohService: OhService,
    readonly injuryService: InjuryService,
    readonly lookupService: LookupService,
    readonly coreContributorService: CoreContributorService,
    readonly establishmentService: EstablishmentService,
    readonly complicationService: ComplicationService,
    readonly alertService: AlertService,
    readonly router: Router,
    readonly modalService: BsModalService,
    readonly documentService: DocumentService,
    readonly workflowService: WorkflowService,
    readonly contributorService: ContributorService,
    readonly diseaseService: DiseaseService,
    readonly fb: FormBuilder,
    readonly storageService: StorageService,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,    
    readonly activatedRoute: ActivatedRoute,
    readonly location: Location,
    readonly pLocation: PlatformLocation
  ) {
    super(
      language,
      ohService,
      injuryService,
      lookupService,
      coreContributorService,
      establishmentService,
      complicationService,
      diseaseService,
      alertService,
      router,
      modalService,
      documentService,
      workflowService,
      contributorService,
      fb,
      routerData,
      appToken,
      activatedRoute,
      location     
    );
    pLocation.onPopState(() => {
      if (this.routerData.taskId && this.appToken === ApplicationTypeEnum.PUBLIC) {
        this.router.navigate([RouterConstants.ROUTE_TODOLIST]);
        this.alertService.clearAlerts();
      }
    });
  }


  /* Local Variables */
  currentTab = ComplicationConstants.CURRENT_PAGE_TAB;
  currentPage = ComplicationConstants.CURRENT_PAGE_TAB;
  totalTabs = ComplicationConstants.TABS_TOTAL_LOAD;
  pageLimit = ComplicationConstants.PAGE_LIMIT_LOAD;
  workFlowType = 'Complication';
  otherEst = false;
  // isIndividualApp : boolean;
  sessionRegistrationNo: number;
  injuryDetails: InjuryHistory;
  diseaseDetails: DiseaseHistory;
  /**
   * This method is for initialization tasks
   */
  ngOnInit() {
    this.clearAllAlerts();
    this.referenceNo = this.ohService.getTransactionRefId();
    this.reportComplicationWizardItems = this.getWizardItems();
    this.initializeLocalVariables();
    this.initializeLookUps();
   // this.ohService.setIsDiseaseedit(false);
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.type === 'report') {
        this.isReportView = true;
        this.processType = 'add';
        this.ohService.setComplicationId(undefined);
      }
    });
  /*   this.activatedRoute.url.subscribe(res => {
      if (res.length > 0) if (res[0].path === 'disease-edit') this.isDiseaseedit = true;
      this.ohService.setIsDiseaseedit(true);
    }); */
    this.getRouteParam(this.activatedRoute.paramMap);
    this.ohService.setIsWorkflow(false);
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP ? true : false;

    if (this.routerData && this.routerData.taskId !== null && this.routerData.taskId !== undefined) {
      this.setValues();
    } else {
      this.modifyScenario();
    }
    this.getData();
    if (this.socialInsuranceNo) {     
      this.wizardChanges();
      this.getInjuryList();
      //this.getDiseaseList();

      if (
        this.isReportView ||
        this.processType === ProcessType.EDIT ||
        this.processType === ProcessType.MODIFY ||
        (this.injuryId && this.injuryService.injurySelected) ||
        this.isEdit
      ) {
        setTimeout(() => {
          this.getInjuryDetails(this.injuryDetails ? this.injuryDetails : null);
        }, 1000);
        if (this.registrationNo !== this.sessionRegistrationNo) {
          this.getContributorDetails(true, this.sessionRegistrationNo, this.socialInsuranceNo);
        } else {
          this.getContributorDetails(true, this.registrationNo, this.socialInsuranceNo);
        }
      }
    }
    if (!this.socialInsuranceNo) {
      this.location.back();
    }
  }
  modifyScenario() {
    if (
      this.processType === ProcessType.MODIFY &&
      (this.routerData.taskId === null || this.routerData.taskId === undefined)
    ) {
      this.ohService.setIsWorkflow(true);
      this.isValidator1 = true;
    }
  }
  /**Wizard Changes while skipping the first screen */
  wizardChanges() {
    if (this.routerData && this.router.url.indexOf('/edit') >= 0) {
      this.reportComplicationWizardItems[0].isDisabled = true;
      this.reportComplicationWizardItems[0].isActive = true;
    } else {
      this.reportComplicationWizardItems[0].isDisabled = false;
      this.reportComplicationWizardItems[0].isActive = true;
    }
  }

  /**Getting values */
  getData() {
    this.personalDetails = this.ohService.getPersonDetails();
    this.socialInsuranceNo = this.ohService.getSocialInsuranceNo();
    this.registrationNo = this.ohService.getRegistrationNumber();
    this.sessionRegistrationNo = this.ohService.getRegistrationNumber();
    this.establishmentRegNo = this.ohService.getEstablishmetRegistrationNo();
    if(this.ohService.getIsNewTransaction()){
      this.ohService.setInjuryId(null);
      this.ohService.setInjuryNumber(null);
      this.ohService.setComplicationId(null);
    }
    this.injuryId = this.ohService.getInjuryId();
    this.injuryNumber = this.ohService.getInjuryNumber();
    this.complicationId = this.ohService.getComplicationId();
    this.isWorkflow = this.ohService.getIsWorkflow();
    this.diseaseNumber = this.ohService.getDiseaseNumber();
    this.getManageInjuryDocumentList();
    if (this.complicationId) {
      this.getComplicationDetails(this.registrationNo, this.socialInsuranceNo, this.injuryNumber, this.complicationId);
    }
   /*  else if (this.complicationId && this.isDiseaseedit)
    {
      this.getComplicationDraftDetails(this.registrationNo, this.socialInsuranceNo, this.injuryNumber, this.complicationId)
    } */
    this.getContributorDetails(false, this.establishmentRegNo, this.socialInsuranceNo);
  }

  clearAllAlerts() {
    this.alertService.clearAllErrorAlerts();
    this.alertService.clearAllWarningAlerts();
    this.alertService.clearAllSuccessAlerts();
  }

  //Set Values for service calls
  setValues() {
    this.ohService.setIsWorkflow(true);
    this.assignedRole = this.routerData.assignedRole;
    const payload = JSON.parse(this.routerData.payload);
    this.comment = this.routerData.comments;
    if (this.routerData.assignedRole === Role.VALIDATOR_1) {
      this.isValidator1 = true;
    }
    if (this.routerData.assignedRole === Role.EST_ADMIN_OH) {
      this.isValidator2 = true;
    }
    this.complicationId = payload.id;
    this.injuryNumber = payload.injuryId;
    this.registrationNo = payload.registrationNo;
    this.sessionRegistrationNo = payload.registrationNo;
    this.socialInsuranceNo = payload.socialInsuranceNo;
    this.injuryId = payload.id;
    this.ohService.setComplicationId(this.complicationId);
    this.ohService.setInjuryNumber(this.injuryNumber);
    this.ohService.setRegistrationNo(this.registrationNo);
    this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
    this.ohService.setInjuryId(this.injuryId);
  }
  //Get injury details through api
  getInjuryDetails(injuryDetails?) {
    const isChangeRequired = false;
    const queryParams = this.activatedRoute.snapshot.queryParams;
    const typeParam = queryParams['type'];
    this.injuryId = this.ohService.getInjuryId();
    this.ohService.setInjuryId(this.injuryId);
    this.injury = injuryDetails;
    this.viewInjuryDetail = injuryDetails;
    const transactionStatus = this.ohService.getTransactionStatus();
    if (transactionStatus?.english === TransactionStatus.DRAFT && (typeParam !== 'report')) {
      this.isDisease = this.viewInjuryDetail ? false : true;
      this.ohService.setIsDisease(this.isDisease);
    } else {
      this.isDisease = this.ohService.getIsDisease();
    }
    if (this.establishmentRegNo !== this.sessionRegistrationNo) {
      this.otherEst = true;
    }
    this.injuryService
      .getInjuryDetails(
        this.otherEst ? this.establishmentRegNo : this.ohService.getRegistrationNumber(),
        this.socialInsuranceNo,
        this.injuryId,
        this.isIndividualApp,
        isChangeRequired
      )
      .subscribe((response: InjuryWrapper) => {
        this.injuryDetailsWrapper = response;
        this.ohService.setInjuryClosedDate(moment(this.injuryDetailsWrapper.injuryDetailsDto.closingDate.gregorian).toDate());
        this.closingDate=this.ohService.getInjuryClosedDate();
        this.closingDate=addDays(moment(this.closingDate).toDate(), 30);      //30 days after injury close date
        if (this.processType === ProcessType.MODIFY) {
          this.ohService.setNavigationIndicator(NavigationIndicator.CSR_MODIFY);
          if (this.taskid !== null || this.taskid !== undefined) {
            this.ohService.setNavigationIndicator(NavigationIndicator.VALIDATOR1_EDITS_COMPLICATION);
          }
        }
        if (this.routerData.resourceType === 'Complication' && this.processType === ProcessType.EDIT) {
          this.ohService.setNavigationIndicator(NavigationIndicator.VALIDATOR1_EDITS_REPORT);
        }
      });
  }
  getDiseaseDetails(diseaseDetails?) {
    this.diseaseId = this.ohService.getDiseaseId();
    this.ohService.setDiseaseId(this.diseaseId);
    this.disease = diseaseDetails;
    this.viewdiseaseDetail = diseaseDetails;
    if (this.establishmentRegNo !== this.sessionRegistrationNo) {
      this.otherEst = true;
    }
    this.diseaseService
      .getDiseaseHistory(
        this.registrationNo,
        this.socialInsuranceNo,
        OHReportTypes.Disease,
        this.pagination,
        this.isIndividualApp,
        this.isAppPrivate
      )
      .subscribe(response => {
        this.diseaseList = response;
      });
  }
  /** Capturing input on changes */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.injuryList) {
      this.injuryList = changes.injuryList.currentValue;
      this.getInjuryList();
    }
   /*  if (changes && changes.diseaseList) {
      this.diseaseList = changes.diseaseList.currentValue;
      this.getDiseaseList();
    }  */
  }
  //Getting the injury list
  getInjuryList() {
    this.ohService.setRegistrationNo(this.sessionRegistrationNo);
    this.ohService.getOhHistory(OHReportTypes.Complication, null, this.isAppPrivate).subscribe(
      response => {
        this.pageTotal = response.totalCount;
        this.injuryList = response.injuryHistory;
        if (this.injuryId && this.injuryList) {
          this.injuryList.forEach(item => {
            if (item.injuryId === this.injuryId) {
              this.injuryDetails = item;
            }
          });
        }
        if(this.injuryList && this.injuryList.length>0 && this.ohService.getRegistrationNumber() === undefined ||  this.ohService.getRegistrationNumber() === 0 || !this.ohService.getRegistrationNumber()){
          this.ohService.setRegistrationNo(this.injuryList[0]?.establishmentRegNo);
          this.registrationNo = this.injuryList[0]?.establishmentRegNo;
        }
        this.getInjuryDetails(this.injuryDetails);
      },
      err => {
        this.showError(err);
      }
    );
  }
  /**
   * disease List
   */
  getDiseaseList() {
    this.diseaseService
      .getDiseaseHistory(
        this.registrationNo,
        this.socialInsuranceNo,
        OHReportTypes.Disease,
        this.pagination,
        this.isIndividualApp,
        this.isAppPrivate
      ).subscribe(response => {
    this.diseaseList = response;
    const diseaseNo = this.ohService.getDiseaseId();
    const queryParams = this.activatedRoute.snapshot.queryParams;
    const typeParam = queryParams['type'];
    
    if ((typeParam === 'report') && diseaseNo !== undefined && diseaseNo !== null) {
      this.diseaseList = this.diseaseList.filter(diseaseHistory =>
        diseaseHistory.diseaseId === diseaseNo
      );
      this.viewdiseaseDetail = this.diseaseList[0];
     
    } else {
      this.diseaseList = this.diseaseList.filter(diseaseHistory =>
        diseaseHistory.actualStatus &&
        (diseaseHistory.actualStatus.english === 'Cured With Disability' ||
         diseaseHistory.actualStatus.english === 'Cured Without Disability')
      );
    }
  });
}

  /**
   * This method is to get the progress wizard icons
   */
  getWizardItems() {
    const wizardItems: WizardItem[] = [];
    wizardItems.push(new WizardItem(ComplicationConstants.SEC_SELECT_INJURY, 'user-injured'));
    wizardItems.push(new WizardItem(ComplicationConstants.WIZARD_COMPLICATION, 'user'));
    wizardItems.push(new WizardItem(OhConstants.SEC_CONTACT_DETAILS, 'address-book'));
    wizardItems.push(new WizardItem(OhConstants.WIZARD_DOCUMENTS, 'file-alt'));
    return wizardItems;
  }

  // Event emitted method from progress wizard to make form navigation

  selectWizard(wizardIndex: number) {
    this.alertService.clearAlerts();
    this.currentTab = wizardIndex;
  }

  /**
   * This method is to navigate to previous tab
   * @memberof ManageInjuryDcComponent
   */
  previousForm() {
    scrollToTop();
    this.currentTab--;
    if (this.reportComplicationWizard) {
      this.reportComplicationWizard.setPreviousItem(this.currentTab);
    }
  }
  //This methodis used to save contact details
  saveEmergencyNumber(personalDetails) {
    this.complicationService.saveEmergencyContact(personalDetails.contactDetail.mobileNo, this.establishmentRegNo).subscribe(
      () => {
        if (personalDetails.personDetails !== null && personalDetails.personDetails !== undefined) {
          personalDetails.personDetails.contactDetail.emergencyContactNo = personalDetails.contactDetail.mobileNo.primary.toString();
        }
        if (
          !this.isAddressPresent &&
          personalDetails.personDetails &&
          personalDetails.personDetails.contactDetail &&
          personalDetails.personDetails.contactDetail.addresses &&
          personalDetails.personDetails.contactDetail.addresses.length > 0
        ) {
          this.saveAddress(personalDetails.personDetails);
        } else {
          this.nextForm();
        }
      },
      err => {
        this.showError(err);
      }
    );
  }
  saveAddress(personDetails) {
    this.ohService.updateAddress(personDetails).subscribe(
      () => {
        this.nextForm();
      },
      err => {
        this.showError(err);
      }
    );
  }
  cancelInjury() {
    this.router.navigate([RouteConstants.ROUTE_COMPLICATION]);
  }
  // This method is used to confirm cancellation of transaction
  confirmCancel() {
    this.modalRef.hide();
    this.ohService.deleteTransactionDetails(this.transactionNumber).subscribe(res => {
      res = res;
      this.alertService.clearAlerts();
      this.ohService.setComplicationId(null);
     // this.ohService.setDiseaseId(null);
    });
    const transactionStatus = this.ohService.getTransactionStatus();
    if (transactionStatus?.english === TransactionStatus.DRAFT) {
      this.router.navigate(['home/transactions/list/history']);
    } else {
      this.location.back();
    }
  }

  // Save complication details
  saveComplication(reportComplicationDetails: Complication) {
    reportComplicationDetails.navigationIndicator = 0;
    if (
      this.processType === ProcessType.MODIFY &&
      (this.routerData.taskId === null || this.routerData.taskId === undefined)
    ) {
      if (this.isEdit) {
        reportComplicationDetails.navigationIndicator = NavigationIndicator.RESUME_CSR_EDITS;
      } else {
        reportComplicationDetails.navigationIndicator = NavigationIndicator.CSR_MODIFY;
      }
    } else if (
      this.processType === ProcessType.MODIFY &&
      (this.routerData.taskId !== null || this.routerData.taskId !== undefined)
    ) {
      if (this.isEdit) {
        reportComplicationDetails.navigationIndicator = NavigationIndicator.RESUME_CSR_EDITS;
      } else {
        reportComplicationDetails.navigationIndicator = NavigationIndicator.VALIDATOR1_EDITS_COMPLICATION;
      }
    }
    if (this.routerData.resourceType === 'Complication' && this.processType === ProcessType.EDIT) {
      if (this.isEdit) {
        reportComplicationDetails.navigationIndicator = NavigationIndicator.RESUME_CSR_EDITS;
      } else {
        reportComplicationDetails.navigationIndicator = NavigationIndicator.VALIDATOR1_EDITS_REPORT;
      }
    }
    reportComplicationDetails.registrationNo = this.establishmentRegNo;
    this.ohService.setNavigationIndicator(reportComplicationDetails.navigationIndicator);
    this.saveComplicationDetails(reportComplicationDetails);
  }

  // Method for cancelling transaction
  decline() {
    this.modalRef.hide();
  }
  //Method for showing cancel template
  showCancelTemplate() {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(this.cancelEngagement, config);
  }
  // Method to navigate to injury view page
  viewInjury(injuryDetails: InjuryHistory) {
   // this.ohService.setIsDisease(false);
   // this.isDisease = this.ohService.getIsDisease();
    if (injuryDetails.addComplicationAllowed === false) {
      this.alertService.showErrorByKey('OCCUPATIONAL-HAZARD.INJURY.ERR-PROHIBIT-ADD-COMPLICATION');
    } else {
      this.alertService.clearAlerts();
      this.ohService.setInjuryId(injuryDetails.injuryId);
      this.injuryId = injuryDetails.injuryId;
      this.establishmentRegNo = injuryDetails.establishmentRegNo;
      if (this.isAppPrivate) {
        this.ohService.setRegistrationNo(this.establishmentRegNo);
        if (this.establishmentRegNo && this.socialInsuranceNo && this.processType === ProcessType.ADD) {
          this.getContributorDetails(false, this.establishmentRegNo, this.socialInsuranceNo);
        }
      } else {
        this.ohService.setRegistrationNo(this.sessionRegistrationNo);
        if (this.sessionRegistrationNo && this.socialInsuranceNo && this.processType === ProcessType.ADD) {
          this.getContributorDetails(false, this.sessionRegistrationNo, this.socialInsuranceNo);
        }
      }
      this.getManageInjuryDocumentList();
      this.getInjuryDetails(injuryDetails);
      this.ohService.setComplicationId(null);
      this.nextForm();
    }
  }

  viewDisease(diseaseDetails: DiseaseHistory) {
  //  this.ohService.setIsDisease(true);
   // this.isDisease = this.ohService.getIsDisease();
    if (diseaseDetails.addComplicationAllowed === false) {
      this.alertService.showErrorByKey('OCCUPATIONAL-HAZARD.INJURY.ERR-PROHIBIT-ADD-COMPLICATION');
    } else {
      this.alertService.clearAlerts();
      this.ohService.setDiseaseId(diseaseDetails?.diseaseId);
      this.diseaseId = diseaseDetails?.diseaseId;
      this.getManageInjuryDocumentList();
      this.getDiseaseDetails(diseaseDetails);
      this.ohService.setComplicationId(null);
      this.nextForm();
    }
  }
  /** Form Validation */
  showFormValidation() {
    this.alertService.clearAlerts();
    this.alertService.showMandatoryErrorMessage();
  }
  //Show mandatory for documents
  showMandatoryDocErrorMessage($event) {
    this.uploadFailed = $event;
    if (this.isAppPrivate && this.uploadFailed) {
      this.alertService.showErrorByKey('CORE.ERROR.SCAN-MANDATORY-DOCUMENTS');
    } else if (this.uploadFailed) {
      this.alertService.showErrorByKey('CORE.ERROR.UPLOAD-MANDATORY-DOCUMENTS');
    }
  }
  //Method to handle pagination logic
  requestHandler(pagination, clearlist: boolean) {
    this.ohService.getOhHistory(OHReportTypes.Complication, pagination, this.isAppPrivate).subscribe(
      (response: InjuryHistoryResponse) => {
        this.pageTotal = response.totalCount;
        if (clearlist) {
          this.injuryList = [];
        }
        if (response.injuryHistory) {
          response.injuryHistory.forEach(element => {
            this.injuryList.push(element);
          });
        }
      },
      err => {
        this.showError(err);
      }
    );
  }
  //Method to handle load more
  onLoadMore(loadMoreObj) {
    this.currentPage = loadMoreObj.currentPage;
    this.pagination.page.pageNo = this.currentPage;
    this.pagination.page.size = this.pageSize;
    this.requestHandler(this.pagination, false);
  }
  //Final submit for complication
  submitComplicationDocuments(comments: string) {
    if (this.routerData.taskId === null || this.routerData.taskId === undefined) {
      this.actionflag = true;
    } else {
      this.actionflag = false;
    }
    this.injuryId = this.ohService.getInjuryId();
   /*  this.diseaseId = this.ohService.getDiseaseId();
    if(this.isDisease){
      this.submitDiseaseDocument(this.complicationId, this.diseaseId, this.actionflag, comments);
    } */
   //else{
    this.submitDocument(this.complicationId, this.injuryId, this.actionflag, comments);
   // }
  }
  viewInjuryDetails(injuryHistory: InjuryHistory) {
    this.ohService.setRoute(Route.COMPLICATION);
    this.ohService.setInjuryId(injuryHistory.injuryId);
    this.router.navigate([
      `home/oh/view/${injuryHistory.establishmentRegNo}/${this.socialInsuranceNo}/${injuryHistory.injuryId}/injury/info`
    ]);
  }
  /* viewDiseaseDetails(diseaseHistory: DiseaseHistory) {
    this.ohService.setRoute(Route.COMPLICATION);
    this.ohService.setDiseaseId(diseaseHistory.diseaseId);
    this.router.navigate([
      `home/oh/view/${this.establishmentRegNo}/${this.socialInsuranceNo}/${diseaseHistory.diseaseId}/disease/info`
    ]);
  } */
  //Navigate to injury view
  injuryView(injuryId: number) {
    this.ohService.setInjuryId(injuryId);
  }
  /* diseaseView(diseaseId: number) {
    this.ohService.setRoute(Route.COMPLICATION);
    this.ohService.setDiseaseId(diseaseId);
    this.router.navigate([
      `home/oh/view/${this.establishmentRegNo}/${this.socialInsuranceNo}/${diseaseId}/disease/info`
    ]);
  } */
  ngOnDestroy() {
    this.alertService.clearAllErrorAlerts();
    super.ngOnDestroy();
  }
  /* saveDisease(reportComplicationDetails: Complication) {
    reportComplicationDetails.navigationIndicator = 0;
    // reportComplicationDetails.registrationNo = this.establishmentRegNo;
    // this.ohService.setNavigationIndicator(reportComplicationDetails.navigationIndicator);
    this.saveReportDiseaseDetails(reportComplicationDetails);
  } */
   //This methodis used to save contact details
  /*  saveEmergencyContacts(personalDetails) {
    this.complicationService.emergencyContactSave(personalDetails.contactDetail.mobileNo, this.establishmentRegNo).subscribe(
      () => {
        if (personalDetails.personDetails !== null && personalDetails.personDetails !== undefined) {
          personalDetails.personDetails.contactDetail.emergencyContactNo = personalDetails.contactDetail.mobileNo.primary.toString();
        }
        if (
          !this.isAddressPresent &&
          personalDetails.personDetails &&
          personalDetails.personDetails.contactDetail &&
          personalDetails.personDetails.contactDetail.addresses &&
          personalDetails.personDetails.contactDetail.addresses.length > 0
        ) {
          this.saveDiseaseAddress(personalDetails.personDetails);
        } else {
          this.nextForm();
        }
      },
      err => {
        this.showError(err);
      }
    );
  }
  saveDiseaseAddress(personDetails) {
    this.ohService.updateDiseaseAddress(personDetails).subscribe(
      () => {
        this.nextForm();
      },
      err => {
        this.showError(err);
      }
    );
  } */
}
