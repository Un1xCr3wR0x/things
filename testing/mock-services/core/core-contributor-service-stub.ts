import { contributorSearchResponse } from '../../test-data';
import { of } from 'rxjs';

export class CoreContributorSerivceStub {
  selectedSIN = 123456;
  isVic$ = of(false);
  getContributor() {
    return of(contributorSearchResponse);
  }
}
