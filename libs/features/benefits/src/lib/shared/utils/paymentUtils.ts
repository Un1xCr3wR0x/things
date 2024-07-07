/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BenefitValues } from '@gosi-ui/features/benefits/lib/shared/enum';
import { PatchPersonBankDetails } from '@gosi-ui/features/benefits/lib/shared/models';
import { FormGroup } from '@angular/forms';
import { GosiCalendar, startOfDay } from '@gosi-ui/core';



export const setPaymentDetailsToObjectFromForm = function (
  form: FormGroup,
  object: { [k: string]: any },
  authPersonId?: number,
  expiryDate?: GosiCalendar
) {
  if (form.get('payeeForm.payeeType')) {
    object.payeeType = form.get('payeeForm.payeeType').value;
    object.payee = form.get('payeeForm.payeeType').value;
  }
  if (form.get('payeeForm.paymentDetailsUpdated')) {
    object.paymentDetailsUpdated = form.get('payeeForm.paymentDetailsUpdated').value;
  }
  if (form.get('payeeForm.paymentMode')) {
    object.paymentMode = form.get('payeeForm.paymentMode').value;
  }
  if (
    object.payee.english === BenefitValues.authorizedPerson &&
    (form.get('payeeForm')?.get('personId').value || form.get('payeeForm')?.get('authorizedPersonId')?.value)
  ) {
    object.authorizedPersonId =
      authPersonId ||
      form.get('payeeForm')?.get('personId')?.value ||
      form.get('payeeForm')?.get('authorizedPersonId')?.value;
    // object.authorizationDetailsId = form.get('payeeForm.authorizationDetailsId').value;
    object.certificateExpiryDate = expiryDate;
    object.authorizationId = form.get('payeeForm')?.get('authorizationId')?.value;
    object.certificateExpiryDate = { gregorian: startOfDay(object.certificateExpiryDate?.gregorian) };
  }
  if (form.get('payeeForm.bankAccount')) {
    const savedBankDetails = new PatchPersonBankDetails();
    savedBankDetails.isNewlyAdded = form.get('payeeForm.bankAccount.bankType')
      ? form.get('payeeForm.bankAccount.bankType').value === 'addNewIBAN'
      : false;
    savedBankDetails.bankCode = form.get('payeeForm.bankAccount.bankCode').value;
    savedBankDetails.bankName = form.get('payeeForm.bankAccount.bankName').value;
    savedBankDetails.ibanBankAccountNo = form.get('payeeForm.bankAccount.ibanBankAccountNo').value;
    savedBankDetails.isNewlyAdded = form.get('payeeForm.bankAccount.isNewlyAdded').value;
    if (form.get('payeeForm.bankAccount.isNonSaudiIBAN')) {
      savedBankDetails.isNonSaudiIBAN = form.get('payeeForm.bankAccount.isNonSaudiIBAN').value;
    }
    if (form.get('payeeForm.bankAccount.swiftCode')) {
      savedBankDetails.swiftCode = form.get('payeeForm.bankAccount.swiftCode').value;
    }
    object.bankAccount = savedBankDetails;
  }
};
