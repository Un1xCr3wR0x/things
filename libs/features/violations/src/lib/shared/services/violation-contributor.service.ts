import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertService } from '@gosi-ui/core';
import { Observable } from 'rxjs';
import { ContributorsInfo, EngagementInfo } from '../models';
@Injectable({
  providedIn: 'root'
})
export class ViolationContributorService {
  constructor(private http: HttpClient, readonly datePipe: DatePipe, readonly alertService: AlertService) {}

  getContributorInfo(registrationNo: number, identifier: number): Observable<ContributorsInfo> {
    const url = `/api/v1/establishment/${registrationNo}/contributor/fetch?identifier=${identifier}&sortBy=LATEST_ENGAGEMENT_WITH_CONTRIBUTOR_NAME&sortOrder=ASC&pageNo=0&pageSize=10`;
    return this.http.get<ContributorsInfo>(url);
  }

  getEngagementInfo(registrationNo: number, socialInsuranceNo: number): Observable<EngagementInfo> {
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/engagement?searchType=ACTIVE_AND_TERMINATED_AND_CANCELLED`;
    return this.http.get<EngagementInfo>(url);
  }
  /**
   * Method to show error
   */
  showAlerts(error) {
    this.alertService.showError(error.error.message);
  }
}
