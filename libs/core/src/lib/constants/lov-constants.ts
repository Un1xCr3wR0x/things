import { IbanSaudiBank } from '../enums';

/**
 * Class to hold Lov Constants
 */
export abstract class LovConstants {
  /**Returns Saudi bank names which are already mapped with iban code */
  public static get ibanMappedSaudiBanks(): string[] {
    return Object.values(IbanSaudiBank);
  }
}
