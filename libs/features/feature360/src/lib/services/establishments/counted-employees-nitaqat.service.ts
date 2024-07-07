import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CountedEmployeesNitaqat } from '../../models/establishments/counted-employees-nitaqat';
import { BaseService } from '../shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class CountedEmployeesNitaqatService extends BaseService {
  constructor(readonly http: HttpClient) {
    super();
  }

  /**
   * This method is to fetch the Establishment with registration number
   * @param RegistrationNumber
   * @memberof CountedEmployeesNitaqatService
   */
  getCountedEmployeesNitaqat(registrationNo: number): Observable<CountedEmployeesNitaqat> {
    const getCountedEmployeesNitaqatUrl = `${this.interceptUrl}/customer360/bv_counted_employees_in_nitaqat/views/bv_counted_employees_in_nitaqat?$filter=p_registrationnumber+in+%27${registrationNo}%27`;
    return this.http
      .get<{ elements: CountedEmployeesNitaqat[] }>(getCountedEmployeesNitaqatUrl, { headers: this.getHeaders() })
      .pipe(
        map(res => (res?.elements?.length > 1 ? res?.elements?.find(element => element.total > 0) : res?.elements[0]))
      );
  }
}
