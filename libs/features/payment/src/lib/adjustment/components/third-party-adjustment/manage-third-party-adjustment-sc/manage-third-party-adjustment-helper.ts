/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { FormGroup } from '@angular/forms';
import { DocumentItem } from '@gosi-ui/core';
import {
  Adjustment,
  AdjustmentConstants,
  AdjustmentModificationList,
  CountinuesDeductionTypeEnum,
  PayeeDetails
} from '@gosi-ui/features/payment/lib/shared';
import { of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ManageThirdPartyAdjustmentScComponent } from './manage-third-party-adjustment-sc.component';

/**
 * method to bind the form values to adjustment model in the case of add
 */
export const bindAddFormValuesToAdjustmentModel = (form: FormGroup, payeeDetails: PayeeDetails): Adjustment => {
  const formValues = form.getRawValue();
  const adjustment = new Adjustment();
  adjustment.adjustmentStatus = AdjustmentConstants.ADJUSTMENT_STATUS.NEW;
  adjustment.benefitType = formValues?.addTpaForm?.benefitType;
  adjustment.beneficiaryId = formValues?.addTpaForm?.beneficiaryId;
  adjustment.payeeId = payeeDetails?.payeeId;
  adjustment.payeeName = payeeDetails?.payeeName;
  adjustment.transferMode = formValues?.paymentMethod?.transferMode;
  adjustment.continuousDeduction =
    formValues?.continousDeductionForm?.continuousDeduction?.english === CountinuesDeductionTypeEnum.YES;
  adjustment.adjustmentAmount = formValues?.continousDeductionForm?.adjustmentAmount;
  adjustment.monthlyDeductionAmount = formValues?.continousDeductionForm?.monthlyDeductionAmount;
  adjustment.adjustmentPercentage = +formValues?.continousDeductionForm?.adjustmentPercentage?.english;
  adjustment.adjustmentReason = formValues?.continousDeductionForm?.adjustmentReason;
  adjustment.notes = formValues?.continousDeductionForm?.notes;
  adjustment.requestedBy = formValues?.continousDeductionForm?.requestedBy;
  adjustment.caseNumber = formValues?.continousDeductionForm?.caseNumber;
  adjustment.caseDate = formValues?.continousDeductionForm?.caseDate;
  adjustment.city = formValues?.continousDeductionForm?.city;
  adjustment.holdAdjustment = formValues?.continousDeductionForm?.holdAdjustment;
  return adjustment;
};

/**
 * method to bind the form values to adjustment model in the case of modify
 */
export const bindManageFormValuesToAdjustmentModel = (form: FormGroup, currentAdjustment: Adjustment): Adjustment => {
  const formValues = form.getRawValue();
  const adjustment = new Adjustment();

  adjustment.holdAdjustmentReason =
    formValues?.maintainTpaForm?.manageType?.english === AdjustmentConstants.ADJUSTMENT_ACTION_TYPE.HOLD?.english
      ? formValues?.maintainTpaForm?.reasonForHolding
      : null;

  adjustment.monthlyDeductionAmount =
    formValues?.maintainTpaForm?.manageType?.english === AdjustmentConstants.ADJUSTMENT_ACTION_TYPE.MODIFY?.english &&
    currentAdjustment?.monthlyDeductionAmount
      ? parseFloat(formValues?.maintainTpaForm?.newMonthlyDeductionAmount)
      : null;

  adjustment.adjustmentPercentage =
    formValues?.maintainTpaForm?.manageType?.english === AdjustmentConstants.ADJUSTMENT_ACTION_TYPE.MODIFY?.english &&
    !currentAdjustment?.monthlyDeductionAmount
      ? +formValues?.maintainTpaForm?.newDebitPercentage?.english
      : null;

  adjustment.stopAdjustmentReason =
    formValues?.maintainTpaForm?.manageType?.english === AdjustmentConstants.ADJUSTMENT_ACTION_TYPE.STOP?.english
      ? formValues?.maintainTpaForm?.reasonForStopping
      : null;

  adjustment.reactivateAdjustmentReason =
    formValues?.maintainTpaForm?.manageType?.english === AdjustmentConstants.ADJUSTMENT_ACTION_TYPE.REACTIVATE?.english
      ? formValues?.maintainTpaForm?.reasonForReactivating
      : null;

  adjustment.otherReason =
    AdjustmentConstants.MANAGE_ADJUSTMENT_OTHER_RESONS.includes(
      formValues?.maintainTpaForm?.reasonForReactivating?.english
    ) ||
    AdjustmentConstants.MANAGE_ADJUSTMENT_OTHER_RESONS.includes(
      formValues?.maintainTpaForm?.reasonForStopping?.english
    ) ||
    AdjustmentConstants.MANAGE_ADJUSTMENT_OTHER_RESONS.includes(formValues?.maintainTpaForm?.reasonForHolding?.english)
      ? formValues?.maintainTpaForm?.otherReason
      : null;

  adjustment.notes = formValues?.maintainTpaForm?.notes;
  adjustment.actionType = formValues?.maintainTpaForm?.manageType;
  return adjustment;
};

/**
 * method to to check adjustment model is changed or not for odify
 */
export const checkForModification = (oldAdjustment: Adjustment, newAdjustment: Adjustment): boolean => {
  if (
    oldAdjustment?.monthlyDeductionAmount !== newAdjustment?.monthlyDeductionAmount ||
    oldAdjustment?.adjustmentPercentage !== newAdjustment?.adjustmentPercentage ||
    oldAdjustment?.notes !== newAdjustment?.notes ||
    oldAdjustment?.holdAdjustmentReason?.english !== newAdjustment?.holdAdjustmentReason?.english ||
    oldAdjustment?.stopAdjustmentReason?.english !== newAdjustment?.stopAdjustmentReason?.english ||
    oldAdjustment?.reactivateAdjustmentReason?.english !== newAdjustment?.reactivateAdjustmentReason?.english ||
    oldAdjustment?.otherReason !== newAdjustment?.otherReason
  ) {
    return true;
  } else {
    return false;
  }
};

export const createModifyTpaRequest = (
  tpaForm: FormGroup,
  adjustment: Adjustment,
  csrAdjustment: Adjustment
): AdjustmentModificationList => {
  const formValues = tpaForm.getRawValue()?.maintainTpaForm ? tpaForm.getRawValue() : null;
  const tpaRequest = new AdjustmentModificationList();
  tpaRequest.actionType = formValues ? formValues?.maintainTpaForm?.manageType : csrAdjustment?.actionType;
  tpaRequest.tpa = true;
  tpaRequest.adjustmentId = adjustment?.adjustmentId;
  tpaRequest.adjustmentReason = adjustment?.adjustmentReason;
  tpaRequest.requestedBy = adjustment?.requestedBy;
  tpaRequest.benefitType = null;
  tpaRequest.city = null;
  tpaRequest.caseDate = null;
  tpaRequest.transferMode = null;
  tpaRequest.adjustmentType = AdjustmentConstants.ADJUSTMENT_TYPE.DEBIT;

  tpaRequest.monthlyDeductionAmount =
    formValues && formValues.hasOwnProperty('maintainTpaForm')
      ? formValues?.maintainTpaForm?.manageType?.english ===
          AdjustmentConstants.ADJUSTMENT_ACTION_TYPE.MODIFY?.english && adjustment?.monthlyDeductionAmount
        ? formValues?.maintainTpaForm?.newMonthlyDeductionAmount
        : null
      : csrAdjustment?.monthlyDeductionAmount;

  tpaRequest.adjustmentPercentage =
    formValues && formValues.hasOwnProperty('maintainTpaForm')
      ? formValues?.maintainTpaForm?.manageType?.english ===
          AdjustmentConstants.ADJUSTMENT_ACTION_TYPE.MODIFY?.english && !adjustment?.monthlyDeductionAmount
        ? +formValues?.maintainTpaForm?.newDebitPercentage?.english
        : null
      : csrAdjustment?.adjustmentPercentage;

  tpaRequest.holdAdjustmentReason = formValues
    ? formValues?.maintainTpaForm?.manageType?.english === AdjustmentConstants.ADJUSTMENT_ACTION_TYPE.HOLD?.english
      ? formValues?.maintainTpaForm?.reasonForHolding
      : null
    : csrAdjustment?.holdAdjustmentReason;

  tpaRequest.stopAdjustmentReason = formValues
    ? formValues?.maintainTpaForm?.manageType?.english === AdjustmentConstants.ADJUSTMENT_ACTION_TYPE.STOP?.english
      ? formValues?.maintainTpaForm?.reasonForStopping
      : null
    : csrAdjustment?.stopAdjustmentReason;

  tpaRequest.reactivateAdjustmentReason = formValues
    ? formValues?.maintainTpaForm?.manageType?.english ===
      AdjustmentConstants.ADJUSTMENT_ACTION_TYPE.REACTIVATE?.english
      ? formValues?.maintainTpaForm?.reasonForReactivating
      : null
    : csrAdjustment?.reactivateAdjustmentReason;

  tpaRequest.otherReason = formValues
    ? AdjustmentConstants.MANAGE_ADJUSTMENT_OTHER_RESONS.includes(
        formValues?.maintainTpaForm?.reasonForReactivating?.english
      ) ||
      AdjustmentConstants.MANAGE_ADJUSTMENT_OTHER_RESONS.includes(
        formValues?.maintainTpaForm?.reasonForStopping?.english
      ) ||
      AdjustmentConstants.MANAGE_ADJUSTMENT_OTHER_RESONS.includes(
        formValues?.maintainTpaForm?.reasonForHolding?.english
      )
      ? formValues?.maintainTpaForm?.otherReason
      : null
    : csrAdjustment?.otherReason;

  tpaRequest.notes = formValues ? formValues?.maintainTpaForm?.notes : csrAdjustment?.notes;
  return tpaRequest;
};

/** Method to get required document list. */
export const getTpaRequiredDocument = (
  transactionName: string,
  transactionType: string,
  modificationList: AdjustmentModificationList[],
  adjustmentModificationId: number,
  self: ManageThirdPartyAdjustmentScComponent
) => {
  of(self.allDocuments)
    .pipe(
      switchMap(allDocuments => {
        if (allDocuments?.length > 0) {
          return of(self.allDocuments);
        } else {
          return self.documentService.getRequiredDocuments(transactionName, transactionType).pipe(
            tap(docs => {
              docs.forEach(doc => {
                if (AdjustmentConstants.MODIFY_DOCUMENT_TYPE_IDS.includes(doc?.documentTypeId)) {
                  self.modifyDocuments.push(doc);
                }
                if (AdjustmentConstants.HOLD_DOCUMENT_TYPE_IDS.includes(doc?.documentTypeId)) {
                  self.holdDocuments.push(doc);
                }
                if (AdjustmentConstants.STOP_DOCUMENT_TYPE_IDS.includes(doc?.documentTypeId)) {
                  self.stopDocuments.push(doc);
                }
                if (AdjustmentConstants.REACTIVATE_DOCUMENT_TYPE_IDS.includes(doc?.documentTypeId)) {
                  self.reactivateDocumnets.push(doc);
                }
                if (AdjustmentConstants.ADD_DOCUMENT_TYPE_IDS.includes(doc?.documentTypeId)) {
                  self.addDocuments.push(doc);
                }
              });
            })
          );
        }
      }),
      map(docs => {
        self.allDocuments = docs;
        let documents: DocumentItem[] = [];
        modificationList.forEach(modification => {
          if (modification?.actionType?.english === AdjustmentConstants.ADJUSTMENT_ACTION_TYPE.ADD?.english) {
            documents = documents.concat(
              self.addDocuments.map(document => {
                return { ...document, businessKey: adjustmentModificationId } as DocumentItem;
              })
            );
          } else if (modification?.actionType?.english === AdjustmentConstants.ADJUSTMENT_ACTION_TYPE.MODIFY?.english) {
            documents = documents.concat(
              self.modifyDocuments.map(document => {
                return { ...document, businessKey: modification?.adjustmentId, showBusinessKey: true } as DocumentItem;
              })
            );
          } else if (modification?.actionType?.english === AdjustmentConstants.ADJUSTMENT_ACTION_TYPE.HOLD?.english) {
            documents = documents.concat(
              self.holdDocuments.map(document => {
                return { ...document, businessKey: modification?.adjustmentId, showBusinessKey: true } as DocumentItem;
              })
            );
          } else if (modification?.actionType?.english === AdjustmentConstants.ADJUSTMENT_ACTION_TYPE.STOP?.english) {
            documents = documents.concat(
              self.stopDocuments.map(document => {
                return { ...document, businessKey: modification?.adjustmentId, showBusinessKey: true } as DocumentItem;
              })
            );
          } else if (
            modification?.actionType?.english === AdjustmentConstants.ADJUSTMENT_ACTION_TYPE.REACTIVATE?.english
          ) {
            documents = documents.concat(
              self.reactivateDocumnets.map(document => {
                return { ...document, businessKey: modification?.adjustmentId, showBusinessKey: true } as DocumentItem;
              })
            );
          }
        });
        return documents;
      })
    )
    .subscribe(
      doc => {
        self.documents = doc;
        self.documents.forEach(docItem => {
          self.refreshTpaDocuments(docItem, transactionName, transactionType, false);
        });
      },
      err => {
        self.showErrorMessage(err);
      }
    );
};
