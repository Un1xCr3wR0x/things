/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BankAccount } from '@gosi-ui/core';
import {
  Adjustment,
  AdjustmentMapModel,
  AdjustmentPaymentMethodEnum,
  CountinuesDeductionTypeEnum,
  DeductionTypeEnum,
  IbanStatusEnum,
  PayeeDetails
} from '../../shared';

export const getIbanDetails = (
  payeeCurrentBank: BankAccount,
  isValidator: boolean,
  formValues,
  csrAdjustmentValues: Adjustment,
  selectedpayee: PayeeDetails,
  csrSelectedpayee: PayeeDetails,
  mapIndex: number,
  adjustmentMap: Map<number, AdjustmentMapModel>
) => {
  const ibanAccountNo =
    payeeCurrentBank?.verificationStatus !== IbanStatusEnum.ACTIVE &&
    formValues?.paymentMethod?.transferMode?.english === AdjustmentPaymentMethodEnum.BANK &&
    ((isValidator &&
      csrAdjustmentValues?.payeeId === selectedpayee?.payeeId &&
      csrSelectedpayee?.iban !== formValues?.paymentMethod?.ibanAccountNo) ||
      !isValidator ||
      csrAdjustmentValues?.payeeId !== selectedpayee?.payeeId)
      ? formValues?.paymentMethod?.ibanAccountNo
      : '';
  const ibanId = formValues
    ? isValidator &&
      payeeCurrentBank?.verificationStatus !== IbanStatusEnum.ACTIVE &&
      formValues?.paymentMethod?.transferMode?.english === AdjustmentPaymentMethodEnum.BANK
      ? adjustmentMap.get(mapIndex)?.addData.selectedpayee?.ibanId
      : null
    : csrSelectedpayee?.ibanId;
  return [ibanAccountNo, ibanId];
};

export const getAdjsutemntPercentage = (formValues, csrAdjustmentValues: Adjustment) => {
  return formValues && formValues.hasOwnProperty('continousDeductionForm')
    ? formValues?.continousDeductionForm?.continuousDeduction?.english === CountinuesDeductionTypeEnum.NO &&
      formValues?.continousDeductionForm?.deductionType === DeductionTypeEnum.PERCENTAGE
      ? +formValues?.continousDeductionForm?.adjustmentPercentage?.english
      : null
    : csrAdjustmentValues?.adjustmentPercentage;
};
