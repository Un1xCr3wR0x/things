import { of } from 'rxjs';
import { establishmentsDetailsTestData } from 'testing';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class EstablishmentMockService {
  getEstablishment() {
    return of(establishmentsDetailsTestData);
  }
  getEstablishmentDetails() {
    return of(establishmentsDetailsTestData);
  }
}
