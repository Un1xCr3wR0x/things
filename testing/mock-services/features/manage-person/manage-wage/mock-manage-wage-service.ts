import { EngagementDetails, SearchEngagementResponse } from '@gosi-ui/features/contributor/lib/shared';
import { of, Observable } from 'rxjs';
import { getCurrentEngagementResponse } from 'testing/test-data/features/customer-information';
import { engagementInChangeWorkflow, periodChangeResponse } from '../../../../test-data';
import { TransactionFeedback } from '@gosi-ui/core';

/**
 * This method is used to mock manage wage service
 */
export class MockManageWageService {
  //  Local variables
  currentEngagment: EngagementDetails = new EngagementDetails();
  _registrationNo: number = 123456;
  _socialInsuranceNo: number;
  _engagementId: number;

  /**
   *
   * @param sin
   * @param registrationNo
   */
  getEngagementWithCoverage(sin: any, registrationNo: any) {
    if (sin || registrationNo) {
    }
    return of(getCurrentEngagementResponse.engagements);
  }
  updateTaskWorkflow(BPMRequest, reg, sin, engId) {
    return true;
  }

  updateWageDetails(period, reg, sin, engId, isEdit) {
    return of(new TransactionFeedback());
  }

  getEstablishmentRegistrationNo() {
    return 200085744;
  }

  set socialInsuranceNo(sin: number) {
    this._socialInsuranceNo = sin;
  }

  set engagementId(id: number) {
    this._engagementId = id;
  }

  set registrationNo(registrationNo) {
    this._registrationNo = registrationNo;
  }

  get socialInsuranceNo(): number {
    return this._socialInsuranceNo;
  }

  get engagementId(): number {
    return this._engagementId;
  }

  get registrationNo() {
    return this._registrationNo;
  }

  set setCurrentEngagment(engagement: EngagementDetails) {
    this.currentEngagment = engagement;
  }
  get getCurrentEngagment(): EngagementDetails {
    return this.currentEngagment;
  }

  getOccupationAndWageDetails() {
    return of(new EngagementDetails());
  }

  verifyWageChange() {
    return of(true);
  }

  modifyEnagagementPeriodWage() {
    return of(periodChangeResponse);
  }

  submitEngagementAfterChange() {
    return of(26125);
  }

  searchEngagement(): Observable<SearchEngagementResponse> {
    return of({ activeEngagements: [new EngagementDetails()], overallEngagements: [new EngagementDetails()] });
  }

  getEngagementInWorkflow() {
    return of(engagementInChangeWorkflow);
  }

  getEngagements() {
    return of([new EngagementDetails()]);
  }
}
