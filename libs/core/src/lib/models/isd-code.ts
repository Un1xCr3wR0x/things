import { BilingualText } from './bilingual-text';

export class IsdCode {
  key: string = undefined;
  label: BilingualText = new BilingualText();
  icon: string = undefined;
  format: string = undefined;
  prefix: string = undefined;
  exampleEn: string = undefined;
  exampleAr: string = undefined;
  altFormats?: string[] = [];
}
