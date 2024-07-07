/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {BilingualText} from "@gosi-ui/core";
import {
  AccountStatusEnum,
  CreditStatusEnum,
  MatchStatusEnum, ResponseStatusEnum
} from "@gosi-ui/features/establishment/lib/shared/enums/sama-response-enum";

export class EstablishmentIbanValidationRequest {
  iban: string = undefined;
  unn: number = undefined;
  name: string = undefined;
}

export class EstablishmentIbanValidationResponse {
  ibanValidationResult: BilingualText = undefined;
  accountStatus: AccountStatusEnum = undefined;
  matchStatus: MatchStatusEnum = undefined;
  creditStatus: CreditStatusEnum = undefined;
  responseStatus: ResponseStatusEnum = undefined;
  referenceKey: string = undefined;
}
