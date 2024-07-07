import {BilingualText, DropdownItem, RoleIdEnum} from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class AdjustmentConstants {
  public static get ADJUSTMENT_DETAILS(): string {
    return 'ADJUSTMENT.ADJUSTMENT-DETAILS-TAB';
  }

  public static BENEFITS_SANED_LIST(sinNo): string {
    return `/home/profile/contributor/${sinNo}/benefits/saned/list`;
  }

  public static get DOCUMENTS(): string {
    return 'ADJUSTMENT.DOCUMENTS';
  }

  public static get PAYMENT_DETAILS(): string {
    return 'ADJUSTMENT.PAYMENT_DETAILS';
  }

  public static get SANED_LIST(): string {
    return 'sanedList';
  }

  public static get TRANSACTION_APPROVED(): string {
    return 'ADJUSTMENT.TRANSACTION-APPROVED';
  }

  public static get TRANSACTION_REJECTED(): string {
    return 'ADJUSTMENT.TRANSACTION-REJECTED';
  }

  public static get TRANSACTION_RETURNED(): string {
    return 'ADJUSTMENT.TRANSACTION-RETURNED';
  }

  public static get BENEFITS(): string {
    return 'saned-benefit';
  }

  public static get ENGAGEMENT_CHANGE(): string {
    return 'engagement-change';
  }

  public static get REJOINING(): string {
    return 'rejoining';
  }

  public static get From(): string {
    return 'from';
  }

  public static get ADJUSTMENT_DETAIL(): string {
    return 'adjustmentdetails';
  }

  public static get DISABILITY_ASSESSMENT(): string {
    return 'Disability Assessment';
  }

  public static get HEIR_RECALCULATION(): string {
    return 'Heir Recalculation';
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

  public static get RESTART_CONTRIBUTOR(): string {
    return 'Restart Contributor';
  }

  public static get STOP_CONTRIBUTOR(): string {
    return 'Stop Contributor';
  }

  public static get MODIFY_PAYEE(): string {
    return 'Modify Payee';
  }

  //Constant for other in the bank list.
  public static get BILLER_CODE(): string {
    return '060';
  }

  public static get ADJUSTMENT_PAGE_SIZE(): number {
    return 5;
  }

  public static get ADD_DOCUMENT_TRANSACTION_ID(): number {
    return 300363;
  }

  public static get ADD_DOCUMENT_TRANSACTION_NAME(): string {
    return 'ADD_THIRD_PARTY_ADJUSTMENT_DOCUMENTS';
  }

  public static get ADD_DOCUMENT_TRANSACTION_TYPE(): string {
    return 'ADD_THIRD_PARTY_ADJUSTMENT_DOCUMENT_REQUEST';
  }

  public static get ADD_THIRD_PARTY_TRANSACTION_ID(): number {
    return 300361;
  }

  public static get ADD_THIRD_PARTY_TRANSACTION_NAME(): string {
    return 'MAINTAIN_THIRD_PARTY_ADJUSTMENT';
  }

  public static get ADD_THIRD_PARTY_TRANSACTION_TYPE(): string {
    return 'MAINTAIN_THIRD_PARTY_ADJUSTMENT_REQUEST';
  }

  public static get MAINTAIN_THIRD_PARTY_TRANSACTION_ID(): number {
    return 300362;
  }

  public static get MAINTAIN_THIRD_PARTY_TRANSACTION_NAME(): string {
    return 'MODIFY_THIRD_PARTY_ADJUSTMENT';
  }

  public static get MAINTAIN_PARTY_TRANSACTION_TYPE(): string {
    return 'MODIFY_THIRD_PARTY_ADJUSTMENT_REQUEST';
  }

  public static get MAINTAIN_ADJUSTMENT(): string {
    return 'MAINTAIN_ADJUSTMENT';
  }

  public static get MAINTAIN_ADJUSTMENT_REQUEST(): string {
    return 'MAINTAIN_ADJUSTMENT_REQUEST';
  }

  public static get MAINTAIN_ADJUSTMENT_CONSTANT(): number {
    return 201508;
  }

  public static get ADJUSTMENT_REPAY_TRANSACTION_CONSTANT(): string {
    return '201547';
  }

  public static get RETURN_LUMPSUM_TRANSACTION_CONSTANT(): string {
    return '302020';
  }

  public static get TRANSACTION_NUMBER_MAX_LENGTH(): number {
    return 15;
  }

  public static get BANK_NAME_MAX_LENGTH(): number {
    return 50;
  }

  public static get AMOUNT_RECEIVED_SEPARATOR_LIMIT(): number {
    return 10000000000000;
  }

  public static get ADDITIONAL_DETAILS_MAX_LENGTH(): number {
    return 200;
  }

  public static get TRANSACTION_MINDATE(): string {
    return '2004-03-01';
  }

  public static get ADJUSTMENT_TABS(): DropdownItem[] {
    return [
      {
        id: 0,
        value: {
          english: 'GOSI Adjustments',
          arabic: 'فروقات التأمينات'
        }
      },
      {
        id: 1,
        value: {
          english: 'Third Party Adjustments',
          arabic: 'فروقات الطرف الثالث'
        }
      }
    ];
  }

  public static get THIRD_PARTY_ADJUSTMENT_TABS(): DropdownItem[] {
    return [
      {
        id: 0,
        value: {
          english: 'Payment Details',
          arabic: 'تفاصيل الصرف'
        }
      },
      {
        id: 1,
        value: {
          english: 'Adjustment Modifications',
          arabic: 'سجل تعديل الفروقات'
        }
      },
      {
        id: 2,
        value: {
          english: 'Documents',
          arabic: 'المستندات'
        }
      }
    ];
  }

  public static get ADJUSTMENT_ACTION_TYPE(): {
    ADD: BilingualText;
    MODIFY: BilingualText;
    STOP: BilingualText;
    HOLD: BilingualText;
    REACTIVATE: BilingualText;
  } {
    return {
      ADD: {
        english: 'Add',
        arabic: 'Add'
      },
      MODIFY: {
        english: 'Modify',
        arabic: 'Modify'
      },
      STOP: {
        english: 'Stop',
        arabic: 'Stop'
      },
      HOLD: {
        english: 'Hold',
        arabic: 'Hold'
      },
      REACTIVATE: {
        english: 'Reactivate',
        arabic: 'Reactivate'
      }
    };
  }

  public static get ADJUSTMENT_TYPE(): {
    DEBIT: BilingualText;
    CREDIT: BilingualText;
  } {
    return {
      DEBIT: {
        english: 'Debit',
        arabic: 'مدين'
      },
      CREDIT: {
        english: 'Credit',
        arabic: 'تنسب إليه'
      }
    };
  }

  public static get ADJUSTMENT_STATUS(): {
    NEW: BilingualText;
  } {
    return {
      NEW: {
        english: 'New',
        arabic: 'New'
      }
    };
  }

  //Constant for other reason in in the  manage adjustment reason list.
  public static get MANAGE_ADJUSTMENT_OTHER_RESONS(): string[] {
    return ['Other', 'Others'];
  }

  public static get ADD_DOCUMENT_TYPE_IDS(): number[] {
    return [2033, 1272];
  }

  public static get MODIFY_DOCUMENT_TYPE_IDS(): number[] {
    return [2034, 1272];
  }

  public static get HOLD_DOCUMENT_TYPE_IDS(): number[] {
    return [2035, 1272];
  }

  public static get STOP_DOCUMENT_TYPE_IDS(): number[] {
    return [2036, 1272];
  }

  public static get REACTIVATE_DOCUMENT_TYPE_IDS(): number[] {
    return [2037, 1272];
  }

  public static get MONTHLY_TPA_ADJUSTMENT_DEDUCTION_PERCENATGE_LIMIT(): number {
    return 50; //50%
  }

  public static get SANED_PENSION(): string {
    return 'Saned Pension';
  }

  public static get REQUESTED_BY_MOJ(): string {
    return 'Ministry of Justice';
  }

  public static get BANK_TRANSFER(): string {
    return 'Bank Transfer';
  }

  /**
   * method to get the eligible roles to perfoem the create flag transaction
   */
  public static get CREATE_TPA_ACCESS_ROLES(): RoleIdEnum[] {
    return [RoleIdEnum.CUSTOMER_SERVICE_REPRESENTATIVE];
  }

  public static get REPAY_FC_ROLE() {
    return 'FC Approver';
  }

  public static get SANED() {
    return 'saned';
  }

  public static get UI() {
    return 'Unemployment Insurance';
  }

  public static get ACTIVE() {
    return 'Active';
  }

  public static get NEW() {
    return 'New';
  }

  public static get GOSI_ADJUSTMENT(): string {
    return 'gosi-adjustment';
  }

  public static get HEIR_ADJUSTMENT_ID(): string {
    return 'HEIR_MAINTAIN_ADJUSTMENT';
  }

  public static get HEIR_ADJUSTMENT_TYPE(): string {
    return 'HEIR_MAINTAIN_ADJUSTMENT_REQUEST';
  }

  public static get HEIR_MAINTAIN_ADJUSTMENT(): string {
    return 'Heir Adjustment Modification';
  }

  public static get HEIR_ADJUSTMENT_ROUTE(): string {
    return 'home/payment/adjustment/validator/heir-adjustment';
  }

  public static get ROUTE_ADJUSTMENT() {
    return '/home/adjustment/adjustment-details';
  }

  public static ROUTE_PROFILE(id) {
    return `home/profile/individual/internal/${id}/personal-details`;
  }

  public static ROUTE_BENEFIT_LIST(sin: number): string {
    return `home/profile/individual/internal/${sin}/benefits`;
  }

  public static REFORM_ADJUSTMENT_LOV() {
    return [
      "1051",
      "1052",
      "1059",
      "1060",
      "1061",
      "1070",
      "1071",
      "1072",
      "1080",
      "1081",
      "1082",
      "1086",
      "1087",
      "1094",
      "1095",
      "1096",
      "1104",
      "1113",
      "1114",
      "1115",
      "1116",
      "1117"
    ]
  }
}
