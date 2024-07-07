import { BilingualText } from '@gosi-ui/core';
import { FilterKeyEnum } from '../enums';

export class FilterKeyValue {
  key: FilterKeyEnum = undefined;
  value? = undefined;
  values?: Array<string> = []; // Used to show periods where we need to separate values with '->'
  translateKeys?: Array<string> = [];
  bilingualValues?: Array<BilingualText> = [];
  codes?: number[] = [];
  rangeValues?: number[] = [];

  fromJsonToObject?(json) {
    if (json) {
      Object.keys(json).forEach(key => {
        if (key === 'bilingualValues') {
          if (json.bilingualValues?.length > 0) {
            this.bilingualValues = json.bilingualValues?.map(value => ({ ...value }));
          }
        } else {
          this[key] = json[key];
        }
      });
    }
    return this;
  }
}
