import { BilingualText } from '@gosi-ui/core';

export const approveMessage = (): BilingualText => {
  return { english: 'Transaction is approved.', arabic: 'تم اعتماد المعاملة.' };
};
export const rejectMessage = (): BilingualText => {
  return { english: 'Transaction is rejected.', arabic: 'تم رفض المعاملة.' };
};

export const returnMessage = (): BilingualText => {
  return { english: 'Transaction is returned.', arabic: 'تم إعادة المعاملة' };
};


export const socialInsuranceLawBilingual = (): BilingualText => {
  return { english: 'Social Insurance Law', arabic: 'نظام التأمينات الاجتماعية' };
};