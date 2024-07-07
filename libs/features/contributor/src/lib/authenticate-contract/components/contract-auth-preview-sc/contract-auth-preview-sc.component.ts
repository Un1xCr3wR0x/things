/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, OnInit, TemplateRef, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BankAccount,
  BaseComponent,
  bindToObject,
  downloadFile,
  LanguageToken,
  LookupService,
  LovList,
  markFormGroupTouched,
  RouterConstants,
  RouterData,
  RouterDataToken,
  WorkFlowActions,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable } from 'rxjs';
import { ContributorConstants, ContributorRouteConstants, ContractAuthConstant } from '../../../shared/constants';
import { DaysLeftLabels } from '../../../shared/enums/days-left-labels';
import { RejectReasonsEnum } from '../../../shared/enums/reject-reasons';
import {
  ContractDetails,
  Contributor,
  ContributorBPMRequest,
  EngagementDetails,
  EngagementPeriod,
  Establishment,
  PendingContract,
  PersonalInformation
} from '../../../shared/models';
import { PendingEngagement } from '../../../shared/models/pending-engagement';
import { ContractAuthenticationService } from '../../../shared/services';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'cnt-contract-auth-preview-sc',
  templateUrl: './contract-auth-preview-sc.component.html',
  styleUrls: ['./contract-auth-preview-sc.component.scss']
})
export class ContractAuthPreviewScComponent extends BaseComponent implements OnInit {
  selectedLang: string;
  identifier: number;
  referenceNo: string;
  engagementId:number;
  isIndividualApp:boolean;
  type:string;
  establishment: Establishment;
  contributor: Contributor;
  activeEngagement: EngagementDetails;
  bankInfo: BankAccount;
  contract: ContractDetails;
  pendingContract: PendingContract;
  pendingEngagement:PendingEngagement;
  transportationAllowance: number;
  modalRef: BsModalRef;
  rejectDetailsForm: FormGroup;
  otherReasonFlag = false;
  acceptOrRejectFlag = false;
  daysLabel: string = DaysLeftLabels.ZERO_DAYS;
  contractId: number;
  eng:boolean =false;
  /** Observables. */
  rejectReasonList$: Observable<LovList>;

  /** Creates an insatance of ContractAuthPreviewScComponent. */
  constructor(
    readonly alertService: AlertService,
    readonly contractService: ContractAuthenticationService,
    readonly lookupService: LookupService,
    readonly workflowService:WorkflowService,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    readonly modalService: BsModalService,
    readonly fb: FormBuilder,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {
    super();
  }

  /** Method to initialize the component. */
  ngOnInit(): void {
    this.alertService.clearAlerts();
    this.language.subscribe(language => (this.selectedLang = language));
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;

    if(this.isIndividualApp){ this.eng=true;
    this.initializeFromToken();}
    else{
    this.activatedRoute.queryParams.subscribe(params => {
      this.referenceNo = params.reference_number;
      this.type=params.type;
    });
    this.identifier = this.contractService.identifier;
    }
    // For getting Engagement Details

    if (this.referenceNo && this.identifier)
     {
      if(this.type==="ENG_AUTH")
        {
        this.eng=true;
        this.getEngagementDetails(this.referenceNo, this.identifier);
        }
      else{
         this.eng=false;
         this.getPendingContract(this.referenceNo, this.identifier);
         this.getContractByContractId(this.referenceNo, this.identifier);
         }
         this.rejectDetailsForm = this.createReceiptForm();
         this.getRejectReasonList();
      }
    else if(this.engagementId && this.identifier) //individual app
    {
      this.eng=true;
      this.getindividualEngagementDetails(this.engagementId, this.identifier);
    }
    else {
      this.navigateToHome();
    }
  }


  /** Method to initialize keys from token. */
  initializeFromToken(): void {
    // this.ref = this.routerDataToken?.transactionId;
    this.identifier=+(this.routerDataToken?.assigneeId);
    const payload = JSON.parse(this.routerDataToken?.payload);
    if (payload) {
      // this.registrationNo = Number(payload?.registrationNo);
      // this.socialInsuranceNo = Number(payload?.socialInsuranceNo);
      this.engagementId = Number(payload?.engagementId);
    }
  }

  /* If accepted or rejected hide button and
   * on refresh navigate to home .
   */
  navigateToHome() {
    this.router.navigate([ContributorRouteConstants.ROUTE_CONTRACT_APP_LOGIN], {
      queryParams: {
        reference_number: this.referenceNo
      }
    });
  }
  /** Method to create reject form. */
  createReceiptForm(): FormGroup {
    return this.fb.group({
      reasonForReject: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      rejectedMessage: [null]
    });
  }

  /** Method to get contract rejection reason list. */
  getRejectReasonList() {
    this.rejectReasonList$ = this.lookupService.getReasonForRejection(this.contractService.getNoAuthHeaders());
  }

  /** Method to get other reason. */
  otherValueSelect() {
    const otherField = this.rejectDetailsForm.get('reasonForReject').get('english');
    const othersReason = this.rejectDetailsForm.get('rejectedMessage');
    if (otherField.value === 'Other Reasons') {
      this.otherReasonFlag = true;
      othersReason.setValidators([Validators.required, Validators.maxLength(1000)]);
    } else {
      this.otherReasonFlag = false;
      othersReason.setValue(null);
      othersReason.setValidators(null);
    }
  }

  /** Method to get pending contract. */
  getPendingContract(referenceNo, identifier) {
    this.contractService.getPendingContractByRef(referenceNo, identifier).subscribe(
      data => {
        this.pendingContract = data;
        if (data) {
          this.setLabelsForDays();
        }
      },
      err => {
        if (err.error.code === ContractAuthConstant.CANCELEED_CONTRACT_ERROR_CODE) {
          this.router.navigate([ContributorRouteConstants.ROUTE_INVALID_CONTRACT]);
        } else
          this.alertService.showError(
            err['error']['details']?.length === 1 ? err['error']['details'][0] : err['error']['message']
          );
      }
    );
  }

  /** Method to get engagement details. */
  getEngagementDetails(referenceNo, identifier) {
    this.contractService.getPendingEngagementByRef(referenceNo, identifier).subscribe(
      data => {
        this.pendingEngagement = data;
        if (data) {
          this.setLabelsForDays();
        }
      },
      err => {
        if (err.error.code === ContractAuthConstant.CANCELEED_CONTRACT_ERROR_CODE) {
          this.router.navigate([ContributorRouteConstants.ROUTE_INVALID_CONTRACT]);
        } else
          this.alertService.showError(
            err['error']['details']?.length === 1 ? err['error']['details'][0] : err['error']['message']
          );
      }
    );
  }


   /** Method to get engagement details for individual app */
   getindividualEngagementDetails(engagementId, identifier) {
    this.contractService.getIndividualEngagementByRef(engagementId, identifier).subscribe(
      data => {
        this.pendingEngagement = data;
        if (data) {
          this.setLabelsForDays();
        }
      },
      err => {
        if (err.error.code === ContractAuthConstant.CANCELEED_CONTRACT_ERROR_CODE) {
          this.router.navigate([ContributorRouteConstants.ROUTE_INVALID_CONTRACT]);
        } else
          this.alertService.showError(
            err['error']['details']?.length === 1 ? err['error']['details'][0] : err['error']['message']
          );
      }
    );
  }

  /** Method to set day label. */
  setLabelsForDays() {
    const daysLeft = this.pendingContract?.daysLeft;
    if (daysLeft === 0) {
      this.daysLabel = DaysLeftLabels.ZERO_DAYS;
    } else if (daysLeft === 1) {
      this.daysLabel = DaysLeftLabels.ONE_DAY;
    } else if (daysLeft === 2) {
      this.daysLabel = DaysLeftLabels.TWO_DAYS;
    } else if (daysLeft > 2 && daysLeft < 11) {
      this.daysLabel = DaysLeftLabels.THREE_TO_TEN_DAYS;
    } else if (daysLeft > 10) {
      this.daysLabel = DaysLeftLabels.GRT_THAN_TEN_DAYS;
    }
  }

  /** Method to get contract details by contract Id */
  getContractByContractId(referenceNo: string, identifier: number) {
    this.contractService.getUnifiedContract(referenceNo, identifier).subscribe(
      data => {
        if (data.contract) {
          this.contract = data.contract;
          this.contractId = data.contract.id;
          this.establishment = bindToObject(new Establishment(), data.firstPartyInfo);
          this.contributor = bindToObject(new Contributor(), {
            person: bindToObject(new PersonalInformation(), data.secondPartyInfo)
          });
          this.transportationAllowance = this.contract.wage.transportationAllowance ?? 0;
          this.activeEngagement = bindToObject(new EngagementDetails(), {
            engagementPeriod: [
              bindToObject(new EngagementPeriod(), {
                contributorAbroad: data.workDomain === 'inside Saudi' ? false : true,
                wage: data.contract.wage
              })
            ],
            workType: data.workType
          });
          this.bankInfo = data.contract.bankAccount;
        }
      },
      err => {
        if (err.error.code === ContractAuthConstant.CANCELEED_CONTRACT_ERROR_CODE) {
          this.router.navigate([ContributorRouteConstants.ROUTE_INVALID_CONTRACT]);
        } else this.alertService.showError(err['error']['message']);
      }
    );
  }

  /** This method is to show the modal reference.*/
  showModal(templateRef: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-md' }));
  }

  /** This method is to hide the modal reference. */
  hideModal() {
    this.modalRef.hide();
    //reset form
    this.rejectDetailsForm.reset();
    //hide text area
    this.otherReasonFlag = false;
  }

  /** This method is to accept contract. */
  confirmAcceptPreview() {
    this.contractService.acceptPendingContract(this.referenceNo, this.identifier).subscribe(
      data => {
        if (data) {
          this.hideModal();
          this.alertService.showSuccess(data['message'], null, 5);
          this.acceptOrRejectFlag = true;
        }
      },
      err => {
        this.hideModal();
        if (err.error.code === ContractAuthConstant.CANCELEED_CONTRACT_ERROR_CODE) {
          this.router.navigate([ContributorRouteConstants.ROUTE_INVALID_CONTRACT]);
        } else this.alertService.showError(err['error']['message']);
      }
    );
  }

  /** Method to get rejecction reason. */
  getRejectedReason() {
    const value = this.rejectDetailsForm.get('reasonForReject').get('english').value;
    let reason: string;
    if (value) {
      switch (value.toUpperCase()) {
        case 'INVALID WAGE DETIALS':
          reason = RejectReasonsEnum.INVALID_WAGE_DETAILS;
          break;
        case 'INVALID STARTING OR ENDING CONTRACT DATE':
          reason = RejectReasonsEnum.INVALID_CONTRACT_DATE;
          break;
        case 'INCORRECT LABOR RELATIONSHIP':
          reason = RejectReasonsEnum.INCORRECT_LABOR_RELATIONSHIP;
          break;
        case 'OTHER REASONS':
          reason = RejectReasonsEnum.OTHER_REASONS;
          break;
      }
    }
    return reason;
  }

  /** Method to reject contract. */
  confirmRejectPreview() {
    const rejectedReason = this.getRejectedReason();
    markFormGroupTouched(this.rejectDetailsForm);
    const otherField = this.rejectDetailsForm.get('reasonForReject').get('english');
    if (otherField.value !== 'Other Reasons') {
      this.rejectDetailsForm.get('rejectedMessage').setValue(null);
      this.rejectDetailsForm.get('rejectedMessage').setValidators(null);
    }
    if (this.rejectDetailsForm.valid) {
      const rejectContract = {
        rejectedMessage: this.rejectDetailsForm.get('rejectedMessage').value,
        rejectedReason: rejectedReason
      };
      this.contractService.rejectPendingContract(this.referenceNo, this.identifier, rejectContract).subscribe(
        data => {
          if (data) {
            this.hideModal();
            this.alertService.showSuccess(data['message'], null, 5);
            this.acceptOrRejectFlag = true;
          }
        },
        err => {
          this.hideModal();
          if (err.error.code === ContractAuthConstant.CANCELEED_CONTRACT_ERROR_CODE) {
            this.router.navigate([ContributorRouteConstants.ROUTE_INVALID_CONTRACT]);
          } else this.alertService.showError(err['error']['message']);
        }
      );
    }
  }

  /*this method print the preview page in private and public */
  printPreview() {
    this.contractService.printPreviewByRef(this.contractId).subscribe(
      res => {
        downloadFile(ContributorConstants.PRINT_CONTRACT_FILE_NAME, 'application/pdf', res);
      },
      err => {
        if (err.error.code === ContractAuthConstant.CANCELEED_CONTRACT_ERROR_CODE) {
          this.router.navigate([ContributorRouteConstants.ROUTE_INVALID_CONTRACT]);
        } else this.alertService.showError(err['error']['message']);
      }
    );
  }



  //..........................Engagement ....................................................................


  confirmEngagementReject(rejectContract){
    //(rejectContract);

    this.contractService.rejectengagementContract(this.referenceNo, this.identifier, rejectContract).subscribe(
      data => {
        if (data) {
          this.alertService.showSuccess(data['message'], null, 5);
          this.acceptOrRejectFlag = true;
        }
      },
      err => {
        if (err.error.code === ContractAuthConstant.CANCELEED_CONTRACT_ERROR_CODE) {
          this.router.navigate([ContributorRouteConstants.ROUTE_INVALID_CONTRACT]);
        } else this.alertService.showError(err['error']['message']);
      }
    );

  }


  confirmEngagementApprove(){
    this.contractService.engagementPendingContract(this.referenceNo, this.identifier).subscribe(
      data => {
        if (data) {
          this.alertService.showSuccess(data['message'], null, 5);
          this.acceptOrRejectFlag = true;
        }
      },
      err => {
        if (err.error.code === ContractAuthConstant.CANCELEED_CONTRACT_ERROR_CODE) {
          this.router.navigate([ContributorRouteConstants.ROUTE_INVALID_CONTRACT]);
        } else this.alertService.showError(err['error']['message']);
      }
    );
  }

// ............................Individual App.......................................

/** Method to handle e-inspection actions. */
  handleActions(key: number) {
    this.saveWorkflow(this.setWorkflowData(this.routerDataToken, this.getWorkflowAction(key)));
  }

  /** Method to save workflow details. */
  saveWorkflow(data: ContributorBPMRequest) {
    this.workflowService.updateTaskWorkflow(data).subscribe(
      res => {
        if (res) {
          this.alertService.showSuccessByKey(this.getSuccessMessage(data.outcome), null, 5);
          this.router.navigate([RouterConstants.ROUTE_INBOX]);
          // this.showSucccessMessage(data);
        }
      },
      err => this.alertService.showError(err.error.message)
    );
  }


    /** Method to get success message. */
    getSuccessMessage(outcome: string) {
      let messageKey: string;
      switch (outcome) {
        case WorkFlowActions.APPROVE:
          messageKey = 'CONTRIBUTOR.SUCCESS-MESSAGES.TRANSACTION-APPROVAL-MESSAGE';
          break;
        case WorkFlowActions.REJECT:
          messageKey = 'CONTRIBUTOR.SUCCESS-MESSAGES.TRANSACTION-REJECTION-MESSAGE';
          break;
      }
      return messageKey;
    }

   /** Method to set workflow details. */
   setWorkflowData(routerData: RouterData, action: string): ContributorBPMRequest {
    const data = new ContributorBPMRequest();
    // if (this.rejectDetailsForm.get('reasonForReject'))
    //   data.rejectionReason = this.rejectDetailsForm.get('reasonForReject').value;
    // if (this.validatorForm.get('comments')) data.comments = this.validatorForm.get('comments').value;
    // if (this.validatorForm.get('returnReason')) data.returnReason = this.validatorForm.get('returnReason').value;
    // if (this.validatorForm.get('penalty')) {
    //   if (this.validatorForm.get('penalty.english').value === 'No') data.penaltyIndicator = 0;
    //   else data.penaltyIndicator = 1;
    // }
    data.taskId = routerData.taskId;
    data.user = routerData.assigneeId;
    data.outcome = action;
    // data.isExternalComment =
      // this.Channel === Channel.GOSI_ONLINE && routerData.assignedRole === ValidatorRoles.VALIDATOR;
    return data;
  }

   /** Method to get workflow action. */
   getWorkflowAction(key: number): string {
    let action: string;
    switch (key) {
      case 0:
        action = WorkFlowActions.APPROVE;
        break;
      case 1:
        action = WorkFlowActions.REJECT;
        break;
    }
    return action;
  }




}
