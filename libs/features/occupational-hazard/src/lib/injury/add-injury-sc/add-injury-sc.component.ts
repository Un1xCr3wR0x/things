/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location, PlatformLocation } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BilingualText,
  BPMUpdateRequest,
  CoreContributorService,
  DocumentService,
  FeedbackStatus,
  LanguageToken,
  LookupService,
  Role,
  RouterConstants,
  RouterData,
  RouterDataToken,
  StorageService,
  TransactionService,
  TransactionStatus,
  WorkFlowActions,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { NavigationIndicator, OHTransactionType, ProcessType } from '../../shared/enums';
import {
  ComplicationService,
  ContributorService,
  EstablishmentService,
  InjuryService,
  OhService,
  DiseaseService
} from '../../shared/services';
import { RouteConstants, InjuryConstants } from '../../shared/constants';
import { InjuryBaseComponent } from '../base/injury-base.sc.component';
@Component({
  selector: 'oh-add-injury-sc',
  templateUrl: './add-injury-sc.component.html',
  styleUrls: ['./add-injury-sc.component.scss']
})
export class AddInjuryScComponent extends InjuryBaseComponent implements OnInit {
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly modalService: BsModalService,
    readonly alertService: AlertService,
    readonly ohService: OhService,
    readonly contributorService: ContributorService,
    readonly coreContributorService: CoreContributorService,
    readonly documentService: DocumentService,
    readonly workflowService: WorkflowService,
    readonly establishmentService: EstablishmentService,
    readonly injuryService: InjuryService,
    readonly lookupService: LookupService,
    readonly diseaseService: DiseaseService,
    readonly complicationService: ComplicationService,
    readonly router: Router,
    readonly storageService: StorageService,
    readonly fb: FormBuilder,
    readonly route: ActivatedRoute,
    readonly transactionService: TransactionService,
    @Inject(ApplicationTypeToken) readonly appToken: string,   
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly activatedRoute: ActivatedRoute,
    readonly location: Location,
    readonly pLocation: PlatformLocation
  ) {
    super(
      language,
      alertService,
      complicationService,
      contributorService,
      documentService,
      establishmentService,
      injuryService,
      diseaseService,
      lookupService,
      ohService,
      router,
      appToken,
      fb,
      location,
      pLocation,
      modalService,
      transactionService
    );
    pLocation.onPopState(() => {
      if (this.routerData.taskId && this.appToken === ApplicationTypeEnum.PUBLIC) {
        this.router.navigate([RouterConstants.ROUTE_TODOLIST]);
        this.alertService.clearAlerts();
      }
    });
  }
  @ViewChild('cancelInjury', { static: false })
  private cancelInjuryModal: TemplateRef<Object>;
  ngOnInit() {
    super.ngOnInit();
    this.payeeInfo = false;
    this.referenceNo = this.ohService.getTransactionRefId();
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    const url = this.router.url;
    if (url.indexOf('/edit') >= 0) {
      this.isEdit = true;
    }
    this.alertService.clearAlerts();
    this.processType = url.substr(url.lastIndexOf('/') + 1);
    this.initializeWizardItems();
    this.taskid = this.routerData.taskId;
    this.getRouteParam(this.route.paramMap);
    if (this.routerData) {
      if (this.routerData.taskId !== null && this.routerData.taskId !== undefined) {
        this.comment = this.routerData.comments;
        if (this.routerData.assignedRole === Role.VALIDATOR_1) {
          this.isValidator1 = true;
        }
        if (this.routerData.assignedRole === Role.EST_ADMIN_OH && (this.routerData.channel !== "taminaty")) {
          this.isValidator2 = true;
        }
        this.isWorkflow = true;
        this.setValues();
      }

      // report injury admin inbox
      if (this.routerData.resourceId === 'admin') {
        this.allowanceFlag = true;
      }
      if (this.routerData?.payload) {
        const payload = JSON.parse(this.routerData.payload);
        if (payload.previousOutcome === "RETURN") {
          this.allowanceFlagReturn = true;
        }
      }

    }
    if (
      (this.processType === ProcessType.MODIFY || this.processType === ProcessType.REOPEN) &&
      !this.routerData.taskId
    ) {
      this.isWorkflow = true;
      this.isValidator1 = true;
      if (this.processType === ProcessType.MODIFY) {
        this.injuryService.setNavigationIndicator(NavigationIndicator.CSR_EDITS);
      }
    }
    if (this.processType === ProcessType.REOPEN) {
      if (this.isAppPrivate) {
        this.injuryService.setNavigationIndicator(NavigationIndicator.CSR_REOPEN_INJURY);
      } else {
        this.injuryService.setNavigationIndicator(NavigationIndicator.EST_ADMIN_REOPEN_INJURY);
      }
    }
    if (this.routerData.resourceType === InjuryConstants.INJURY && this.processType === ProcessType.EDIT) {
      this.injuryService.setNavigationIndicator(NavigationIndicator.VALIDATOR1_EDITS_REPORT);
    }
    this.getData();
    if (!this.socialInsuranceNo) {
      this.location.back();
    }
  }
  //Getting data from services
  getData() {
    this.referenceNo = this.ohService.getTransactionRefId();
    this.socialInsuranceNo = this.ohService.getSocialInsuranceNo();
    this.registrationNo = this.ohService.getRegistrationNumber();
    if(this.ohService.getIsNewTransaction()){
      this.ohService.setInjuryId(null);
    }
    this.injuryId = this.ohService.getInjuryId();  
    if (this.socialInsuranceNo) {
      this.getManageInjuryDocumentList();
      if (this.injuryId) {
        this.getInjuryDetails();
      }
      if (
        this.routerData.taskId ||
        !this.isAppPrivate ||
        this.processType === ProcessType.REOPEN ||
        this.processType === ProcessType.MODIFY ||
        this.isEdit
      ) {
        if(this.registrationNo) {
          this.getPersonDetails();
         } else {
           this.getContributor();
         }   
      }
      if(this.registrationNo) {
        this.getPersonDetails();
       } else {
         this.getContributor();
       } 
      if (this.isAppPrivate) {
        this.person = this.ohService.getPersonDetails();
      }
      if (!this.isAppPrivate || this.isValidator1 || this.isEdit || this.processType === ProcessType.MODIFY) {
        this.getEngagementDetails(this.registrationNo, this.socialInsuranceNo);
      }
      if (this.socialInsuranceNo) {
        this.ohservice.setSocialInsuranceNo(this.socialInsuranceNo);
        this.getInjuryStatistics();
      }
      this.initializeLookups();
      this.getManageInjuryDocumentList();      
    }
  }
  //Set values from Router Data
  setValues() {
    this.injuryId = Number(this.routerData.resourceId);
    this.injuryNumber = Number(this.routerData.resourceId);
    const payload = JSON.parse(this.routerData.payload);
    this.channel = payload.channel;
    this.registrationNo = payload.registrationNo;
    this.socialInsuranceNo = payload.socialInsuranceNo;
    this.transactionNumber = payload.referenceNo;
    if ((payload.resource === "Complication" ) || (payload.resource === "Disease")) {
      this.isBulkInjury = false;
    } else {      
      this.injuryId = payload.id;
      if(payload.bulkInjuryRequestId && payload.bulkInjuryRequestId !== "NULL"){
        this.isBulkInjury = true;
        this.bulkInjuryId = payload.bulkInjuryRequestId;
      }
    }
    this.previousOutcome = payload.previousOutcome;
    this.ohService.setInjuryId(this.injuryId);
    this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
    this.ohService.setRegistrationNo(this.registrationNo);
    this.ohService.setInjuryNumber(this.injuryNumber);
  }
  getInjuryReason(injuryType) {
    this.injuryReasonList$ = this.lookupService.getInjuryReasonList(injuryType);
  }
  selectEstablishment(registrationNo) {
    this.ohService.setRegistrationNo(registrationNo);
    this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
    if(registrationNo) {
      this.getPersonDetails();
     } else {
       this.getContributor();
     }
    this.getEstablishment();
    this.getEngagementDetails(registrationNo, this.socialInsuranceNo);
  }
  displayMsg(event) {
    if (event) {
      this.alertService.showWarningByKey('OCCUPATIONAL-HAZARD.INJURY-EXISTING');
    } else {
      this.alertService.clearAllWarningAlerts();
    }
  }

  saveInjury(personalDetails) {
    this.injuryService.saveEmergencyContactInjury(personalDetails.contactDetail.mobileNo).subscribe(
      response => {
        this.injuryNumber = response;
        if (personalDetails.personDetails !== null && personalDetails.personDetails !== undefined) {
          personalDetails.personDetails.contactDetail.emergencyContactNo = personalDetails.contactDetail.mobileNo.primary.toString();
        }
        if (this.socialInsuranceNo) {
          this.ohservice.setSocialInsuranceNo(this.socialInsuranceNo);
          this.getInjuryStatistics();
        }
        if (this.processType !== ProcessType.MODIFY && this.processType !== ProcessType.REOPEN) {
          this.saveAllowancePayee(personalDetails.allowancePayee);
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
  showFormValidation() {
    if (this.appToken === ApplicationTypeEnum.PUBLIC) {
      this.alertService.clearAlerts();
    }
    this.alertService.showMandatoryErrorMessage();
  } 

  getContributor() {
    this.registrationNo = this.ohService.getRegistrationNumber();
    this.contributorService
      .getContributor(this.registrationNo, this.socialInsuranceNo)
      .pipe(map(res => res.person))
      .subscribe(
        res => {
          this.personId = res.personId;
          this.person = res;
          this.ohService.setPersonDetails(this.person);
          this.isAddressPresent = this.getAddressAvailability(res);
        },
        err => {
          this.showError(err);
        }
      );
  }
  showEstablishmentValidation(establishmentForm: FormGroup) {
    this.formStatus = establishmentForm.invalid;
  }
  getInjuryDetails() {
    let isChangeRequired = false;
    this.ohService.setInjuryId(this.injuryId);
    if (
      this.routerData.taskId &&
      (this.processType === ProcessType.MODIFY || this.processType === ProcessType.REOPEN)
    ) {
      isChangeRequired = true;
    }
    if (this.isEdit && (this.processType === ProcessType.MODIFY || this.processType === ProcessType.REOPEN)) {
      isChangeRequired = true;
    }
    if (this.isEdit) {
      isChangeRequired = true;
    }
    this.injuryService
      .getInjuryDetails(this.registrationNo, this.socialInsuranceNo, this.injuryId, this.isIndividualApp, isChangeRequired)
      .subscribe(
        response => {
          this.injuryDetailsWrapper = response;
          if (this.injuryDetailsWrapper.injuryDetailsDto?.initiatedBy === 2005) {
            if (this.processType === ProcessType.MODIFY || this.processType === ProcessType.REOPEN) {
              this.allowanceFlag = true;
              this.allowanceFlagReopen = true;
            }
          }
          if (this.allowanceFlag) {
            this.occupation = this.injuryDetailsWrapper.injuryDetailsDto.occupation;
          }
          if (this.injuryDetailsWrapper?.injuryDetailsDto?.status?.english === 'pending') {
            this.isValidator1 = true;
            this.isWorkflow = true;
          }
          if (this.processType === ProcessType.MODIFY && this.routerData.taskId !== null) {
            this.injuryService.setNavigationIndicator(NavigationIndicator.CSR_EDITS);
          } else if (
            this.processType === ProcessType.REOPEN &&
            this.routerData.taskId !== null &&
            this.routerData.taskId !== undefined
          ) {
            this.injuryService.setNavigationIndicator(NavigationIndicator.VALIDATOR1_REOPEN_EDITS);
          }
          if (this.routerData.resourceType === InjuryConstants.INJURY && this.processType === ProcessType.EDIT) {
            this.injuryService.setNavigationIndicator(NavigationIndicator.VALIDATOR1_EDITS_REPORT);
          }
          this.injury = this.injuryDetailsWrapper.injuryDetailsDto;
          if (this.injury && this.injury.requiredDocuments.length > 0) {
            this.documentsList = this.injury.requiredDocuments;
          }
          this.establishmentName = this.injury.establishmentName;
          this.getInjuryReason(this.injury.accidentType.english);
          this.getDocs(this.injury.governmentSector.english);
          this.emergencyContactNo = this.injury.emergencyContactNo.primary;
          this.payeeT = this.injury.allowancePayee;
          this.isdControl = this.injury.emergencyContactNo.isdCodePrimary;
          if (
            (this.isValidator2 === true && !this.isEdit) ||
            (this.previousOutcome === 'RETURN' && this.isEdit && this.isValidator2 === true) || (this.allowanceFlag && this.allowanceFlagReturn)
          ) {
            let id = this.injuryId;
            if(this.isBulkInjury){
              id = this.bulkInjuryId;
            }
            this.documentService
              .getDocuments(OHTransactionType.DOCUMENT_TRANSACTION_KEY, OHTransactionType.Injury, id)
              .subscribe(documentResponse => {
                this.documentItem = documentResponse.filter(item => item.documentContent !== null);
                if (this.documentsList) {
                  for (const doc of this.documentsList) {
                    this.reqdocumentTemp = documentResponse.filter(item => item.name.english.toLowerCase() === doc.english.toLowerCase());
                    this.reqdocumentTemp = this.reqdocumentTemp.filter(item => (item.required = true));
                    this.reqdocumentList.push(this.reqdocumentTemp);
                  }
                }
              });
          }
        },
        err => {
          this.showError(err);
        }
      );
  }
  showMandatoryDocErrorMessage($event) {
    this.showErrorMessage($event);
  }
  //Saving the injury details for contributor
  saveInjuryDetails(reportInjuryDetails) {
    this.reportedInjuryInformation = reportInjuryDetails;
    this.reportedDate = reportInjuryDetails.injuryDate;
    this.reportedInjuryInformation.navigationIndicator = 0;
    this.registrationNo = this.ohService.getRegistrationNumber();
    this.getNavigationIndicator(this.routerData);

    if (this.routerData.resourceType === InjuryConstants.INJURY && this.processType === ProcessType.EDIT) {
      this.reportedInjuryInformation.navigationIndicator = NavigationIndicator.VALIDATOR1_EDITS_REPORT;
    }
    if (this.reportInjuryMainForm.get('reportInjury')) {
      this.reportInjuryMainForm.markAllAsTouched();
      this.reportInjuryMainForm.updateValueAndValidity();
      if ((this.reportInjuryMainForm.valid || this.modifyIndicator === false) && !this.formStatus) {
        this.alertService.clearAlerts();
        if (this.reportedInjuryInformation.injuryToDeathIndicator === true && !this.isAddressPresent) {
          this.isAddressOptional = false;
        }
        if (this.reportedInjuryInformation.injuryToDeathIndicator === false && !this.isAddressPresent) {
          this.isAddressOptional = true;
        }
        if (this.injuryId) {
          reportInjuryDetails.injuryId = this.injuryId;
          this.injuryService.updateInjuryService(reportInjuryDetails).subscribe(
            response => {
              this.injuryId = response;
              this.disabled = this.getEngagementOnDate(this.socialInsuranceNo, this.injuryId);
              this.ohService.setInjuryId(this.injuryId);
              
              if(this.modifyIndicator === true) {
                this.getDocs(this.reportedInjuryInformation.governmentSector.english);   
                console.log("save injury");
              }else {
                this.getDocs(this.injury.governmentSector.english);
                console.log("save injury2");
              }

              this.nextForm();
            },
            err => {
              this.showError(err);
            }
          );
        } else {
          this.injuryService.reportInjuryService(reportInjuryDetails).subscribe(
            response => {
              this.injuryId = response;
              this.disabled = this.getEngagementOnDate(this.socialInsuranceNo, this.injuryId);
              this.ohService.setISNewTransaction(false);
              this.ohService.setInjuryId(this.injuryId);
              this.nextForm();
            },
            err => {
              this.showError(err);
            }
          );
        }
      } else {
        this.alertService.showMandatoryErrorMessage();
      }
    }
  }
  confirmCancel() {
    this.modalRef.hide();
    if (this.processType !== ProcessType.ADD) {
      this.ohService.deleteTransactionDetails(this.transactionNumber).subscribe(res => {
        res = res;
        this.alertService.clearAlerts();
      });
    }
    const transactionStatus = this.ohService.getTransactionStatus();
    if (transactionStatus?.english === TransactionStatus.DRAFT) {
      this.router.navigate(['home/transactions/list/history']);
    } else {
      this.location.back();
    }
  }
  decline() {
    this.modalRef.hide();
  }
  showCancelTemplate() {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(this.cancelInjuryModal, config);
  }
  setModifyIndicator(modifyIndicator: boolean) {
    this.modifyIndicator = modifyIndicator;
  }
  setReopenReason(reopenReason: BilingualText) {
    if (reopenReason.english !== 'Others') {
      this.isSelectedReasonOthers = false;
    } else {
      this.isSelectedReasonOthers = true;
    }
  }
  submitDocument(comments: string) {
    let actionFlag = false;
    if (this.routerData.taskId === null || this.routerData.taskId === undefined) {
      actionFlag = true;
    }
    if (this.processType === ProcessType.REOPEN) {
      this.injuryNumber = this.injuryId;
    }
    if (this.documentForm.get('uploadDocument')) {
      this.documentForm.markAllAsTouched();
      if (this.documentForm.valid) {
        this.injuryService.submitInjury(this.injuryNumber, actionFlag, comments).subscribe(
          response => {
            this.feedbackdetails = response;
            this.ohService.setInjuryId(null);
            let status = 'modified';
            if (this.processType === ProcessType.REOPEN) {
              status = 're-open';
            }
            const transactionStatus = this.ohService.getTransactionStatus();
            this.injuryService.setNavigationIndicator(NavigationIndicator.ADD_INJURY);
            if (
              this.isWorkflow &&
              (this.processType === ProcessType.MODIFY || this.processType === ProcessType.REOPEN) &&
              (this.routerData.taskId === null || this.routerData.taskId === undefined)
            ) {
              if (transactionStatus?.english === TransactionStatus.DRAFT) {
                this.router.navigate(['home/transactions/list/history']);
              } else {
                this.router.navigate(
                  [`home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryId}/injury/info`],
                  {
                    queryParams: {
                      status: status
                    }
                  }
                );
              }

              this.alertService.showSuccess(this.feedbackdetails.transactionMessage);
            } else if (
              (this.processType === ProcessType.MODIFY ||
                this.processType === ProcessType.REOPEN ||
                this.processType === ProcessType.EDIT) &&
              this.routerData.taskId
            ) {
              const workflowData = new BPMUpdateRequest();
              workflowData.isExternalComment = true;
              workflowData.comments = this.documentForm.get('uploadDocument').get('comments').value;
              workflowData.taskId = this.routerData.taskId;
              workflowData.outcome = WorkFlowActions.UPDATE;
              workflowData.user = this.routerData.assigneeId;
              this.workflowService.updateTaskWorkflow(workflowData).subscribe(
                () => {
                  if (this.isAppPrivate && this.isWorkflow) {
                    this.router.navigate([RouteConstants.ROUTE_INBOX]);
                  } else if (!this.isAppPrivate && this.isWorkflow) {
                    this.router.navigate([RouteConstants.ROUTE_INBOX_PUBLIC]);
                  } else {
                    this.location.back();
                  }
                  this.alertService.showSuccess(this.feedbackdetails.transactionMessage);
                },
                error => {
                  this.showError(error);
                }
              );
            } else {
              this.ohService.resetValues();
              this.injuryId = null;
              this.injuryNumber = null;
              this.location.back();
              if (this.feedbackdetails.status.english === FeedbackStatus.REJECTED) {
                this.alertService.showError(this.feedbackdetails.transactionMessage);
              } else if (
                this.feedbackdetails.status.english === FeedbackStatus.APPROVED ||
                this.feedbackdetails.status.english === FeedbackStatus.PENDING ||
                this.feedbackdetails.status.english === FeedbackStatus.INPROGRESS
              ) {
                this.alertService.clearAllErrorAlerts();
                this.alertService.showSuccess(this.feedbackdetails.transactionMessage);
                this.showSuccessMessage(this.feedbackdetails.transactionMessage);
              }
            }
          },
          error => {
            this.showError(error);
          }
        );
      } else {
        this.alertService.showMandatoryErrorMessage();
      }
    }
  }
}

