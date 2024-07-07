import { Directive, Input, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LovList, Lov, ContactDetails, CoreActiveBenefits } from '@gosi-ui/core';
import { AddressDcComponent } from '@gosi-ui/foundation/form-fragments';
import { HeirsDetails, DependentDetails } from '../../models';
import { BenefitValues } from '../../enum';

@Directive()
export abstract class PaymentMethodDetailsHelper {
  @Input() activeBenefit: CoreActiveBenefits;
  @Input() payeeList: LovList;
  @Input() isAddressReadOnly = false;
  @Input() heirDetail: DependentDetails;
  @Input() momentObj;
  @Input() isDead = false;
  /** Local Variables */
  BenefitValues = BenefitValues;
  payee = 1;
  //IBAN Related Local Variables
  bankEditForm: FormGroup;
  selectIbanForm: FormGroup;
  bankAccountId;
  bankCode: number;
  bankType = 'addNewIban';
  existingIbanList: Lov[] = [];
  existingIbanLovList = new LovList([]);
  newIban = true;
  isExistingIban = false;
  //Authorized Person Related Local Variables
  authPersonId: number;
  authPersonChanged = true; //To detect if anyone selected authorized person from the list
  payeeDetail: HeirsDetails = new HeirsDetails();
  payeeForm: FormGroup;
  paymentMode: string;
  showGuardian: boolean;
  showSaudiAddnewIban: boolean;
  ibanValue: string;
  showBankDetails = true;
  payeesListWithGuardian = new LovList([]);
  payeeListToShow = new LovList([]);
  payeesListWithOutGuardian = new LovList([]);

  hasPOAddress = false;
  hasNationalAddress = false;
  hasOverseasAddress = false;

  @ViewChild('addressComponent', { static: false })
  addressComponent: AddressDcComponent;
  /*
   * This method is to initiallize payee type
   */
  initializePaymentDetails() {
    if (
      this.payeesListWithOutGuardian &&
      this.payeesListWithOutGuardian.items.length === 0 &&
      this.payeesListWithGuardian &&
      this.payeesListWithGuardian.items.length === 0
    ) {
      this.payeeList?.items?.forEach(p => {
        if (p?.value?.english !== BenefitValues.guardian && p?.value?.english !== BenefitValues.custodian) {
          this.payeesListWithOutGuardian?.items?.push(p);
        }
        if (p?.value?.english !== BenefitValues.authorizedPerson && p?.value?.english !== BenefitValues.attorney) {
          this.payeesListWithGuardian?.items?.push(p);
        }
      });
    }
    this.showOrHideGuardian(this.showGuardian);
  }
  showOrHideGuardian(show: boolean) {
    if (show) {
      this.payeeListToShow = this.payeesListWithGuardian;
    } else {
      this.payeeListToShow = this.payeesListWithOutGuardian;
    }
  }
  // This method true if all forms are valid. Need to access using viewchild or viewchildren
  checkFormValidity() {
    let formValid;
    let formModified;
    let isBankFormValid;
    const isPayeeFormValid = this.payeeForm ? this.payeeForm?.valid : true;
    if (this.bankEditForm && this.showSaudiAddnewIban) {
      isBankFormValid = this.bankEditForm?.get('ibanBankAccountNo')?.valid
        ? this.bankEditForm?.get('ibanBankAccountNo')?.valid
        : false;
    } else if (this.bankEditForm && !this.showSaudiAddnewIban) {
      isBankFormValid =
        this.bankEditForm?.get('nonSaudiIbanAccNo')?.valid &&
        this.bankEditForm?.get('nonSaudiBankName')?.valid &&
        this.bankEditForm?.get('swiftCode')?.valid
          ? this.bankEditForm?.get('nonSaudiIbanAccNo')?.valid &&
            this.bankEditForm?.get('nonSaudiBankName')?.valid &&
            this.bankEditForm?.get('swiftCode')?.valid
          : false;
    } else {
      isBankFormValid = this.bankEditForm ? this.bankEditForm.valid : true;
    }
    let isSelectIbanFormValid = this.selectIbanForm ? this.selectIbanForm.valid : true;
    const isPayeeFormModified = this.payeeForm ? this.payeeForm.dirty : false;
    const isBankFormModified = this.bankEditForm ? this.bankEditForm.dirty : false;
    const isSelectIbanFormModified = this.selectIbanForm ? this.selectIbanForm.dirty : false;
    if (this.payeeDetail?.paymentMode?.english === BenefitValues.cheque) {
      isBankFormValid = isSelectIbanFormValid = true;
    }
    if (this.isFormValid(isPayeeFormValid, isBankFormValid, isSelectIbanFormValid)) {
      formValid = true;
    } else {
      formValid = false;
    }
    if (this.isFormModified(isPayeeFormModified, isBankFormModified, isSelectIbanFormModified)) {
      formModified = true;
    } else {
      formModified = false;
    }
    return { formValid: formValid, formModified: formModified };
  }
  isFormModified(isPayeeFormModified, isBankFormModified, isSelectIbanFormModified) {
    return isPayeeFormModified || isBankFormModified || isSelectIbanFormModified;
  }
  isFormValid(isPayeeFormValid, isBankFormValid, isSelectIbanFormValid) {
    return isPayeeFormValid && isBankFormValid && isSelectIbanFormValid;
  }
  /** Address Related Functions */
  setAdressRelatedValues() {
    if (this.isAddressReadOnly) {
      this.payeeDetail.contactDetail = this.heirDetail?.contactDetail;
    } else {
      if (!this.payeeDetail.contactDetail) this.payeeDetail.contactDetail = new ContactDetails();
      this.payeeDetail.contactDetail.addresses = this.addressComponent?.getAddressDetails();
      this.payeeDetail.contactDetail.currentMailingAddress =
        this.addressComponent?.parentForm?.get('currentMailingAddress')?.value;
      this.addressComponent?.parentForm?.get('foreignAddress')?.markAsUntouched();
      this.addressComponent?.parentForm?.get('poBoxAddress')?.markAsUntouched();
      this.addressComponent?.parentForm?.get('saudiAddress')?.markAsUntouched();
      this.addressComponent?.parentForm?.updateValueAndValidity();
    }
  }
}
