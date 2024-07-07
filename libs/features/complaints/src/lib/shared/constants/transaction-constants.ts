/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CategoryEnum } from '../enums';

export class TransactionConstants {
  public static get TRANSACTION_DOCUMENT_DETAILS() {
    return [
      {
        category: CategoryEnum.COMPLAINT,
        docTransactionId: 'REGISTER_COMPLAINT',
        transactionType: 'REGISTER_COMPLAINT',
        value: CategoryEnum.COMPLAINT,
        transactionId: 300339
      },
      {
        category: CategoryEnum.ENQUIRY,
        docTransactionId: 'SUBMIT_ENQUIRY',
        transactionType: 'REGISTER_ENQUIRY',
        value: CategoryEnum.ENQUIRY,
        transactionId: 300341
      },
      {
        category: CategoryEnum.SUGGESTION,
        docTransactionId: 'SUBMIT_SUGGESTION',
        transactionType: 'REGISTER_SUGGESTION',
        value: CategoryEnum.SUGGESTION,
        transactionId: 300340
      },
      {
        category: CategoryEnum.APPEAL,
        docTransactionId: 'RAISE_APPEAL',
        transactionType: 'SUBMIT_APPEAL',
        value: CategoryEnum.APPEAL,
        transactionId: 300342
      },
      {
        category: CategoryEnum.PLEA,
        docTransactionId: 'RAISE_PLEA',
        transactionType: 'SUBMIT_PLEA',
        value: CategoryEnum.PLEA,
        transactionId: 300343
      }
    ];
  }
  public static get APPEAL_DOCUMENT_DETAILS(){
    return [
      {
        docTitle: "ReviewRequest - Document External",
        transactionId: 300410,
        documentType:2516,
        actionName: "canRequestReview",
        category: "GeneralAppeal",
        requestType: "Private Sector Appeal",
        type: 1001,
      },
      {
        docTitle: "Appeal - Document External",
        transactionId: 300411,
        documentType:2518,
        actionName: "canAppeal",
        category: "GeneralAppeal",
        requestType: "Private Sector Appeal",
        type: 1002,
      }
    ]
  }
}
