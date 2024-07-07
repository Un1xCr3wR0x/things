/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

// only 4 status given now for individual app
export enum SamaStatus {
  samaVerified = 'Sama Verified',
  samaFailed = 'Sama Verification Failed',
  samaPending = 'Sama Verification Pending',
  samaNotVerified = 'Sama Not Verified'
}
/** VerificationStatus enum to show in UI*/
export enum VerificationStatus {
  VERIFIED = 'Verified',
  REJECTED = 'Rejected',
  PENDING = 'Pending',
  REVERIFICATION = 'Requires Reverification'
}

export enum SamaArabic {
  verifiedAr = 'تم التحقق',
  rejectedAr = 'مرفوض',
  pendingAr = 'قيد التحقق',
  reverificationAr = 'يتطلب إعادة تحقق'
}

//   if (samaStatus == 'Sama Not Verified') {
//     this.verificationStatus.english = 'REQUIRES REVERIFICATION';
//     this.verificationStatus.arabic = 'يتطلب إعادة تحقق';
//   } else if (samaStatus == 'Sama Verification Failed') {
//     this.verificationStatus.english = 'REJECTED';
//     this.verificationStatus.arabic = 'مرفوض';
//   } else if (samaStatus == 'Not Applicable') {
//     this.verificationStatus.english = '';
//     this.verificationStatus.arabic = '';
//   } else if (samaStatus == 'Sama iban not verifiable') {
//     this.verificationStatus.english = 'NOT VERIFIABLE';
//     this.verificationStatus.arabic = 'لا يمكن التحقق';
//   } else if (samaStatus == 'Sama Verified') {
//     this.verificationStatus.english = 'VERIFIED';
//     this.verificationStatus.arabic = 'تم التحقق';
//   } else if (samaStatus == 'Sama Verification Pending') {
//     this.verificationStatus.english = 'PENDING';
//     this.verificationStatus.arabic = 'قيد التحقق';
//   } else if (samaStatus == 'Expired') {
//     this.verificationStatus.english = 'EXPIRED';
//     this.verificationStatus.arabic = 'انتهت صلاحية التحقق';
//   }
