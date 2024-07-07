import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup,Validators} from '@angular/forms';
import { AlertService, ApplicationTypeToken, BilingualText,
   DocumentService, getPersonNameAsBilingual, InspectionReferenceType,
    InspectionService, InspectionTypeEnum, LookupService, Role, RouterConstants,
     RouterDataToken, TransactionService,
   WorkFlowActions, WorkflowService
   } from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ContributorConstants } from '../../../shared';
import { DocumentTransactionId, DocumentTransactionType } from '../../../shared/enums';
import { Contributor, ContributorBPMRequest, EngagementDetails, ViolationRequest } from '../../../shared/models';
import { ContractAuthenticationService, ContributorService, EngagementService, EstablishmentService, ManageWageService } from '../../../shared/services';
import {
  RouterData,
} from '@gosi-ui/core';
import { TransactionBaseScComponent } from '../shared/base/transaction-base-sc/transaction-base-sc.component';

@Component({
  selector: 'cnt-e-inspection-sc',
  templateUrl: './e-inspection-sc.component.html',
  styleUrls: ['./e-inspection-sc.component.css']
})
export class EInspectionScComponent extends TransactionBaseScComponent   implements OnInit {

  //Local Variables
  canApprove = false;
  contributorType: string;
  isReInspection = false;
  showInspectDocument = false;
  violationDetails: ViolationRequest;
  formSubmissionDate: Date;
  requestId: number;
  engagementDetails: EngagementDetails;
  violationType: string;
  violationSubType: string;
  documentsByteArray = [];
  previousOutcome: string;
  personName: BilingualText;
  fieldActivityNo: string;
  customActions: WorkFlowActions[] = [];
  isModifyWage=false;
  canEdit =false;
  /** Method to initialize ValidatorEInspectionScComponent. */
  constructor(
    readonly contractAuthenticationService: ContractAuthenticationService,
    readonly router: Router,
    readonly lookupService: LookupService,
    readonly alertService: AlertService,
    readonly establishmentService: EstablishmentService,
    readonly contributorService: ContributorService,
    readonly engagementService: EngagementService,
    readonly modalService: BsModalService,
    readonly documentService: DocumentService,
    readonly inspectionService: InspectionService,
    readonly workflowService: WorkflowService,
    readonly transactionService: TransactionService,
    readonly manageWageService: ManageWageService,
    readonly contractService: ContractAuthenticationService,
    readonly fb: FormBuilder,


    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(RouterDataToken) readonly routerData: RouterData,
  ) {
    super(
      contributorService,
      establishmentService,
      engagementService,
      lookupService,
      documentService,
      transactionService,
      alertService,
      router
    );
  }



  /** This method handles the initialization tasks.*/
  ngOnInit() {
    super.getTransactionDetails();
    this.alertService.clearAlerts();
    // this.getDefaultLookupValues();
    // this.initializeParameters();




    if (this.referenceNo) {
      this.getViolationData();
      this.getContributorData();
      this.getEngagmentDetails();
    };
  }




  /** Method to get inspection status. */
  isValidatorInspection(assignedRole: string) {
    return (
      (this.routerData.resourceType === 'Violate engagement') &&
      assignedRole &&
      assignedRole === Role.VALIDATOR_1
    );
  }

  /**
   * This methode is to know whther inspection done or not
   * If done show reject and approve button for
   */
  getInspectionTask() {
    const inspectionStatus = this.isValidatorInspection(this.routerData.assignedRole);
    if (this.customActions.length <= 2) {
      // this.canReturn = true;
      this.isReInspection = false;
    }
    else if (inspectionStatus) {
      // this.canReject = true;
      this.canApprove = true;
      this.showInspectDocument = true;
      //second time the request inspection button name change to requestreinspection. and button only for Val1
      this.isReInspection = true;
      if (this.violationDetails?.violationType?.english !== 'Cancel Engagement') {
        // this.canEdit = true;
      }
    }
    if (
      inspectionStatus ||
      (this.routerData.assignedRole &&
        this.routerData.assignedRole === Role.VALIDATOR_2 &&
        this.previousOutcome === WorkFlowActions.SUBMIT)
    ) {
      this.getRasedDoc();
    }
  }

  /** Method to get Rased Documents */
  getRasedDoc() {
    this.documentService
      .getRasedDocuments(
        InspectionTypeEnum.EMPLOYEE_AFFAIRS,
        this.socialInsuranceNo,
        InspectionReferenceType.CONTRIBUTOR,
        this.fieldActivityNo
      )
      .subscribe(res => (this.documentsByteArray = res));
  }

  /** Method to Combine Documents uploaded by est admin and rased docs */
  getCombinedDocuments(documentsByteArray, documents) {
    if (documentsByteArray && documents) {
      return documentsByteArray.concat(documents);
    }
  }

  /** Method to initialize edit mode data */
  initializeParameters() {
    this.readDataFromToken(this.routerData);

  }

  /** Method to read data from token. */
  readDataFromToken(token: RouterData) {
    if (token.payload) {
      const payload = JSON.parse(token.payload);
      if (payload.registrationNo) this.registrationNo = payload.registrationNo;
      if (payload.socialInsuranceNo) this.socialInsuranceNo = payload.socialInsuranceNo;
      if (payload.requestId) this.requestId = payload.requestId;
      if (payload.referenceNo) this.referenceNo = payload.referenceNo;
      if (payload.previousOutcome) this.previousOutcome = payload.previousOutcome;
      if (token.customActions) this.customActions = token.customActions;
      //Set validator types
      if (this.routerData.assignedRole && this.routerData.assignedRole === Role.VALIDATOR_1) {
        this.isReInspection = false;
        this.showInspectDocument = true;
        // this.canReturn = false;
      } else if (this.routerData.assignedRole && this.routerData.assignedRole === Role.VALIDATOR_2) {
        // this.canReturn = true;
        // this.canReject = true;
        this.canApprove = true;
        this.isReInspection = false;
        this.showInspectDocument = false;
      }
    }
    // this.comments = token.comments;
  }

  /** Method to get field activity number. */
  getInspectionFieldActivityNumber() {
    return this.inspectionService.getInspectionByTransactionId(this.referenceNo, this.socialInsuranceNo).pipe(
      tap(res => {
        if (res && res.length > 0) this.fieldActivityNo = res[0].fieldActivityNumber;
      })
    );
  }

  /* Method to get the violation data */
  getViolationData() {
    forkJoin([
      this.contractAuthenticationService.getViolationRequest(this.registrationNo, this.transaction.params.VIOLATION_REQUEST_ID),
      // this.getInspectionFieldActivityNumber()
    ]).subscribe(
      ([data]) => {
        this.violationDetails = data;
        this.getInspectionTask();
        this.engagementId = data['engagementId'];
        if (
          this.violationDetails.violationType &&
          this.violationDetails.violationType.english === 'Cancel Engagement'
        ) {
          this.violationType = DocumentTransactionId.CANCEL_ENGAGEMENT_VIOLATION;
          this.violationSubType = DocumentTransactionType.CANCEL_ENGAGEMENT_VIOLATION;
        } else if (
          this.violationDetails.violationSubType &&
          this.violationDetails.violationSubType.english === 'Modify Leaving Date'
        ) {
          this.violationType = DocumentTransactionId.CHANGE_ENGAGEMENT_VIOLATION;
          this.violationSubType = DocumentTransactionType.CHANGE_ENGAGEMENT_VIOLATION_LEAVING_DATE;
        } else if (
          this.violationDetails.violationSubType &&
          this.violationDetails.violationSubType.english === 'Modify Joining Date'
        ) {
          this.violationType = DocumentTransactionId.CHANGE_ENGAGEMENT_VIOLATION;
          this.violationSubType = DocumentTransactionType.CHANGE_ENGAGEMENT_VIOLATION_JOINING_DATE;
        } else if (
          this.violationDetails.violationType &&
          this.violationDetails.violationType.english === 'Terminate Engagement'
        ) {
          this.violationType = DocumentTransactionId.TERMINATE_ENGAGEMENT_VIOLATION;
          this.violationSubType = DocumentTransactionType.TERMINATE_ENGAGEMENT_VIOLATION;
        } else if (
          this.violationDetails.violationType &&
          this.violationDetails.violationSubType.english === 'Modify Wage And Occupation'
        ) {
          this.isModifyWage = true;
          this.violationType = DocumentTransactionId.CHANGE_ENGAGEMENT_VIOLATION;
          this.violationSubType = DocumentTransactionType.CHANGE_ENGAGEMENT_VIOLATION_UPDATE_WAGE;
        }
        if (this.violationType && this.violationSubType) {
          this.getDocuments(this.violationType, this.violationSubType, this.transaction.params.VIOLATION_REQUEST_ID, this.referenceNo).subscribe();
        }
        this.getData();
      },
      err => {
        if (err.error) {
          this.alertService.showError(err.error.message);
        }
      }
    );
  }

  /* Method to get contributor and engagement data */
  getData() {
    if (this.registrationNo && this.socialInsuranceNo && this.engagementId) {
      this.getContributorData();
      this.getEngagmentDetails();
    }
  }

  /** This method is to get contibutor details    */
  getContributorData() {
    this.contributorService.getContributor(this.registrationNo, this.socialInsuranceNo).subscribe(
      (res: Contributor) => {
        this.contributor = res;
        this.contributorType = res.contributorType;
        this.getEstablishmentData();
      },
      err => {
        if (err.error) {
          this.alertService.showError(err.error);
        }
      }
    );
  }

  /** This method is to get establishment details */
  getEstablishmentData() {
    this.establishmentService.getEstablishmentDetails(this.registrationNo).subscribe(
      response => (this.establishment = response),
      err => this.alertService.showError(err.error.message, err.error.details)
    );
  }

  /** This method to get engagment  details.*/
  getEngagmentDetails() {
    this.engagementService
      .getEngagementDetails(this.registrationNo, this.socialInsuranceNo, this.engagementId)
      .pipe(
        tap(res => {
          this.formSubmissionDate = res.formSubmissionDate?.gregorian;
          this.engagementDetails = res;
        })
      )
      .subscribe();
  }

  /** Method to handle e-inspection actions. */
  handleEInspectionActions(key: number) {
    this.saveWorkflow(this.setWorkflowData(this.routerData, this.getWorkflowAction(key)));
    this.hideModal();
  }

  /** Method to save workflow details. */
  saveWorkflow(data: ContributorBPMRequest) {
    this.workflowService.updateTaskWorkflow(data).subscribe(
      res => {
        if (res) {
          this.showSucccessMessage(data);
        }
      },
      err => this.alertService.showError(err.error.message)
    );
  }

  /** Method to show success message. */
  showSucccessMessage(data) {
    if (data.outcome !== WorkFlowActions.SEND_FOR_INSPECTION) {
      this.alertService.showSuccessByKey(super.getSuccessMessage(data.outcome), null, 5);
    } else {
      let message: string;
      const transactionId = this.routerData.transactionId;
      if (this.violationDetails?.violationType?.english === 'Cancel Engagement') {
        message = ContributorConstants.VALIDATOR_SEND_FOR_INSPECTION_CANCEL;
      } else if (this.violationDetails?.violationType?.english === 'Modify Engagement') {
        message = ContributorConstants.VALIDATOR_SEND_FOR_INSPECTION_MODIFY;
      } else if (this.violationDetails?.violationType?.english === 'Terminate Engagement') {
        message = ContributorConstants.VALIDATOR_SEND_FOR_INSPECTION_TERMINATE;
      }

      this.personName = getPersonNameAsBilingual(this.contributor?.person?.name);
      this.personName.english = this.personName.english ?? this.personName.arabic;
      const params = {
        personFullName: this.personName,
        transactionId: transactionId
      };
      this.alertService.showSuccessByKey(message, params, 5);
    }
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }

  /** Method to decline reject / return pop up. */
  decline(): void {
    this.modalRef.hide();
    this.validatorForm.markAsUntouched();
    this.validatorForm.markAsPristine();
  }

  /** Methode to request for inspection functionality */
  requestInspection() {
    this.inspectionService.getInspectionList(this.registrationNo, this.socialInsuranceNo, true).subscribe(
      res => {
        if (res.length > 0) this.showErrorMessage();
        else this.saveWorkflow(this.setWorkflowData(this.routerData, WorkFlowActions.SEND_FOR_INSPECTION));
      },
      err => this.alertService.showError(err.error.message)
    );
  }

  /** Method to show inspection already in progress erro message. */
  showErrorMessage() {
    const message = ContributorConstants.VALIDATOR_CANNOT_SEND_FOR_INSPECTION;
    const transactionId = this.routerData.transactionId;
    this.personName = getPersonNameAsBilingual(this.contributor?.person?.name);
    this.personName.english = this.personName.english ?? this.personName.arabic;
    const params = {
      personFullName: this.personName,
      transactionId: transactionId
    };
    this.alertService.showErrorByKey(message, params, 5);
  }

  /**Method to return to inbox */
  confirmCancel() {
    this.router.navigateByUrl(RouterConstants.ROUTE_INBOX);
  }

  /** This method is used to navigate to csr view on clicking of edit icon */
  navigateToCsrView(tabIndex: number) {
    this.router.navigate([`home/authenticate-contributor/edit/${tabIndex}`]);
  }

  /** This method is used to navigate to modify engagement */
  navigateToModifyEngagement() {
    this.router.navigate([`home/contributor/validator/modify-violation`]);
  }
}