import { CoverageFlag } from './coverage-flag';
import { EmploymentHistoryList } from './employment-history-list';

export class ContributorInfo {
  id: number = undefined;
  totallastwage: string = undefined;
  numbermonth: number = undefined;
  numbermonthofcurrentemployment: number = undefined;
  numbermonthofhistoryemployment: number = undefined;
  numbermonthofrpa: number = undefined;

  employmenthistorylist: EmploymentHistoryList[] = [];
  coverageflag: CoverageFlag[] = [];

  contributionmonth: number = undefined;
  annuitiesamount: number = undefined;
  contributorywage: number = undefined;
}
