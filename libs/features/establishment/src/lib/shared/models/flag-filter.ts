import { BilingualText, Lov } from '@gosi-ui/core';
import { FilterKeyValue } from './filter-key-value';

export class FlagFilter {
  flagType: BilingualText;
  transactionId: number;
  flagFilter: FilterKeyValue[];
  sortBy: Lov;
  sortOrder: string;
}
