import { NIN, Iqama, NationalId, Passport, BorderNumber, IdentityTypeEnum } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export function getIdentificationNumber(identity: Array<NIN | Iqama | NationalId | Passport | BorderNumber>) {
  return identity.map(item => {
    if (item.idType === IdentityTypeEnum.NIN)
      return {
        identificationNumber: (<NIN>item).newNin ? (<NIN>item).newNin : (<NIN>item).oldNin,
        label: 'NATIONAL-ID'
      };
    if (item.idType === IdentityTypeEnum.IQAMA)
      return {
        identificationNumber: (<Iqama>item).iqamaNo,
        label: 'IQAMA-NUMBER'
      };
    if (item.idType === IdentityTypeEnum.NATIONALID)
      return {
        identificationNumber: (<NationalId>item).id,
        label: 'GCC-ID'
      };
    if (item.idType === IdentityTypeEnum.PASSPORT)
      return {
        identificationNumber: (<Passport>item).passportNo,
        label: 'PASSPORT-NUMBER'
      };
    if (item.idType === IdentityTypeEnum.BORDER)
      return {
        identificationNumber: (<BorderNumber>item).id,
        label: 'BORDER-NO'
      };
  });
}
