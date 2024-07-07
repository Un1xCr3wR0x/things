/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

/**
 * This class is to declare occupational-hazard group-injury module constants.
 *
 * @export
 * @class GroupInjuryConstants
 */

export class GroupInjuryConstants {
    public static get WIZARD_INJURY_DETAILS() {
        return 'OCCUPATIONAL-HAZARD.GROUP-INJURY.WIZARD-GROUP-INJURY-DETAILS';
    }
    public static get WIZARD_REOPEN_DETAILS() {
        return 'OCCUPATIONAL-HAZARD.REOPENING-DETAILS';
    }
    public static get WIZARD_CONTRIBUTORS_DETAILS() {
        return 'OCCUPATIONAL-HAZARD.GROUP-INJURY.WIZARD-CONTRIBUTORS-DETAILS';
    }
    public static get DOCUMENT_TRANSACTION_TYPE(): string {
        return 'GROUP_INJURY';
    }
    public static get GROUP_INJURY(): string{
        return 'GroupInjury';
      }
    

}
