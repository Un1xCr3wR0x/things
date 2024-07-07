import { of } from 'rxjs';
import {
  BranchDetailsWrapper,
  EstablishmentSearchResponse
} from '@gosi-ui/foundation-dashboard/lib/admin-dashboard/models';
import { SearchRequest } from '@gosi-ui/foundation-dashboard/lib/shared';

export class DashboardServiceStub {
  getBranchList() {
    return of(new BranchDetailsWrapper());
  }

  getEstablishmentList(estListRequest: SearchRequest) {
    if (estListRequest) {
      return of(EstablishmentSearchResponse);
    }
  }
  getDashboardEstablishmentList(listRequest: SearchRequest) {
    if (listRequest) {
      return of(EstablishmentSearchResponse);
    }
  }
}
