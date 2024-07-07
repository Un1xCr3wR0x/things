import { DropDownItems } from "@gosi-ui/features/contributor";

export class ManageWageConstants {
public static get ViewContracts(): DropDownItems {
    return ManageWageConstants.getDropDownItems(
      'ContributorActionEnum.VIEW_CONTRACT',
      'file-contract',
      'View-Contract.svg'
    );
  }
  public static getDropDownItems(key: string, icon, urlParam?: string): DropDownItems {
    return {
      key: key,
      id: key,
      value: undefined,
      icon: icon,
      disabled: false,
      toolTipValue: undefined,
      toolTipParam: undefined,
      url: 'assets/icons/' + urlParam
    };
  }
}