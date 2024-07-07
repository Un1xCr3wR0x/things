/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { AbstractControl, FormGroup } from '@angular/forms';
import { BankAccount, bindToObject, getFormErrorCount, GosiCalendar } from '@gosi-ui/core';
import { forkJoin, iif, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { AddContributorBaseSc } from '../../../shared/components/base/add-contributor-base-sc';
import { ContributorRouteConstants } from '../../../shared/constants';
import { SearchTypeEnum } from '../../../shared/enums';
import { Contributor, EngagementDetails, Establishment, PersonBankDetails } from '../../../shared/models';

export abstract class AddContractBaseSc extends AddContributorBaseSc {
  /** Local variables. */
  approvedBank: BankAccount;
  bankInfo: BankAccount;
  isBankDetailsPending: boolean;
  personDetails: Contributor;
  previewEstablishment: Establishment;
  activeEngagement: EngagementDetails;
  contributorAbroad: boolean;
  minStartDate: GosiCalendar;

  /** Method to get basic details. */
  getBasicDetails() {
    return forkJoin([this.getEstablishment(), this.getContributor(), this.getActiveEngagement()]).pipe(
      switchMap(() => this.getBankDetailsById())
    );
  }

  /** Method to get preview establishment */
  getEstablishment() {
    return this.getEstablishmentDetails(this.registrationNo).pipe(
      tap(data => (this.previewEstablishment = bindToObject(new Establishment(), data)))
    );
  }

  /** to get contributor type by calling contributor service */
  getContributor() {
    return this.contributorService.getContributor(this.registrationNo, this.socialInsuranceNo).pipe(
      tap(data => {
        this.personDetails = data;
        this.person = data.person;
        this.personId = data.person.personId;
        this.getMinContractEligibilityDate();
        if (this.personDetails && this.personDetails.contributorType)
          this.contributorType = this.personDetails.contributorType;
      })
    );
  }

  /** Method  to get minimum contract eligibility date. */
  getMinContractEligibilityDate() {
    this.calendarService
      .addToHijiriDate(this.personDetails.person.birthDate.hijiri, 15)
      .subscribe(response => (this.minStartDate = response));
  }

  /** Method to get bank details by person id */
  getBankDetailsById() {
    return this.contributorService.getBankDetails(this.registrationNo, this.socialInsuranceNo).pipe(
      tap(data => (this.approvedBank = this.assembleBankDetails(data.bankAccountList[0]))),
      switchMap(() => iif(() => (this.bankInfo ? true : false), of(true), this.getPendingBankDetails()))
    );
  }

  /** Method to assemble  bank details. */
  assembleBankDetails(bank: PersonBankDetails) {
    if (bank) {
      const bankDetails = new BankAccount();
      bankDetails.bankName = bank.bankName;
      bankDetails.ibanAccountNo = bank.ibanBankAccountNo;
      bankDetails.verificationStatus = bank.verificationStatus;
      return bankDetails;
    } else return undefined;
  }

  /** Method to get pending bank details. */
  getPendingBankDetails() {
    return this.contributorService
      .getBankDetailsWorkflowStatus(new Map().set('regNo', this.registrationNo).set('sin', this.socialInsuranceNo))
      .pipe(
        tap(pendingDetails => {
          this.bankInfo = pendingDetails ? pendingDetails : this.approvedBank;
          this.isBankDetailsPending = pendingDetails ? true : false;
        })
      );
  }

  /** Method to get Active Engagement */
  getActiveEngagement() {
    return this.manageWageService
      .getEngagements(this.socialInsuranceNo, this.registrationNo, SearchTypeEnum.ACTIVE)
      .pipe(
        tap(data => {
          this.activeEngagement = bindToObject(new EngagementDetails(), data[0]);
          this.activeEngagement['engagementPeriod'] = data[0]['engagementPeriod'].filter(period => !period['endDate']);
          this.contributorAbroad = this.activeEngagement['engagementPeriod'][0]?.contributorAbroad;
        })
      );
  }

  /*  To navigate back to profile   */
  navigateToEngagmentDetails() {
    this.location.back();
    this.hideModal();
  }
  /*  To navigate back to validator view  */
  navigateToValidatorView() {
    this.router.navigate([ContributorRouteConstants.ROUTE_ADD_CONTRACT_VALIDATOR]);
    this.hideModal();
  }

  /** Method to check for any changes in transaction. */
  checkPopupRequired(formGroup: FormGroup, contractDataSaveStatus: boolean): boolean {
    return (
      getFormErrorCount(formGroup) > 0 ||
      formGroup.dirty ||
      contractDataSaveStatus ||
      this.checkDocumentStatus(formGroup.get('docStatus.changed'))
    );
  }

  /** Method to check for changes in documents. */
  checkDocumentStatus(controls: AbstractControl): boolean {
    return controls ? controls.value : false;
  }

  /** Method to check whether revert is required. */
  checkRevertRequired(formGroup: FormGroup, contractDataSaveStatus: boolean): boolean {
    return this.isEditMode && (contractDataSaveStatus || this.checkDocumentStatus(formGroup.get('docStatus.changed')));
  }
}
