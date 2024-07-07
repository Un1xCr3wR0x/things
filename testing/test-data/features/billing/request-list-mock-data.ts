import { Page } from '@gosi-ui/features/collection/billing/lib/shared/models';

export const requestListMockData = {
  sort: {
    column: 'CONTRIBUTOR_NAME_ENG',
    direction: 'ASC'
  },
  page: new Page(),

  maxContributoryWage: 1000,
  minContributoryWage: 50,
  maxTotal: 100,
  minTotal: 50,
  maxContributionUnit: 31,
  minContributionUnit: 31,
  period: {
    endDate: '10-05-2020',
    startDate: '10-03-2020'
  },
  search: 111,
  saudiPerson: true
};
