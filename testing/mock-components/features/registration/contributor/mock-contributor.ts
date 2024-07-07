import { BankAccount } from '@gosi-ui/core';
import {
  ContributorTypesEnum,
  DocumentTransactionType,
  PersonalInformation,
  PersonBankDetails
} from '@gosi-ui/features/contributor';
import { BehaviorSubject, of } from 'rxjs';
import { contributorResponseTestData, systemParameterData, vicContributorResponseData } from 'testing';

/**
 * Stub class for ContributorService.
 *
 * @export
 * @class ContributorServiceStub
 */
export class ContributorServiceStub {
  contributorDetails: BehaviorSubject<any> = new BehaviorSubject<any>(contributorResponseTestData);

  _personId: number;

  params: BehaviorSubject<any> = new BehaviorSubject<any>({
    registrationNumber: '12334',
    socialInsuranceNumber: '12334',
    engagememtId: '12334'
  });

  public get personId() {
    return this._personId;
  }

  public set personId(personId: number) {
    this._personId = personId;
  }

  getContributor() {
    return this.contributorDetails.asObservable();
  }

  getContributorType() {
    return ContributorTypesEnum.SAUDI;
  }

  getTransactionType() {
    return DocumentTransactionType.REGISTER_CONTRIBUTOR_IN_GOVT;
  }

  cancelAddedContributor() {
    return of(null);
  }

  revertTransaction() {
    return of(true);
  }

  /**  get system parameters  */
  getSystemParams() {
    return of(systemParameterData);
  }

  submitUploadedDocuments() {
    return of({ message: { english: 'success', arabic: 'success' } });
  }

  /** Mock for boolean */
  setSin() {
    return of(null);
  }

  updateContributor() {
    return of(null);
  }

  getPersonDetails() {
    return of(new PersonalInformation());
  }

  setContributorType() {}

  setPersonalInformation() {}

  getPersonById() {}

  getContributorBySin() {
    return of(vicContributorResponseData);
  }

  getBankDetailsWorkflowStatus() {
    return of(new BankAccount());
  }

  getBankDetails() {
    return of({ bankAccountList: [new PersonBankDetails()] });
  }
}
