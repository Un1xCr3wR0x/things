import { Injectable } from '@angular/core';
import {ItemizedLateFeesWrapper} from "@gosi-ui/features/collection/billing/lib/shared/models";
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HandleDelayedPaymentService {

  constructor(readonly http: HttpClient) { }

  getReversedLateFees(regNo: number, startDate: string){
    const url = `/api/v1/establishment/${regNo}/handle-delayed-payment?startDate=${startDate}`;
    return this.http.get<ItemizedLateFeesWrapper>(url);
  }
}
