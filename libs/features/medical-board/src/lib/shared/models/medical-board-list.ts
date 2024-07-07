import { BilingualText } from '@gosi-ui/core';
/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class MedicalBoardList {
  contractType: BilingualText = new BilingualText();
  inviteeId: number = undefined;
  identity: number = undefined;
  isdCode: string;
  mobileNo: number = undefined;
  name: BilingualText = new BilingualText();
  specialty: BilingualText = new BilingualText();
  subSpecialty: BilingualText = new BilingualText();
  canAmbRemove?: boolean;
  canPmbRemove?: boolean;
  isDisableMembers: boolean;
  mbProfessionId?:Number;
}
export class ParticipantsList {
  identity: number = undefined;
  name: BilingualText = new BilingualText();
  participantType: BilingualText = new BilingualText();
  assessmentType: BilingualText = new BilingualText();
  location: BilingualText = new BilingualText();
  isPhoneClicked: boolean;
  isVdRequired?: boolean;
  isdCode?: string;
  inviteeId: number = undefined;
  mobileNo: string;
  disabilityType: BilingualText = new BilingualText();
  status:  BilingualText = new BilingualText();
  slot?: BilingualText;
}
