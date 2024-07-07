export class IPensionReformEngagement {
  engagementId: number;
  establishmentId: string;
  establishmentName: string;
  startDate: DateInfo;
  endDate: DateInfo;
  engagementDuration: Duration;
  unPaidVicMonths: number;
  engagementType: number;
  paidStatus: boolean;
  aggregationType: number;
  engagementPeriods: IPensionReformEngagementPeriod[];
  sourceEngagementId: number;
  engagementSourceType: string;
  considered: boolean;
}

interface DateInfo {
  gregorian: string;
  hijiri: string;
  entryFormat: string;
}

interface Duration {
  noOfMonths: number;
  noOfDays: number;
}

export class IPensionReformEngagementPeriod {
  periodId: number;
  startDate: DateInfo;
  endDate: DateInfo;
  basicSalary: number;
  housing: number;
  commissions: number;
  otherAllowance: number;
  totalWage: number;
  monthlyContributoryWage: number;
  grade: number | null;
  rank: number | null;
  jobClass: number | null;
  occupation: Occupation | null;
  hasPeriodWithoutAnnuityCoverage: boolean;
  showWage?: boolean = false;
  showBasicWage?: boolean = false;
  showHousing?: boolean = false;
  showCommissions?: boolean = false;
  showOtherAllowance?: boolean = false;
}

interface Occupation {
  arabic: string;
  english: string;
}
