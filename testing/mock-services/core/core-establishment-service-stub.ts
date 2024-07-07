import { of, Observable } from 'rxjs';
import { establishmentDetailsTestData, personResponse } from '../../test-data';
import { Person, bindToObject } from '@gosi-ui/core';

export class CoreEstablishmentServiceStub {
  selectedRegNo = 123456;
  /**
   * Mock Method for getEstablishment
   *
   * @param registrationNumber
   */
  getEstablishment(registrationNumber) {
    if (registrationNumber) {
      return of(establishmentDetailsTestData);
    }
  }
  getRegistrationFromStorage() {
    return 200085746;
  }

  /**
   * Mock Method for getEstablishment
   *
   * @param registrationNumber
   */
  getEstablishmentDetails(registrationNumber) {
    if (registrationNumber) {
      return of(establishmentDetailsTestData);
    }
  }

  /**
   * Mock method for getAdminDetails
   * @param registrationNo
   */
  getAdminDetails(registrationNo): Observable<Person> {
    if (registrationNo) {
      return bindToObject(new Person(), personResponse);
    }
  }

  /**
   * Mock method for getAdminDetails
   * @param registrationNo
   */
  getOwnerDetails(registrationNo): Observable<Person[]> {
    if (registrationNo) {
      return of([bindToObject(new Person(), personResponse)]);
    }
  }
}
