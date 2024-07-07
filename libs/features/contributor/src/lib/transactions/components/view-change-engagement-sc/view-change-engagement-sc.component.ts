/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, OnDestroy, ElementRef, ViewChild, Inject } from '@angular/core';
import {
  AlertService,
  LookupService,
  DocumentService,
  TransactionService,
  Transaction,
  AuthTokenService,
  convertToStringDDMMYYYY,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  InspectionTypeEnum,
  InspectionReferenceType,
  DocumentItem
} from '@gosi-ui/core';
import { Router } from '@angular/router';
import moment from 'moment-timezone';
import { ContributorService, EstablishmentService } from '../../../shared/services';
import { ContributorConstants } from '../../../shared/constants';
import { DocumentTransactionId, DocumentTransactionType, ViolationRequest } from '../../../shared';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
@Component({
  selector: 'cnt-view-change-engagement-sc',
  templateUrl: './view-change-engagement-sc.component.html',
  styleUrls: ['./view-change-engagement-sc.component.scss']
})
export class ViewChangeEngagementScComponent implements OnInit, OnDestroy {
  
  
  /** Creates an instance of ViewAuthorizationScComponent. */
  constructor(
    readonly authTokenService: AuthTokenService,
    readonly contributorService: ContributorService,
    readonly alertService: AlertService,
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly router: Router,
    readonly transactionService: TransactionService,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {}
  transaction: Transaction;
  personId;
  referenceNo: number;
  nin: number;
  violationRequest;
  newEngagementDate: string;
  isIndividualApp = false;
  socialInsuranceNo : number;
  isPublic: boolean;
  registrationNo: number;
  documentsByteArray = [];
  fieldActivityNo: string;
  violationDetails: ViolationRequest;
  violationType: string;
  violationSubType
  documents: DocumentItem[];
  isModifyWage: boolean;
  requestId: number;



  /** Constants */
  ENGAGEMENT_INACTIVE = ContributorConstants.ENGAGEMENT_INACTIVE_STATUS;
  ENGAGEMENT_ACTIVE = ContributorConstants.ENGAGEMENT_ACTIVE_STATUS;
  ENGAGEMENT_CANCELLED = ContributorConstants.ENGAGEMENT_CANCELLED_STATUS;
  CANCEL_IN_PROGRESS = ContributorConstants.CANCEL_ENGAGEMENT_PROGRESS_STATUS;

  @ViewChild('custodyTextIframe')
  custodyTextIframe: ElementRef;

  /** Method to initialize the component. */
  ngOnInit(): void {
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
    this.isPublic = this.appToken === ApplicationTypeEnum.PUBLIC;
    this.nin = this.authTokenService.getIndividual();
    this.transaction = this.transactionService.getTransactionDetails();
    this.referenceNo = this.transaction.transactionRefNo;
    this.socialInsuranceNo = this.transaction.params.SIN;
    this.registrationNo = this.transaction.params.REGISTRATION_NO;
    this.requestId = this.transaction.params.VIOLATION_REQUEST_ID;
    this.isPublic ? this.getViolationDeatilsPublic() : this.getViolationDeatils();
  }

  /**  This method is to cancel validator edit transaction */
  getViolationDeatils() {
    this.contributorService.getViolationRequest(this.isIndividualApp ? this.nin : this.socialInsuranceNo, this.referenceNo, this.transaction.transactionId).subscribe(
      res => {
        this.violationRequest = res.violationRequest[0];
        this.violationDetails = res.violationRequest[0];
        this.getDocument();
        if (this.violationRequest.violationType.english === 'Modify Engagement') {
          this.newEngagementDate = convertToStringDDMMYYYY(
            moment(this.violationRequest.joiningDate.gregorian).toString()
          );
        } else {
          this.newEngagementDate = convertToStringDDMMYYYY(
            moment(this.violationRequest.joiningDate.gregorian).toString()
          );
        }
        
        this.getRasedDoc();
      },
      err => this.alertService.showErrorByKey(err.message)
    );
  }
  getDocument() {
    if (
      this.violationDetails?.violationType &&
      this.violationDetails?.violationType.english === 'Cancel Engagement'
    ) {
      this.violationType = DocumentTransactionId.CANCEL_ENGAGEMENT_VIOLATION;
      this.violationSubType = DocumentTransactionType.CANCEL_ENGAGEMENT_VIOLATION;
    } else if (
      this.violationDetails?.violationSubType &&
      this.violationDetails?.violationSubType.english === 'Modify Leaving Date'
    ) {
      this.violationType = DocumentTransactionId.CHANGE_ENGAGEMENT_VIOLATION;
      this.violationSubType = DocumentTransactionType.CHANGE_ENGAGEMENT_VIOLATION_LEAVING_DATE;
    } else if (
      this.violationDetails?.violationSubType &&
      this.violationDetails?.violationSubType.english === 'Modify Joining Date'
    ) {
      this.violationType = DocumentTransactionId.CHANGE_ENGAGEMENT_VIOLATION;
      this.violationSubType = DocumentTransactionType.CHANGE_ENGAGEMENT_VIOLATION_JOINING_DATE;
    } else if (
      this.violationDetails?.violationType &&
      this.violationDetails?.violationType.english === 'Terminate Engagement'
    ) {
      this.violationType = DocumentTransactionId.TERMINATE_ENGAGEMENT_VIOLATION;
      this.violationSubType = DocumentTransactionType.TERMINATE_ENGAGEMENT_VIOLATION;
    } else if (
      this.violationDetails?.violationType &&
      this.violationDetails?.violationSubType.english === 'Modify Wage And Occupation'
    ) {
      this.isModifyWage = true;
      this.violationType = DocumentTransactionId.CHANGE_ENGAGEMENT_VIOLATION;
      this.violationSubType = DocumentTransactionType.CHANGE_ENGAGEMENT_VIOLATION_UPDATE_WAGE;
    }
    if (this.violationType) {
      this.getDocuments(this.violationType, this.violationSubType, this.requestId, this.referenceNo).subscribe();
    }
  }

  /** this method is to get violation details in gol  */ 
  getViolationDeatilsPublic(){
    this.contributorService.getViolationRequestPublic(this.registrationNo , this.socialInsuranceNo).subscribe(
      res => {
        this.violationRequest = res.violationRequest[0];
        this.violationDetails = res.violationRequest[0];
        this.getDocument()
        this.getRasedDoc();
      },
      err => this.alertService.showErrorByKey(err.message)
    );
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

  /** Method to get documents for the transaction. */
  getDocuments(
    transactionId: string,
    transactionType: string | string[],
    identifier: number,
    referenceNo: number
  ): Observable<DocumentItem[]> {
    return this.documentService.getDocuments(transactionId, transactionType, identifier, referenceNo).pipe(
      tap(res => {
        this.documents = res.filter(item => item.documentContent !== null);
      })
    );
  }

  /** Method to clear alerts  */
  ngOnDestroy() {
    this.alertService.clearAllErrorAlerts();
  }

  
}
