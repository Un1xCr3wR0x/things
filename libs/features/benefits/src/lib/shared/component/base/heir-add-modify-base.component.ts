/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Directive, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import {
  deepCopy,
  getContactDetails,
  getEligibilityStatusForHeirPensionLumpsumFromValidateApi,
  getRequestDateFromForm,
  getStatusDate,
  hasValidModifiedEventsAfterOdmRemove,
  removeNullFromIdentities,
  hasOdmAddedEventForHeirAdd,
  isRequiredField
} from '../../utils';
import {
  AttorneyDetailsWrapper,
  BankAccountList,
  DependentDetails,
  HeirDetailsRequest,
  HeirPersonIds,
  PersonalInformation,
  SearchPerson
} from '../../models';
import { HeirContactDetailsDcComponent } from '../heir-contact-details-dc/heir-contact-details-dc.component';
import { PaymentDetailsDcComponent } from '../payment-details-dc/payment-details-dc.component';
import { BenefitValues, ActionType, MaritalValues, RelationShipCode } from '../../enum';
import { HeirDependentAddEditBaseComponent } from './heir-dependent-add-edit-base.component';
import { Observable } from 'rxjs';
import { BilingualText, GosiCalendar, LovList, Name, startOfDay } from '@gosi-ui/core';
import { DependentHeirConstants, EventsConstants } from '@gosi-ui/features/benefits/lib/shared/constants';
import moment from 'moment';

@Directive()
export abstract class HeirAddModifyBaseComponent extends HeirDependentAddEditBaseComponent {
  contactForm = new FormGroup({});
  eligibilityStatusAfterValidation: BilingualText;
  disableSave = false;
  disableVerify = false;
  /**
   * Input
   */
  @Input() isUnborn = false;
  @Input() attorneyDetailsWrapper: AttorneyDetailsWrapper[];
  @Input() paymentMethodList: Observable<LovList>;
  @Input() payeeList: LovList;
  @Input() nationalityList$: Observable<LovList>;
  @Input() guardianDetails: PersonalInformation;
  @Input() listOfGuardians: AttorneyDetailsWrapper[];
  @Input() bankDetails: BankAccountList;
  @Input() isModifyPage: boolean;
  /**
   * Output
   */
  @Output() addValidatedHeir: EventEmitter<DependentDetails> = new EventEmitter();
  @Output() getAuthPeronContactDetails: EventEmitter<HeirPersonIds> = new EventEmitter();
  @Output() getBankForid = new EventEmitter();
  @Output() searchGuardian: EventEmitter<SearchPerson> = new EventEmitter();
  @Output() onIbanEnter = new EventEmitter();
  @Output() openEligibilityRulesPopup = new EventEmitter();

  @ViewChild('paymentDetails', { static: false })
  paymentDetailsComponent: PaymentDetailsDcComponent;

  @ViewChild('heirAddress', { static: false })
  heirAddress: HeirContactDetailsDcComponent;
  deadBilingual = EventsConstants.deadBilingualText();
  missingBilingual = EventsConstants.missingBilingualText();
  // constructor() {
  //   super();
  // }

  heirValidated() {
    this.disableSave = false;
    if (
      this.isHeir &&
      this.isModifyPage &&
      !this.isWifeWithPregnantStatus(this.validateApiResponse.validatedHeir) &&
      !this.validateApiResponse.validatedHeir.orphanDate?.gregorian &&
      !hasOdmAddedEventForHeirAdd(this.validateApiResponse.validatedHeir, this.validateApiResponse.events) &&
      !hasValidModifiedEventsAfterOdmRemove(
        this.validateApiResponse.events,
        this.validateApiResponse.validatedHeir?.events
      )
    ) {
      //only for modify heir
      this.eligibilityStatusAfterValidation = DependentHeirConstants.notEligible();
      this.disableSave = true;
    } else {
      this.eligibilityStatusAfterValidation = getEligibilityStatusForHeirPensionLumpsumFromValidateApi(
        this.validateApiResponse.events,
        this.validateApiResponse.valid,
        this.benefitType,
        this.systemRunDate
      );
    }
    this.validated(this.isModifyPage, this.disableSave);
  }

  isWifeWithPregnantStatus(heir: DependentDetails) {
    return heir.relationship.english === DependentHeirConstants.WifeBilingual.english && heir.pregnant ? true : false;
  }
  /**
   * when clicked verify button
   */
  validateHeir(fromModifyPage = false) {
    this.resetErrors(); // reset errors
    if(this.personDetailsForm && this.personDetailsForm.invalid) {
      this.personDetailsForm.markAllAsTouched();
      this.alertService.showMandatoryErrorMessage();
      return;
    }
    const heir: DependentDetails = deepCopy(this.dependentDetails);
    heir.editMode = this.update;
    if (this.questionsForm.valid && this.dependentForm.valid && this.setHeirDetails(heir, fromModifyPage)) {
      if (this.isUnborn) {
        heir.isUnborn = this.isUnborn;
      }
      this.validateDependent.emit(heir);
    } else {
      this.alertService.showMandatoryErrorMessage();
      this.questionsForm.markAllAsTouched();
      this.dependentForm.markAllAsTouched();
    }
  }

  setHeirDetails(heir: DependentDetails, fromModifyPage = false): boolean {
    let valid = true;
    heir.events = [];
    if (this.searchPersonData?.dob?.gregorian) {
      const dob = new GosiCalendar();
      dob.calendarType = this.searchPersonData?.dob?.calendarType;
      dob.gregorian = new Date(this.searchPersonData?.dob?.gregorian);
      dob.hijiri = this.searchPersonData?.dob?.hijiri;
      heir.dateOfBirth = dob;
    } else {
      const dob = new GosiCalendar();
      dob.calendarType = this.dependentDetails?.birthDate?.calendarType || this.dependentDetails?.birthDate?.entryFormat;
      dob.gregorian = this.dependentDetails?.birthDate?.gregorian;
      dob.hijiri = moment(this.dependentDetails.birthDate?.hijiri).format('YYYY-MM-DD') !== 'Invalid date' ? moment(this.dependentDetails.birthDate?.hijiri).format('YYYY-MM-DD') : this.dependentDetails.birthDate?.hijiri;
      heir.dateOfBirth = dob;
    }
    //Backdated heir using two apis so ADD is fine
    heir.actionType = fromModifyPage && !heir.newlyAdded && this.update ? ActionType.MODIFY : ActionType.ADD;
    heir.editMode = this.update;
    heir.modificationRequestDate = fromModifyPage ? getRequestDateFromForm(this.parentForm) : null;
    heir.dependentSource = heir.dependentSource ? heir.dependentSource : BenefitValues.gosi;
    heir.maritalStatusDateUpdatedFromUi = this.maritalStatusDateUpdatedFromUi;
    heir.deathDate = this.dependentForm.get('deathDate') ? this.dependentForm.get('deathDate').value : null;
    heir.birthDate = this.dependentDetails.birthDate; //to match with get api
    heir.personId = this.dependentDetails.personId;
    heir.relationship = this.selectedRelationship?.value || this.dependentForm?.get('relationship')?.value;
    heir.statusDate = getStatusDate(this.dependentForm);
    if (this.parentForm.get('notificationDetails')) {
      heir.notificationDate = this.parentForm.get('notificationDetails').value;
      heir.notificationDate.gregorian = startOfDay(heir.notificationDate.gregorian);
    }
    if (this.dependentForm.get('disabilityDescription')) {
      heir.disabilityDescription = this.dependentForm.get('disabilityDescription').value;
    }
    heir.married =
      this.dependentForm.get('maritalStatus.english') &&
      this.dependentForm.get('maritalStatus.english').value === MaritalValues.married;

    heir.maritalStatus = this.dependentForm.get('maritalStatus')
      ? this.dependentForm.get('maritalStatus').value
      : this.dependentDetails.maritalStatus;
    heir.maritalStatusDate = this.dependentForm.get('maritalStatus')
      ? this.dependentForm?.get('maritalStatusDate')?.value
      : null;
    heir.valid = true; //TODO: recheck logic
    heir.hasMandatoryDetails = true;
    // if (this.personDetailsForm && Object.keys(this.personDetailsForm.controls).length > 0) {
    heir.identity = this.searchPersonData?.identity
      ? removeNullFromIdentities(this.searchPersonData?.identity)
      : removeNullFromIdentities(this.dependentDetails?.identity);
    if (this.personDetailsForm && Object.keys(this.personDetailsForm.controls).length > 0) {
      heir.name =
        new Name()?.fromJsonToObject(this.personDetailsForm?.get('name')?.value) || this.dependentDetails?.name;
      heir.sex = this.personDetailsForm?.get('gender')?.value;
      heir.nonSaudiHeirAdded = true;
    }
    heir.nationality = this.searchPersonData?.nationality || this.dependentDetails?.nationality;
    // }
    //TODO: add input controls
    if (!this.setQuestionsEventsControlsForValidate(heir as DependentDetails)) valid = false;
    return valid;
  }

  /**
   * Add Heir button click from HTML
   */
  addHeir(fromModifyPage = false) {
    const heir: DependentDetails = deepCopy(this.dependentDetails);
    const payeeForm = this.paymentDetailsComponent ? this.paymentDetailsComponent.payeeForm : null;
    this.setHeirDetails(heir, fromModifyPage);
    //TODO: To handle Heir without payment
    if (payeeForm) {
      this.setHeirPayementDetails(heir, payeeForm);
      if (this.isBankDetailsEntered(heir, payeeForm)) {
        if (this.heirAddress?.addressForm) {
          //agent address is not handled here
          if(
            this.heirAddress.addressForm.getAddressValidity() &&
            this.contactForm.get('contactDetail').valid
          ) {
            heir.contactDetail = getContactDetails(this.contactForm);
            this.addValidatedHeir.emit(heir);
          } else {
            this.contactForm.markAllAsTouched();
          }
        } else {
          this.addValidatedHeir.emit(heir);
        }
      } else {
        this.alertService.showErrorByKey('BENEFITS.ENTER-BANK-DETAILS');
      }
    } else {
      this.addValidatedHeir.emit(heir);
    }
  }

  /**
   * Set Each Heir payment details
   * @param heir
   * @param payeeForm
   */
  setHeirPayementDetails(heir: DependentDetails, payeeForm: FormGroup = new FormGroup({})) {
    heir.payeeType = payeeForm.get('payeeType')?.value; //Remove
    heir.payee = payeeForm.get('payeeType')?.value;
    heir.paymentMode = payeeForm.get('paymentMode')?.value;
    if (payeeForm.get('payeeType')?.get('english')?.value === BenefitValues.authorizedPerson) {
      heir.authorizationDetailsId = payeeForm.get('authorizationDetailsId')?.value;
      heir.authorizationId = payeeForm.get('authorizationId')?.value;
      heir.authorizedPersonId = payeeForm.get('personId')?.value || payeeForm.get('authorizedPersonId')?.value;
      heir.lastModifiedAuthPersonId = heir.authorizedPersonId;
      if (heir.authorizedPersonId) {
        const selectedAuthPerson = this.attorneyDetailsWrapper.filter(item => {
          return item.personId === heir.authorizedPersonId;
        });
        heir.attorneyDetails = selectedAuthPerson.length ? selectedAuthPerson[0] : null;
      }
    } else if (payeeForm.get('payeeType')?.get('english').value === BenefitValues.guardian) {
      heir.guardianPersonId = payeeForm.get('guardianPersonId') ? payeeForm.get('guardianPersonId').value : null;
      heir.guardianSource = payeeForm.get('guardian') ? payeeForm.get('guardian.guardianSource').value : null;
    } else {
      heir.authorizationDetailsId = null;
      heir.authorizedPersonId = null;
      heir.lastModifiedAuthPersonId = null;
      heir.attorneyDetails = null;
      heir.guardianPersonId = null;
      heir.authorizationId = null;
    }
    if (heir.guardianPersonId) {
      //payment for guardian
      heir.bankModifiedFor = heir.guardianPersonId;
      //Only bank transfer available
      heir.bankAccount = payeeForm.get('bankAccount')?.value;
    } else if (heir.paymentMode.english === BenefitValues.BANK) {
      //Self or Authorized person payment details
      if (heir.authorizedPersonId) {
        heir.bankModifiedFor = heir.authorizedPersonId;
      } else {
        heir.bankModifiedFor = heir.personId;
      }
      heir.bankAccount = payeeForm.get('bankAccount')?.value;
      if(heir.bankAccount?.ibanBankAccountNo?.slice(0, 2) === 'SA') heir.bankAccount.ibanBankAccountNo = heir.bankAccount.ibanBankAccountNo.replace(/\s/g, '');
    }
    if (heir.bankAccount && payeeForm?.get('bankAccount')?.get('bankType').value === 'addNewIBAN') {
      heir.bankAccount.isNewlyAdded = true;
    }
  }

  /**
   *
   * @param heir
   */
  isBankDetailsEntered(heir: DependentDetails, formGroup: FormGroup) {
    let valid = true;
    //TODO: Check wile guardian dev
    if (heir && heir.payeeType.english !== BenefitValues.guardian && heir.paymentMode.english === BenefitValues.BANK) {
      if (isRequiredField(formGroup.get('bankAccount') as FormGroup, 'ibanBankAccountNo') && !heir.bankAccount?.ibanBankAccountNo) {
        valid = false;
      }
    } else if (heir?.paymentMode.english === BenefitValues.cheque) {
      valid = true;
    }
    return valid;
  }

  getPreselectedAuthPerson(data: AttorneyDetailsWrapper) {
    return data ? [data] : null;
  }

  showAddContact(value: boolean) {
    // this.showAgentContact = value;
  }

  getContactDetailsForAuthPerson(id: number) {
    const ids: HeirPersonIds = { authPersonId: id, HeirId: this.dependentDetails.personId };
    this.getAuthPeronContactDetails.emit(ids);
  }

  getBankDetails(personId: number) {
    //To keep the modified bank details untill next click by preventing the bank api call
    // if (personId !== this.dependentDetails.bankModifiedFor) {
    //   this.dependentDetails.authorizedPersonId =
    //     this.paymentDetailsComponent &&
    //     this.paymentDetailsComponent.payeeForm &&
    //     this.paymentDetailsComponent.payeeForm.get('payeeType').get('english').value === BenefitValues.authorizedPerson
    //       ? personId
    //       : null;
    //   this.dependentDetails.bankModifiedFor = null;
    this.getBankForid.emit(personId);
    // }
  }

  getBank(iban: number) {
    this.getBankName.emit(iban);
  }
  clearSuccessMessage() {}
  selectAddIBAN() {}

  searchForGuardian(data: SearchPerson) {
    if (this.dependentForm.get('nationalId')) {
      data.heirNin = this.dependentForm.get('nationalId').value;
    } else if (this.idValue) {
      data.heirNin = Number(this.idValue);
    }
    this.searchGuardian.emit(data);
  }

  isEligibleForBenefit(eligibilityStatusAfterValidation: BilingualText) {
    return (
      eligibilityStatusAfterValidation?.english === DependentHeirConstants.eligibleString ||
      eligibilityStatusAfterValidation?.english === DependentHeirConstants.eligibleForBackdatedString
    );
  }

  openEligibilityPopup() {
    this.openEligibilityRulesPopup.emit();
  }

  getContributorStatus(benefitReason: HeirDetailsRequest) {
    if (benefitReason?.reason) {
      return benefitReason?.reason;
    } else {
      return !this.isAlive ? this.deadBilingual : this.missingBilingual;
    }
  }
}
