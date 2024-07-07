/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Person } from './person';

export class PersonWrapperDto {
  recordCount: number;
  listOfPersons: Person[] = [];
}
