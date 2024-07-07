/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  BankAccount,
  BilingualText,
  DocumentItem,
  DocumentService,
  LookupService,
  LovList,
  RouterConstants,
  Transaction,
  TransactionService,
  CoreActiveBenefits,
  CoreAdjustmentService,
  CoreBenefitService,
  LanguageToken,
  CoreContributorService,
  checkIqamaOrBorderOrPassport,
  Person
} from '@gosi-ui/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { forkJoin, Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import {
  Adjustment,
  AdjustmentConstants,
  AdjustmentDetails,
  AdjustmentService,
  BenefitDetails,
  PayeeDetails,
  PaymentRoutesEnum,
  ThirdPartyAdjustmentList,
  ThirdpartyAdjustmentService
} from '../../../shared';
import { PersonAdjustment } from '../../../shared/models/person-adjustment';
import { TransactionBaseScComponent } from '../../base';

@Component({
  selector: 'pmt-third-party-transaction-sc',
  templateUrl: './third-party-transaction-sc.component.html',
  styleUrls: ['./third-party-transaction-sc.component.scss']
})
export class ThirdPartyTransactionScComponent extends TransactionBaseScComponent implements OnInit {
  // Local Variables
  transaction: Transaction;
  referenceNumber: number;
  transactionId: number;
  modificationId: number;
  personId: number;
  adjustmentResponse: AdjustmentDetails;
  beneficiaryId: number;
  payeeId: number;
  modalRef: BsModalRef;
  payeeResponse: PayeeDetails;
  payeebankName: BilingualText;
  benefitResponse: BenefitDetails[] = [];
  transactionType: string;
  transactionName: string;
  showAddTpaTransaction: boolean;
  currentAdjustments: Adjustment[];
  modifiedAdjustmentValues: Adjustment[];
  payeesList: PayeeDetails[];
  bankCodeList: string[];
  bankCodeMap: Map<string, BilingualText> = new Map();
  thirdPartyAdjustmentList: Map<number, ThirdPartyAdjustmentList> = new Map();
  allDocuments: DocumentItem[] = [];
  addDocuments: DocumentItem[] = [];
  modifyDocuments: DocumentItem[] = [];
  reactivateDocumnets: DocumentItem[] = [];
  holdDocuments: DocumentItem[] = [];
  stopDocuments: DocumentItem[] = [];
  sin: number;
  requestId: number;
  readonly adjustmentConstants = AdjustmentConstants;

  constructor(
    readonly route: ActivatedRoute,
    readonly documentService: DocumentService,
    @Inject(LanguageToken) private language: BehaviorSubject<string>,
    readonly lookupService: LookupService,
    readonly transactionService: TransactionService,
    readonly tpaService: ThirdpartyAdjustmentService,
    readonly alertService: AlertService,
    readonly adjustmentService: AdjustmentService,
    readonly router: Router,
    readonly coreBenefitService: CoreBenefitService,
    readonly coreAdjustmentService: CoreAdjustmentService,
    readonly contributorService: CoreContributorService
  ) {
    super(documentService);
  }

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.transaction = this.transactionService.getTransactionDetails();
    if (this.transaction) {
      this.referenceNumber = this.transaction.transactionRefNo;
      this.transactionId = this.transaction.transactionId;
      this.modificationId = parseInt(this.transaction.params.ADJUSTMENT_MODIFICATION_ID, 10);
      this.personId = parseInt(this.transaction.params.IDENTIFIER, 10);
      this.sin = this.transaction.params.NIN;
      if (this.transactionId === AdjustmentConstants.ADD_THIRD_PARTY_TRANSACTION_ID) {
        this.getBenefitDetails(this.personId);
        this.transactionName = AdjustmentConstants.ADD_THIRD_PARTY_TRANSACTION_NAME;
        this.transactionType = AdjustmentConstants.ADD_THIRD_PARTY_TRANSACTION_TYPE;
        this.fetchAddTpaValidatorView();
        this.showAddTpaTransaction = true;
        this.getDocumentDetails(this.transactionName, this.transactionType, this.modificationId, this.referenceNumber);
      } else if (this.transactionId === AdjustmentConstants.MAINTAIN_THIRD_PARTY_TRANSACTION_ID) {
        this.transactionName = AdjustmentConstants.MAINTAIN_THIRD_PARTY_TRANSACTION_NAME;
        this.transactionType = AdjustmentConstants.MAINTAIN_PARTY_TRANSACTION_TYPE;
        this.fetchManageTpaAdjustment();
        this.showAddTpaTransaction = false;
      }
      // this.getContributor();
    }
  }
  fetchAddTpaValidatorView() {
    (this.transaction.status.english === 'Completed'
      ? this.tpaService.getAdjustmentDetails(this.personId, this.sin)
      : this.tpaService.getThirdPartyAdjustmentValidatorDetails(this.personId, this.modificationId, true, this.sin)
    )
      .pipe(
        tap(res => {
          this.adjustmentResponse = res;
          this.getContributor();
          this.beneficiaryId = res?.adjustments[0]?.beneficiaryId;
          this.payeeId = res?.adjustments[0]?.payeeId;
          this.requestId = res?.adjustments[0]?.benefitRequestId;
        }),
        switchMap(() => {
          if (this.payeeId) {
            return this.tpaService.getValidatorPayeeDetails(this.payeeId).pipe(
              tap(
                data => {
                  this.payeeResponse = data;
                  const iBanCode = this.payeeResponse?.iban ? String(this.payeeResponse?.iban).slice(4, 6) : null;
                  if (iBanCode) {
                    this.lookupService.getBank(iBanCode).subscribe(bankDetails => {
                      if (bankDetails?.items?.length > 0) {
                        const bank = new BankAccount();
                        bank.ibanAccountNo = this.payeeResponse?.iban;
                        bank.bankName = bankDetails?.items[0]?.value;
                        this.payeebankName = bankDetails?.items[0]?.value;
                      }
                    });
                  }
                },
                err => {
                  this.alertService.showError(err.error.message);
                  this.hideModal();
                }
              )
            );
          }
        }),
        catchError(error => {
          if (error) this.alertService.showError(error.error.message);
          return throwError(error);
        })
      )
      .subscribe();
  }
  // Method to hide
  hideModal() {
    this.modalRef?.hide();
  }
  // This method is used to fetch benefit details
  getBenefitDetails(personId) {
    this.tpaService.getBeneficiaryDetails(personId, this.sin).subscribe(res => {
      res.beneficiaryBenefitList.forEach(data => {
        if (data.beneficiaryId === this.beneficiaryId) {
          this.benefitResponse.push(data);
        }
      });
    });
  }
  navigateToBenefitViewPage(type) {
    this.coreBenefitService.setActiveBenefit(
      new CoreActiveBenefits(this.sin, this.requestId, type, this.referenceNumber)
    );
    this.router.navigate([PaymentRoutesEnum.VIEW_BENEFIT_PAGE]);
  }
  // This method is used to fetch transaction details for manage tpa
  fetchManageTpaAdjustment() {
    forkJoin([
      this.tpaService.getBeneficiaryDetails(this.personId, this.sin),
      this.tpaService.getTpaAdjustmentsDetails(this.personId, null, this.sin),
      this.tpaService.getThirdPartyAdjustmentValidatorDetails(this.personId, this.modificationId, true, this.sin)
    ])
      .pipe(
        switchMap(data => {
          this.benefitResponse = data[0].beneficiaryBenefitList;
          this.currentAdjustments = data[1]?.adjustments;
          this.modifiedAdjustmentValues = data[2]?.adjustments;
          this.adjustmentResponse = data[2];
          this.getContributor();
          this.requestId = this.modifiedAdjustmentValues[0]?.benefitRequestId;
          this.getModifyTpaDocuments(this.modifiedAdjustmentValues, this.referenceNumber, this.modificationId);
          const payeeIds: number[] = [];
          const httpcalls: Observable<PayeeDetails>[] = [];
          this.modifiedAdjustmentValues?.forEach(adjustment => {
            if (!payeeIds.includes(adjustment?.payeeId)) {
              payeeIds.push(adjustment?.payeeId);
              httpcalls.push(this.tpaService.getValidatorPayeeDetails(adjustment.payeeId));
            }
          });
          return forkJoin(httpcalls);
        }),
        switchMap(payees => {
          this.payeesList = payees;
          this.bankCodeList = [];
          const bankApis: Observable<LovList>[] = [];
          payees.forEach(payee => {
            const iBanCode = payee?.iban ? String(payee?.iban).slice(4, 6) : null;
            if (iBanCode && !this.bankCodeList.includes(iBanCode)) {
              this.bankCodeList.push(iBanCode);
              bankApis.push(this.lookupService.getBank(iBanCode));
            }
          });
          if (!this.bankCodeList?.length) {
            // Story 577329 - should show the details for TPA even though there is no bank
            this.getThirdPartyAdjList();
          }
          return forkJoin(bankApis);
        })
      )
      .subscribe(
        banks => {
          this.bankCodeList.forEach((code, index) => {
            this.bankCodeMap.set(code, banks[index].items[0]?.value);
          });
          this.getThirdPartyAdjList();
        },
        err => {
          this.alertService.showError(err.error.message);
          this.hideModal();
        }
      );
  }
  getThirdPartyAdjList() {
    this.modifiedAdjustmentValues?.forEach((modifiedAdjustment, index) => {
      const payee = this.payeesList?.find(payeeItem => payeeItem.payeeId === modifiedAdjustment?.payeeId);
      const iBanCode = payee?.iban ? String(payee?.iban).slice(4, 6) : null;
      this.thirdPartyAdjustmentList.set(index, {
        currentAdjustment: this.currentAdjustments.find(
          currentAdjustment => currentAdjustment?.adjustmentId === modifiedAdjustment?.adjustmentId
        ),
        modifiedAdjustment: modifiedAdjustment,
        payee: payee,
        bank: this.bankCodeMap.get(iBanCode),
        benefit: this.benefitResponse?.find(benefit => benefit?.beneficiaryId === modifiedAdjustment?.beneficiaryId),
        isAdd: modifiedAdjustment?.actionType?.english === AdjustmentConstants?.ADJUSTMENT_ACTION_TYPE?.ADD?.english
      });
    });
  }
  // This method is used to fetch validator document details
  getModifyTpaDocuments(modifiedAdjustments: Adjustment[], referenceNumber: number, adjustmentModificationId: number) {
    this.documentService
      .getRequiredDocuments(
        AdjustmentConstants.MAINTAIN_THIRD_PARTY_TRANSACTION_NAME,
        AdjustmentConstants.MAINTAIN_PARTY_TRANSACTION_TYPE
      )
      .pipe(
        tap(docs => {
          docs.forEach(doc => {
            if (AdjustmentConstants.MODIFY_DOCUMENT_TYPE_IDS.includes(doc?.documentTypeId)) {
              this.modifyDocuments.push(doc);
            }
            if (AdjustmentConstants.HOLD_DOCUMENT_TYPE_IDS.includes(doc?.documentTypeId)) {
              this.holdDocuments.push(doc);
            }
            if (AdjustmentConstants.STOP_DOCUMENT_TYPE_IDS.includes(doc?.documentTypeId)) {
              this.stopDocuments.push(doc);
            }
            if (AdjustmentConstants.REACTIVATE_DOCUMENT_TYPE_IDS.includes(doc?.documentTypeId)) {
              this.reactivateDocumnets.push(doc);
            }
            if (AdjustmentConstants.ADD_DOCUMENT_TYPE_IDS.includes(doc?.documentTypeId)) {
              this.addDocuments.push(doc);
            }
          });
        }),
        map(docs => {
          this.allDocuments = docs;
          let documents: DocumentItem[] = [];
          modifiedAdjustments.forEach(modification => {
            if (modification?.actionType?.english === AdjustmentConstants.ADJUSTMENT_ACTION_TYPE.ADD?.english) {
              documents = documents.concat(
                this.addDocuments.map(document => {
                  return { ...document, businessKey: adjustmentModificationId } as DocumentItem;
                })
              );
            } else if (
              modification?.actionType?.english === AdjustmentConstants.ADJUSTMENT_ACTION_TYPE.MODIFY?.english
            ) {
              documents = documents.concat(
                this.modifyDocuments.map(document => {
                  return { ...document, businessKey: modification?.adjustmentId } as DocumentItem;
                })
              );
            } else if (modification?.actionType?.english === AdjustmentConstants.ADJUSTMENT_ACTION_TYPE.HOLD?.english) {
              documents = documents.concat(
                this.holdDocuments.map(document => {
                  return { ...document, businessKey: modification?.adjustmentId } as DocumentItem;
                })
              );
            } else if (modification?.actionType?.english === AdjustmentConstants.ADJUSTMENT_ACTION_TYPE.STOP?.english) {
              documents = documents.concat(
                this.stopDocuments.map(document => {
                  return { ...document, businessKey: modification?.adjustmentId } as DocumentItem;
                })
              );
            } else if (
              modification?.actionType?.english === AdjustmentConstants.ADJUSTMENT_ACTION_TYPE.REACTIVATE?.english
            ) {
              documents = documents.concat(
                this.reactivateDocumnets.map(document => {
                  return { ...document, businessKey: modification?.adjustmentId } as DocumentItem;
                })
              );
            }
          });
          return documents;
        }),
        switchMap(docs => {
          return this.documentService.getDocuments(
            this.transactionName,
            this.transactionType,
            null,
            referenceNumber,
            null,
            null,
            null,
            docs
          );
        })
      )
      .subscribe(docs => {
        this.documents = docs;
      });
  }
  getContributor() {
    this.tpaService.getPersonById(this.personId).subscribe(data => {
      this.sin = data?.socialInsuranceNo;
      if (this.transaction.status.english === 'Completed') {
        this.adjustmentResponse.person = new PersonAdjustment();
        this.adjustmentResponse.person.age = data?.person?.ageInHijiri;
        this.adjustmentResponse.person.birthDate = data?.person?.birthDate;
        this.adjustmentResponse.person.identity = [
          { idType: null, newNin: checkIqamaOrBorderOrPassport(data?.person?.identity).id }
        ];
        this.adjustmentResponse.person.name = data?.person?.name;
      }
    });
  }
  navigateToAdjustmentPage(val: number) {
    this.router.navigate([PaymentRoutesEnum.THIRD_PARTY_ADJUSTMENT_DETAIL], {
      queryParams: {
        adjustmentId: val,
        personId: this.personId
      }
    });
  }
  navigateOnLinkClick() {
    this.contributorService.selectedSIN = this.sin;
    this.router.navigate([RouterConstants.ROUTE_INDIVIDUAL(this.sin)]);
  }
  /** Method  to  navigate  to  View Maintain Adjustment */
  viewMaintainAdjustment(adjustmentdetails) {
    this.coreAdjustmentService.identifier = this.personId;
    this.coreAdjustmentService.sin = this.sin;
    this.router.navigate([PaymentRoutesEnum.ADJUSTMENT_DETAIL], { queryParams: { from: adjustmentdetails } });
  }
}
