import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Indicators, IndicatorsList } from '../models/commitment-indicators-response';


@Injectable({
  providedIn: 'root'
})
export class IndicatorsService {

  constructor(readonly http: HttpClient) { }

  getEstablishmentIndicatorsHistory(registrationNo:number,year:number):Observable<Indicators[]>{
    const url =`/api/v1/indicators?RegistrationNumber=${registrationNo}&Year=${year}`
    return this.http.get<Indicators[]>(url);
  }

  getEstablishmentIndicators(registrationNo:number,year:number, month:number):Observable<Indicators>{
    const url =`/api/v1/indicators?RegistrationNumber=${registrationNo}&Month=${month}&Year=${year}`
    return this.http.get<Indicators>(url);
  }
}
