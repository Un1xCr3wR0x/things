import { of } from 'rxjs';
import {
  branchDetailsMockData,
  establishmentDetailsMockData,
  gccEstablishmentDetailsMockData
} from 'testing/test-data';

export class BillEstablishmentServiceStub {
  getEstablishment() {
    return of(gccEstablishmentDetailsMockData);
  }
  getBranchDetails() {
    return of(branchDetailsMockData);
  }
}
