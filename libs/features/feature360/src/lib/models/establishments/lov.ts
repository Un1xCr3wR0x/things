import { BilingualText } from '@gosi-ui/core';

export class Lov {
  value: BilingualText = new BilingualText();
  code?: number = undefined;
  sequence: number = undefined;
  items?: Lov[] = [];
  disabled? = false;
}
