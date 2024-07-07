/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export enum ReceiptApprovalStatus {
  APPROVED = 'Approved',
  DATA_ENTERED_BY_CSR = 'Data Entered by CSR',
  DATA_ENTERED_BY_ESTABLISHMENT_ADMIN = 'Data Entered by Establishment Admin',
  PROCESSED = 'Processed',
  NEW = 'New',
  ACTIVE = 'Active',
  WAITING_FOR_DOWN_PAYMENT = 'Waiting for Down payment',
  REGISTERED = 'Registered',
  //receipt status
  APPROVAL_IN_PROGRESS = 'Approval in progress',
  APPROVAL_IN_PROGRESS_ = 'Approval in Progress',
  CANCELLED = 'Cancelled',
  TO_BE_CANCELLED = 'To Be Cancelled',
  DISCARD = 'Discarded',
  REJECTED = 'Rejected',
  RECEIVED = 'Received',
  WAITING_ALLOCATION = 'Waiting Allocation',
  PARTIALLY_ALLOCATED = 'Partially Allocated',
  FULLY_ALLOCATED = 'Fully Allocated',
  CANCELLED_PV_WAITING = 'Cancelled PV waiting',
  RECEIPT_ALLOCATION_CANCEL_IN_PROGRESS = 'Receipt Allocation Cancellation in progress'
}
