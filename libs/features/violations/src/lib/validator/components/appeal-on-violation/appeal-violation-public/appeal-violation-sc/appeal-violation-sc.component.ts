import {Component, Inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ContributorDetails, ViolationsValidatorService, ViolationTransaction} from "@gosi-ui/features/violations";
import {
  AlertService,
  AppealRequest,
  ApplicationTypeToken,
  AuthTokenService,
  BPMUpdateRequest,
  DocumentItem,
  DocumentService,
  Establishment, getPersonNameAsBilingual, IdentityTypeEnum, Iqama,
  ItTicketHistory,
  LanguageToken,
  LookupService, NIN,
  RouterData,
  RouterDataToken,
  scrollToTop,
  Transaction,
  TransactionService,
  TransactionWorkflowDetails,
  WorkflowService
} from "@gosi-ui/core";
import {BsModalService} from "ngx-bootstrap/modal";
import {Router} from "@angular/router";
import {BehaviorSubject, forkJoin, noop, Observable, throwError} from "rxjs";
import {Location} from "@angular/common";
import {EstablishmentService} from "@gosi-ui/features/establishment";
import {catchError, map, switchMap, takeUntil, tap} from "rxjs/operators";
import {ContributorDetail} from '@gosi-ui/features/violations/lib/shared/models/contributor-detail';
import {AppealViolationsService} from '@gosi-ui/features/violations/lib/shared/services/appeal-violations.service';
import {AppealContributor} from '@gosi-ui/features/violations/lib/shared/models/appeal-contributor';
import {
  AppealVlidatorBaseScComponent
} from '@gosi-ui/features/violations/lib/shared/components/base/appeal-validator-base-sc.component';
import {AppealOnViolationDetailsResponse} from "@gosi-ui/core/lib/models/appeal-on-violation-details-response";
import {TransactionType} from '@gosi-ui/core/lib/enums/transaction-type';
import {CustomerInfo} from "@gosi-ui/features/violations/lib/shared/models/appeal-on-violation";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'vol-appeal-violation-sc',
  templateUrl: './appeal-violation-sc.component.html',
  styleUrls: ['./appeal-violation-sc.component.scss']
})
export class AppealViolationScComponent
  extends AppealVlidatorBaseScComponent
  implements OnInit {

  lang: string;
  noOfRecords: number;
  itemsPerPage = 10;
  pageDetails = {
    currentPage: 1,
    goToPage: '1'
  };
  workflow: TransactionWorkflowDetails;
  establishment: Establishment;
  transaction: Transaction
  contributorList: ContributorDetail[] = [];
  @ViewChild('cancelTemplate', {static: false}) cancelTemplate: TemplateRef<HTMLElement>
  reportDoc: DocumentItem;
  canEdit = false;
  currentPage: number = 1;
  appealOnViolationObs$: Observable<AppealOnViolationDetailsResponse>;
  violationTransObs$: Observable<ViolationTransaction>;
  appealOnViolationDocuments$: Observable<DocumentItem[]>;
  violativeContributorsList: ContributorDetails[];
  ticketHistory: ItTicketHistory[];
  violationDetail: ViolationTransaction;
  typeAov;
  private editedAppeal: boolean = true;
  isDocumentsValid: boolean[];
  appealTransactionIdEnum = TransactionType;
  customerSummary: CustomerInfo;
  formsContributor: FormGroup = this.fb.group({contributors: this.fb.array([])});

  constructor(
    readonly appealVlcService: AppealViolationsService,
    readonly modalService: BsModalService,
    readonly alertService: AlertService,
    readonly workflowService: WorkflowService,
    readonly router: Router,
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly validatorService: ViolationsValidatorService,
    readonly transactionService: TransactionService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    @Inject(ApplicationTypeToken) readonly appTokenValue: string,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly location: Location,
    readonly establishmentService: EstablishmentService,
    readonly authService: AuthTokenService,
    readonly fb: FormBuilder) {
    super(
      lookupService,
      documentService,
      alertService,
      workflowService,
      modalService,
      validatorService,
      appealVlcService,
      router,
      routerDataToken,
      appTokenValue
    );
  }

  ngOnInit(): void {
    super.getDataFromToken(this.routerDataToken);
    this.language.subscribe(language => (this.lang = language));
    this.transactionService.getTransaction(this.referenceNo).subscribe(resp => {
      this.transaction = resp;

      this.typeAov = this.transaction.transactionId == TransactionType.REQUEST_VIEW
        ? this.appealVlcService.types_appeal_on_violation.requestView
        : this.appealVlcService.types_appeal_on_violation.appeal;
      this.initForm();
    });
    this.workflowService.getWorkFlowDetails(this.referenceNo).subscribe(res => (this.workflow = res));
  }

  initForm() {
    if (this.violationId) {
      this.appealOnViolationObs$ = this.transactionService.getAppealOnViolationDetailsById(this.appealId);
      this.violationTransObs$ = this.transactionService.getViolationDetails(this.violationId, this.transaction?.params?.REGISTRATION_NO);
      this.appealOnViolationDocuments$ = this.getDocumentsObservable(this.referenceNo);

      forkJoin([this.appealOnViolationObs$, this.violationTransObs$, this.appealOnViolationDocuments$]).subscribe(
        ([appealOnViolationData, violationData, appealOnViolationDocumentsData]) => {
          this.violationDetail = violationData;
          this.getCustomerDetails(appealOnViolationData.objector);

          // Populate the list of violative contributors by joining response from both violation details API and get Appeal on Violation Details API
          this.violativeContributorsList = violationData.contributors.map(violContributor => {
            const matchingUser = appealOnViolationData.decisions.find(decisionContributor => decisionContributor.contributorId === violContributor.contributorId);
            return matchingUser ? {...violContributor, ...matchingUser} : null;
          }).filter(Boolean) as ContributorDetails[];

          // Fill the documents for each contributor based on the provided content ID from get Appeal On Violation API
          this.violativeContributorsList.forEach(contributor => {
            const matchingDecision = appealOnViolationData.decisions.find(decision => decision.contributorId == contributor.contributorId);
            const matchingDocuments = matchingDecision.contributorDocuments.map(docId => {
              return appealOnViolationDocumentsData.find(aovDoc => aovDoc.id === docId);
            }).filter(Boolean) as DocumentItem[];
            contributor.documents = matchingDocuments;

            this.contributorList.push({
              idNumber: contributor.nationalId,
              idType: contributor.identity[0].idType,
              appealReason: contributor.reason,
              contributorId: contributor.contributorId,
              contributorName: contributor.contributorName,
              documents: contributor.documents,
              violationAmount: contributor.penaltyAmount
            } as ContributorDetail);

            this.contributors.push(
              this.fb.group({
                contributorId: [contributor?.contributorId],
                comment: [contributor?.reason]
              })
            );

          });
        },
        error => {
          this.alertService.showError(error.error.message);
        }
      );
    }

    this.workflowService.ticketHistory$
      .pipe(
        takeUntil(this.destroy$),
        tap(res => (this.ticketHistory = res))
      )
      .subscribe();
  }

  checkMandatoryDocs(documents) {
    return this.documentService.checkMandatoryDocuments(documents);
  }

  get contributors(): FormArray {
    return <FormArray>this.formsContributor.get('contributors');
  }

  checkValidity(): boolean {
    let flag = true;
    const isDocumentsValid = [];
    this.contributorList.forEach(item => {
      if (this.checkMandatoryDocs(item?.documents)) {
        isDocumentsValid.push(true);
      } else {
        isDocumentsValid.push(false);
      }
    });

    if (isDocumentsValid.includes(false)) {
      flag = false;
      this.alertService.showMandatoryDocumentsError();
    }
    return flag;
  }


  goToViolation(e) {
    this.navigateToViolationProfile();
  }

  selectPage(page: number): void {
    if (this.pageDetails.currentPage !== page) {
      this.pageDetails.currentPage = this.currentPage = page;
    }
  }

  /** Method to handle workflow events. */
  manageWorkflowTransaction(currentAction: number) {
    const bpmUpdateRequest = new BPMUpdateRequest();
    bpmUpdateRequest.taskId = this.routerDataToken?.taskId;
    bpmUpdateRequest.user = this.routerDataToken?.assigneeId;
    bpmUpdateRequest.outcome = super.getWorkflowActions(currentAction);
    return bpmUpdateRequest;
  }


  onUpdateAppeal() {
    if (this.checkValidity()) {
      const updateVlContributor = this.saveContributorForm();
      const appealRequest = this.generateAppealRequest(updateVlContributor);


      this.appealVlcService.updateAppealAov(this.appealId, appealRequest).subscribe(
        response => {
          this.navigateBack();
          scrollToTop();
          this.saveWorkflow(this.manageWorkflowTransaction(3));
        },
        err => {
          this.alertService.showError(err.error.message);
          scrollToTop();
        }
      );
    }
  }


  saveWorkflow(data: BPMUpdateRequest): void {
    this.workflowService
      .updateTaskWorkflow(data)
      .pipe(
        tap(() => {
          this.alertService.showSuccessByKey('COMPLAINTS.SUCCESS-RETURN-MSG');
          this.navigateToInboxPage();
        }),
        catchError(err => {
          this.handleErrors(err, false);
          return throwError(err);
        })
      )
      .subscribe(noop, noop);
  }

  onCancel() {
    this.modalRef.hide();
  }

  onConfirmCancel() {
    this.modalRef.hide();
    this.location.back();
  }

  showCancelModal(templateRef: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(templateRef, {class: 'modal-md modal-dialog-centered'});
  }

  openAppealTxn() {
    this.canEdit = true;
    scrollToTop();
  }

  navigateBack() {
    this.location.back();
  }

  getDocumentsObservable(referenceNo: number): Observable<DocumentItem[]> {
    return this.documentService
      .getOldDocumentContentId(null, null, null, referenceNo)
      .pipe(
        tap(
          (documentResponse: DocumentItem[]) => {
            if (documentResponse.length === 0) this.sequenceNumber = 1;
            else this.sequenceNumber = Math.max(...documentResponse.map(doc => doc.sequenceNumber)) + 1;
          },
          () => {
            this.sequenceNumber = 1;
          },
          () => {
          }
        ),
        switchMap(response => {
          return forkJoin(
            response.map(doc => {
              if (response) {
                return this.documentService.getDocumentContent(doc.contentId).pipe(
                  map(documentResponse => {
                    return this.documentService.setContentToDocument(doc, documentResponse);
                  })
                );
              }
            })
          );
        })
      )
  }

  generateAppealRequest(contributors: AppealContributor[]): AppealRequest {
    return {
      contributors: contributors,
      appealType: this.typeAov.type,
      edited: this.editedAppeal,
      initiatorComment: null,
      objector: this.authService.getEstablishmentUID(),
      registrationNo: this.estRegNo.toString(),
      transactionRefNumber: this.referenceNo,
      transactionSource: 'Violation'
    }
  }

  saveContributorForm() {
    const contributorAppeal: AppealContributor[] = []
    this.contributorList.forEach((contributor, index) => {
      const documentList: string[] = [];
      contributor.documents.forEach(document => documentList.push(document.contentId));

      contributorAppeal.push({
        contributorId: contributor?.contributorId,
        reason: this.contributors.controls[index].get('comment').value,
        documents: documentList
      })
    })
    return contributorAppeal
  }

  getCustomerDetails(identifier: number) {
    if (identifier)
      this.appealVlcService.getPersonById(identifier).subscribe(res => {
        this.customerSummary = new CustomerInfo();
        this.customerSummary.customerName = getPersonNameAsBilingual(res && res.name);
        this.customerSummary.emailId =
          res && res.contactDetail && res.contactDetail.emailId && res.contactDetail.emailId.primary;
        if (res && res.identity)
          res.identity.forEach((item, index) => {
            if (item.idType === IdentityTypeEnum.NIN) this.customerSummary.id = <NIN>res.identity[index];
            else if (item.idType === IdentityTypeEnum.IQAMA) this.customerSummary.id = <Iqama>res.identity[index];
          });
      });
  }
}
