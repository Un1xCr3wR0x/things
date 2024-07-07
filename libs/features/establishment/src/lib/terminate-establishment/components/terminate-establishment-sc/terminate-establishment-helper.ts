/**
 * Copyright GOSI. All Rights Reserved.
 * Thiself software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpErrorResponse } from '@angular/common/http';
import { ApplicationTypeEnum, DocumentItem, Lov, LovList, WorkFlowActions } from '@gosi-ui/core';
import { Observable, noop, of } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import {
  BranchList,
  DocumentNameEnum,
  DocumentTransactionIdEnum,
  EstablishmentActionEnum,
  EstablishmentConstants,
  EstablishmentQueryKeysEnum,
  EstablishmentRoutesEnum,
  NavigationIndicatorEnum,
  TERMINATE_CONTRIBUTOR_LOV_VALUE,
  TRANSFER_CONTRIBUTOR_LOV_VALUE,
  TerminateContributorActionsEnum,
  getBranchRequest,
  getDocumentContentIds
} from '../../../shared';
import { TerminateEstablishmentScComponent } from './terminate-establishment-sc.component';

/**
 * method to inmpliment the validation
 */
export const performDocumentValidation = (self: TerminateEstablishmentScComponent, callback: () => void) => {
  getDocuments$(self).subscribe(docs => {
    docs.forEach(document => {
      if (document.name.english === DocumentNameEnum.EMPLOYER_PROCESS_DOCUMENT) {
        if (document.transactionReferenceIds.length === 0) {
          self.CBMReferenceNo
            ? document.transactionReferenceIds.push(self.terminateReferenceNo, self.CBMReferenceNo)
            : document.transactionReferenceIds.push(self.terminateReferenceNo);
        }
        document.show = document.required = !self.isGcc;
      } else if (document.name.english === DocumentNameEnum.NATIONAL_ID_IQAMA) {
        if (document.transactionReferenceIds.length === 0) {
          self.CBMReferenceNo
            ? document.transactionReferenceIds.push(self.terminateReferenceNo, self.CBMReferenceNo)
            : document.transactionReferenceIds.push(self.terminateReferenceNo);
        }
        document.required = false;
        document.show = self.isPrivate;
      } else if (document.name.english === DocumentNameEnum.PROOF_TERMINATION) {
        if (document.transactionReferenceIds.length === 0) {
          document.transactionReferenceIds.push(self.terminateReferenceNo);
        }
        document.required = document.show = !self.isGcc;
      } else if (document.name.english === DocumentNameEnum.AUTH_DELEGATION_LETTER) {
        if (document.transactionReferenceIds.length === 0) {
          self.CBMReferenceNo
            ? document.transactionReferenceIds.push(self.terminateReferenceNo, self.CBMReferenceNo)
            : document.transactionReferenceIds.push(self.terminateReferenceNo);
        }
        document.required = false;
        document.show = self.isPrivate;
      } else if (document.name.english === DocumentNameEnum.OTHERS_DOCUMENT) {
        if (document.transactionReferenceIds.length === 0) {
          self.CBMReferenceNo
            ? document.transactionReferenceIds.push(self.terminateReferenceNo, self.CBMReferenceNo)
            : document.transactionReferenceIds.push(self.terminateReferenceNo);
        }
        document.required = false;
        document.show = true;
      } else if (document.name.english === DocumentNameEnum.TERMINATE_REQ_LETTER) {
        if (document.transactionReferenceIds.length === 0) {
          document.transactionReferenceIds.push(self.terminateReferenceNo);
        }
        document.required = document.show = self.isGcc;
      } else if (document.name.english === DocumentNameEnum.IBAN_PROOF_CERTIFICATE) {
        if (document.transactionReferenceIds.length === 0) {
          document.transactionReferenceIds.push(self.terminateReferenceNo);
        }
        document.required = document.show = self.includeBankDocument;
      }
      if (document.transactionReferenceIds?.length > 1) {
        document.transactionIds.push(
          DocumentTransactionIdEnum.TERMINATE_ESTABLISHMENT,
          DocumentTransactionIdEnum.CHANGE_BRANCH_TO_MAIN
        );
      } else {
        document.transactionIds.push(DocumentTransactionIdEnum.TERMINATE_ESTABLISHMENT);
      }
    });
    self.documents = docs;
    callback();
  });
};

/**
 *
 * @param self method to handle error
 * @param error
 */
export const handleError = (self: TerminateEstablishmentScComponent, error: HttpErrorResponse) => {
  self.apiCallInprogress = false;
  self.alertService.showError(error?.error?.message, error?.error?.details);
};

/**
 * Method to cancel the transaction
 */
export const cancelTransaction = (self: TerminateEstablishmentScComponent) => {
  if (self.terminateReferenceNo && !self.isValidator) {
    self.changeEstablishmentService.revertTransaction(self.registrationNo, self.terminateReferenceNo).subscribe(
      () => {
        if (self.CBMReferenceNo) {
          self.changeEstablishmentService.revertTransaction(self.registrationNo, self.CBMReferenceNo).subscribe(() => {
            self.setTransactionComplete();
            self.location.back();
          });
        } else {
          self.setTransactionComplete();
          self.location.back();
        }
      },
      err => handleError(self, err)
    );
  } else if (self.isValidator && self.isPrivate) {
    self.setTransactionComplete();
    self.router.navigate([EstablishmentRoutesEnum.VALIDATOR_TERMINATE]);
  } else if (self.isValidator && !self.isPrivate) {
    self.setTransactionComplete();
    self.router.navigate([EstablishmentConstants.ROUTE_TO_INBOX(ApplicationTypeEnum.PUBLIC)]);
  } else {
    self.setTransactionComplete();
    self.location.back();
  }
};

/**
 * Method to get all documents
 */
export const getDocuments$ = (self: TerminateEstablishmentScComponent): Observable<DocumentItem[]> => {
  if (self.documents) {
    return of(self.documents);
  } else {
    return self.changeGrpEstablishmentService.getDocuments(
      self.documentTransactionKey,
      self.documentTransactionType,
      self.registrationNo,
      self.terminateReferenceNo ? self.terminateReferenceNo : null,
      null
    );
  }
};

export const changeMainEstablishment = (self: TerminateEstablishmentScComponent, establishment: BranchList) => {
  const mainBranchIndex = self.branchEstablishments.findIndex(branch => branch.establishmentType.english === self.main);
  if (mainBranchIndex >= 0) {
    self.branchEstablishments[mainBranchIndex].establishmentType.english = self.branch;
  }
  const newMainEstIndex = self.branchEstablishments.findIndex(
    branchItem => branchItem.registrationNo === establishment.registrationNo
  );
  if (newMainEstIndex >= 0) {
    self.branchEstablishments[newMainEstIndex].establishmentType.english = self.main;
  }
  self.selectedMainEstablishment = establishment;
  self.newMainEstRegistrationNo = self.selectedMainEstablishment.registrationNo;
};

/***
 * method to get the navigation indicator
 */
export const getNavigationIndicator = (isPrivate: boolean, isValidator: boolean): number => {
  return isPrivate
    ? isValidator
      ? NavigationIndicatorEnum.VALIDATOR_TERMINATE_ESTABLISHMENT_SUBMIT
      : NavigationIndicatorEnum.CSR_TERMINATE_ESTABLISHMENT_SUBMIT
    : isValidator
    ? NavigationIndicatorEnum.GOL_VALIDATOR_TERMINATE_EST_SUBMIT
    : NavigationIndicatorEnum.GOL_TERMINATE_ESTABLISHMENT_SUBMIT;
};

export const invokeSaveNewMainEstService = (self: TerminateEstablishmentScComponent, isFinalSubmit: boolean) => {
  self.changeGrpEstablishmentService
    .saveMainEstablishment(self.mainEstablishmentRegNo, {
      newMainRegistrationNo: self.newMainEstRegistrationNo,
      navigationIndicator: self.changeGrpEstablishmentService.getNavigationIndicator(
        EstablishmentActionEnum.CHG_MAIN_EST,
        isFinalSubmit,
        false,
        self.appToken
      ),
      comments: self.terminateEstForm.get('comments').value,
      contentIds: self.isPrivate && isFinalSubmit ? getDocumentContentIds(self.CBMDocuments) : [],
      referenceNo: self.CBMReferenceNo
    })
    .pipe(
      tap(res => {
        if (isFinalSubmit) {
          self.terminateEstablishmentService.transactionFeedback.push(res);
          invokeCloseEstablishmentService(self);
        } else {
          self.CBMReferenceNo = +res?.transactionId;
          performDocumentValidation(self, () => self.selectedWizard(2));
        }
      })
    )
    .subscribe(noop, err => handleError(self, err));
};

export const invokeCloseEstablishmentService = (self: TerminateEstablishmentScComponent) => {
  const formDetails = self.terminateEstForm.getRawValue();
  const contributorAction = formDetails?.contributorDetails?.action?.english;
  self.terminateService
    .terminateEstablishment(self.registrationNo, {
      navigationIndicator: getNavigationIndicator(self.isPrivate, self.isValidator),
      comments: self.terminateEstForm.get('comments').value,
      contentIds: getDocumentContentIds(self.documents),
      ibanAccountNo: self.showBank && self.isBankPayment ? formDetails?.bankDetails?.ibanAccountNo : null,
      bankName: self.showBank && self.isBankPayment ? formDetails?.bankDetails?.bankName : null,
      paymentMethod: formDetails?.bankDetails?.paymentMethod,
      referenceNo: self.terminateReferenceNo,
      contributorAction:
        contributorAction === TRANSFER_CONTRIBUTOR_LOV_VALUE.english
          ? TerminateContributorActionsEnum.TRANSFER_ALL
          : contributorAction === TERMINATE_CONTRIBUTOR_LOV_VALUE.english
          ? TerminateContributorActionsEnum.TERMINATE_ALL
          : null,
      contributorLeavingDate:
        contributorAction === TRANSFER_CONTRIBUTOR_LOV_VALUE.english
          ? formDetails?.contributorDetails?.transferDate
          : contributorAction === TERMINATE_CONTRIBUTOR_LOV_VALUE.english
          ? formDetails?.contributorDetails?.terminateDate
          : null,
      contributorLeavingReason:
        contributorAction === TRANSFER_CONTRIBUTOR_LOV_VALUE.english
          ? formDetails?.contributorDetails?.transferReason
          : contributorAction === TERMINATE_CONTRIBUTOR_LOV_VALUE.english
          ? formDetails?.contributorDetails?.terminateReason
          : null,
      transferTo: contributorAction === TRANSFER_CONTRIBUTOR_LOV_VALUE.english ? self.selectedBranchToTransfer : null,
      uuid: undefined
    })
    .subscribe(
      terminateResponse => {
        if (self.isValidator) {
          self
            .updateBpm(
              self.estRouterData,
              self.terminateEstForm.get('comments').value,
              terminateResponse.successMessage,
              WorkFlowActions.UPDATE
            )
            .subscribe(
              () => {
                self.setTransactionComplete();
                self.apiCallInprogress = false;
                if (self.isPrivate) self.location.back();
                else self.router.navigate([EstablishmentConstants.ROUTE_TO_INBOX(ApplicationTypeEnum.PUBLIC)]);
              },
              err => handleError(self, err)
            );
        } else {
          self.setTransactionComplete();
          self.terminateEstablishmentService.transactionFeedback.push(terminateResponse);
          self.apiCallInprogress = false;
          self.location.back();
        }
      },
      err => handleError(self, err)
    );
};

export const getTerminateContributorActionLovList = (
  self: TerminateEstablishmentScComponent,
  hideTransfer = false,
  hideTerminate = false
): LovList => {
  const lovlist: LovList = self.lookupService.getTerminateContributorActionLovList();
  if (hideTransfer) {
    lovlist.items = lovlist.items.filter(item => item.value.english !== TRANSFER_CONTRIBUTOR_LOV_VALUE.english);
  }
  if (hideTerminate) {
    lovlist.items = lovlist.items.filter(item => item.value.english !== TERMINATE_CONTRIBUTOR_LOV_VALUE.english);
  }
  return lovlist;
};

/**
 * method to create the lov lis of branch establishments
 * @param self
 */
export const getEstablishmentLOVList = (self: TerminateEstablishmentScComponent): Observable<Lov[]> => {
  return self.establishmentService
    .getBranchEstablishmentsWithStatus(self.registrationNo, getBranchRequest(0, 0, [self.registeredStatus], false), [], true)
    .pipe(
      map(branchListRes => branchListRes.branchList.filter(branch => branch.registrationNo !== self.registrationNo)),
      map(branchList => {
        return branchList.map(branch => {
          const newLov = new Lov();
          newLov.sequence = branchList.indexOf(branch);
          newLov.code = branch.registrationNo;
          newLov.value.english = branch.name.english ? branch.name.english : branch.name.arabic;
          newLov.value.arabic = branch.name.arabic ? branch.name.arabic : branch.name.english;
          return newLov;
        });
      })
    );
};

/**
 * Method to load the terminate establishment statsu
 */
export const loadTerminateEligibilityStatus = (self: TerminateEstablishmentScComponent) => {
  self.terminateService
    .terminateEstablishment(self.establishment.registrationNo, null, [
      {
        queryKey: EstablishmentQueryKeysEnum.MODE,
        queryValue: EstablishmentQueryKeysEnum.DRAFT_MODE
      }
    ])
    .pipe(
      switchMap(statusRes => {
        self.terminateEligibilityStatus = statusRes;
        return statusRes?.hasActiveContributors && !statusRes?.hasProactiveContributors
          ? getEstablishmentLOVList(self)
          : of(null);
      })
    )
    .subscribe(
      res => {
        self.showTransferContributor = res !== null;
        if (self.showTransferContributor) {
          self.branchEstablsihmentLovList = res || [];
          self.lookupService
            .getContributorLeavingReasonList()
            .pipe(
              filter(lovRes => lovRes !== null),
              tap(lovRes => {
                self.leaveReasonLovList = lovRes;
              })
            )
            .subscribe(noop, err => handleError(self, err));
          self.terminateContributorActionList = getTerminateContributorActionLovList(
            self,
            self.branchEstablsihmentLovList?.length === 0 || self.isMain || !self.eligibleToTransfer
          );
        }
      },
      err => handleError(self, err)
    );
};
