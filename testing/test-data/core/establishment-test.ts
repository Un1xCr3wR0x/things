/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from '@gosi-ui/core';
export class Establishment {
  name: BilingualText = new BilingualText();
  registrationNo: number;
  status: BilingualText = new BilingualText();
  establishmentType: string;
  mainEstablishmentRegNo: number;
}
export const establishmentListData = {
  items: [
    {
      name: {
        arabic: '-----',
        english: 'Galaxy Exports'
      },
      registrationNo: 880584213,
      status: {
        arabic: '-----',
        english: 'Registered'
      }
    },
    {
      name: {
        arabic: '-----',
        english: 'Galaxy Transport'
      },
      registrationNo: 102478934,
      status: {
        arabic: '-----',
        english: 'Registered'
      }
    },
    {
      name: {
        arabic: '-----',
        english: 'Galaxy Hotels'
      },
      registrationNo: 580584213,
      status: {
        arabic: '-----',
        english: 'Closing In Progress'
      }
    }
  ]
};
