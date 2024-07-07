import { dayDifference } from '@gosi-ui/core';
import { EmployerProductShare } from '../enums/employer-product-share';
export abstract class CoverageConstants {
  public static UI_PERCENT(
    isMof: boolean,
    currentDate: Date = new Date(),
    uiChangeDate: Date = new Date('01-01-2022') //to be fetched from API
  ): number {
    if (dayDifference(currentDate, uiChangeDate) <= 0) {
      return EmployerProductShare.UI_NEW / (isMof ? 2 : 1);
    }
    return EmployerProductShare.UI / (isMof ? 2 : 1);
  }

  public static ANNUITY_PERCENT(isMof: boolean): number {
    return EmployerProductShare.ANNUITY / (isMof ? 2 : 1);
  }

  public static OH_PERCENT(isMof?: boolean): number {
    return isMof ? EmployerProductShare.OH_MOF : EmployerProductShare.OH;
  }
  public static PPA_PERCENT(isMof?: boolean): number {
    return isMof ? EmployerProductShare.OH_MOF : EmployerProductShare.PPA;
  }
  public static PENSION_PERCENT(isMof?: boolean): number {
    return isMof ? EmployerProductShare.OH_MOF : EmployerProductShare.PENSION;
  }
}
