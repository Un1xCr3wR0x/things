/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Establishment } from '../models';

@Injectable({
  providedIn: 'root'
})

/**
 * This class is used for  establishment apis
 */
export class EstablishmentService {
  /**Local variable */
  private selectedRegNo: number;

  constructor(readonly http: HttpClient) {}

  /**
   * Method to set establishment reg no to local variable
   * @param registrationNo
   */
  public setSelectedRegNo(registrationNo: number) {
    this.selectedRegNo = registrationNo;
  }

  /**
   * Get registration number
   */
  public getSelectedRegNo(): number {
    return this.selectedRegNo;
  }
  /**
   * This method is to fetch the Establishment with registration number
   * @param RegistrationNumber
   * @memberof EstablishmentService
   */
  getEstablishmentDetails(registrationNo: number): Observable<Establishment> {
    if(registrationNo && registrationNo !== null){
        const getEstablishmentUrl = `/api/v1/establishment/${registrationNo}`;
        return this.http.get<Establishment>(getEstablishmentUrl).pipe(
          tap({
            error: () => {
              this.selectedRegNo = null;
            },
            complete: () => {
              this.selectedRegNo = registrationNo;
            }
          })
        );
    }
  }
}
