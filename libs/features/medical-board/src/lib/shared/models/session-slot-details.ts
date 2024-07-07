import { BilingualText } from '@gosi-ui/core';

export class SessionSlotDetails {
  isSlotsFilled: boolean;
  isSlotPartiallyFilled?: boolean;
  slotSequence: number;
  slotTime: BilingualText;
}
