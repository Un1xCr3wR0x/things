import { of } from 'rxjs';

export class BranchOverviewServiceMock {
  /**
   * Local variables
   */
  pageSize = 6;

  constructor() {}

  /**
   * Method to retrieve list of main & branch establishments
   * @memberof DashboardService
   * @param registrationNo
   */
  establishmentBranches(registrationNo: number, pageNo: number, searchTerm: string) {
    if (registrationNo || pageNo || searchTerm) {
      return of(null);
    }
  }
}
