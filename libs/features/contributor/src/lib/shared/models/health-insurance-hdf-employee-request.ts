/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */


import {DependentsRule} from "@gosi-ui/features/contributor/lib/shared/models/health-insurance-dependents-rule";

/**
 * The wrapper class create form request employees.
 *
 * @export
 * @class CreateHDFEmployee
 */
// tslint:disable-next-line:class-name
export class CreateHDFEmployee {
  NIN:string;
  FirstName: string;
  SecondName:  string;
  SurName: string;
  NameEnglish:  string;
  Nationality: number;
  Gender: number;
  BirthDate: string;
  MaritalStatus: number;
  InsuranceClassCode: number;
  dependentsChoosedRule: DependentsRule[];
}

