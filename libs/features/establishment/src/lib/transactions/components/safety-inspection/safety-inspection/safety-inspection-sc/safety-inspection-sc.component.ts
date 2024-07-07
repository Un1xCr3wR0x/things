import { Location } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  Channel,
  DocumentItem,
  DocumentService,
  EstablishmentRouterData,
  EstablishmentToken,
  LanguageToken,
  Lov,
  LovList,
  RouterConstants,
  TransactionService,
  bindToObject
} from '@gosi-ui/core';
import {
  AddEstablishmentService,
  DocumentTransactionTypeEnum,
  EstablishmentQueryKeysEnum,
  EstablishmentService,
  EstablishmentTransEnum,
  InspectionDecisionNameEnum,
  InspectionDetails,
  OHQueryParam,
  OHRate,
  OHRateHistory,
  RasedDoc,
  SafetyCheckData,
  SafetyCheckListQuestionare,
  SafetyInspectionConstants,
  SafetyInspectionService,
  ScFullChecklistDcComponent,
  TimelineColourEnum
} from '@gosi-ui/features/establishment/lib/shared';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { TransactionsBaseScComponent } from '../../../../base/transactions-base-sc.component';

@Component({
  selector: 'est-safety-inspection-sc',
  templateUrl: './safety-inspection-sc.component.html',
  styleUrls: ['./safety-inspection-sc.component.scss']
})
export class SafetyInspectionScComponent extends TransactionsBaseScComponent implements OnInit {
  private _baseRate: number;
  private _ohRateDetails: OHRate;
  OHCurrentRateDetails: OHRate;
  private _ohRateHistoryColorMap: Map<number, string> = new Map();
  delataValue: Map<string, number> = SafetyInspectionConstants.DELTA_VALUES();
  timelineColourMap: Map<string, TimelineColourEnum> = new Map([
    ['min', TimelineColourEnum.GREEN],
    ['medium', TimelineColourEnum.ORANGE],
    ['max', TimelineColourEnum.RED]
  ]);
  pageSize = 5;
  currentPage = 0;
  loadedHistoryData: OHRateHistory[] = [];
  inspectionDetails: InspectionDetails;
  contributionList: LovList = null;
  recommendation = '';
  inspectionId: number;
  lang: string;
  documentTransactionKey1 = '';
  documentTransactionType2 = '';
  documents: DocumentItem[];
  rasedDocs: RasedDoc[];
  isSafetyTransaction: boolean;
  estData: SafetyCheckData;
  modalRef: BsModalRef;
  checkList: SafetyCheckListQuestionare;
  isSelfEvaluation = false;

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
    @Inject(EstablishmentToken) readonly estRouterData: EstablishmentRouterData,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly modalService: BsModalService
  ) {
    super(establishmentService, transactionService, alertService, addEstService, documentService, router);
    this.documentTransactionKey = DocumentTransactionTypeEnum.SAFETY_INSPECION_CHECK;
    this.documentTransactionType = DocumentTransactionTypeEnum.SAFETY_INSPECTION_LETTER;
    this.documentTransactionKey1 = DocumentTransactionTypeEnum.SAFETY_INSPECION_CHECK;
    this.documentTransactionType2 = DocumentTransactionTypeEnum.SAFETY_INSPECION_CHECK;
    this.tnxId = EstablishmentTransEnum.SAFETY_INSPECTION_TRANSACTION;
  }

  ngOnInit(): void {
    this.getTransactionData();
    if (this.estRegNo) {
      this.getEstablishmentDetails(this.estRegNo);
      this.getCurrentEstablishmentOHRate();
      if (
        this.channel === Channel.RASED_SAFETY ||
        (this.channel === Channel.BATCH &&
          this.transaction?.transactionId === EstablishmentTransEnum.SAFETY_INSPECTION_TRANSACTION)
      ) {
        this.getEstablishmentOHRate();
        // this.getCurrentEstablishmentOHRate();
        this.isSafetyTransaction = true;
        this.documentList = [];
        this.getInspectionDocs();
        this.getReInspectionDocs();
        this.getRasedDoc();
        if (this.channel === Channel.BATCH) this.getSafetyCheckDocs();
      }
      if (this.channel === Channel.TAMINATY_BUSINESS) this.getSafetyCheckDocs();
      if (this.transaction?.transactionId === EstablishmentTransEnum.SC_EVALUATION_TRANSACTION) {
        this.tnxId = EstablishmentTransEnum.SC_EVALUATION_TRANSACTION;
        this.getSCSelfEvaluationData(this.estRegNo, this.transaction?.transactionRefNo, true);
      }
    } else {
      this.router.navigate([RouterConstants.ROUTE_INBOX]);
    }
    this.language.subscribe(language => {
      this.lang = language;
    });
  }

  //method to fetch the current oh percentage of the establishment

  getCurrentEstablishmentOHRate() {
    const ohParamQuery = new OHQueryParam();
    ohParamQuery.excludeHistory = false;
    if (
      !this.inspectionId &&
      this.transaction?.transactionId === EstablishmentTransEnum.SAFETY_INSPECTION_TRANSACTION
    ) {
      ohParamQuery.screferenceNumber = this.transaction?.transactionRefNo;
    }
    this.ohService.getEstablishmentOHRate(this.estRegNo, ohParamQuery).subscribe(
      response => {
        this.OHCurrentRateDetails = response;
        if (this.OHCurrentRateDetails?.scSelfEvaluationTransactionId && !this.OHCurrentRateDetails?.inspectionId) {
          this.getSCSelfEvaluationData(this.estRegNo, this.OHCurrentRateDetails?.scSelfEvaluationTransactionId, true);
        }
      },
      err => {
        if (err.error) {
          this.showErrorMessage(err);
        }
      }
    );
  }

  //same method is called to fetch oh details of the establishment in inprogress and complete state

  getEstablishmentOHRate() {
    const ohQuery = new OHQueryParam();
    ohQuery.excludeHistory = false;
    ohQuery.referenceNumber = this.referenceNo;
    ohQuery.getTxnDetails = true;
    this.ohService.getEstablishmentOHRate(this.estRegNo, ohQuery).subscribe(
      response => {
        this.OHRateDetails = response;
        if (response.inspectionId) this.getEstablishmentInspectionDetail(response.inspectionId);
        const items = this.OHRateDetails.applicableRates?.map((rate, i) => {
          const lov = new Lov();
          lov.value.english = rate + '%';
          lov.value.arabic = '%' + rate;
          lov.sequence = i;
          return lov;
        });
        this.contributionList = new LovList(items);
      },
      err => {
        if (err.error) {
          this.showErrorMessage(err);
        }
      }
    );
  }

  //method to fetch the oh history of the establishment

  getEstablishmentInspectionDetail(inspectionId: number) {
    this.ohService
      .getEstablishmentInspectionDetails(this.estRegNo, [
        {
          queryKey: EstablishmentQueryKeysEnum.INSPECTION_ID,
          queryValue: inspectionId
        }
      ])
      .subscribe(
        inspectionRes => {
          this.inspectionDetails = inspectionRes;
          this.recommendation =
            this.inspectionDetails?.inspectionDecision?.filter(
              decision => decision.name === InspectionDecisionNameEnum.SAFETY_CHECK_DECISION_TYPE
            )[0]?.comments || '';
        },
        err => {
          this.alertService.showError(err?.error?.message);
        }
      );
  }

  @Input() set OHRateDetails(OHRateDetails: OHRate) {
    this._baseRate = OHRateDetails?.baseRate;
    this._ohRateDetails = OHRateDetails;
    if (OHRateDetails?.ohRateHistory?.length > 0) {
      this.loadedHistoryData = [];
      this.loadMore({ currentPage: 0, pageSize: this.pageSize });
      OHRateDetails?.ohRateHistory?.forEach((history, index) => {
        this._ohRateHistoryColorMap.set(
          index,
          history?.contributionPercentage - this._baseRate === this.delataValue.get('min')
            ? this.timelineColourMap.get('min')
            : history?.contributionPercentage - this._baseRate === this.delataValue.get('medium')
            ? this.timelineColourMap.get('medium')
            : this.timelineColourMap.get('max')
        );
      });
    }
  }
  get OHRateDetails() {
    return this._ohRateDetails;
  }

  get baseRate() {
    return this._baseRate;
  }

  get ohRateHistoryColorMap() {
    return this._ohRateHistoryColorMap;
  }
  /**
   * Method to load more items in view
   * @param event
   */
  loadMore(event: { currentPage: number; pageSize: number }) {
    this.currentPage = event.currentPage;
    const currentIndex = event.currentPage * event.pageSize;
    this.loadedHistoryData.push(
      ...this.OHRateDetails?.ohRateHistory?.slice(currentIndex, currentIndex + event.pageSize)
    );
  }

  //method to fetch the oh document received at email after the oh percentage is changed

  getInspectionDocs() {
    this.getUploadedRasedDocuments(
      this.documentTransactionKey,
      this.documentTransactionType,
      this.estRegNo,
      this.referenceNo
    );
  }

  //method to fetch the oh document received from rased

  getRasedDoc() {
    this.ohService
      .getRasedDoc(this.estRegNo)
      .pipe(
        switchMap(doc => {
          this.rasedDocs = doc.filter(d => d['documentUrl'] !== '.pdf');
          return forkJoin(
            this.rasedDocs.map(rasedDoc => {
              return this.ohService.getDocumentByteArray(rasedDoc.documentUrl).pipe(
                map(docByte => {
                  return bindToObject(new DocumentItem(), {
                    documentContent: docByte?.docByte,
                    name: rasedDoc?.documentName,
                    fileName: rasedDoc?.documentName
                  });
                })
              );
            })
          );
        })
      )
      .subscribe(
        res => {
          this.documents = res;
          this.documentList = this.documentList.concat(res);
        },
        err => {
          this.alertService.showError(err?.error?.message);
        }
      );
  }

  //method to fetch the re-inspection docs

  getReInspectionDocs() {
    this.getUploadedRasedDocuments(
      this.documentTransactionKey1,
      this.documentTransactionType2,
      this.estRegNo,
      this.referenceNo
    );
  }

  getUploadedRasedDocuments(
    transactionKey: string,
    transactionType: string,
    registrationNo: number,
    referenceNo: number
  ) {
    this.documentService.getDocuments(transactionKey, transactionType, registrationNo, referenceNo).subscribe(res => {
      res.forEach(item => {
        if (item.documentContent != null) {
          this.documentList.push(item);
        }
      });
    });
  }
  getSCSelfEvaluationData(
    registrationNo: number,
    safetyCheckTransactionId: number,
    getTransactionSpecificData = false
  ) {
    this.ohService.getSafetyCheckList(registrationNo).subscribe(
      res => {
        this.checkList = res;
        this.getEstData(registrationNo, safetyCheckTransactionId, getTransactionSpecificData);
        this.isSelfEvaluation = true;
      },
      err => {
        this.alertService.showError(err?.error?.message, err?.error?.details);
      }
    );
    if (this.transaction?.transactionId === EstablishmentTransEnum.SC_EVALUATION_TRANSACTION) {
      this.documentTransactionKey = DocumentTransactionTypeEnum.SC_SELF_EVALUATION;
      this.documentTransactionType = DocumentTransactionTypeEnum.SC_SELF_EVALUATION_TRANSACTION;
    }
    this.getSafetyCheckDocs();
  }
  getEstData(registrationNo: number, safetyCheckTransactionId: number, getTransactionSpecificData = false) {
    this.ohService
      .getEstablishmentSafetyData(registrationNo, safetyCheckTransactionId, getTransactionSpecificData)
      .subscribe(
        res => {
          this.estData = res;
        },
        err => {
          this.alertService.showError(err?.error?.message, err?.error?.details);
        }
      );
  }
  viewFullCheckList() {
    const initialState = {
      safetyChecklists: JSON.parse(JSON.stringify(this.checkList?.establishmentSafetyChecklists)),
      adminSelectedList: JSON.parse(JSON.stringify(this.estData?.latestSubmissions))
    };

    this.modalRef = this.modalService.show(ScFullChecklistDcComponent, {
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-xl modal-dialog-centered',
      initialState
    });
  }
  getSafetyCheckDocs() {
    this.getUploadedDocuments(
      this.documentTransactionKey,
      this.documentTransactionType,
      this.estRegNo,
      this.referenceNo
    );
  }
}
