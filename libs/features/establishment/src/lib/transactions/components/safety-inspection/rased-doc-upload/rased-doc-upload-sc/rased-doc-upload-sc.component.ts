import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  CommonIdentity,
  Contributor,
  DocumentItem,
  DocumentService,
  RouterConstants,
  TransactionService,
  getIdentityByType
} from '@gosi-ui/core';
import {
  AddEstablishmentService,
  ContributorDocumentList,
  DocumentTransactionTypeEnum,
  EstablishmentQueryKeysEnum,
  EstablishmentService,
  EstablishmentTransEnum,
  InspectionDecisionNameEnum,
  InspectionDetails,
  OHRate,
  RequiredUploadDocumentsResponse,
  SafetyInspectionService
} from '@gosi-ui/features/establishment/lib/shared';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TransactionsBaseScComponent } from '../../../../base/transactions-base-sc.component';

@Component({
  selector: 'est-rased-doc-upload-sc',
  templateUrl: './rased-doc-upload-sc.component.html',
  styleUrls: ['./rased-doc-upload-sc.component.scss']
})
export class RasedDocUploadScComponent extends TransactionsBaseScComponent implements OnInit {
  inspectionId: number;
  OHRateDetails: OHRate;
  inspectionDetails: InspectionDetails;
  fieldActivityNo: string;
  documentReferenceNo: string;
  uploadDocumentsDetails: RequiredUploadDocumentsResponse;
  contributors: Contributor[];
  documents: DocumentItem[];
  contributorsMap: Map<number, { documents: DocumentItem[]; identity: string }> = new Map();
  translateFromModule = 'ESTABLISHMENT.';
  sinNo: number;
  contributorDocs: ContributorDocumentList[];
  estContributor: number;
  notRegisteredContributor: boolean;
  registeredContributor: boolean;

  constructor(
    readonly documentService: DocumentService,
    readonly route: ActivatedRoute,
    readonly alertService: AlertService,
    readonly establishmentService: EstablishmentService,
    readonly transactionService: TransactionService,
    readonly location: Location,
    readonly router: Router,
    readonly addEstService: AddEstablishmentService,
    readonly ohService: SafetyInspectionService,
    readonly safetyInspectionService: SafetyInspectionService
  ) {
    super(establishmentService, transactionService, alertService, addEstService, documentService, router);
    this.documentTransactionKey = DocumentTransactionTypeEnum.RASED_DOCUMENT_UPLOAD;
    this.documentTransactionType = DocumentTransactionTypeEnum.RASED_DOCUMENT_UPLOAD;
    this.tnxId = EstablishmentTransEnum.RASED_DOCUMENT_UPLOAD;
  }

  ngOnInit(): void {
    this.getTransactionData();
    if (this.estRegNo) {
      this.getEstablishmentDetails(this.estRegNo);
      this.getEstablishmentInspectionDetail(this.inspectionRefNo);
    } else {
      this.router.navigate([RouterConstants.ROUTE_INBOX]);
    }
  }

  getEstablishmentInspectionDetail(inspectionRefNo: string) {
    this.safetyInspectionService
      .getEstablishmentInspectionDetails(this.estRegNo, [
        {
          queryKey: EstablishmentQueryKeysEnum.INSPECTION_REFERENCE_NUMBER,
          queryValue: inspectionRefNo
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
          return this.safetyInspectionService.getRequiredUploadDocuments(this.estRegNo, [
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
          this.contributorDocs = [];
          this.uploadDocumentsDetails?.contributors.forEach(res => {
            this.getUploadedContibutorDocuments(
              this.documentTransactionKey,
              this.documentTransactionType,
              Number(res),
              this.referenceNo
            );
          });
          return this.documentService.getDocuments(
            this.documentTransactionKey,
            this.documentTransactionType,
            this.estRegNo,
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

  getUploadedContibutorDocuments(
    transactionKey: string,
    transactionType: string,
    registrationNo: number,
    referenceNo: number
  ) {
    this.documentService.getDocuments(transactionKey, transactionType, registrationNo, referenceNo).subscribe(res => {
      const documentList = res?.filter(item => item?.documentContent != null);
      this.contributorDocs.push({ documentList: documentList });
    });
  }
}
