import {Component, Inject, OnInit} from '@angular/core';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  DocumentItem,
  DocumentService,
  Establishment,
  getPersonNameAsBilingual,
  IdentityTypeEnum,
  Iqama,
  LanguageToken,
  NIN,
  RouterConstants,
  RouterData,
  RouterDataToken,
  Transaction,
  TransactionService,
  TransactionWorkflowDetails
} from "@gosi-ui/core";
import {AppealOnViolation} from "@gosi-ui/features/violations/lib/shared/models/appeal-on-violation";
import {
  DocumentTransactionType,
  TransactionsBaseScComponent,
  ViolationRouteConstants,
  ViolationsValidatorService
} from "@gosi-ui/features/violations";
import {Router} from "@angular/router";
import {Location} from "@angular/common";
import {BehaviorSubject, forkJoin} from "rxjs";
import {map, switchMap, tap} from "rxjs/operators";
import {AppealViolationsService} from "@gosi-ui/features/violations/lib/shared/services/appeal-violations.service";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {CustomerSummary} from "@gosi-ui/features/complaints/lib/shared/models";
import {ContributorDetail} from "@gosi-ui/features/violations/lib/shared/models/contributor-detail";

@Component({
  selector: 'vol-appeal-on-violation-sc',
  templateUrl: './appeal-on-violation-sc.component.html',
  styleUrls: ['./appeal-on-violation-sc.component.scss']
})
export class AppealOnViolationScComponent
  extends TransactionsBaseScComponent
  implements OnInit {

  idType: string;
  documentList: DocumentItem[] = [];
  noOfRecords: number;
  itemsPerPage = 10;
  pageDetails = {
    currentPage: 1,
    goToPage: '1'
  };
  currentPage = 1;
  lang: string;
  channelFilter: any;
  appealTxn: AppealOnViolation;
  formsContributor: FormGroup = this.fb.group({contributors: this.fb.array([])});
  workflow: TransactionWorkflowDetails;
  customerSummary: CustomerSummary = new CustomerSummary();
  establishment: Establishment;
  transaction: Transaction
  contributorList: ContributorDetail[] = [];
  transactionId: number = 300394;
  sequenceNumber: number;
  personIdentifier: number;
  ninOrIqama: number;
  accordionPanel: number;
  reportAppeal: DocumentItem[] = [];


  constructor(
    readonly transactionService: TransactionService,
    readonly alertService: AlertService,
    readonly documentService: DocumentService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly router: Router,
    readonly validatorService: ViolationsValidatorService,
    readonly location: Location,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly appealVlcService: AppealViolationsService,
    readonly violationValidatorService: ViolationsValidatorService,
    readonly fb: FormBuilder
  ) {
    super(
      transactionService,
      alertService,
      documentService,
      routerDataToken,
      router,
      validatorService,
      location,
      appToken
    );

    this.documentTransactionKey = DocumentTransactionType.APPEAL_ON_VIOLATION;
    this.documentTransactionType = DocumentTransactionType.APPEAL_ON_VIOLATION;
  }

  ngOnInit(): void {
    super.getTransactionData();
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    if (this.estRegNo && this.violationId && this.appealViolationId) {
      this.initForm();
    } else {
      this.router.navigate([RouterConstants.ROUTE_INBOX]);
    }
  }

  onViolationPage(item) {
    const regNo = this.estRegNo;
    const violationId = this.violationId;
    let url = '';
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      url = '/establishment-private/#' + ViolationRouteConstants.ROUTE_VIOLATIONS_PROFILE(violationId, regNo);
    } else {
      url = '/establishment-public/#' + ViolationRouteConstants.ROUTE_VIOLATIONS_PROFILE(violationId, regNo);
    }
    window.open(url, '_blank');
  }

  initForm() {
    forkJoin(
      this.appToken == ApplicationTypeEnum.PRIVATE
        ? this.appealVlcService.getAppealDetails(this.violationId, +this.appealViolationId)
        : this.appealVlcService.getAppealViolationTransaction(this.estRegNo, this.violationId, +this.appealViolationId),
      this.getDocuments(this.transactionId)
    ).pipe(
      map(([appealTxn, documents]) => {
        for (let index = 0; index < appealTxn?.contributors.length; index++) {
          const documentList: DocumentItem[] = [];
          appealTxn.contributors[index].documents.forEach(item => {
            if (documents.find(doc => doc.id === item.id)) {
              documentList.push(documents.find(doc => doc.id === item.id));
            }
          });
          appealTxn.contributors[index].documents = JSON.parse(JSON.stringify(documentList));
        }
        return appealTxn
      })
    ).subscribe(resp => {
      this.appealTxn = resp;
      this.noOfRecords = resp.contributors.length;
      this.initTransaction();
      this.initCustomerSummary();

      if (resp.reportContentId) {
        this.documentService.getDocumentContent(resp.reportContentId)
          .subscribe(response => {
            const documentItem = new DocumentItem();
            documentItem.name = {
              arabic: 'نتيجة الاعتراض',
              english: 'Appeal Result'
            }
            this.reportAppeal = this.reportAppeal.concat(this.documentService.setContentToDocument(documentItem, response));
          });
      }

      this.appealTxn.contributors.forEach(item => {
        const docReviewComment = item?.documentsReview != null ? item?.documentsReview.notes : null;
        this.contributorList.push({
          contributorId: item?.contributorId,
          violationAmount: item?.penaltyAmount,
          contributorName: item?.contributorName,
          documents: item?.documents,
          idType: item?.persionIdentifier.idType,
          idNumber: +item?.persionIdentifier.personIdentifier,
          appealReason: item?.appealReason,
          docReview: docReviewComment
        });
        this.contributorFormArray.push(this.fb.group({
            contributorId: [item?.contributorId],
            comment: [{value: docReviewComment, disabled: true}]
          })
        );
      });
    });
  }

  get contributorFormArray(): FormArray {
    return <FormArray>this.formsContributor.get("contributors");
  }

  getDocuments(referenceNo: number) {
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
      );
  }

  initTransaction() {
    const transaction = {
      channel: this.channelFilter,
      transactionRefNo: this.referenceNo,
      status: this.appealTxn?.status
    }
    this.transaction = new Transaction().fromJsonToObject(transaction);
  }

  initCustomerSummary() {
    this.personIdentifier = this.appealTxn?.personId;
    this.getPersonDetailsCz();
  }

  getPersonDetailsCz() {
    if (this.personIdentifier !== null)
      this.appealVlcService.getPersonById(this.personIdentifier).subscribe(response => {
        this.customerSummary.customerName = getPersonNameAsBilingual(response?.name);
        this.customerSummary.emailId =
          response && response?.contactDetail && response?.contactDetail.emailId && response?.contactDetail.emailId.primary;
        if (response && response?.identity)
          response.identity.forEach((item, index) => {
            if (item.idType === IdentityTypeEnum.NIN) {
              this.customerSummary.id = <NIN>response?.identity[index];
              this.ninOrIqama = this.customerSummary?.id.newNin;
            } else if (item.idType === IdentityTypeEnum.IQAMA) {
              this.customerSummary.id = <Iqama>response?.identity[index];
              this.ninOrIqama = this.customerSummary?.id.iqamaNo;
            }
          });
      });
  }

  selectPanel(openEvent: boolean, tabIndex: number) {
    if (openEvent === true) {
      this.accordionPanel = tabIndex;
    }
  }

  navigateToProfile() {
    let url = '';
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      url = `/establishment-private/#/home/profile/individual/internal/${this.ninOrIqama}`;
    }
    window.open(url, '_blank');
  }
}
