import { PenalityWavierDetailsMockData } from '../../../test-data/features/billing/penality-wavier-details-mock-data';
import { PenalityWavierBulkDetailsMockData } from '../../../test-data/features/billing/penality-wavier-bulk-details-mock-data';
import { of } from 'rxjs';
import { PenaltyWaiverRequestMockData } from 'testing/test-data/features/billing';
export class PenalityWavierServiceStub {
  /**
   * Method to getPenality details
   */
  getWavierPenalityDetails() {
    return of(PenalityWavierDetailsMockData);
  }

  submitWavierPenalityDetails() {
    return of(PenalityWavierDetailsMockData);
  }
  onSubmitVicPenalityDetails() {
    return of(PenaltyWaiverRequestMockData);
  }
  onSubmitEstPenality() {
    return of(PenaltyWaiverRequestMockData);
  }
  submitVicWavierPenalityDetails() {
    return of(PenalityWavierDetailsMockData);
  }
  submitWavierPenalitySegmentDetails() {
    return of(PenaltyWaiverRequestMockData);
  }
  saveSegmentDetails() {
    return of(PenaltyWaiverRequestMockData);
  }
  getWavierPenalityDetailsForView() {
    return of(PenalityWavierDetailsMockData);
  }
  getExceptionalBulkDetails() {
    return of(PenalityWavierBulkDetailsMockData);
  }
  handleWorkflowActions() {
    return of('');
  }
  submitAfterEditforWaivePenalty() {
    return of('');
  }
  penaltyWaiverRevert() {
    return of('');
  }
  vicExceptionalPenaltyWaiverRevert() {
    return of('');
  }
  updateVicExceptionalPenaltyDet() {
    return of(PenalityWavierDetailsMockData);
  }
  updateEstablishmentExceptional() {
    return of(PenalityWavierDetailsMockData);
  }
  estVicBulkExceptionalRevert() {
    return of('');
  }
  updateEstVicSegmentDetails() {
    return of(PenalityWavierDetailsMockData);
  }
  getVicWavierPenalityDetails() {
    return of(PenalityWavierDetailsMockData);
  }
  setPenalityWaiverReason() {}
  getPenalityWaiverReason() {
    return of('');
  }
  setPenalityWaiverOtherReason() {}
  getPenalityWaiverOtherReason() {
    return of('');
  }
  setEstablishmentSegments() {}
  getEstablishmentSegments() {
    return of('');
  }
  setSegments() {}
  getSegments() {
    return of('');
  }
  setVicSegments() {}
  getVicSegments() {
    return of('');
  }
  setPenalityWaiverBulkFileContent() {}
  getPenalityWaiverBulkFileContent() {
    return of('');
  }
  getPenalityWaiverDetails() {
    return of('');
  }
  setPenalityWaiverDetails() {}
  getBulkPenaltyWaiverQuote() {
    return of('');
  }
  getBulkPenaltyWaiverQuoteForAll() {
    return of({ establishmentCount: 213, vicCount: 23 });
  }
  getAllEntitySegments() {
    return of('');
  }
  setAllEntitySegments() {}
  getBulkPenaltyWaiverAllEntityDetails() {
    return of('');
  }
  getExceptionalVicDetails() {
    return of(PenalityWavierBulkDetailsMockData);
  }
}
