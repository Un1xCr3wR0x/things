/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { KeyValue } from '@gosi-ui/core';
import { ContributorActionEnum } from '../enums/contributor-action';
import { DropDownItems } from '../models/drop-down';

export class ManageWageConstants {
  // return list of excluded occupation list which for non saudhi
  public static get EXCLUDED_OCCUPATIONS_NONSAUDI(): string[] {
    return [
      'Body guard',
      'Agricultural worker',
      'Cattle breeding worker',
      'Sport coach',
      'Coach, physical fitness',
      'Private driver'
    ];
  }
  public static get EXCLUDED_OCCUPATIONS_NONSAUDI_PRIVATE(): string[] {
    return [
      'Private driver',
      'Body guard',
      'Agricultural worker',
      'Cattle breeding worker',
      'Sport coach',
      'Coach, physical fitness',
      'Exploiter'
    ];
  }

  public static get CHANGE_ENGAGEMENT_SUCCESS_MESSAGE_KEY(): string {
    return 'CONTRIBUTOR.ENGAGEMENT-CHANGED-MESSAGE';
  }

  public static get CHANGE_ENGAGEMENT_VALIDATOR_REVERT_ERROR_CODE(): string {
    return 'CON-ERR-5144';
  }

  public static get CHANGE_ENGAGEMENT_VALIDATOR_REVERT_MESSAGE(): string {
    return 'CONTRIBUTOR.NO-CHANGE-MESSAGE';
  }

  public static get CHANGE_ENGAGEMENT_VALIDATOR_REVERT_MESSAGE_DETAILS() {
    return [
      { key: 'CONTRIBUTOR.NO-CHANGE-OPTION-1', param: null },
      { key: 'CONTRIBUTOR.NO-CHANGE-OPTION-2', param: null }
    ];
  }
  public static get ACTIVE_ENGAGEMENT_DROPDOWN(): string[] {
    return [
      ContributorActionEnum.TERMINATE,
      ContributorActionEnum.TRANSFER,
      ContributorActionEnum.CANCEL,
      ContributorActionEnum.MODIFY,
      //ContributorActionEnum.ADD_CONTRACT,
      ContributorActionEnum.CONTRACT_DETAILS,
      ContributorActionEnum.MODIFY_COVERAGE
    ];
  }
  public static get INACTIVE_ENGAGEMENT_DROPDOWN(): string[] {
    return [
      ContributorActionEnum.CANCEL,
      ContributorActionEnum.MODIFY,
      ContributorActionEnum.CONTRACT_DETAILS,
      ContributorActionEnum.MODIFY_COVERAGE
    ];
  }
  public static get CANCEL_ENGAGEMENT_DROPDOWN(): string[] {
    return [ContributorActionEnum.RE_ACTIVATE];
  }

  public static get REACTIVATE_ENGAGEMENT_DROPDOWN(): DropDownItems {
    return ManageWageConstants.getDropDownItems(
      ContributorActionEnum.RE_ACTIVATE,
      'file-contract',
      'View-Contract.svg'
    );
  }
 

  public static get VicActionsDropdown(): DropDownItems[] {
    return [
      ManageWageConstants.getDropDownItems(ContributorActionEnum.TERMINATE, ['far', 'times-circle'], 'Terminate.svg'),
      ManageWageConstants.getDropDownItems(ContributorActionEnum.CANCEL, 'trash-alt', 'Cancel.svg'),
      ManageWageConstants.getDropDownItems(
        ContributorActionEnum.VIEW_VIC_BILL_DASH,
        'file-contract',
        'View-Contract.svg'
      ),
      ManageWageConstants.getDropDownItems(ContributorActionEnum.MODIFY, 'pencil-alt', 'Modify.svg')
      
    ];
  }

  public static get VicIndividualActionsDropdown(): DropDownItems[] {
    return [
      ManageWageConstants.getDropDownItems(
        ContributorActionEnum.VIEW_VIC_BILL_DASH,
        ['far', 'times-circle'],
        'file-invoice-solid.svg'
      )
    ];
  }

  public static get contributorActionsDropdown(): DropDownItems[] {
    return [
      ManageWageConstants.getDropDownItems(ContributorActionEnum.TERMINATE, ['far', 'times-circle'], 'Terminate.svg'),
      ManageWageConstants.getDropDownItems(ContributorActionEnum.TRANSFER, 'sync', 'Transfer.svg'),
      ManageWageConstants.getDropDownItems(ContributorActionEnum.CANCEL, 'trash-alt', 'Cancel.svg'),
      ManageWageConstants.getDropDownItems(ContributorActionEnum.MODIFY, 'pencil-alt', 'Modify.svg'),
      ManageWageConstants.getDropDownItems(ContributorActionEnum.MODIFY_COVERAGE, 'pencil-alt', 'Modify.svg'),
      // ManageWageConstants.getDropDownItems(ContributorActionEnum.ADD_CONTRACT, 'plus-circle', 'Add-Contract.svg'),
      ManageWageConstants.getDropDownItems(ContributorActionEnum.CONTRACT_DETAILS, 'file-contract', 'View-Contract.svg')
    ];
  }
  public static get IndividualActionsDropdown(): DropDownItems[] {
    return [
      ManageWageConstants.getDropDownItems(ContributorActionEnum.MODIFY_JOINING_DATE, 'pencil-alt', 'modify-new.svg'),
      ManageWageConstants.getDropDownItems(
        ContributorActionEnum.TERMINATE_ENGAGEMENT,
        ['fas', 'trash-alt'],
        'terminate_new.svg'
      ),
      ManageWageConstants.getDropDownItems(
        ContributorActionEnum.CANCEL_ENGAGEMENT,
        ['fas', 'trash-alt'],
        'cancel-new.svg'
      ),
      ManageWageConstants.getDropDownItems(ContributorActionEnum.VIEW_CONTRACT, 'file-contract', 'View-Contract.svg')
    ];
  }
  public static get IndividualSecondDropdown(): DropDownItems[] {
    return [
      ManageWageConstants.getDropDownItems(ContributorActionEnum.MODIFY_JOINING_DATE, 'pencil-alt', 'modify-new.svg'),
      ManageWageConstants.getDropDownItems(
        ContributorActionEnum.TERMINATE_ENGAGEMENT,
        ['fas', 'trash-alt'],
        'terminate_new.svg'
      ),
      ManageWageConstants.getDropDownItems(
        ContributorActionEnum.CANCEL_ENGAGEMENT,
        ['fas', 'trash-alt'],
        'cancel-new.svg'
      )
    ];
  }
  public static get MultiIndividualSecondDropdown(): DropDownItems {
    return ManageWageConstants.getDropDownItems(
      ContributorActionEnum.VIEW_WAGE_BREAKUP,
      'pencil-alt',
      'view-wage-break.svg'
    );
  }
  // public static get OverallActions(): DropDownItems[] {
  //   return [
  //     ManageWageConstants.getDropDownItems(ContributorActionEnum.MODIFY_JOINING_DATE, 'pencil-alt', 'modify-new.svg'),
  //     ManageWageConstants.getDropDownItems(ContributorActionEnum.CANCEL_ENGAGEMENT, ['fas', 'trash-alt'], 'cancel-new.svg')
  //   ];
  // }
  public static get ModifyJoiningDate(): DropDownItems[] {
    return [
      ManageWageConstants.getDropDownItems(ContributorActionEnum.MODIFY_JOINING_DATE, 'pencil-alt', 'modify-new.svg')
    ];
  }
  public static get CancelEngagement(): DropDownItems {
    return ManageWageConstants.getDropDownItems(
      ContributorActionEnum.CANCEL_ENGAGEMENT,
      ['fas', 'trash-alt'],
      'cancel-new.svg'
    );
  }
  public static get ViewContracts(): DropDownItems {
    return ManageWageConstants.getDropDownItems(
      ContributorActionEnum.VIEW_CONTRACT,
      'file-contract',
      'View-Contract.svg'
    );
  }
  public static get ModifyLeaving(): DropDownItems {
    return ManageWageConstants.getDropDownItems(ContributorActionEnum.MODIFY_LEAVING_DATE, 'pencil-alt', 'Modify.svg');
  }
  public static get TerminateEngagement(): DropDownItems {
    return ManageWageConstants.getDropDownItems(
      ContributorActionEnum.TERMINATE_ENGAGEMENT,
      'pencil-alt',
      'terminate_new.svg'
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

  public static get ACTIVE_DEAD_PERSON_MESSAGE_KEY(): string {
    return 'CONTRIBUTOR.TERMINATE-DEAD-PERSON-MESSAGE';
  }

  public static get ACTIVE_GOVT_EMPLOYEE_MESSAGE_KEY(): string {
    return 'CONTRIBUTOR.TERMINATE-GOVT-EMPLOYEE-MESSAGE';
  }

  public static get DEAD_PERSON_LEAVING_REASON(): string {
    return 'Termination due to Contributor is Deceased';
  }

  public static get GOVT_EMPLOYEE_LEAVING_REASON(): string {
    return 'Government Job Joining';
  }

  public static get WAGE_UPDATE_FILE_NAME(): string {
    return 'Wage update form.csv';
  }

  public static KEY_VALUE_PAIR(key: string, value: string | number): KeyValue {
    return { key: key, value: value };
  }

  public static get CUSTOMLIST_SORT_PARAMS(): KeyValue[] {
    return [
      this.KEY_VALUE_PAIR('CONTRIBUTOR.WAGE.ENGAGEMENT-START-DATE', 'ENGAGEMENT_START_DATE'),
      this.KEY_VALUE_PAIR('CONTRIBUTOR.NATIONALITY', 'NATIONALITY'),
      this.KEY_VALUE_PAIR('CONTRIBUTOR.WAGE.LAST-WAGE-UPDATE', 'LAST_WAGE_UPDATE'),
      this.KEY_VALUE_PAIR('CONTRIBUTOR.WAGE.TOTAL-WAGE', 'TOTAL_WAGE')
    ];
  }

  public static get MULTIPLE_WAGE_UPDATE_SORT_PARAMS(): KeyValue[] {
    return [
      this.KEY_VALUE_PAIR('CONTRIBUTOR.WAGE.CONTRIBUTOR-NAME', 'CONTRIBUTOR_NAME'),
      this.KEY_VALUE_PAIR('CONTRIBUTOR.JOINING-DATE', 'ENGAGEMENT_START_DATE'),
      this.KEY_VALUE_PAIR('CONTRIBUTOR.WAGE.LAST-MODIFIED', 'LAST_MODIFIED_DATE')
    ];
  }

  public static get BULK_WAGE_CSV_FILE_HEADER(): string {
    return 'CONTRIBUTOR NAME,IDENTIFIER,BASIC WAGE,HOUSING,COMMISSION,OTHER ALLOWANCE\n';
  }
}
