import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { MedicalReportDetails } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MedicalReportService {

  constructor() { }
  getMedicalReportDetails() {
    return of(new MedicalReportDetails());
  }
}

