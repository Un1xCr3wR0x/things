export class RecalculationConstants {
  public static get DISABILITY_ASSESSMENT(): string {
    return 'Disability Assessment';
  }
  public static get HeirRecalculation(): string {
    return 'Heir Recalculation';
  }
  public static ROUTE_BENEFIT_CONTRIBUTOR(sin): string {
    return `home/profile/contributor/${sin}/benefits/saned/list`;
  }
  public static get PENSION_ACTIVE(): string {
    return 'Pension Active';
  }
  public static get PERSONAL(): string {
    return 'personal';
  }
  public static get ADD_FAMILY(): string {
    return 'addFamily';
  }
  public static get MODIFY_FAMILY(): string {
    return 'modifyFamily';
  }
}
