/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

// export class BulkReassignData {
//     transactionId: string;
//     userId: string;
// }

export class Transaction{

    transactionUserMap:TransactionUserMap[] = [];
    
    }
    
    export class TransactionUserMap{
    
    transactionTraceId:number;
    
    userId:number;
    
    }
