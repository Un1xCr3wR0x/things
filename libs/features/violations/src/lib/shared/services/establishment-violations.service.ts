import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertService, BilingualText } from '@gosi-ui/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HistoryRequest, RaiseViolationResponse, ViolationHistoryResponse } from '../models';
import { ContributorsInfo } from '../models/contributors-info';

@Injectable({
  providedIn: 'root'
})
export class EstablishmentViolationsService {
  baseUrl = '/api/v1';
  estRegNumber: number;
  constructor(private http: HttpClient, readonly datePipe: DatePipe, readonly alertService: AlertService) {}

  /** Method to get establishment summary. */
  getViolationHistory(registrationNo: number, historyRequest: HistoryRequest): Observable<ViolationHistoryResponse> {
    let historyUrl = '';
    historyUrl = `${this.baseUrl}/establishment/${registrationNo}/unpaid-violation?pageNo=${historyRequest.page.pageNo}&pageSize=${historyRequest.page.size}`;
    if (historyRequest.searchKey) {
      historyUrl += `&searchKey=${historyRequest.searchKey}`;
    }
    if (historyRequest.sort && historyRequest.sort.direction) {
      historyUrl += `&sortOrder=${historyRequest.sort.direction}`;
    }
    if (historyRequest.sort.column) {
      historyUrl += `&sortBy=${historyRequest.sort.column}`;
    }
    if (
      historyRequest.filter &&
      historyRequest.filter.violationType &&
      historyRequest.filter.violationType.length > 0
    ) {
      historyRequest.filter.violationType.map((value: BilingualText) => {
        historyUrl += `&listOfViolationType=${value.english}`;
      });
    }
    if (historyRequest.filter && historyRequest.filter.period.startDate && historyRequest.filter.period.endDate) {
      historyUrl += `&startDate=${this.datePipe.transform(
        historyRequest.filter.period.startDate,
        'yyyy-MM-dd'
      )}&endDate=${this.datePipe.transform(historyRequest.filter.period.endDate, 'yyyy-MM-dd')}`;
    }
    if (historyRequest.filter && historyRequest.filter.status && historyRequest.filter.status.length > 0) {
      historyRequest.filter.status.map((value: BilingualText) => {
        historyUrl += `&listOfStatus=${value.english}`;
      });
    }
    if (historyRequest.filter && historyRequest.filter.channel && historyRequest.filter.channel.length > 0) {
      historyRequest.filter.channel.map((value: BilingualText) => {
        historyUrl += `&listOfViolationChannel=${value.english}`;
      });
    }
    if (historyRequest.isPreviousViolation) {
      historyUrl += `&isPreviousViolation=true`;
    }
    if (historyRequest.contributorId > 0) {
      historyUrl += `&contributorId=${historyRequest.contributorId}`;
    }
    if (historyRequest.filter && historyRequest.filter.appliedPaidAmountEnd !== null) {
      // historyUrl += `&penaltyAmountStart=${historyRequest.filter.appliedPenaltyAmountStart}&penaltyAmountEnd=${historyRequest.filter.appliedPenaltyAmountEnd}`;
      historyUrl += `&paidAmountStart=${historyRequest.filter.appliedPaidAmountStart}&paidAmountEnd=${historyRequest.filter.appliedPaidAmountEnd}`;
    }
    if (historyRequest.filter && historyRequest.filter.appliedPenaltyAmountEnd !== null) {
      historyUrl += `&penaltyAmountStart=${historyRequest.filter.appliedPenaltyAmountStart}&penaltyAmountEnd=${historyRequest.filter.appliedPenaltyAmountEnd}`;
    }

    return this.http.get<ViolationHistoryResponse>(historyUrl).pipe(
      catchError(error => {
        this.showAlerts(error);
        throw error;
      })
    );
  }

  /**
   * Method to show error
   */
  showAlerts(error) {
    this.alertService.showError(error.error.message);
  }
  /**
   * Method for searching transaction using esta
   * @param violationData
   * @param registrationNo
   */
  saveReportViolationData(registrationNo, violationData) {
    const url = `${this.baseUrl}/establishment/${registrationNo}/violation`;
    return this.http.post<RaiseViolationResponse>(url, violationData);
  }
}
