import { getActiveContributorResponse, updateWageResponse } from '../../../test-data/features/customer-information';
import { of } from 'rxjs';

export class ContributorsWageMockService {
  getContributorWageDetails(reg) {
    if (reg) {
    }
    return of(getActiveContributorResponse);
  }
  updateContributorWageDetailsList(data, regNo) {
    if (data || regNo) {
    }
    return of(updateWageResponse);
  }
  getContributorList() {
    return of(getActiveContributorResponse);
  }
}
