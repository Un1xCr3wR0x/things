/**
 * ~ Copyright GOSI. All Rights Reserved.
  ~  This software is the proprietary information of GOSI.
  ~  Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  Contributor,
  DocumentItem,
  DocumentService,
  EstablishmentRouterData,
  EstablishmentToken,
  LookupService,
  scrollToTop,
  WorkFlowActions,
  WorkflowService
} from '@gosi-ui/core';
import {
  ChangeEstablishmentService,
  ChangeGroupEstablishmentService,
  DocumentTransactionIdEnum,
  DocumentTransactionTypeEnum,
  EstablishmentConstants,
  EstablishmentQueryKeysEnum,
  EstablishmentService,
  InspectionDecisionNameEnum,
  InspectionDetails,
  isDocumentsValid,
  RequiredUploadDocumentsResponse,
  SafetyInspectionService
} from '@gosi-ui/features/establishment/lib/shared';
import { BsModalService } from 'ngx-bootstrap/modal';
import { switchMap } from 'rxjs/operators';
import { ValidatorScBaseComponent } from '../../../base/validator-sc.base-component';

@Component({
  selector: 'est-rased-request-document-sc',
  templateUrl: './rased-request-document-sc.component.html',
  styleUrls: ['./rased-request-document-sc.component.scss']
})
export class RasedRequestDocumentScComponent extends ValidatorScBaseComponent implements OnInit {
  accordionPanel = 0;
  referenceNo: number;
  registrationNo: number;
  inspectionId: number;
  inspectionDetails: InspectionDetails;
  contributors: Contributor[];
  contributorsMap: Map<number, { documents: DocumentItem[]; identity: string }> = new Map();
  translateFromModule = 'ESTABLISHMENT.';
  uploadDocumentsDetails: RequiredUploadDocumentsResponse;
  documentTransactionId = DocumentTransactionIdEnum.RASED_DOCUMENT_UPLOAD;
  documentTransactionKey = DocumentTransactionTypeEnum.RASED_DOCUMENT_UPLOAD;
  documentTransactionType = DocumentTransactionTypeEnum.RASED_DOCUMENT_UPLOAD;
  isDocumentsValid: boolean;
  fieldActivityNo: string;
  documentReferenceNo: string;
  estContributor: number;
  notRegisteredContributor: boolean;
  registeredContributor: boolean;

  constructor(
    readonly lookupService: LookupService,
    readonly workflowService: WorkflowService,
    readonly establishmentService: EstablishmentService,
    readonly fb: FormBuilder,
    readonly documentService: DocumentService,
    readonly modalService: BsModalService,
    readonly changeEstService: ChangeEstablishmentService,
    readonly changeGroupEstService: ChangeGroupEstablishmentService,
    readonly alertService: AlertService,
    readonly router: Router,
    @Inject(EstablishmentToken) readonly estRouterData: EstablishmentRouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly location: Location,
    readonly safetyInspectionService: SafetyInspectionService
  ) {
    super(
      lookupService,
      changeEstService,
      establishmentService,
      alertService,
      documentService,
      fb,
      workflowService,
      modalService,
      appToken,
      estRouterData,
      router
    );
  }

  ngOnInit(): void {
    scrollToTop();
    if (this.estRouterData.registrationNo && this.estRouterData.registrationNo && this.estRouterData.inspectionId) {
      this.initialiseView();
    } else {
      this.router.navigate([EstablishmentConstants.ROUTE_TO_INBOX(this.appToken)]);
    }
  }

  /**
   *  Method to initialise the view for showing Owner details and comments
   * @param referenceNumber
   */
  initialiseView() {
    this.referenceNo = this.estRouterData.referenceNo;
    this.registrationNo = this.estRouterData.registrationNo;
    this.inspectionId = this.estRouterData.inspectionId;
    this.getEstablishmentDetails(this.registrationNo);
    this.getEstablishmentInspectionDeatils(this.inspectionId);
  }

  /**
   * method to get the OH details of an establishment
   * @param registrationNo
   */
  getEstablishmentInspectionDeatils(inspectionId: number) {
    this.safetyInspectionService
      .getEstablishmentInspectionDetails(this.registrationNo, [
        {
          queryKey: EstablishmentQueryKeysEnum.INSPECTION_ID,
          queryValue: inspectionId
        }
      ])
      .pipe(
        switchMap(inspectionRes => {
          this.inspectionDetails = inspectionRes;
          this.documentReferenceNo = this.inspectionDetails?.inspectionDecision?.find(
            decision => decision.name === InspectionDecisionNameEnum.DOCUMENT_REFERENCE_NO
          )?.value;
          this.fieldActivityNo = this.inspectionDetails?.inspectionDecision?.find(
            decision => decision.name === InspectionDecisionNameEnum.FIELD_ACTIVITY_NO
          )?.value;
          return this.safetyInspectionService.getRequiredUploadDocuments(this.registrationNo, [
            {
              queryKey: EstablishmentQueryKeysEnum.FIELD_ACTIVITY_NO,
              queryValue: this.fieldActivityNo
            },
            {
              queryKey: EstablishmentQueryKeysEnum.DOCUMENT_REFERENCE_NO,
              queryValue: this.documentReferenceNo
            },
            {
              queryKey: EstablishmentQueryKeysEnum.REFERENCE_NUMBER,
              queryValue: this.referenceNo
            }
          ]);
        }),

        switchMap(requiredUploadDocumentsResponse => {
          this.uploadDocumentsDetails = requiredUploadDocumentsResponse;
          return this.documentService.getDocuments(
            this.documentTransactionKey,
            this.documentTransactionType,
            this.registrationNo,
            this.referenceNo,
            null,
            null
          );
        })
      )
      .subscribe(
        docs => {
          this.documents = docs;
          this.uploadDocumentsDetails.contributors.forEach(contributor => {
            if (contributor?.partyId) {
              this.notRegisteredContributor = true;
              this.estContributor = contributor?.partyId;
              this.contributorsMap.set(contributor?.partyId, {
                documents: docs.map(doc => {
                  const docItem = new DocumentItem();
                  return docItem.fromJsonToObject(doc);
                }),
                identity: 'CONTRIBUTOR.SOCIAL-INSURANCE-NO'
              });
            }
            else {
              this.registeredContributor = true;
              this.estContributor = contributor?.nationalId;
              this.contributorsMap.set(contributor?.nationalId, {
                documents: docs.map(doc => {
                  const docItem = new DocumentItem();
                  return docItem.fromJsonToObject(doc);
                }),
                identity: 'CUSTOMER-INFORMATION.NIN/IQAMA'
              });
            }
          });
        },
        err => {
          this.alertService.showError(err?.error?.message);
        }
      );
  }

  /**
   * method to navigate to back page
   */
  navigateBack() {
    this.location.back();
  }

  /**
   * Method to navigate back
   */
  cancelModal() {
    this.alertService.clearAlerts();
    this.hideModal();
    this.navigateBack();
  }

  /**
   *Method to submit the transaction
   */
  submitTransaction() {
    this.alertService.clearAlerts();
    this.isDocumentsValid = true;
    this.contributorsMap.forEach(contributor => {
      if (!isDocumentsValid(contributor.documents)) {
        this.isDocumentsValid = false;
      }
    });
    if (this.isDocumentsValid) {
      this.safetyInspectionService
        .saveUploadedDocuments(this.registrationNo, this.fieldActivityNo, this.uploadDocumentsDetails.contributors, this.referenceNo)
        .pipe()
        .subscribe(
          feedBackMsg => {
            this.updateBpmTransaction(this.estRouterData, '', WorkFlowActions.APPROVE).subscribe(
              () => {
                this.estRouterData.resetRouterData();
                this.alertService.showSuccess(feedBackMsg);
                this.router.navigate([EstablishmentConstants.ROUTE_TO_INBOX(this.appToken)]);
              },
              err => {
                this.alertService.showError(err.error.message);
              }
            );
          },
          err => {
            this.alertService.showError(err.error.message);
          }
        );
    } else {
      this.alertService.showMandatoryDocumentsError();
    }
  }

  /**
   * Method to open the owner accordion
   * @param openEvent
   * @param tabIndex
   */
  selectPanel(openEvent: boolean, tabIndex: number) {
    if (openEvent === true) {
      this.accordionPanel = tabIndex;
    }
  }
}
