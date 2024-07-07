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
  public static get HEIR_ACTIVE(): string {
    return 'Heir Active';
  }
  public static get IMPRISONMENT_MODIFY(): string {
    return 'Imprisonment Modify';
  }
  public static get MODIFY_PAYEE(): string {
    return 'Modify Payee';
  }
  public static get RESTART_CONTRIBUTOR(): string {
    return 'Restart Contributor';
  }
  public static get STOP_CONTRIBUTOR(): string {
    return 'Stop Contributor';
  }
  public static get ACTIVE() {
    return 'Active';
  }
  public static get NEW() {
    return 'New';
  }

  public static get ADD_ESTABLISHMENT(): string {
    return 'Add Establishment';
  }
  public static get MODIFY_OWNER(): string {
    return 'Modify Owner';
  }
}
