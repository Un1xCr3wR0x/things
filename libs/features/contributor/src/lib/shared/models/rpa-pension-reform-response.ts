export interface IPensionReformEligibility {
    pensionReformEligible: string;
    reason: Reason[];
    totalEngagementMonthsAsOnEffectiveDate: number | null;
  }
  
  export interface Reason {
    arabic: string;
    english: string;
  }
  