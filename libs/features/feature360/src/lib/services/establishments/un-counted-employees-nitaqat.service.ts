import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UnCountedEmployeesNitaqat } from '../../models/establishments/un-counted-employees-nitaqat';
import { BaseService } from '../shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class UnCountedEmployeesNitaqatService extends BaseService {
  constructor(readonly http: HttpClient) {
    super();
  }

  /**
   * This method is to fetch the Establishment with registration number
   * @param RegistrationNumber
   * @memberof UnCountedEmployeesNitaqatService
   */
  getUnCountedEmployeesNitaqat(
    registrationnumber: number,
    gosiregnumber: number
  ): Observable<UnCountedEmployeesNitaqat> {
    const getUnCountedEmployeesNitaqatUrl = `${this.interceptUrl}/customer360/bv_un_counted_employees_in_nitaqat/views/bv_un_counted_employees_in_nitaqat?$filter=p_registrationnumber+in+%27${registrationnumber}%27+AND+p_gosiregnumber+in+%27${gosiregnumber}%27`;
    return this.http
      .get<{ elements: UnCountedEmployeesNitaqat[] }>(getUnCountedEmployeesNitaqatUrl, { headers: this.getHeaders() })
      .pipe(
        map(res => (res?.elements?.length > 1 ? res?.elements?.find(element => element.total > 0) : res?.elements[0]))
      );
  }
}
